import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";
import { useAuth } from "../components/auth/AuthContext";
import { supabase } from "../integrations/supabase/client";
import { 
  Search, 
  Plus, 
  MessageSquare, 
  Heart, 
  Eye, 
  Calendar,
  Users,
  TrendingUp,
  Pin
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

// Define TypeScript interfaces for our data
interface Profile {
  username: string;
}

interface Category {
  id: string;
  name: string;
  description: string;
  color: string;
}

interface Topic {
  id: string;
  title: string;
  content: string;
  author_id: string;
  category_id: string;
  is_pinned: boolean;
  view_count: number;
  like_count: number;
  reply_count: number;
  created_at: string;
  profiles: Profile | null;
  categories: {
    name: string;
    color: string;
  } | null;
}

const Forum = () => {
  const { user } = useAuth();
  const [topics, setTopics] = useState<Topic[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  const fetchCategories = useCallback(async () => {
    const { data, error } = await supabase
      .from("categories")
      .select("*")
      .order("name");

    if (!error && data) {
      setCategories(data);
    }
  }, []);

  const fetchTopics = useCallback(async () => {
    setLoading(true);
    let query = supabase
      .from("topics")
      .select(`
        id,
        title,
        content,
        author_id,
        category_id,
        is_pinned,
        view_count,
        like_count,
        reply_count,
        created_at,
        profiles (username),
        categories (name, color)
      `)
      .order("is_pinned", { ascending: false })
      .order("created_at", { ascending: false });

    if (selectedCategory) {
      query = query.eq("category_id", selectedCategory);
    }

    if (searchQuery) {
      query = query.or(`title.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);
    }

    const { data, error } = await query;

    if (!error && data) {
      setTopics(data as Topic[]);
    }
    setLoading(false);
  }, [selectedCategory, searchQuery]);


  useEffect(() => {
    fetchCategories();
  }, [fetchCategories]);

  useEffect(() => {
    fetchTopics();
  }, [fetchTopics]);

  const formatTimeAgo = (dateString: string) => {
    try {
        return formatDistanceToNow(new Date(dateString), { addSuffix: true });
    } catch (error) {
        return "Invalid date";
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-subtle border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div>
                <h1 className="text-3xl font-bold text-foreground mb-2">
                  Community Forum
                </h1>
                <p className="text-muted-foreground">
                  Connect with fellow robotics enthusiasts, share knowledge, and get help
                </p>
              </div>
              
              {user ? (
                <Button variant="default" size="lg" asChild>
                  <Link to="/forum/new">
                    <Plus className="w-5 h-5" />
                    New Topic
                  </Link>
                </Button>
              ) : (
                <Button variant="default" size="lg" asChild>
                  <Link to="/auth">
                    <Users className="w-5 h-5" />
                    Sign In to Post
                  </Link>
                </Button>
              )}
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Search */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Search Topics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      placeholder="Search discussions..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Categories */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Categories</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    <button
                      onClick={() => setSelectedCategory("")}
                      className={`w-full text-left px-3 py-2 rounded-lg transition-smooth ${
                        selectedCategory === "" 
                          ? "bg-primary text-primary-foreground" 
                          : "hover:bg-secondary"
                      }`}
                    >
                      All Categories
                    </button>
                    {categories.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => setSelectedCategory(category.id)}
                        className={`w-full text-left px-3 py-2 rounded-lg transition-smooth ${
                          selectedCategory === category.id 
                            ? "bg-primary text-primary-foreground" 
                            : "hover:bg-secondary"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <div 
                            className="w-3 h-3 rounded-full" 
                            style={{ backgroundColor: category.color }}
                          />
                          <span className="text-sm font-medium">{category.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Stats */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <TrendingUp className="w-5 h-5" />
                    Forum Stats
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Total Topics</span>
                    <span className="font-semibold">{topics.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Categories</span>
                    <span className="font-semibold">{categories.length}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-muted-foreground">Online Users</span>
                    <span className="font-semibold">24</span>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Main Content */}
            <div className="lg:col-span-3">
              {loading ? (
                <div className="space-y-4">
                  {[...Array(5)].map((_, i) => (
                     <Card key={i}>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4">
                                <div className="flex-1 space-y-3">
                                    <Skeleton className="h-5 w-1/4" />
                                    <Skeleton className="h-6 w-3/4" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-2/3" />
                                    <Skeleton className="h-4 w-1/2" />
                                </div>
                                <div className="flex flex-col items-center gap-3">
                                    <Skeleton className="h-5 w-8" />
                                    <Skeleton className="h-5 w-8" />
                                    <Skeleton className="h-5 w-8" />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                  ))}
                </div>
              ) : topics.length > 0 ? (
                <div className="space-y-4">
                  {topics.map((topic) => (
                    <Card key={topic.id} className="hover:shadow-md transition-smooth">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              {topic.is_pinned && (
                                <Pin className="w-4 h-4 text-primary" />
                              )}
                              {topic.categories && (
                                <Badge 
                                  variant="secondary" 
                                  className="text-xs"
                                  style={{ 
                                    backgroundColor: `${topic.categories.color}20`,
                                    color: topic.categories.color 
                                  }}
                                >
                                  {topic.categories.name}
                                </Badge>
                              )}
                            </div>
                            
                            <Link 
                              to={`/forum/topic/${topic.id}`}
                              className="block group"
                            >
                              <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-smooth mb-2">
                                {topic.title}
                              </h3>
                              <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                                {topic.content?.substring(0, 150)}{topic.content?.length > 150 && '...'}
                              </p>
                            </Link>

                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>by {topic.profiles?.username || "Unknown"}</span>
                              <div className="flex items-center gap-1">
                                <Calendar className="w-4 h-4" />
                                {formatTimeAgo(topic.created_at)}
                              </div>
                            </div>
                          </div>

                          <div className="flex flex-col items-center gap-3 text-sm text-muted-foreground">
                            <div className="flex items-center gap-1" title="Replies">
                              <MessageSquare className="w-4 h-4" />
                              <span>{topic.reply_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1" title="Likes">
                              <Heart className="w-4 h-4" />
                              <span>{topic.like_count || 0}</span>
                            </div>
                            <div className="flex items-center gap-1" title="Views">
                              <Eye className="w-4 h-4" />
                              <span>{topic.view_count || 0}</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              ) : (
                <Card>
                  <CardContent className="p-12 text-center">
                    <MessageSquare className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No topics found</h3>
                    <p className="text-muted-foreground mb-6">
                      {searchQuery || selectedCategory 
                        ? "Try adjusting your search or category filter" 
                        : "Be the first to start a discussion!"
                      }
                    </p>
                    {user && (
                      <Button variant="default" asChild>
                        <Link to="/forum/new">
                          <Plus className="w-4 h-4" />
                          Create First Topic
                        </Link>
                      </Button>
                    )}
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Forum;
