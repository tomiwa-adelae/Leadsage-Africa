"use server";

import { requireAdmin } from "@/app/data/admin/require-admin";
import { prisma } from "@/lib/db";
import { ApiResponse } from "@/lib/types";
import {
  createBlogPostServerSchema,
  CreateBlogPostServerSchemaType,
  editBlogPostFormSchema,
  EditBlogPostFormSchemaType,
  createBlogCategoryFormSchema,
  CreateBlogCategoryFormSchemaType,
} from "@/lib/zodSchemas";
import { revalidatePath } from "next/cache";
import slugify from "slugify";

export const createBlogPost = async (
  data: CreateBlogPostServerSchemaType
): Promise<ApiResponse> => {
  const { user } = await requireAdmin();

  try {
    const validation = createBlogPostServerSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data provided" };

    const slug = slugify(validation.data.title);

    const post = await prisma.blogPost.create({
      data: {
        title: validation.data.title,
        slug,
        excerpt: validation.data.excerpt,
        content: validation.data.content,
        featuredImage: validation.data.featuredImage || null,
        categoryId: validation.data.categoryId || null,
        tags: validation.data.tags || [],
        status: validation.data.status,
        authorId: user.id,
        publishedAt: validation.data.status === "Published" ? new Date() : null,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return {
      status: "success",
      message: "Blog post created successfully",
      type: post.slug,
    };
  } catch (error) {
    console.error("Error creating blog post:", error);
    return { status: "error", message: "Failed to create blog post" };
  }
};

export const updateBlogPost = async (
  id: string,
  data: EditBlogPostFormSchemaType
): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Post ID is required" };

    const validation = editBlogPostFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data provided" };

    const existingPost = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!existingPost)
      return { status: "error", message: "Blog post not found" };

    const slug = slugify(validation.data.title);

    // Determine if we need to update publishedAt
    const shouldSetPublishedAt =
      validation.data.status === "Published" && !existingPost.publishedAt;

    await prisma.blogPost.update({
      where: { id },
      data: {
        title: validation.data.title,
        slug,
        excerpt: validation.data.excerpt,
        content: validation.data.content,
        featuredImage: validation.data.featuredImage,
        categoryId: validation.data.categoryId || null,
        tags: validation.data.tags || [],
        status: validation.data.status,
        ...(shouldSetPublishedAt && { publishedAt: new Date() }),
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");
    revalidatePath(`/blog/${slug}`);

    return { status: "success", message: "Blog post updated successfully" };
  } catch (error) {
    console.error("Error updating blog post:", error);
    return { status: "error", message: "Failed to update blog post" };
  }
};

export const deleteBlogPost = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Post ID is required" };

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) return { status: "error", message: "Blog post not found" };

    await prisma.blogPost.update({
      where: { id },
      data: { status: "Deleted" },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { status: "success", message: "Blog post deleted successfully" };
  } catch (error) {
    console.error("Error deleting blog post:", error);
    return { status: "error", message: "Failed to delete blog post" };
  }
};

export const restoreBlogPost = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Post ID is required" };

    const post = await prisma.blogPost.findUnique({
      where: { id, status: "Deleted" },
    });

    if (!post)
      return { status: "error", message: "Deleted blog post not found" };

    await prisma.blogPost.update({
      where: { id },
      data: { status: "Draft" },
    });

    revalidatePath("/admin/blog");

    return { status: "success", message: "Blog post restored successfully" };
  } catch (error) {
    console.error("Error restoring blog post:", error);
    return { status: "error", message: "Failed to restore blog post" };
  }
};

export const publishBlogPost = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Post ID is required" };

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) return { status: "error", message: "Blog post not found" };

    if (!post.title || !post.content || !post.excerpt)
      return {
        status: "error",
        message: "Post must have title, content, and excerpt to publish",
      };

    await prisma.blogPost.update({
      where: { id },
      data: {
        status: "Published",
        publishedAt: post.publishedAt || new Date(),
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { status: "success", message: "Blog post published successfully" };
  } catch (error) {
    console.error("Error publishing blog post:", error);
    return { status: "error", message: "Failed to publish blog post" };
  }
};

export const unpublishBlogPost = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Post ID is required" };

    const post = await prisma.blogPost.findUnique({
      where: { id, status: "Published" },
    });

    if (!post)
      return { status: "error", message: "Published blog post not found" };

    await prisma.blogPost.update({
      where: { id },
      data: { status: "Draft" },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { status: "success", message: "Blog post unpublished successfully" };
  } catch (error) {
    console.error("Error unpublishing blog post:", error);
    return { status: "error", message: "Failed to unpublish blog post" };
  }
};

export const archiveBlogPost = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Post ID is required" };

    const post = await prisma.blogPost.findUnique({
      where: { id },
    });

    if (!post) return { status: "error", message: "Blog post not found" };

    if (post.status === "Deleted")
      return {
        status: "error",
        message: "Cannot archive a deleted post. Restore it first.",
      };

    await prisma.blogPost.update({
      where: { id },
      data: { status: "Archived" },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/blog");

    return { status: "success", message: "Blog post archived successfully" };
  } catch (error) {
    console.error("Error archiving blog post:", error);
    return { status: "error", message: "Failed to archive blog post" };
  }
};

export const unarchiveBlogPost = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Post ID is required" };

    const post = await prisma.blogPost.findUnique({
      where: { id, status: "Archived" },
    });

    if (!post)
      return { status: "error", message: "Archived blog post not found" };

    await prisma.blogPost.update({
      where: { id },
      data: { status: "Draft" },
    });

    revalidatePath("/admin/blog");

    return { status: "success", message: "Blog post unarchived successfully" };
  } catch (error) {
    console.error("Error unarchiving blog post:", error);
    return { status: "error", message: "Failed to unarchive blog post" };
  }
};

// Blog Category Actions
export const createBlogCategory = async (
  data: CreateBlogCategoryFormSchemaType
): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    const validation = createBlogCategoryFormSchema.safeParse(data);

    if (!validation.success)
      return { status: "error", message: "Invalid data provided" };

    const slug = slugify(validation.data.name, { lower: true, strict: true });

    const category = await prisma.blogCategory.create({
      data: {
        name: validation.data.name,
        slug,
        description: validation.data.description,
      },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/admin/blog/categories");

    return {
      status: "success",
      message: "Category created successfully",
      type: category.id,
    };
  } catch (error) {
    console.error("Error creating blog category:", error);
    return { status: "error", message: "Failed to create category" };
  }
};

export const deleteBlogCategory = async (id: string): Promise<ApiResponse> => {
  await requireAdmin();

  try {
    if (!id) return { status: "error", message: "Category ID is required" };

    const category = await prisma.blogCategory.findUnique({
      where: { id },
      include: { _count: { select: { posts: true } } },
    });

    if (!category) return { status: "error", message: "Category not found" };

    if (category._count.posts > 0)
      return {
        status: "error",
        message: "Cannot delete category with existing posts",
      };

    await prisma.blogCategory.delete({
      where: { id },
    });

    revalidatePath("/admin/blog");
    revalidatePath("/admin/blog/categories");

    return { status: "success", message: "Category deleted successfully" };
  } catch (error) {
    console.error("Error deleting blog category:", error);
    return { status: "error", message: "Failed to delete category" };
  }
};
