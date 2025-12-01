import { prisma } from "@/lib/db";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

// GET all conversations for the current user
export async function GET() {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const conversations = await prisma.conversation.findMany({
      where: {
        participants: {
          some: {
            userId: session.user.id,
            isArchived: false,
          },
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
        messages: {
          orderBy: {
            createdAt: "desc",
          },
          take: 1,
          include: {
            sender: {
              select: {
                id: true,
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        lastMessageAt: "desc",
      },
    });

    const formattedConversations = conversations.map((conv) => {
      const currentUserParticipant = conv.participants.find(
        (p) => p.userId === session.user.id
      );
      const otherParticipants = conv.participants.filter(
        (p) => p.userId !== session.user.id
      );

      return {
        ...conv,
        unreadCount: currentUserParticipant?.unreadCount || 0,
        otherParticipants,
        lastMessage: conv.messages[0] || null,
      };
    });

    return NextResponse.json(formattedConversations);
  } catch (error) {
    console.error("Error fetching conversations:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// POST create a new conversation
export async function POST(request: Request) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const {
      participantIds,
      type = "DIRECT",
      title,
      bookingId,
      applicationId,
      leaseId,
      listingId,
      initialMessage,
    } = body;

    if (!participantIds || !Array.isArray(participantIds)) {
      return NextResponse.json(
        { error: "participantIds is required and must be an array" },
        { status: 400 }
      );
    }

    // Ensure current user is included in participants
    const allParticipantIds = [
      ...new Set([session.user.id, ...participantIds]),
    ];

    // For DIRECT conversations, check if one already exists between these users
    if (type === "DIRECT" && allParticipantIds.length === 2) {
      const existingConversation = await prisma.conversation.findFirst({
        where: {
          type: "DIRECT",
          AND: allParticipantIds.map((id) => ({
            participants: {
              some: {
                userId: id,
              },
            },
          })),
        },
        include: {
          participants: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true,
                  image: true,
                },
              },
            },
          },
        },
      });

      if (existingConversation) {
        // Unarchive if archived
        await prisma.conversationParticipant.updateMany({
          where: {
            conversationId: existingConversation.id,
            userId: session.user.id,
          },
          data: {
            isArchived: false,
          },
        });

        // Add otherParticipants
        const otherParticipants = existingConversation.participants.filter(
          (p) => p.userId !== session.user.id
        );

        return NextResponse.json({
          ...existingConversation,
          otherParticipants,
        });
      }
    }

    // Create new conversation
    const conversation = await prisma.conversation.create({
      data: {
        type,
        title,
        bookingId,
        applicationId,
        leaseId,
        listingId,
        participants: {
          create: allParticipantIds.map((userId) => ({
            userId,
            role: userId === session.user.id ? "ADMIN" : "MEMBER",
          })),
        },
      },
      include: {
        participants: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
                image: true,
              },
            },
          },
        },
      },
    });

    // If there's an initial message, create it
    if (initialMessage) {
      await prisma.message.create({
        data: {
          conversationId: conversation.id,
          senderId: session.user.id,
          content: initialMessage,
          type: "TEXT",
          status: "SENT",
        },
      });

      // Update lastMessageAt
      await prisma.conversation.update({
        where: { id: conversation.id },
        data: { lastMessageAt: new Date() },
      });

      // Increment unread count for other participants
      await prisma.conversationParticipant.updateMany({
        where: {
          conversationId: conversation.id,
          userId: { not: session.user.id },
        },
        data: {
          unreadCount: { increment: 1 },
        },
      });
    }

    // Add otherParticipants
    const otherParticipants = conversation.participants.filter(
      (p) => p.userId !== session.user.id
    );

    return NextResponse.json(
      {
        ...conversation,
        otherParticipants,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error creating conversation:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
