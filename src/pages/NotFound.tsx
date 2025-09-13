import { Link } from "react-router-dom";
import { Zap, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-subtle flex items-center justify-center text-center px-4">
      <div>
        <div className="inline-flex items-center justify-center mb-8">
           <div className="w-16 h-16 bg-gradient-primary rounded-2xl flex items-center justify-center">
             <Zap className="w-8 h-8 text-white" />
           </div>
        </div>
        <h1 className="text-6xl font-bold text-foreground">404</h1>
        <p className="text-2xl font-medium text-muted-foreground mt-4 mb-8">
          Oops! The page you're looking for doesn't exist.
        </p>
        
        <Button asChild size="lg">
          <Link to="/">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Go Back Home
          </Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
