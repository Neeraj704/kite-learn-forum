import { Link } from "react-router-dom";
import { Zap } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-muted-darker text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo and Description */}
          <div className="md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-gradient-primary rounded-lg flex items-center justify-center">
                <Zap className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold">KITERETSU</span>
            </div>
            <p className="text-muted-foreground max-w-md">
              Professional robotics learning platform with 3D micro-simulators. 
              Learn by doing with hands-on circuit design and programming challenges.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="text-muted-foreground hover:text-white transition-smooth">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/game" className="text-muted-foreground hover:text-white transition-smooth">
                  Simulation
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-muted-foreground hover:text-white transition-smooth">
                  Forum
                </Link>
              </li>
              <li>
                <a href="#team" className="text-muted-foreground hover:text-white transition-smooth">
                  Team
                </a>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/forum" className="text-muted-foreground hover:text-white transition-smooth">
                  Help Center
                </Link>
              </li>
              <li>
                <Link to="/forum" className="text-muted-foreground hover:text-white transition-smooth">
                  Community
                </Link>
              </li>
              <li>
                <a href="mailto:support@kiteretsu.com" className="text-muted-foreground hover:text-white transition-smooth">
                  Contact
                </a>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-muted-dark mt-8 pt-8 text-center">
          <p className="text-muted-foreground">
            © 2024 KITERETSU. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;