import { useState } from "react";
import { FaBook, FaBars, FaTimes } from "react-icons/fa";
import { useNavigate, useLocation } from "react-router-dom";

const classes = [
  { id: 1, name: "CS 2200", path: "/classes/cs2200" },
  { id: 2, name: "MATH 3012", path: "/classes/math3012" },
  { id: 3, name: "PHYS 2211", path: "/classes/phys2211" },
  { id: 4, name: "ECE 2020", path: "/classes/ece2020" },
];

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  // only show  sidebar if the user is on a /classes route
  if (!location.pathname.startsWith("/classes")) {
    return null;
  }

  return (
    <div className="flex">
      <div
        className={`fixed left-0 top-0 h-screen bg-gray-900 text-white w-64 p-4 transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "-translate-x-64"
        }`}
      >
        <button
          className="text-white mb-4 focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
        </button>
        <h1 className="text-xl font-bold mb-4">My Classes</h1>
        <ul>
          {classes.map((course) => (
            <li
              key={course.id}
              className="flex items-center space-x-2 p-2 hover:bg-gray-700 rounded cursor-pointer"
              onClick={() => navigate(course.path)}
            >
              <FaBook />
              <span>{course.name}</span>
            </li>
          ))}
        </ul>
      </div>
      {!isOpen && (
        <button
          className="fixed left-2 top-2 text-white bg-gray-900 p-2 rounded focus:outline-none"
          onClick={() => setIsOpen(true)}
        >
          <FaBars size={24} />
        </button>
      )}
    </div>
  );
}
