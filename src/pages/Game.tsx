import Navigation from "@/components/layout/Navigation";
import Footer from "@/components/layout/Footer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  Play, 
  ArrowLeft, 
  Cog, 
  Layers, 
  Monitor,
  Gamepad2
} from "lucide-react";

const Game = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <div className="pt-16">
        {/* Header */}
        <div className="bg-gradient-subtle border-b border-border">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="flex items-center gap-4 mb-6">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Home
                </Link>
              </Button>
            </div>
            
            <div className="text-center max-w-3xl mx-auto">
              <h1 className="text-4xl font-bold text-foreground mb-4">
                3D Robotics Simulator
              </h1>
              <p className="text-xl text-muted-foreground mb-8">
                Experience immersive robotics learning in our advanced 3D simulation environment
              </p>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Simulator Area */}
            <div className="lg:col-span-2">
              <Card className="shadow-elegant">
                <CardContent className="p-0">
                  <div className="aspect-video bg-gradient-subtle rounded-lg flex items-center justify-center">
                    <div className="text-center space-y-6">
                      <div className="w-24 h-24 bg-gradient-primary rounded-2xl flex items-center justify-center mx-auto">
                        <Layers className="w-12 h-12 text-white" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          Simulator Loading...
                        </h3>
                        <p className="text-muted-foreground mb-6">
                          The 3D robotics simulation environment is being prepared
                        </p>
                        <Button variant="premium" size="lg">
                          <Play className="w-5 h-5" />
                          Launch Simulation
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Controls */}
              <div className="mt-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Play className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Start Mission</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Cog className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Settings</div>
                  </div>
                </Button>
                <Button variant="outline" className="h-auto p-4">
                  <div className="text-center">
                    <Monitor className="w-6 h-6 mx-auto mb-2" />
                    <div className="text-sm font-medium">Full Screen</div>
                  </div>
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Mission Info */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Current Mission</h3>
                  <div className="space-y-4">
                    <div>
                      <h4 className="font-medium text-primary mb-2">Basic Navigation</h4>
                      <p className="text-sm text-muted-foreground">
                        Learn to control your robot's movement and navigate through obstacles.
                      </p>
                    </div>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-muted-foreground">Difficulty:</span>
                        <div className="font-medium text-green-600">Beginner</div>
                      </div>
                      <div>
                        <span className="text-muted-foreground">Time:</span>
                        <div className="font-medium">15-20 min</div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Progress */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Your Progress</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Missions Completed</span>
                      <span className="font-semibold">0/12</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2">
                      <div className="bg-gradient-primary h-2 rounded-full w-0"></div>
                    </div>
                    <div className="flex justify-between items-center text-sm text-muted-foreground">
                      <span>Level 1</span>
                      <span>0% Complete</span>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Quick Actions */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
                  <div className="space-y-3">
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Gamepad2 className="w-4 h-4" />
                      Tutorial Mode
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start" asChild>
                      <Link to="/forum">
                        <Layers className="w-4 h-4" />
                        Get Help in Forum
                      </Link>
                    </Button>
                    <Button variant="outline" size="sm" className="w-full justify-start">
                      <Monitor className="w-4 h-4" />
                      View Documentation
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Coming Soon Features */}
              <Card className="border-dashed border-2">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-4">Coming Soon</h3>
                  <div className="space-y-3 text-sm text-muted-foreground">
                    <div>• Multi-robot coordination</div>
                    <div>• Advanced physics simulation</div>
                    <div>• Custom robot building</div>
                    <div>• Collaborative missions</div>
                    <div>• Real-time multiplayer</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Game;