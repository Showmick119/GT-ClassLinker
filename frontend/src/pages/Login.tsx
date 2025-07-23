import { useState, FormEvent } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  setUser: (user: { first_name: string; last_name: string; roster: string }) => void;
}

export default function Login({ setUser }: LoginProps) {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [roster, setRoster] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:8000/api/users/create_user/", {
        first_name: firstName,
        last_name: lastName,
        roster,
      });

      setUser({ first_name: firstName, last_name: lastName, roster });
      navigate("/classes");
    } catch (err) {
      setError("User creation failed. Try again.");
      console.error(err);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-purple-100 via-purple-200 to-yellow-100 overflow-y-auto">
      <div className="min-h-screen flex flex-col justify-center items-center px-4 py-12">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-md">
          <h1 className="text-3xl font-bold text-center text-purple-700 mb-6">Welcome to ClassLinker</h1>
          <p className="text-center text-gray-600 mb-6">Enter your info to continue</p>

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <input
              type="text"
              placeholder="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <input
              type="text"
              placeholder="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <input
              type="text"
              placeholder="GTID"
              value={roster}
              onChange={(e) => setRoster(e.target.value)}
              className="border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-purple-400"
              required
            />
            <button
              type="submit"
              className="bg-purple-600 text-white font-semibold p-2 rounded hover:bg-purple-700 transition"
            >
              Log In
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
