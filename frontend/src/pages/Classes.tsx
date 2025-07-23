import React, { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

interface User {
  first_name: string;
  last_name: string;
  roster: string;
}

interface ClassInfo {
  crn: string;
  course_id: string;
  course_name_long: string;
  section: string;
}

interface ClassesProps {
  user: User | null;
}

const Classes: React.FC<ClassesProps> = ({ user }) => {
  const [view, setView] = useState("people");
  const [myClasses, setMyClasses] = useState<ClassInfo[]>([]);
  const [selectedClass, setSelectedClass] = useState<ClassInfo | null>(null);
  const [peopleInClass, setPeopleInClass] = useState<User[]>([]);
  const [messages, setMessages] = useState<{ sender: string; text: string }[]>([]);
  const [newMessage, setNewMessage] = useState("");

  const username = user ? `${user.first_name} ${user.last_name}` : null;

  useEffect(() => {
    if (!user) return;
    axios
      .get("http://localhost:8000/api/users/get_user_classes/", {
        params: {
          roster: user.roster,
        },
      })
      .then((res) => {
        setMyClasses(res.data.classes);
        if (res.data.classes.length > 0) {
          setSelectedClass(res.data.classes[0]);
        }
      })
      .catch((err) => console.error("Failed to load user classes:", err));
  }, [user]);

  useEffect(() => {
    if (!selectedClass) return;
    axios
      .get("http://localhost:8000/api/classes/get_users_in_class/", {
        params: {
          crn: selectedClass.crn,
        },
      })
      .then((res) => {
        setPeopleInClass(res.data.users);
      })
      .catch((err) => console.error("Failed to fetch class members:", err));
  }, [selectedClass]);

  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, { sender: username || "You", text: newMessage }]);
      setNewMessage("");
    }
  };

  return (
    <div className="w-screen h-screen flex text-white absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-200 to-yellow-100 py-10">
      {/* Sidebar */}
      <aside className="h-screen w-64 bg-gray-900 p-6 flex flex-col gap-6 pt-16 shadow-xl">
        <h2 className="text-xl font-bold text-white border-b pb-2">My Classes</h2>
        <ul className="space-y-2">
          {myClasses.map((cls) => (
            <li
              key={cls.crn}
              className={`p-2 rounded-lg text-sm font-medium transition cursor-pointer ${
                selectedClass?.crn === cls.crn
                  ? "bg-purple-600"
                  : "bg-gray-700 hover:bg-purple-500"
              }`}
              onClick={() => setSelectedClass(cls)}
            >
              {cls.course_id} - {cls.section}
            </li>
          ))}
          <Link to="/add-class">
            <li className="mt-4 p-2 rounded-lg text-sm font-medium bg-green-600 hover:bg-green-500 text-center transition">
              + Add Class
            </li>
          </Link>
        </ul>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 overflow-y-auto">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold text-gray-800">
            {selectedClass
              ? `${selectedClass.course_id} - ${selectedClass.section}`
              : "Select a class"}
          </h1>
          <div className="space-x-2">
            <button
              onClick={() => setView("people")}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                view === "people"
                  ? "bg-purple-600"
                  : "bg-gray-700 hover:bg-purple-500"
              }`}
            >
              People
            </button>
            <button
              onClick={() => setView("chat")}
              className={`px-5 py-2 rounded-lg font-semibold transition ${
                view === "chat"
                  ? "bg-purple-600"
                  : "bg-gray-700 hover:bg-purple-500"
              }`}
            >
              Chat
            </button>
          </div>
        </div>

        {/* View Switcher */}
        {view === "people" ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            <div className="p-4 rounded-lg bg-white text-gray-800 shadow-md">
              <div className="text-sm font-semibold">You:</div>
              <div className="text-lg">{username ?? "Not logged in"}</div>
            </div>
            {peopleInClass.length > 0 ? (
                peopleInClass
                  .filter((p) => p.roster !== user?.roster)
                  .map((p, idx) => (
                    <div key={idx} className="p-4 rounded-lg bg-white text-gray-800 shadow-md">
                      <div className="text-sm font-semibold">Classmate:</div>
                      <div className="text-lg">
                        {p.first_name} {p.last_name}
                      </div>
                    </div>
                  ))
              ) : (
                <div className="p-4 bg-gray-800 rounded-lg shadow text-center col-span-full">
                  No other classmates yet.
                </div>
              )}
          </div>
        ) : (
          <div className="p-6 bg-white text-gray-900 rounded-lg shadow flex flex-col h-[65vh]">
            <div className="text-xl font-semibold mb-4">Mockup Chat</div>
            <div className="flex-grow overflow-y-auto space-y-2">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`p-3 rounded-lg max-w-[75%] ${
                    msg.sender === username ? "bg-purple-200 text-left text-black" : "bg-gray-300 text-left text-black"
                  }`}
                >
                  <strong>{msg.sender}:</strong> {msg.text}
                </div>
              ))}
            </div>
            <div className="flex mt-4 gap-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                className="flex-1 p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                placeholder="Type a message..."
              />
              <button
                onClick={handleSendMessage}
                className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Classes;
