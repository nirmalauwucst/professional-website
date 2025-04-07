import { useState, useEffect } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { formatDistanceToNow } from "date-fns";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import Header from "../components/Header";
import Footer from "../components/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

interface BlogPost {
  id: number;
  title: string;
  content: string;
  slug: string;
  excerpt: string;
  authorId: number | null;
  coverImage: string | null;
  published: boolean;
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
  tags: string[];
}

export default function BlogPage() {
  const [activeSection, setActiveSection] = useState("blog");
  const [currentTag, setCurrentTag] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  // Fetch blog tags
  const tagsQuery = useQuery<{ tags: string[] }>({
    queryKey: ["/api/blog/tags"],
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  // Fetch blog posts with optional tag filter
  const postsQuery = useQuery<{ posts: BlogPost[], pagination: { total: number } }>({
    queryKey: ["/api/blog/posts", { tag: currentTag, search: searchQuery }],
    queryFn: async () => {
      let url = "/api/blog?published=true";
      
      if (currentTag) {
        url += `&tag=${encodeURIComponent(currentTag)}`;
      }
      
      if (searchQuery) {
        url += `&search=${encodeURIComponent(searchQuery)}`;
      }
      
      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error("Failed to fetch blog posts");
      }
      
      return response.json();
    },
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const tags = tagsQuery.data?.tags || [];
  const posts = postsQuery.data?.posts || [];
  const isLoading = postsQuery.isLoading || tagsQuery.isLoading;

  // Reset to first page when tag or search changes
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [currentTag, searchQuery]);

  // Function to handle search input changes
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  // Function to handle clearing the search
  const clearSearch = () => {
    setSearchQuery("");
  };

  // Function to handle tag selection from individual post
  const handleTagClick = (tag: string): void => {
    setCurrentTag(tag);
  };

  return (
    <>
      <Header activeSection={activeSection} />
      <main className="container mx-auto px-6 py-24">
        <section className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Blog</h1>
          <p className="text-lg text-muted-foreground max-w-2xl">
            Thoughts, insights, and updates about web development, design, and technology.
          </p>
        </section>

        <div className="mb-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-6 mb-8">
            <div className="relative w-full md:w-96">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search articles..."
                className="pl-10"
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </div>

            <Tabs 
              defaultValue="all" 
              className="w-full"
              onValueChange={(value) => setCurrentTag(value === "all" ? null : value)}
            >
              <TabsList className="bg-muted/50 flex-wrap h-auto">
                <TabsTrigger value="all" className={!currentTag ? "data-[state=active]:bg-accent" : ""}>
                  All Posts
                </TabsTrigger>
                {tags.map((tag) => (
                  <TabsTrigger 
                    key={tag} 
                    value={tag}
                    className={currentTag === tag ? "data-[state=active]:bg-accent" : ""}
                  >
                    {tag}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>

          <Separator className="mb-8" />

          {isLoading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, index) => (
                <Card key={index} className="overflow-hidden h-[420px]">
                  <Skeleton className="h-48 w-full" />
                  <CardHeader>
                    <Skeleton className="h-6 w-3/4 mb-2" />
                    <Skeleton className="h-4 w-1/2" />
                  </CardHeader>
                  <CardContent>
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-full mb-2" />
                    <Skeleton className="h-4 w-2/3" />
                    <div className="flex gap-2 mt-4">
                      <Skeleton className="h-6 w-16" />
                      <Skeleton className="h-6 w-16" />
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : posts.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post: BlogPost) => (
                <div key={post.id} className="h-full cursor-pointer" onClick={() => window.location.href = `/blog/${post.slug}`}>
                  <Card className="overflow-hidden h-full hover:shadow-md transition-shadow duration-300">
                    {post.coverImage && (
                      <div className="h-48 w-full overflow-hidden">
                        <img 
                          src={post.coverImage} 
                          alt={post.title} 
                          className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
                          onError={(e) => {
                            console.error(`Failed to load image: ${post.coverImage}`);
                            e.currentTarget.src = "https://placehold.co/600x400?text=Image+Not+Available";
                          }}
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
                        {post.tags.map((tag) => (
                          <Badge 
                            key={tag} 
                            variant="secondary"
                            className="cursor-pointer"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleTagClick(tag);
                            }}
                          >
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-16 border rounded-lg bg-muted/10">
              <h3 className="text-xl font-medium mb-2">No posts found</h3>
              <p className="text-muted-foreground mb-6">
                {searchQuery ? 
                  'No matching posts for your search criteria.' : 
                  currentTag ? 
                    `No posts found with the tag "${currentTag}".` : 
                    'No blog posts have been published yet.'}
              </p>
              {(searchQuery || currentTag) && (
                <button 
                  onClick={clearSearch} 
                  className="text-accent hover:underline"
                >
                  Clear filters
                </button>
              )}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </>
  );
}