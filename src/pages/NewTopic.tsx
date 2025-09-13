import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";

import Navigation from "../components/layout/Navigation";
import Footer from "../components/layout/Footer";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Textarea } from "../components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "../components/ui/form";
import { Alert, AlertDescription } from "../components/ui/alert";
import { ArrowLeft, Loader2, AlertCircle } from "lucide-react";

import { useAuth } from "../components/auth/AuthContext";
import { supabase } from "../integrations/supabase/client";
import { toast } from "../components/ui/use-toast";

const topicSchema = z.object({
  title: z.string().min(5, "Title must be at least 5 characters").max(100),
  categoryId: z.string().uuid("Please select a category"),
  content: z.string().min(20, "Content must be at least 20 characters").max(5000),
});

interface Category {
  id: string;
  name: string;
}

const NewTopic = () => {
  const { user, profile, profileLoading } = useAuth();
  const navigate = useNavigate();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const form = useForm<z.infer<typeof topicSchema>>({
    resolver: zodResolver(topicSchema),
  });

  useEffect(() => {
    // Redirect if auth is still loading or user is not logged in
    if (!profileLoading && !user) {
      navigate("/auth");
      return;
    }
    
    // Fetch categories for the select dropdown
    const fetchCategories = async () => {
      const { data, error } = await supabase.from("categories").select("id, name");
      if (data) {
        setCategories(data);
      }
    };

    if(user) {
        fetchCategories();
    }

  }, [user, profileLoading, navigate]);

  const onSubmit = async (data: z.infer<typeof topicSchema>) => {
    if (!user || !profile) {
      setFormError("You must have a valid profile to create a topic.");
      return;
    }

    setLoading(true);
    setFormError("");

    const { error } = await supabase.from("topics").insert([
      {
        title: data.title,
        content: data.content,
        category_id: data.categoryId,
        author_id: user.id,
      },
    ]);

    if (error) {
      setFormError(error.message);
      toast({
        variant: "destructive",
        title: "Error creating topic",
        description: error.message,
      });
    } else {
      toast({
        title: "Topic Created!",
        description: "Your new topic has been successfully posted.",
      });
      navigate("/forum");
    }

    setLoading(false);
  };

  // Show a loading state for the whole page while the profile is being checked
  if (profileLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  // If profile check is done and there's no profile, show an error.
  if (!profile) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-center p-4">
        <AlertCircle className="h-12 w-12 text-destructive mb-4" />
        <h1 className="text-2xl font-bold mb-2">Profile Error</h1>
        <p className="text-muted-foreground mb-6">We couldn't load your user profile. Please try signing out and back in.</p>
        <Button onClick={() => navigate('/auth')}>Go to Sign In</Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <div className="pt-24 pb-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-6">
            <Button variant="ghost" size="sm" asChild>
              <Link to="/forum">
                <ArrowLeft className="w-4 h-4" />
                Back to Forum
              </Link>
            </Button>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold">Create a New Topic</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="title"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Topic Title</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter a descriptive title for your topic" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="categoryId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category.id} value={category.id}>
                                {category.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="content"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Content</FormLabel>
                        <FormControl>
                          <Textarea
                            placeholder="Explain your topic in detail here..."
                            rows={10}
                            {...field}
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  {formError && (
                    <Alert variant="destructive">
                      <AlertCircle className="h-4 w-4" />
                      <AlertDescription>{formError}</AlertDescription>
                    </Alert>
                  )}

                  <Button 
                    type="submit" 
                    disabled={loading || profileLoading}
                  >
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {loading ? "Submitting..." : "Submit Topic"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default NewTopic;