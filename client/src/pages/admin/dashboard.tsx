import { Button } from "@/components/ui/button";
import { useCMSAuth } from "@/hooks/use-cms-auth";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { FileEdit, LogOut, Plus, Settings, Trash2 } from "lucide-react";
import { BlogPost } from "@shared/schema";
import { useState } from "react";
import { formatDistanceToNow } from "date-fns";

export default function DashboardPage() {
  const { user, logout } = useCMSAuth();
  const [filter, setFilter] = useState<'all' | 'published' | 'drafts'>('all');

  // Fetch blog posts
  const { data, isLoading, error } = useQuery<{ posts: BlogPost[], total: number }>({
    queryKey: ["/api/cms/blog"],
    retry: false,
  });

  // Filter posts based on selection
  const filteredPosts = data?.posts.filter(post => {
    if (filter === 'all') return true;
    if (filter === 'published') return post.published;
    if (filter === 'drafts') return !post.published;
    return true;
  });

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">CMS Dashboard</h1>
            <p className="text-gray-500">Welcome, {user?.name || user?.username}</p>
          </div>
          <div className="flex items-center space-x-4">
            <Button variant="ghost" onClick={logout}>
              <LogOut className="h-4 w-4 mr-2" /> Logout
            </Button>
            <Button asChild>
              <Link href="/admin/settings">
                <Settings className="h-4 w-4 mr-2" /> Settings
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
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
              <Card key={item} className="animate-pulse">
                <CardHeader className="pb-2">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : error ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-red-500">Error loading posts: {(error as Error).message}</p>
              <Button className="mt-4" onClick={() => window.location.reload()}>
                Try Again
              </Button>
            </CardContent>
          </Card>
        ) : filteredPosts?.length === 0 ? (
          <Card>
            <CardContent className="py-8 text-center">
              <p className="text-gray-500">
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
                  <p className="text-sm text-gray-500 line-clamp-3 mb-4">{post.excerpt}</p>
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
      </main>
    </div>
  );
}