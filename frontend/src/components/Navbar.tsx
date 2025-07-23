import React from "react";
import { Link, useLocation } from "react-router-dom";

interface NavbarProps {
  user: {
    first_name: string;
    last_name: string;
    roster: string;
  } | null;
  handleLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ user, handleLogout }) => {
  const location = useLocation();

  const navbarBackground = location.pathname === "/" 
    ? "bg-transparent"
    : "bg-gray-900";

  return (
    <nav className={`fixed top-0 left-0 w-full text-white p-4 shadow-md z-50 ${navbarBackground}`}>
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        
        {/* Left side - logo and links */}
        <div className="flex items-center gap-10">
          <Link to="/" className="hover:text-gray-300">
        <h1 className="text-xl font-bold">ClassLinker</h1>
          </Link>
          
          <ul className="flex space-x-6 list-none">
            <li><Link to="/classes" className="hover:text-gray-300">Classes</Link></li>
            <li><Link to="/study-groups" className="hover:text-gray-300">Study Groups</Link></li>
          </ul>
        </div>

        {/* Right side - user info */}
        {user && (
          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-300">Hi, {user.first_name}</span>
            <button
              onClick={handleLogout}
              className="bg-red-500 hover:bg-red-600 px-3 py-1 rounded text-sm"
            >
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
