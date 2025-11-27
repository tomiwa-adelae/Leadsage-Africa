import { SiteHeader } from "@/components/sidebar/site-header";
import { BlogPostForm } from "../_components/BlogPostForm";
import { getBlogCategories } from "@/app/data/admin/blog/get-blog-categories";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create Blog Post | Admin - Leadsage",
  description: "Create a new blog post",
};

const CreateBlogPostPage = async () => {
  const categories = await getBlogCategories();

  return (
    <div>
      <SiteHeader />
      <div className="py-4 md:py-6 px-4 lg:px-6">
        <div>
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-medium">
              Create Blog Post
            </h1>
            <p className="text-muted-foreground text-base mt-2.5">
              Write and publish a new blog post
            </p>
          </div>

          <BlogPostForm categories={categories} />
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPostPage;
