import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCMSAuth } from "@/hooks/use-cms-auth";
import { useRef, useState } from "react";
import { Link, useLocation } from "wouter";
import { ArrowLeft, FileImage, Loader2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TipTapEditor } from "@/components/cms/TipTapEditor";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/utils";

export default function NewBlogPost() {
  const { isAuthenticated } = useCMSAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [excerpt, setExcerpt] = useState("");
  const [slug, setSlug] = useState("");
  const [published, setPublished] = useState(false);
  const [tags, setTags] = useState<string[]>([]);
  const [tagInput, setTagInput] = useState("");
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [coverImagePreview, setCoverImagePreview] = useState<string | null>(null);

  // Create blog post mutation
  const createPostMutation = useMutation({
    mutationFn: async () => {
      const formData = new FormData();
      formData.append("title", title);
      formData.append("content", content);
      formData.append("excerpt", excerpt);
      formData.append("slug", slug || slugify(title));
      formData.append("published", published.toString());
      formData.append("tags", JSON.stringify(tags));
      
      if (coverImage) {
        formData.append("coverImage", coverImage);
      }

      const response = await fetch("/api/cms/blog", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create blog post");
      }

      return await response.json();
    },
    onSuccess: () => {
      toast({
        title: "Blog post created",
        description: "Your post has been successfully created",
      });
      navigate("/admin/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error creating post",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  // Handle file change
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setCoverImage(file);
      const reader = new FileReader();
      reader.onload = () => {
        setCoverImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle tag addition
  const handleAddTag = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && tagInput.trim() !== "") {
      e.preventDefault();
      if (!tags.includes(tagInput.trim())) {
        setTags([...tags, tagInput.trim()]);
      }
      setTagInput("");
    }
  };

  // Handle tag removal
  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createPostMutation.mutate();
  };

  // Auto-generate slug from title
  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTitle = e.target.value;
    setTitle(newTitle);
    if (!slug) {
      setSlug(slugify(newTitle));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">New Blog Post</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
              </Link>
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={createPostMutation.isPending || !title || !content}
            >
              {createPostMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Save Post
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Editor Column */}
            <div className="md:col-span-2 space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="title">Title</Label>
                      <Input
                        id="title"
                        placeholder="Post title"
                        value={title}
                        onChange={handleTitleChange}
                        required
                      />
                    </div>
                    
                    <div>
                      <Label htmlFor="content">Content</Label>
                      <TipTapEditor
                        content={content}
                        onChange={setContent}
                        placeholder="Write your post content here..."
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Settings Column */}
            <div className="space-y-6">
              <Card>
                <CardContent className="pt-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="excerpt">Excerpt</Label>
                      <Textarea
                        id="excerpt"
                        placeholder="Brief summary of your post"
                        rows={3}
                        value={excerpt}
                        onChange={(e) => setExcerpt(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label htmlFor="slug">URL Slug</Label>
                      <Input
                        id="slug"
                        placeholder="post-url-slug"
                        value={slug}
                        onChange={(e) => setSlug(e.target.value)}
                      />
                    </div>

                    <div>
                      <Label>Cover Image</Label>
                      <div className="mt-1">
                        {coverImagePreview ? (
                          <div className="relative">
                            <img
                              src={coverImagePreview}
                              alt="Cover preview"
                              className="w-full h-32 object-cover rounded-md"
                            />
                            <Button
                              type="button"
                              variant="secondary"
                              size="sm"
                              className="absolute top-2 right-2"
                              onClick={() => {
                                setCoverImage(null);
                                setCoverImagePreview(null);
                                if (fileInputRef.current) {
                                  fileInputRef.current.value = "";
                                }
                              }}
                            >
                              Remove
                            </Button>
                          </div>
                        ) : (
                          <Button
                            type="button"
                            variant="outline"
                            onClick={() => fileInputRef.current?.click()}
                            className="w-full h-32 flex flex-col items-center justify-center border-dashed"
                          >
                            <FileImage className="h-8 w-8 mb-2 text-gray-400" />
                            <span>Upload Cover Image</span>
                          </Button>
                        )}
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleFileChange}
                          accept="image/*"
                          className="hidden"
                        />
                      </div>
                    </div>

                    <div>
                      <Label htmlFor="tags">Tags</Label>
                      <Input
                        id="tags"
                        placeholder="Add a tag and press Enter"
                        value={tagInput}
                        onChange={(e) => setTagInput(e.target.value)}
                        onKeyDown={handleAddTag}
                      />
                      <div className="flex flex-wrap gap-2 mt-2">
                        {tags.map((tag) => (
                          <Badge key={tag} variant="secondary" className="cursor-pointer" onClick={() => handleRemoveTag(tag)}>
                            {tag} &times;
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <Label htmlFor="published">Publish</Label>
                      <Switch
                        id="published"
                        checked={published}
                        onCheckedChange={setPublished}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </form>
      </main>
    </div>
  );
}