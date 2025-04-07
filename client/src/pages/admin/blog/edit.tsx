import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useCMSAuth } from "@/hooks/use-cms-auth";
import { useRef, useState, useEffect } from "react";
import { Link, useLocation, useRoute, useParams } from "wouter";
import { ArrowLeft, FileImage, Loader2, Save } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { TipTapEditor } from "@/components/cms/TipTapEditor";
import { useMutation, useQuery } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { Badge } from "@/components/ui/badge";
import { slugify } from "@/lib/utils";
import { BlogPost } from "@shared/schema";

export default function EditBlogPost() {
  const { isAuthenticated } = useCMSAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const params = useParams();
  const postId = params.id ? parseInt(params.id) : undefined;
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
  const [currentCoverImageUrl, setCurrentCoverImageUrl] = useState<string | null>(null);

  // Fetch blog post to edit
  const { data: postData, isLoading: isLoadingPost } = useQuery<{ post: BlogPost }>({
    queryKey: [`/api/cms/blog/${postId}`],
    enabled: !!postId,
    staleTime: 0,
  });

  // Fetch post content
  const { isLoading: isLoadingContent } = useQuery<{ success: boolean, content: string }>({
    queryKey: [`/api/blog/content/${postData?.post?.s3Key}`],
    enabled: !!postData?.post?.s3Key,
    onSuccess: (data) => {
      if (data?.content) {
        setContent(data.content);
      }
    },
    onError: (error) => {
      console.error("Failed to fetch post content:", error);
      toast({
        title: "Error fetching content",
        description: "Unable to load post content. Please try again.",
        variant: "destructive",
      });
    }
  });

  // Populate form data when post is loaded
  useEffect(() => {
    if (postData?.post) {
      const post = postData.post;
      setTitle(post.title);
      setExcerpt(post.excerpt);
      setSlug(post.slug);
      setPublished(post.published);
      setTags(post.tags);
      setCurrentCoverImageUrl(post.coverImage);
    }
  }, [postData]);

  // Update blog post mutation
  const updatePostMutation = useMutation({
    mutationFn: async () => {
      if (!postId) throw new Error("Post ID is missing");
      
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

      // Use apiRequest to include authentication token
      return await apiRequest("PUT", `/api/cms/blog/${postId}`, formData);
    },
    onSuccess: () => {
      toast({
        title: "Blog post updated",
        description: "Your post has been successfully updated",
      });
      navigate("/admin/dashboard");
    },
    onError: (error: Error) => {
      toast({
        title: "Error updating post",
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
      setCurrentCoverImageUrl(null);
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
    updatePostMutation.mutate();
  };

  if (isLoadingPost || isLoadingContent) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Edit Blog Post</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="outline" asChild>
              <Link href="/admin/dashboard">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Dashboard
              </Link>
            </Button>
            <Button 
              onClick={handleSubmit}
              disabled={updatePostMutation.isPending || !title || !content}
            >
              {updatePostMutation.isPending ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                <>
                  <Save className="h-4 w-4 mr-2" /> Update Post
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
                        onChange={(e) => setTitle(e.target.value)}
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
                        {(coverImagePreview || currentCoverImageUrl) ? (
                          <div className="relative">
                            <img
                              src={coverImagePreview || currentCoverImageUrl || ""}
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
                                setCurrentCoverImageUrl(null);
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