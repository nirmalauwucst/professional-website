import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Helmet } from 'react-helmet';
import { ContactMessage } from '@shared/schema';
import { ProtectedRoute } from '@/components/cms/ProtectedRoute';
import AdminSidebar from '@/components/cms/AdminSidebar';
import { apiRequest, queryClient } from '@/lib/queryClient';
import { format } from 'date-fns';
import { Loader2, Trash2, Check, Mail, MailOpen } from 'lucide-react';
import { 
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Input } from "@/components/ui/input";
import { Skeleton } from '@/components/ui/skeleton';
import { Badge } from '@/components/ui/badge';

function MessagesPage() {
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('all');

  const { data, isLoading, error } = useQuery<{ success: boolean, messages: ContactMessage[] }>({
    queryKey: ['/api/cms/contact'],
    retry: 1,
  });

  const markAsReadMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest(
        'PATCH',
        `/api/cms/contact/${id}/read`,
        {}
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/contact'] });
      toast({
        title: 'Message marked as read',
        description: 'The message has been marked as read successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to mark message as read',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  const deleteMessageMutation = useMutation({
    mutationFn: async (id: number) => {
      const res = await apiRequest(
        'DELETE',
        `/api/cms/contact/${id}`,
        {}
      );
      return res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/cms/contact'] });
      toast({
        title: 'Message deleted',
        description: 'The message has been deleted successfully.',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Failed to delete message',
        description: error.message,
        variant: 'destructive',
      });
    },
  });

  if (error) {
    return (
      <div className="container mx-auto p-6 max-w-4xl">
        <AdminSidebar />
        <div className="bg-destructive/10 text-destructive p-4 rounded-md mb-6 mt-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-2">Error Loading Messages</h2>
          <p>{error instanceof Error ? error.message : 'Unknown error occurred'}</p>
        </div>
      </div>
    );
  }

  const filteredMessages = data?.messages
    ? data.messages
      .filter(message => 
        message.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
        message.message.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .filter(message => {
        if (activeTab === 'all') return true;
        if (activeTab === 'unread') return !message.read;
        if (activeTab === 'read') return message.read;
        return true;
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    : [];

  const unreadCount = data?.messages?.filter(m => !m.read).length || 0;

  return (
    <div className="container mx-auto p-6 max-w-4xl">
      <Helmet>
        <title>Contact Messages | Admin Dashboard</title>
      </Helmet>
      
      <AdminSidebar />
      
      <div className="mt-6">
        <h1 className="text-3xl font-bold mb-2">Contact Messages</h1>
        <p className="text-muted-foreground mb-6">
          View and manage messages from the contact form
        </p>
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Tabs defaultValue="all" className="w-full" value={activeTab} onValueChange={setActiveTab}>
            <TabsList>
              <TabsTrigger value="all">
                All
                <Badge variant="outline" className="ml-2">{data?.messages?.length || 0}</Badge>
              </TabsTrigger>
              <TabsTrigger value="unread">
                Unread
                <Badge variant="secondary" className="ml-2">
                  {unreadCount}
                </Badge>
              </TabsTrigger>
              <TabsTrigger value="read">Read</TabsTrigger>
            </TabsList>
            <TabsContent value="all"></TabsContent>
            <TabsContent value="unread"></TabsContent>
            <TabsContent value="read"></TabsContent>
          </Tabs>
          
          <div className="w-full sm:w-auto">
            <Input
              placeholder="Search messages..."
              className="w-full sm:w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>
        
        {isLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map((i) => (
              <Card key={i} className="relative overflow-hidden">
                <CardHeader>
                  <Skeleton className="h-6 w-48 mb-2" />
                  <Skeleton className="h-4 w-32" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-full mb-2" />
                  <Skeleton className="h-4 w-3/4" />
                </CardContent>
                <CardFooter className="justify-between">
                  <Skeleton className="h-4 w-24" />
                  <div className="flex gap-2">
                    <Skeleton className="h-9 w-9 rounded-md" />
                    <Skeleton className="h-9 w-9 rounded-md" />
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        ) : filteredMessages.length === 0 ? (
          <div className="bg-muted/40 rounded-lg p-8 text-center">
            <Mail className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
            <h3 className="text-xl font-medium mb-2">No messages found</h3>
            <p className="text-muted-foreground mb-4">
              {searchTerm 
                ? "No messages match your search criteria" 
                : activeTab === 'unread' 
                  ? "You have no unread messages" 
                  : activeTab === 'read' 
                    ? "You have no read messages"
                    : "You haven't received any contact messages yet"}
            </p>
            {searchTerm && (
              <Button variant="outline" onClick={() => setSearchTerm('')}>
                Clear search
              </Button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredMessages.map((message) => (
              <Card 
                key={message.id} 
                className={`relative overflow-hidden ${!message.read ? 'border-l-4 border-l-primary' : ''}`}
              >
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        {message.subject}
                        {!message.read && (
                          <Badge variant="secondary" className="ml-2">New</Badge>
                        )}
                      </CardTitle>
                      <CardDescription>
                        From: {message.name} ({message.email})
                      </CardDescription>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(message.createdAt), 'MMM d, yyyy - h:mm a')}
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="whitespace-pre-wrap">{message.message}</p>
                </CardContent>
                <CardFooter className="justify-between">
                  <div className="flex items-center text-sm text-muted-foreground">
                    {message.read ? (
                      <div className="flex items-center">
                        <MailOpen className="h-4 w-4 mr-1" />
                        <span>Read</span>
                      </div>
                    ) : (
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 mr-1" />
                        <span>Unread</span>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    {!message.read && (
                      <Button 
                        size="sm"
                        variant="outline"
                        disabled={markAsReadMutation.isPending}
                        onClick={() => markAsReadMutation.mutate(message.id)}
                      >
                        {markAsReadMutation.isPending ? (
                          <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                        ) : (
                          <Check className="h-4 w-4 mr-1" />
                        )}
                        Mark as read
                      </Button>
                    )}
                    <Button 
                      size="sm" 
                      variant="destructive"
                      disabled={deleteMessageMutation.isPending}
                      onClick={() => deleteMessageMutation.mutate(message.id)}
                    >
                      {deleteMessageMutation.isPending ? (
                        <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <Trash2 className="h-4 w-4 mr-1" />
                      )}
                      Delete
                    </Button>
                  </div>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function MessagesContainer() {
  return (
    <ProtectedRoute>
      <MessagesPage />
    </ProtectedRoute>
  );
}