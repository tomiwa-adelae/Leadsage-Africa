// "use client";

// import { GetAllBlogPostsType } from "@/app/data/admin/blog/get-all-blog-posts";
// import { Badge } from "@/components/ui/badge";
// import { Card, CardContent } from "@/components/ui/card";
// import { formatDate } from "@/lib/utils";
// import Image from "next/image";
// import Link from "next/link";
// import { BlogPostDropdown } from "./BlogPostDropdown";
// import { DEFAULT_LISTING_IMAGE } from "@/constants";

// interface Props {
//   post: GetAllBlogPostsType;
// }

// export const BlogPostCard = ({ post }: Props) => {
//   const statusColors = {
//     Draft:
//       "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300",
//     Published:
//       "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
//     Deleted: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
//   };

//   return (
//     <Card className="gap-0">
//       <CardContent>
//         <div>
//           <Image
//             src={post.featuredImage || DEFAULT_LISTING_IMAGE}
//             alt={post.title}
//             height={1000}
//             width={1000}
//             className="object-cover size-full"
//           />
//           <div className="flex-1 p-4">
//             <div className="flex items-start justify-between gap-2">
//               <div className="space-y-1 flex-1">
//                 <div className="flex items-center gap-2 flex-wrap">
//                   <Badge
//                     variant="secondary"
//                     className={statusColors[post.status]}
//                   >
//                     {post.status}
//                   </Badge>
//                   {post.category && (
//                     <Badge variant="outline">{post.category.name}</Badge>
//                   )}
//                 </div>
//                 <Link
//                   href={`/admin/blog/${post.id}`}
//                   className="text-lg font-medium hover:underline line-clamp-1"
//                 >
//                   {post.title}
//                 </Link>
//                 <p className="text-sm text-muted-foreground line-clamp-2">
//                   {post.excerpt}
//                 </p>
//               </div>
//               <BlogPostDropdown post={post} />
//             </div>
//             <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
//               <span>By {post.author?.name || "Unknown"}</span>
//               <span>{formatDate(post.createdAt)}</span>
//               {post.publishedAt && (
//                 <span>Published: {formatDate(post.publishedAt)}</span>
//               )}
//             </div>
//           </div>
//         </div>
//       </CardContent>
//     </Card>
//   );
// };

"use client";

import { GetAllBlogPostsType } from "@/app/data/admin/blog/get-all-blog-posts";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { formatDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { BlogPostDropdown } from "./BlogPostDropdown";
import { DEFAULT_LISTING_IMAGE } from "@/constants";
import { Radio } from "lucide-react";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { IconArchive } from "@tabler/icons-react";

interface Props {
  post: GetAllBlogPostsType;
}

export const BlogPostCard = ({ post }: Props) => {
  const photoUrl = useConstructUrl(post.featuredImage);
  return (
    <Card className="bg-transparent gap-0 border-0 rounded-none shadow-none p-0">
      <CardContent className="p-0">
        <div className="relative rounded-lg overflow-hidden">
          <Link
            href={`/admin/blog/${post.slug}`}
            className="relative rounded-lg"
          >
            <Image
              src={photoUrl || DEFAULT_LISTING_IMAGE}
              alt={`${post.title}'s photo`}
              width={1000}
              height={1000}
              className="aspect-video md:aspect-square size-full object-cover"
            />
            <div className="absolute inset-0 bg-black/30" />
          </Link>
          {post.status === "Published" && (
            <Badge className="absolute top-2 left-2">
              <Radio /> {post.status}
            </Badge>
          )}
          {post.status === "Archived" && (
            <Badge variant={"secondary"} className="absolute top-2 left-2">
              <IconArchive /> {post.status}
            </Badge>
          )}
        </div>
        <div className="py-2">
          {post.title ? (
            <Link
              href={`/admin/blog/${post.slug}`}
              className="group-hover:text-primary hover:underline transition-all font-medium text-lg line-clamp-1"
            >
              {post.title}
            </Link>
          ) : (
            <p className="italic text-lg">No title</p>
          )}
          <p className="text-sm line-clamp-3 text-muted-foreground">
            {post.excerpt}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
