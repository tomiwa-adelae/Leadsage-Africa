import { SiteHeader } from "@/components/sidebar/site-header";
import { BlogPostForm } from "../_components/BlogPostForm";
import { getBlogCategories } from "@/app/data/admin/blog/get-blog-categories";

import type { Metadata } from "next";
import { PageHeader } from "@/components/PageHeader";

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
          <PageHeader
            title={"Create Blog Post"}
            description={"Write and publish a new blog post."}
          />

          <div className="mt-8">
            <BlogPostForm categories={categories} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateBlogPostPage;
