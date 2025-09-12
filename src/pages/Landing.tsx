import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import heroImage from "@/assets/hero-robotics.jpg";
import { 
  Play, 
  Cpu, 
  Trophy, 
  Users, 
  CheckCircle, 
  ArrowRight, 
  Zap,
  Brain,
  Layers,
  Target
} from "lucide-react";

const Landing = () => {
  const [email, setEmail] = useState("");

  const handleWaitlistSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle waitlist signup
    console.log("Waitlist signup:", email);
    setEmail("");
  };

  const features = [
    {
      icon: Target,
      title: "Missions",
      description: "Complete challenging robotics missions with real-world scenarios"
    },
    {
      icon: Cpu,
      title: "Circuit Overlay",
      description: "Interactive circuit design with visual feedback and debugging tools"
    },
    {
      icon: Trophy,
      title: "Badges",
      description: "Earn achievements as you master different robotics concepts"
    }
  ];

  const team = [
    {
      name: "Dr. Sarah Chen",
      role: "Lead Robotics Engineer",
      bio: "Former NASA engineer with 15+ years in autonomous systems",
      image: "https://images.unsplash.com/photo-1494790108755-2616b332-0c04?w=300&h=300&fit=crop"
    },
    {
      name: "Alex Kumar",
      role: "Educational Designer",
      bio: "PhD in Educational Technology, specializing in STEM learning",
      image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&h=300&fit=crop"
    },
    {
      name: "Maria Rodriguez",
      role: "3D Simulation Lead",
      bio: "Expert in real-time 3D graphics and physics simulation",
      image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=300&h=300&fit=crop"
    },
    {
      name: "James Thompson",
      role: "Backend Architect",
      bio: "Full-stack engineer with expertise in scalable learning platforms",
      image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=300&h=300&fit=crop"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      {/* Hero Section */}
      <section className="relative pt-16 pb-20 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-subtle"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8 animate-slide-up">
              <div>
                <Badge variant="secondary" className="mb-4">
                  🚀 Now in Beta
                </Badge>
                <h1 className="text-4xl md:text-6xl font-bold text-foreground mb-6">
                  3D Robotics{" "}
                  <span className="bg-gradient-primary bg-clip-text text-transparent">
                    Micro-Simulators
                  </span>
                  {" "}— Learn by Doing
                </h1>
                <p className="text-xl text-muted-foreground mb-8 max-w-lg">
                  Master robotics through immersive 3D simulations. Build circuits, 
                  program behaviors, and solve real-world challenges in our 
                  professional learning environment.
                </p>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4">
                <Button variant="hero" size="xl" asChild>
                  <Link to="/game">
                    <Play className="w-5 h-5" />
                    View Simulation
                  </Link>
                </Button>
                <Button variant="heroOutline" size="xl" asChild>
                  <Link to="/forum">
                    <Users className="w-5 h-5" />
                    Join Community
                  </Link>
                </Button>
              </div>
            </div>

            <div className="relative animate-float">
              <img
                src={heroImage}
                alt="3D Robotics Simulation"
                className="w-full rounded-2xl shadow-elegant"
              />
              <div className="absolute inset-0 bg-gradient-primary/10 rounded-2xl"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Problem Statement */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-6">
              <h2 className="text-3xl md:text-4xl font-bold text-foreground">
                Why Robotics Students Need Troubleshooting Practice
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <p>Traditional learning lacks hands-on debugging experience</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <p>Hardware failures are expensive and time-consuming to replicate</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <p>Students need safe environments to experiment and fail</p>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-6 h-6 text-primary mt-1 flex-shrink-0" />
                  <p>Real-world robotics requires systematic problem-solving skills</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <div className="w-full h-96 bg-gradient-subtle rounded-2xl flex items-center justify-center">
                <Brain className="w-24 h-24 text-primary/30" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Learn Robotics Step by Step
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Our progressive learning system guides you from basics to advanced robotics concepts
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-smooth bg-background">
                <CardContent className="p-8 text-center">
                  <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto mb-6">
                    <feature.icon className="w-8 h-8 text-white" />
                  </div>
                  <h3 className="text-xl font-semibold mb-4">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Demo Preview */}
      <section className="py-20 bg-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            Try It Yourself
          </h2>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto">
            Experience our immersive 3D robotics simulator in action
          </p>
          
          <div className="relative max-w-4xl mx-auto">
            <div className="aspect-video bg-gradient-subtle rounded-2xl flex items-center justify-center shadow-elegant">
              <div className="text-center space-y-4">
                <Layers className="w-24 h-24 text-primary/30 mx-auto" />
                <p className="text-muted-foreground">Interactive Demo Coming Soon</p>
                <Button variant="premium" size="lg" asChild>
                  <Link to="/game">
                    <Play className="w-5 h-5" />
                    Launch Simulator
                  </Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section id="team" className="py-20 bg-secondary/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Meet the Team
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Experts in robotics, education, and technology working to revolutionize STEM learning
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {team.map((member, index) => (
              <Card key={index} className="border-0 shadow-md hover:shadow-lg transition-smooth bg-background text-center">
                <CardContent className="p-6">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                  <h3 className="text-lg font-semibold mb-2">{member.name}</h3>
                  <p className="text-primary font-medium mb-3">{member.role}</p>
                  <p className="text-sm text-muted-foreground">{member.bio}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-hero">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Join the Beta
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Be among the first to experience the future of robotics education. 
            Get early access and help shape the platform.
          </p>
          
          <form onSubmit={handleWaitlistSubmit} className="max-w-md mx-auto">
            <div className="flex gap-3">
              <Input
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="bg-white/10 border-white/20 text-white placeholder:text-white/70 backdrop-blur-sm"
                required
              />
              <Button type="submit" variant="secondary" size="default">
                Join Waitlist
                <ArrowRight className="w-4 h-4" />
              </Button>
            </div>
          </form>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Landing;