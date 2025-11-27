"use client";

import { useMemo } from "react";
import { generateHTML } from "@tiptap/html";
import { JSONContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import parse from "html-react-parser";

export const RenderDescription = ({
  json,
  truncate = false,
  className = "",
}: {
  json?: string | JSONContent | any;
  truncate?: boolean;
  className?: string;
}) => {
  const output = useMemo(() => {
    return generateHTML(json, [
      StarterKit,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
    ]);
  }, [json]);

  const baseClasses =
    "prose dark:prose-invert prose-li:marker:text-primary max-w-none";
  const truncateClasses = truncate
    ? "line-clamp-2 overflow-hidden [&>*]:m-0 [&>p]:leading-tight [&>*]:break-words [&>*]:max-w-full"
    : "[&>p]:mb-4 [&>h1]:mb-4 [&>h2]:mb-4 [&>h3]:mb-4 [&>ul]:mb-4 [&>ol]:mb-4";

  return (
    <div className={`${baseClasses} ${truncateClasses} ${className}`}>
      {parse(output)}
    </div>
  );
};
