import './App.css';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { useState } from 'react';

import Navbar from './components/Navbar';
import About from './pages/About';
import Home from './pages/Home';
import AddClass from './pages/AddClass';
import Classes from './pages/Classes';
import StudyGroups from './pages/StudyGroups';
import Login from './pages/Login';

// Define user type
type User = {
  first_name: string;
  last_name: string;
  roster: string;
};

// Wrap the app content inside a component that can use `useNavigate`
function AppRoutes() {
  const navigate = useNavigate();

  const [user, setUser] = useState<User | null>(() => {
    const stored = localStorage.getItem("user");
    return stored ? JSON.parse(stored) : null;
  });

  const handleSetUser = (newUser: User) => {
    localStorage.setItem("user", JSON.stringify(newUser));
    setUser(newUser);
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/"); // now this will work properly!
  };

  return (
    <>
      <Navbar user={user} handleLogout={handleLogout} />
      <Routes>
        <Route path="/" element={<Home user={user} />} />
        <Route path="/about" element={<About />} />
        <Route path="/add-class" element={<AddClass user={user} />} />
        <Route path="/classes" element={<Classes user={user} />} />
        <Route path="/study-groups" element={<StudyGroups />} />
        <Route path="/login" element={<Login setUser={handleSetUser} />} />
      </Routes>
    </>
  );
}

function App() {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
}

export default App;
