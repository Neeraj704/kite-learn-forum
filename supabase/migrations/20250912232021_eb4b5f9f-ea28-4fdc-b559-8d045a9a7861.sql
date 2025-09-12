-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create profiles table for user data
CREATE TABLE public.profiles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE NOT NULL,
  bio TEXT,
  avatar_url TEXT,
  role TEXT DEFAULT 'user' CHECK (role IN ('user', 'moderator', 'admin')),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Create policies for profiles
CREATE POLICY "Profiles are viewable by everyone" 
ON public.profiles 
FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles 
FOR UPDATE 
USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own profile" 
ON public.profiles 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

-- Create categories table
CREATE TABLE public.categories (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  description TEXT,
  color TEXT DEFAULT '#6545FF',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Insert default categories
INSERT INTO public.categories (name, description, color) VALUES
  ('General Discussion', 'General robotics discussions', '#6545FF'),
  ('Circuit Design', 'Electronics and circuit discussions', '#8B5CF6'),
  ('Programming', 'Code and software discussions', '#A855F7'),
  ('Hardware', 'Mechanical and hardware topics', '#C084FC'),
  ('Troubleshooting', 'Get help with your projects', '#E879F9');

-- Enable RLS for categories
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Categories are viewable by everyone" 
ON public.categories 
FOR SELECT 
USING (true);

-- Create topics table
CREATE TABLE public.topics (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  content TEXT NOT NULL,
  author_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  category_id UUID REFERENCES public.categories(id) ON DELETE SET NULL,
  is_pinned BOOLEAN DEFAULT FALSE,
  is_locked BOOLEAN DEFAULT FALSE,
  is_hidden BOOLEAN DEFAULT FALSE,
  view_count INTEGER DEFAULT 0,
  like_count INTEGER DEFAULT 0,
  reply_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.topics ENABLE ROW LEVEL SECURITY;

-- Create policies for topics
CREATE POLICY "Topics are viewable by everyone (if not hidden)" 
ON public.topics 
FOR SELECT 
USING (NOT is_hidden OR auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('moderator', 'admin')
));

CREATE POLICY "Authenticated users can create topics" 
ON public.topics 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own topics" 
ON public.topics 
FOR UPDATE 
USING (auth.uid() = author_id OR auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('moderator', 'admin')
));

CREATE POLICY "Users can delete their own topics" 
ON public.topics 
FOR DELETE 
USING (auth.uid() = author_id OR auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('moderator', 'admin')
));

-- Create replies table
CREATE TABLE public.replies (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  content TEXT NOT NULL,
  topic_id UUID NOT NULL REFERENCES public.topics(id) ON DELETE CASCADE,
  author_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  parent_id UUID REFERENCES public.replies(id) ON DELETE CASCADE,
  is_hidden BOOLEAN DEFAULT FALSE,
  like_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.replies ENABLE ROW LEVEL SECURITY;

-- Create policies for replies
CREATE POLICY "Replies are viewable by everyone (if not hidden)" 
ON public.replies 
FOR SELECT 
USING (NOT is_hidden OR auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('moderator', 'admin')
));

CREATE POLICY "Authenticated users can create replies" 
ON public.replies 
FOR INSERT 
WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update their own replies" 
ON public.replies 
FOR UPDATE 
USING (auth.uid() = author_id OR auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('moderator', 'admin')
));

CREATE POLICY "Users can delete their own replies" 
ON public.replies 
FOR DELETE 
USING (auth.uid() = author_id OR auth.uid() IN (
  SELECT user_id FROM public.profiles WHERE role IN ('moderator', 'admin')
));

-- Create likes table
CREATE TABLE public.likes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES public.profiles(user_id) ON DELETE CASCADE,
  topic_id UUID REFERENCES public.topics(id) ON DELETE CASCADE,
  reply_id UUID REFERENCES public.replies(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  CONSTRAINT likes_topic_or_reply_check CHECK (
    (topic_id IS NOT NULL AND reply_id IS NULL) OR 
    (topic_id IS NULL AND reply_id IS NOT NULL)
  ),
  UNIQUE(user_id, topic_id),
  UNIQUE(user_id, reply_id)
);

-- Enable RLS
ALTER TABLE public.likes ENABLE ROW LEVEL SECURITY;

-- Create policies for likes
CREATE POLICY "Likes are viewable by everyone" 
ON public.likes 
FOR SELECT 
USING (true);

CREATE POLICY "Authenticated users can create likes" 
ON public.likes 
FOR INSERT 
WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own likes" 
ON public.likes 
FOR DELETE 
USING (auth.uid() = user_id);

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON public.profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_topics_updated_at
  BEFORE UPDATE ON public.topics
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_replies_updated_at
  BEFORE UPDATE ON public.replies
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Function to handle new user signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (user_id, username)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', SPLIT_PART(NEW.email, '@', 1))
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

-- Trigger for new user signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Function to update topic reply count
CREATE OR REPLACE FUNCTION public.update_topic_reply_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE public.topics 
    SET reply_count = reply_count + 1 
    WHERE id = NEW.topic_id;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE public.topics 
    SET reply_count = reply_count - 1 
    WHERE id = OLD.topic_id;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for reply count updates
CREATE TRIGGER update_topic_reply_count_trigger
  AFTER INSERT OR DELETE ON public.replies
  FOR EACH ROW EXECUTE FUNCTION public.update_topic_reply_count();

-- Function to update like counts
CREATE OR REPLACE FUNCTION public.update_like_counts()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    IF NEW.topic_id IS NOT NULL THEN
      UPDATE public.topics 
      SET like_count = like_count + 1 
      WHERE id = NEW.topic_id;
    ELSIF NEW.reply_id IS NOT NULL THEN
      UPDATE public.replies 
      SET like_count = like_count + 1 
      WHERE id = NEW.reply_id;
    END IF;
    RETURN NEW;
  ELSIF TG_OP = 'DELETE' THEN
    IF OLD.topic_id IS NOT NULL THEN
      UPDATE public.topics 
      SET like_count = like_count - 1 
      WHERE id = OLD.topic_id;
    ELSIF OLD.reply_id IS NOT NULL THEN
      UPDATE public.replies 
      SET like_count = like_count - 1 
      WHERE id = OLD.reply_id;
    END IF;
    RETURN OLD;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Trigger for like count updates
CREATE TRIGGER update_like_counts_trigger
  AFTER INSERT OR DELETE ON public.likes
  FOR EACH ROW EXECUTE FUNCTION public.update_like_counts();