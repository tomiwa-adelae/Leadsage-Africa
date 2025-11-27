import { getPublishedPosts } from "@/app/data/blog/get-published-posts";
import { BlogCard } from "../blog/_components/BlogCard";

export const Blogs = async () => {
  const [{ posts }] = await Promise.all([getPublishedPosts()]);
  return (
    <div>
      <div className="container">
        <div className="text-center">
          <h2 className="text-2xl md:text-3xl font-medium">
            From the Leadsage Blog
          </h2>
          <p className="text-muted-foreground text-base mt-2.5">
            Stay informed with expert guides, platform updates, and powerful
            ideas to help you grow, monetize, and thrive in the digital economy.{" "}
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
          {posts.slice(0, 9).map((post) => (
            <BlogCard key={post.id} post={post} />
          ))}
        </div>
      </div>
    </div>
  );
};
