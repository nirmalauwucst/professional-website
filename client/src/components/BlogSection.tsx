import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { ArrowRight } from "lucide-react";
import { Link } from "wouter";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: number;
  title: string;
  excerpt: string;
  slug: string;
  coverImage: string | null;
  publishedAt: string | null;
  tags: string[];
}

export default function BlogSection() {
  // Fetch latest 3 published blog posts
  const { data, isLoading } = useQuery({
    queryKey: ["/api/blog/latest"],
    queryFn: async () => {
      const response = await fetch("/api/blog?published=true&limit=3");
      
      if (!response.ok) {
        throw new Error("Failed to fetch latest blog posts");
      }
      
      return response.json();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const posts = data?.posts || [];

  return (
    <section id="blog" className="py-20 bg-muted/20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">Latest from the Blog</h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Explore my thoughts on web development, design trends, and technology insights.
          </p>
        </div>
        
        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <Card key={index} className="h-[400px]">
                <Skeleton className="h-40 w-full" />
                <CardHeader>
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-2/3 mb-4" />
                  <div className="flex gap-2">
                    <Skeleton className="h-6 w-16" />
                    <Skeleton className="h-6 w-16" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {posts.map((post: BlogPost) => (
              <Link href={`/blog/${post.slug}`} key={post.id}>
                <a className="block h-full">
                  <Card className="h-full hover:shadow-md transition-shadow duration-300">
                    {post.coverImage && (
                      <div className="h-40 w-full overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                        />
                      </div>
                    )}
                    <CardHeader>
                      <CardTitle className="line-clamp-2">{post.title}</CardTitle>
                      <div className="text-sm text-muted-foreground">
                        {post.publishedAt ? formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true }) : ''}
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-muted-foreground mb-4 line-clamp-3">{post.excerpt}</p>
                      <div className="flex flex-wrap gap-2">
                        {post.tags.slice(0, 2).map((tag) => (
                          <Badge key={tag} variant="secondary">{tag}</Badge>
                        ))}
                        {post.tags.length > 2 && (
                          <Badge variant="outline">+{post.tags.length - 2}</Badge>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </a>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground mb-8">No blog posts published yet. Check back soon!</p>
          </div>
        )}
        
        <div className="text-center mt-12">
          <Button asChild className="gap-2 group">
            <Link href="/blog">
              View All Posts
              <ArrowRight className="h-4 w-4 transform transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </div>
      </div>
    </section>
  );
}