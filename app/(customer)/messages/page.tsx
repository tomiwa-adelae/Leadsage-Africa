import { SiteHeader } from "@/components/sidebar/site-header";
import { MessagesPage } from "@/components/messaging";
import { getConversations } from "@/app/data/messages/get-conversations";
import { requireUser } from "@/app/data/user/require-user";
import { PageHeader } from "@/components/PageHeader";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Messages | Leadsage",
  description: "View and manage your conversations",
};

export default async function CustomerMessagesPage() {
  const session = await requireUser();
  const conversations = await getConversations();

  return (
    <div className="h-[100dvh] flex flex-col">
      <SiteHeader />
      <div className="flex-1 flex flex-col min-h-0 py-4 md:py-6 px-4 lg:px-6">
        <div className="mb-2 flex-shrink-0">
          <PageHeader title={"Messages"} />
        </div>
        <div className="flex-1 min-h-0">
          <MessagesPage
            initialConversations={conversations}
            currentUserId={session.user.id}
            basePath="/messages"
          />
        </div>
      </div>
    </div>
  );
}
