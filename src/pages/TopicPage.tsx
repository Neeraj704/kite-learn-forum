import { useState, useEffect, useCallback } from "react";
import { useParams, Link } from "react-router-dom";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";
import { supabase } from "../integrations/supabase/client";
import { useAuth } from "../components/auth/AuthContext";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { Textarea } from "../components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar";
import { Badge } from "../components/ui/badge";
import { Skeleton } from "../components/ui/skeleton";
import { toast } from "../components/ui/use-toast";
import { formatDistanceToNow } from "date-fns";
import { MessageSquare, Heart, ArrowLeft, Send } from "lucide-react";

interface Profile {
  username: string;
  avatar_url: string | null;
}

interface Category {
  name: string;
  color: string;
}

interface Topic {
  id: string;
  title: string;
  content: string;
  created_at: string;
  profiles: Profile | null;
  categories: Category | null;
  like_count: number;
}

interface Reply {
  id: string;
  content: string;
  created_at: string;
  author_id: string;
  profiles: Profile | null;
  like_count: number;
}

const TopicPage = () => {
  const { topicId } = useParams<{ topicId: string }>();
  const { user } = useAuth();
  const [topic, setTopic] = useState<Topic | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [newReply, setNewReply] = useState("");
  const [loading, setLoading] = useState(true);
  const [replying, setReplying] = useState(false);

  const fetchTopicAndReplies = useCallback(async () => {
    if (!topicId) return;
    setLoading(true);

    const { data: topicData, error: topicError } = await supabase
      .from("topics")
      .select("*, profiles(*), categories(*)")
      .eq("id", topicId)
      .single();

    if (topicData && !topicError) {
      setTopic(topicData as Topic);
    }

    const { data: repliesData, error: repliesError } = await supabase
      .from("replies")
      .select("*, profiles(*)")
      .eq("topic_id", topicId)
      .order("created_at", { ascending: true });

    if (repliesData && !repliesError) {
      setReplies(repliesData as Reply[]);
    }
    
    // Increment view count
    await supabase.rpc('increment_view_count', { topic_id_in: topicId });

    setLoading(false);
  }, [topicId]);

  useEffect(() => {
    fetchTopicAndReplies();
  }, [fetchTopicAndReplies]);

  const handleReplySubmit = async () => {
    if (!user || !topicId || !newReply.trim()) return;

    setReplying(true);
    const { error } = await supabase.from("replies").insert({
      content: newReply,
      topic_id: topicId,
      author_id: user.id,
    });

    if (error) {
      toast({ variant: "destructive", title: "Error", description: error.message });
    } else {
      setNewReply("");
      fetchTopicAndReplies(); // Refresh replies
    }
    setReplying(false);
  };
  
  const getInitials = (username: string | undefined) => {
    if(!username) return 'U';
    return username.charAt(0).toUpperCase();
  }

  const formatTimeAgo = (dateString: string) => {
    try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
        return "Invalid date";
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background">
        <Navigation />
        <div className="pt-24 pb-12 max-w-4xl mx-auto px-4">
            <Skeleton className="h-8 w-3/4 mb-4" />
            <Skeleton className="h-4 w-1/2 mb-8" />
            <Card>
                <CardContent className="p-6 space-y-4">
                    <Skeleton className="h-24 w-full" />
                    <div className="flex items-center space-x-4">
                        <Skeleton className="h-10 w-10 rounded-full" />
                        <div className="space-y-2">
                           <Skeleton className="h-4 w-[250px]" />
                           <Skeleton className="h-4 w-[200px]" />
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
      </div>
    );
  }

  if (!topic) {
    return <div>Topic not found</div>;
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/forum" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Forum
          </Link>

          {/* Topic Header */}
          <div className="mb-6">
             {topic.categories && (
                <Badge 
                    variant="secondary" 
                    className="mb-2"
                    style={{ 
                        backgroundColor: `${topic.categories.color}20`,
                        color: topic.categories.color 
                    }}
                >
                    {topic.categories.name}
                </Badge>
            )}
            <h1 className="text-3xl font-bold">{topic.title}</h1>
            <div className="text-sm text-muted-foreground mt-2 flex items-center gap-4">
                <span>Posted by {topic.profiles?.username || '...'}</span>
                <span>{formatTimeAgo(topic.created_at)}</span>
            </div>
          </div>

          {/* Topic Content */}
          <Card className="mb-8">
            <CardContent className="p-6 prose dark:prose-invert max-w-none">
              <p>{topic.content}</p>
            </CardContent>
          </Card>
          
           {/* Replies */}
          <h2 className="text-2xl font-bold mb-4">{replies.length} Replies</h2>
           <div className="space-y-6">
                {replies.map(reply => (
                    <Card key={reply.id}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                               <Avatar>
                                 <AvatarImage src={reply.profiles?.avatar_url || ''} />
                                 <AvatarFallback>{getInitials(reply.profiles?.username)}</AvatarFallback>
                               </Avatar>
                               <div className="flex-1">
                                  <div className="flex items-center justify-between">
                                      <p className="font-semibold">{reply.profiles?.username}</p>
                                      <p className="text-sm text-muted-foreground">{formatTimeAgo(reply.created_at)}</p>
                                  </div>
                                  <p className="mt-2">{reply.content}</p>
                               </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
           </div>


          {/* Reply Form */}
          {user ? (
            <Card className="mt-8">
              <CardHeader>
                <CardTitle>Post a Reply</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <Textarea
                    value={newReply}
                    onChange={(e) => setNewReply(e.target.value)}
                    placeholder="Write your reply here..."
                    className="min-h-[120px]"
                  />
                  <Button onClick={handleReplySubmit} disabled={replying}>
                    <Send className="w-4 h-4 mr-2" />
                    {replying ? "Posting..." : "Post Reply"}
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
             <Card className="mt-8 text-center">
                 <CardContent className="p-6">
                     <p className="text-muted-foreground">
                         <Link to="/auth" className="text-primary hover:underline">Sign in</Link> to post a reply.
                     </p>
                 </CardContent>
             </Card>
          )}

        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TopicPage;