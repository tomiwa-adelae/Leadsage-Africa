import { SiteHeader } from "@/components/sidebar/site-header";
import { BlogPostForm } from "../../_components/BlogPostForm";
import { getBlogCategories } from "@/app/data/admin/blog/get-blog-categories";
import { getBlogPost } from "@/app/data/admin/blog/get-blog-post";
import { notFound } from "next/navigation";

import type { Metadata } from "next";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = await getBlogPost(slug);

  if (!post) {
    return { title: "Post Not Found" };
  }

  return {
    title: `Edit: ${post.title} | Admin - Leadsage`,
    description: "Edit blog post",
  };
}

const EditBlogPostPage = async ({ params }: Props) => {
  const { slug } = await params;
  const [post, categories] = await Promise.all([
    getBlogPost(slug),
    getBlogCategories(),
  ]);

  if (!post) {
    notFound();
  }

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-medium">
              Edit Blog Post
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Update your blog post
            </p>
          </div>

          <BlogPostForm categories={categories} post={post} />
        </div>
      </div>
    </div>
  );
};

export default EditBlogPostPage;
