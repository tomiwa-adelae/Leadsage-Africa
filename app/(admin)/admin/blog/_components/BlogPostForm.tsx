"use client";

import { useRef, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  createBlogPostFormSchema,
  CreateBlogPostFormSchemaType,
} from "@/lib/zodSchemas";
import { createBlogPost, updateBlogPost, createBlogCategory } from "../actions";
import { GetBlogCategoriesType } from "@/app/data/admin/blog/get-blog-categories";
import { GetBlogPostType } from "@/app/data/admin/blog/get-blog-post";
import { RichTextEditor } from "@/components/text-editor/Editor";
import { Badge } from "@/components/ui/badge";
import { IconPhoto, IconUpload, IconX, IconPlus } from "@tabler/icons-react";
import Image from "next/image";
import { useConstructUrl } from "@/hooks/use-construct-url";
import { X } from "lucide-react";
import slugify from "slugify";

interface Props {
  categories: GetBlogCategoriesType[];
  post?: GetBlogPostType;
}

// Helper function to upload image to Tigris via presigned URL
const uploadImageToTigris = async (file: File): Promise<string | null> => {
  try {
    // Get presigned URL
    const presignedResponse = await fetch("/api/s3/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        fileName: file.name,
        contentType: file.type,
        size: file.size,
        isImage: true,
      }),
    });

    if (!presignedResponse.ok) {
      throw new Error("Failed to get presigned URL");
    }

    const { presignedUrl, key } = await presignedResponse.json();

    // Upload file to Tigris
    const uploadResponse = await fetch(presignedUrl, {
      method: "PUT",
      headers: { "Content-Type": file.type },
      body: file,
    });

    if (!uploadResponse.ok) {
      throw new Error("Failed to upload image");
    }

    return key;
  } catch (error) {
    console.error("Error uploading image:", error);
    return null;
  }
};

export const BlogPostForm = ({
  categories: initialCategories,
  post,
}: Props) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [tagInput, setTagInput] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  // Category state
  const [categories, setCategories] = useState(initialCategories);
  const [isCreateCategoryOpen, setIsCreateCategoryOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState("");
  const [newCategoryDescription, setNewCategoryDescription] = useState("");
  const [isCreatingCategory, setIsCreatingCategory] = useState(false);

  // For existing posts, construct the full URL for preview
  const existingImageUrl = useConstructUrl(post?.featuredImage);

  const form = useForm<CreateBlogPostFormSchemaType>({
    resolver: zodResolver(createBlogPostFormSchema),
    defaultValues: {
      title: post?.title || "",
      excerpt: post?.excerpt || "",
      content: post?.content || "",
      featuredImage: post?.featuredImage || "",
      categoryId: post?.category?.id || "",
      tags: post?.tags || [],
      status: (post?.status as "Draft" | "Published") || "Draft",
    },
  });

  const tags = form.watch("tags") || [];

  // Track the file object separately for upload
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>(
    post?.featuredImage ? existingImageUrl : ""
  );

  const addTag = () => {
    const tag = tagInput.trim().toLowerCase();
    if (tag && !tags.includes(tag)) {
      form.setValue("tags", [...tags, tag]);
      setTagInput("");
    }
  };

  const removeTag = (tagToRemove: string) => {
    form.setValue(
      "tags",
      tags.filter((t) => t !== tagToRemove)
    );
  };

  const handleCreateCategory = async () => {
    if (!newCategoryName.trim()) {
      toast.error("Category name is required");
      return;
    }

    setIsCreatingCategory(true);

    const result = await createBlogCategory({
      name: newCategoryName.trim(),
      description: newCategoryDescription.trim() || undefined,
    });

    setIsCreatingCategory(false);

    if (result.status === "success") {
      toast.success(result.message);
      // Add the new category to local state
      const newCategory = {
        id: result.type || crypto.randomUUID(),
        name: newCategoryName.trim(),
        description: newCategoryDescription.trim() || null,
        _count: { posts: 0 },
      };
      setCategories((prev) => [...prev, newCategory]);
      // Select the new category
      form.setValue("categoryId", newCategory.id);
      // Reset and close dialog
      setNewCategoryName("");
      setNewCategoryDescription("");
      setIsCreateCategoryOpen(false);
    } else {
      toast.error(result.message);
    }
  };

  const onSubmit = async (data: CreateBlogPostFormSchemaType) => {
    setIsLoading(true);

    try {
      let featuredImageKey: string | undefined = undefined;

      // If there's a selected file, upload it first
      if (selectedFile) {
        setIsUploading(true);
        const uploadedKey = await uploadImageToTigris(selectedFile);
        setIsUploading(false);

        if (!uploadedKey) {
          toast.error("Failed to upload featured image");
          setIsLoading(false);
          return;
        }
        featuredImageKey = uploadedKey;
      } else if (typeof data.featuredImage === "string" && data.featuredImage) {
        // Keep existing image key
        featuredImageKey = data.featuredImage;
      }

      // Prepare server data
      const serverData = {
        title: data.title,
        excerpt: data.excerpt,
        content: data.content,
        featuredImage: featuredImageKey,
        categoryId: data.categoryId,
        tags: data.tags,
        status: data.status,
      };

      const result = post
        ? await updateBlogPost(post.id, {
            ...serverData,
          })
        : await createBlogPost(serverData);

      setIsLoading(false);

      if (result.status === "success") {
        toast.success(result.message);
        if (!post && result.type) {
          router.push(`/admin/blog/${result.type}`);
        } else {
          router.push("/admin/blog");
        }
      } else {
        toast.error(result.message);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
      toast.error("An error occurred while saving the blog post");
      setIsLoading(false);
    }
  };

  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Title</FormLabel>
              <FormControl>
                <Input {...field} placeholder="Enter blog post title" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="excerpt"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Excerpt</FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  placeholder="Brief description of the post"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="content"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Content</FormLabel>
              <FormControl>
                <RichTextEditor field={field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="featuredImage"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Featured Image</FormLabel>
              <FormControl>
                <div className="py-4 space-y-4">
                  {!previewUrl ? (
                    <div
                      onDragOver={(e) => {
                        e.preventDefault();
                        setIsDragging(true);
                      }}
                      onDragLeave={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                      }}
                      onDrop={(e) => {
                        e.preventDefault();
                        setIsDragging(false);
                        const file = e.dataTransfer.files?.[0];
                        if (file) {
                          if (
                            ![
                              "image/png",
                              "image/jpeg",
                              "image/jpg",
                              "image/webp",
                            ].includes(file.type)
                          ) {
                            toast.error(
                              "Only PNG, JPG, JPEG, or WEBP files are supported."
                            );
                            return;
                          }
                          setSelectedFile(file);
                          setPreviewUrl(URL.createObjectURL(file));
                        }
                      }}
                      className={`border-2 bg-muted border-dashed rounded-md p-12 text-center transition-colors cursor-pointer ${
                        isDragging
                          ? "border-primary bg-primary/5"
                          : "border-gray-300 bg-gray-50"
                      }`}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <div className="flex flex-col items-center gap-3">
                        <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                          <IconPhoto
                            size={32}
                            className="text-primary dark:text-white"
                          />
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Drop your image here, or{" "}
                          <span className="text-primary font-medium hover:underline">
                            browse
                          </span>
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          Supports: PNG, JPG, JPEG, WEBP
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <div className="relative w-full aspect-video bg-gray-50 border rounded-md flex items-center justify-center overflow-hidden">
                        <Image
                          width={1000}
                          height={1000}
                          src={previewUrl}
                          alt="Featured image"
                          className="aspect-video size-full object-cover"
                        />
                      </div>

                      <div className="flex gap-2">
                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => {
                            setSelectedFile(null);
                            setPreviewUrl("");
                            field.onChange("");
                            if (fileInputRef.current) {
                              fileInputRef.current.value = "";
                            }
                          }}
                        >
                          <IconX size={16} className="mr-2" />
                          Remove
                        </Button>

                        <Button
                          type="button"
                          variant="outline"
                          className="flex-1"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <IconUpload size={16} className="mr-2" />
                          Replace
                        </Button>
                      </div>
                    </div>
                  )}

                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/png,image/jpeg,image/jpg,image/webp"
                    className="hidden"
                    onChange={(e) => {
                      const file = e.target.files?.[0];
                      if (!file) return;

                      if (
                        ![
                          "image/png",
                          "image/jpeg",
                          "image/jpg",
                          "image/webp",
                        ].includes(file.type)
                      ) {
                        toast.error(
                          "Only PNG, JPG, JPEG, or WEBP files are supported."
                        );
                        return;
                      }

                      setSelectedFile(file);
                      setPreviewUrl(URL.createObjectURL(file));
                    }}
                  />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid gap-6 md:grid-cols-2">
          <FormField
            control={form.control}
            name="categoryId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Category</FormLabel>
                <div className="flex gap-2">
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="flex-1">
                        <SelectValue placeholder="Select a category" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.length === 0 ? (
                        <div className="px-2 py-4 text-sm text-muted-foreground text-center">
                          No categories yet. Create one!
                        </div>
                      ) : (
                        categories.map((category) => (
                          <SelectItem key={category.id} value={category.id}>
                            {category.name}
                          </SelectItem>
                        ))
                      )}
                    </SelectContent>
                  </Select>
                  <Dialog
                    open={isCreateCategoryOpen}
                    onOpenChange={setIsCreateCategoryOpen}
                  >
                    <DialogTrigger asChild>
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        className="h-11"
                      >
                        <IconPlus />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="container py-4">
                      <DialogHeader className="container">
                        <DialogTitle>Create New Category</DialogTitle>
                        <DialogDescription>
                          Add a new category for your blog posts.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="space-y-4 container ">
                        <div className="space-y-2">
                          <label
                            htmlFor="categoryName"
                            className="text-sm font-medium"
                          >
                            Name
                          </label>
                          <Input
                            id="categoryName"
                            placeholder="e.g., Technology, Lifestyle"
                            value={newCategoryName}
                            onChange={(e) => setNewCategoryName(e.target.value)}
                          />
                        </div>
                        <div className="space-y-2">
                          <label
                            htmlFor="categoryDescription"
                            className="text-sm font-medium"
                          >
                            Description (optional)
                          </label>
                          <Textarea
                            id="categoryDescription"
                            placeholder="Brief description of the category"
                            value={newCategoryDescription}
                            onChange={(e) =>
                              setNewCategoryDescription(e.target.value)
                            }
                          />
                        </div>
                      </div>
                      <DialogFooter className="container">
                        <Button
                          type="button"
                          variant="outline"
                          onClick={() => setIsCreateCategoryOpen(false)}
                        >
                          Cancel
                        </Button>
                        <Button
                          type="button"
                          onClick={handleCreateCategory}
                          disabled={isCreatingCategory}
                        >
                          {isCreatingCategory
                            ? "Creating..."
                            : "Create Category"}
                        </Button>
                      </DialogFooter>
                    </DialogContent>
                  </Dialog>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="status"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Status</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="Draft">Draft</SelectItem>
                    <SelectItem value="Published">Published</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="tags"
          render={() => (
            <FormItem>
              <FormLabel>Tags</FormLabel>
              <div className="space-y-2">
                <div className="flex gap-2">
                  <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    placeholder="Add a tag"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addTag();
                      }
                    }}
                  />
                  <Button type="button" variant="secondary" onClick={addTag}>
                    Add
                  </Button>
                </div>
                {tags.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge
                        key={tag}
                        variant="secondary"
                        className="gap-1 pr-1"
                      >
                        {tag}
                        <button
                          type="button"
                          onClick={() => removeTag(tag)}
                          className="ml-1 hover:bg-muted rounded-full p-0.5"
                        >
                          <IconX className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex gap-4">
          <Button
            className="flex-1"
            type="button"
            variant="outline"
            onClick={() => router.back()}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            type="submit"
            disabled={isLoading || isUploading}
          >
            {isUploading
              ? "Uploading image..."
              : isLoading
              ? "Saving..."
              : post
              ? "Update Post"
              : "Create Post"}
          </Button>
        </div>
      </form>
    </Form>
  );
};
