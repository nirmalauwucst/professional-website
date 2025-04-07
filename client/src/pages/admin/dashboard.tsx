import { Button } from "@/components/ui/button";
import { useCMSAuth } from "@/hooks/use-cms-auth";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileEdit, Plus, Trash2 } from "lucide-react";
import { BlogPost } from "@shared/schema";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";
import { Helmet } from "react-helmet";
import AdminSidebar from "@/components/cms/AdminSidebar";
import { ProtectedRoute } from "@/components/cms/ProtectedRoute";
import { Skeleton } from "@/components/ui/skeleton";

function DashboardContent() {
  const { user } = useCMSAuth();
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');

  // Fetch blog posts
  const { data, isLoading, error } = useQuery<{ posts: BlogPost[], total: number }>({
    queryKey: ["/api/cms/blog"],
    retry: false,
  });

  // Fetch contact messages for the dashboard summary
  const { data: messagesData } = useQuery<{ success: boolean, messages: any[] }>({
    queryKey: ["/api/cms/contact"],
    retry: false,
  });

  // Filter posts based on selection
  const filteredPosts = data?.posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'published') return post.published;
    if (filter === 'drafts') return !post.published;
    return true;
  });

  const unreadMessagesCount = messagesData?.messages?.filter(msg => !msg.read).length || 0;

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <Helmet>
        <title>Dashboard | Admin Panel</title>
      </Helmet>
      
      <AdminSidebar />
      
      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground mb-8">
          Welcome back, {user?.name || user?.username}
        </p>
        
        {/* Dashboard Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Blog Posts</CardTitle>
              <CardDescription>Total published content</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">
                    {data?.posts?.filter(p => p.published).length || 0}
                  </span>
                  <span className="text-muted-foreground text-sm mb-1">published</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Draft Posts</CardTitle>
              <CardDescription>Unpublished content</CardDescription>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">
                    {data?.posts?.filter(p => !p.published).length || 0}
                  </span>
                  <span className="text-muted-foreground text-sm mb-1">drafts</span>
                </div>
              )}
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-lg">Messages</CardTitle>
              <CardDescription>Contact form submissions</CardDescription>
            </CardHeader>
            <CardContent>
              {!messagesData ? (
                <Skeleton className="h-10 w-16" />
              ) : (
                <div className="flex items-end gap-2">
                  <span className="text-3xl font-bold">
                    {unreadMessagesCount}
                  </span>
                  <span className="text-muted-foreground text-sm mb-1">unread</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
        
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-xl font-semibold mb-2">Blog Posts</h2>
            <div className="flex space-x-2">
              <Button 
                variant={filter === 'all' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter('all')}
              >
                All Posts
              </Button>
              <Button 
                variant={filter === 'published' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter('published')}
              >
                Published
              </Button>
              <Button 
                variant={filter === 'drafts' ? "default" : "outline"} 
                size="sm"
                onClick={() => setFilter('drafts')}
              >
                Drafts
              </Button>
            </div>
          </div>
          <Button asChild>
            <Link href="/admin/blog/new">
              <Plus className="h-4 w-4 mr-2" /> New Post
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {[1, 2, 3].map((item) => (
              <Card key={item}>
                <CardHeader className="pb-2">
                  <Skeleton className="h-6 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-1/2" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4 mb-4" />
                  <div className="flex justify-between">
                    <Skeleton className="h-9 w-20 rounded-md" />
                    <Skeleton className="h-9 w-20 rounded-md" />
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-destructive">Error loading posts: {(error as Error).message}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : filteredPosts?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-muted-foreground">
                {filter === 'all' 
                  ? 'No blog posts found. Create your first post!' 
                  : filter === 'published' 
                    ? 'No published posts found.'
                    : 'No drafts found.'}
              </p>
              <Button className="mt-4" asChild>
                <Link href="/admin/blog/new">
                  <Plus className="h-4 w-4 mr-2" /> Create New Post
                </Link>
              </Button>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredPosts?.map((post) => (
              <Card key={post.id} className={!post.published ? "border-dashed" : ""}>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{post.title}</CardTitle>
                    <Badge variant={post.published ? "default" : "outline"}>
                      {post.published ? "Published" : "Draft"}
                    </Badge>
                  </div>
                  <CardDescription>
                    {post.publishedAt
                      ? `Published ${formatDistanceToNow(new Date(post.publishedAt), { addSuffix: true })}`
                      : `Created ${formatDistanceToNow(new Date(post.updatedAt), { addSuffix: true })}`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <p className="text-sm text-muted-foreground line-clamp-3 mb-4">{post.excerpt}</p>
                  <div className="flex flex-wrap gap-1 mb-4">
                    {post.tags.map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex justify-between">
                    <Button variant="outline" size="sm" asChild>
                      <Link href={`/admin/blog/edit/${post.id}`}>
                        <FileEdit className="h-4 w-4 mr-2" /> Edit
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm">
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
        
        {/* View All Messages Button */}
        {unreadMessagesCount > 0 && (
          <div className="mt-8 text-center">
            <Button asChild>
              <Link href="/admin/messages">
                View All Messages
                {unreadMessagesCount > 0 && (
                  <Badge variant="secondary" className="ml-2">
                    {unreadMessagesCount} unread
                  </Badge>
                )}
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}