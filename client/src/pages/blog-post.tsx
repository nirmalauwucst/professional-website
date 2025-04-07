import { useState } from "react";
import { Link, useParams, useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import { formatDistanceToNow } from "date-fns";
import { ArrowLeft, Calendar, User, Tag } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import Header from "../components/Header";
import Footer from "../components/Footer";

export default function BlogPostPage() {
  const { slug } = useParams();
  const [activeSection, setActiveSection] = useState("blog");
  const [, navigate] = useLocation();

  // Fetch blog post by slug
  const { data, isLoading, error } = useQuery({
    queryKey: ["/api/blog/post", slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const response = await fetch(`/api/blog/${slug}`);
      
      if (!response.ok) {
        throw new Error("Failed to fetch blog post");
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const post = data?.post;

  // Go back to blog listing
  const handleBackClick = () => {
    navigate("/blog");
  };

  // Handle tag click
  const handleTagClick = (tag: string) => {
    navigate(`/blog?tag=${encodeURIComponent(tag)}`);
  };

  if (isLoading) {
    return (
      <>
        <Header activeSection={activeSection} />
        <main className="container mx-auto px-6 py-24">
          <Button
            variant="ghost"
            className="mb-8 flex items-center gap-2"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Button>

          <article className="max-w-3xl mx-auto">
            <div className="mb-10">
              <Skeleton className="h-10 w-3/4 mb-4" />
              <div className="flex flex-wrap gap-4 mb-6">
                <Skeleton className="h-5 w-32" />
                <Skeleton className="h-5 w-24" />
              </div>
              <Skeleton className="h-64 w-full mb-6" />
            </div>

            <div className="prose prose-lg max-w-none">
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-11/12 mb-4" />
              <Skeleton className="h-6 w-10/12 mb-4" />
              <Skeleton className="h-6 w-full mb-8" />
              
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-9/12 mb-4" />
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-10/12 mb-8" />
              
              <Skeleton className="h-6 w-full mb-4" />
              <Skeleton className="h-6 w-11/12 mb-4" />
              <Skeleton className="h-6 w-8/12 mb-8" />
            </div>
          </article>
        </main>
        <Footer />
      </>
    );
  }

  if (error || !post) {
    return (
      <>
        <Header activeSection={activeSection} />
        <main className="container mx-auto px-6 py-24">
          <Button
            variant="ghost"
            className="mb-8 flex items-center gap-2"
            onClick={handleBackClick}
          >
            <ArrowLeft className="h-4 w-4" />
            Back to all posts
          </Button>

          <div className="max-w-3xl mx-auto text-center py-16">
            <h1 className="text-2xl font-bold mb-4">Post Not Found</h1>
            <p className="text-muted-foreground mb-8">
              Sorry, the blog post you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={handleBackClick}>Return to Blog</Button>
          </div>
        </main>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Header activeSection={activeSection} />
      <main className="container mx-auto px-6 py-24">
        <Button
          variant="ghost"
          className="mb-8 flex items-center gap-2"
          onClick={handleBackClick}
        >
          <ArrowLeft className="h-4 w-4" />
          Back to all posts
        </Button>

        <article className="max-w-3xl mx-auto">
          <header className="mb-10">
            <h1 className="text-3xl md:text-4xl font-bold mb-4">{post.title}</h1>
            
            <div className="flex flex-wrap gap-4 mb-6 text-sm text-muted-foreground">
              {post.publishedAt && (
                <div className="flex items-center gap-1">
                  <Calendar className="h-4 w-4" />
                  <span>{formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}</span>
                </div>
              )}
              
              {post.author && (
                <div className="flex items-center gap-1">
                  <User className="h-4 w-4" />
                  <span>{post.author}</span>
                </div>
              )}
            </div>
            
            {post.coverImage && (
              <div className="mb-6 rounded-lg overflow-hidden">
                <img
                  src={post.coverImage}
                  alt={post.title}
                  className="w-full h-auto object-cover"
                />
              </div>
            )}
            
            {post.tags && post.tags.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-8">
                <Tag className="h-4 w-4 text-muted-foreground" />
                {post.tags.map((tag: string) => (
                  <Badge
                    key={tag}
                    variant="secondary"
                    className="cursor-pointer"
                    onClick={() => handleTagClick(tag)}
                  >
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </header>

          <div className="prose prose-lg max-w-none dark:prose-invert">
            <ReactMarkdown 
              remarkPlugins={[remarkGfm]} 
              rehypePlugins={[rehypeRaw]}
            >
              {post.content}
            </ReactMarkdown>
          </div>
        </article>
      </main>
      <Footer />
    </>
  );
}