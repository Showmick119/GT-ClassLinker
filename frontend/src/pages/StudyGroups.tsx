import React, { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";


const StudyGroups: React.FC = () => {
  const [view, setView] = useState("members");
  const [message, setMessage] = useState("")
  const [messages, setMessages] = useState([
    { id: 1, author: "Anonymous Snake", content: "Hello!" },
    { id: 2, author: "Pilsbury", content: "When where we supposed to meet?" },
    { id: 3, author: "CoolWizard", content: "Does today at 4 work?" },
    { id: 4, author: "Pilsbury", content: "I think I have a meeting" }
  ])
  const [username, setUsername] = useState("User" + Math.floor(Math.random() * 1000))
  const messagesEndRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({behavior: "smooth"})
  }, [messages])

  const handleSendMessage = (e: React.FormEvent) => {
    e.preventDefault()

    if (message.trim() === "") return

    const newMessage = {
        id: messages.length + 1,
        author: username,
        content: message.trim(),
    }

    setMessages([...messages, newMessage])
    setMessage("")

  }

    return (
        <div className="w-screen h-screen flex text-white absolute inset-0 bg-gradient-to-br from-purple-100 via-purple-200 to-yellow-100">
            <aside className="w-1/5 bg-gray-800 p-4 flex flex-col gap-4 pt-16">
                <h2 className="text-lg font-bold">Study Groups</h2>
                <ul className="space-y-2">
                    <li className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600">CS 101 study group!</li>
                    <li className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600">math homework</li>
                    <li className="p-2 bg-gray-700 rounded cursor-pointer hover:bg-gray-600">physics group</li>
                </ul>
            </aside>

            <main className="flex-1 p-6 flex flex-col pt-20 h-screen overflow-hidden">
                <div className="flex justify-between items-center mb-4">
                    <h1 className="text-2xl font-bold text-black">Study Group Name</h1>
                    <div className="flex items-center">
                        <div className="mr-4 text-black">
                            <label htmlFor="username" className="mr-2">Your name:</label>
                            <input 
                                type="text"
                                id="username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                className="px-2 py-1 text-white bg-gray-700 rounded"
                            />
                        </div>

                        <div>
                        <button 
                            onClick={() => setView("members")} 
                            className={`mr-2 px-4 py-2 rounded ${view === "members" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}>Members</button>
                        <button 
                            onClick={() => setView("chat")} 
                            className={`px-4 py-2 rounded ${view === "chat" ? "bg-purple-600" : "bg-gray-700 hover:bg-gray-600"}`}>Chat</button>
                    </div>

                    </div>
                </div>
                
                {view === "members" ? (
                    <div className="flex flex-col gap-3">
                        <div className="p-4 bg-gray-800 rounded">Student</div>
                        <div className="p-4 bg-gray-800 rounded">Another Student</div>
                        <div className="p-4 bg-gray-800 rounded">Also a Student</div>
                    </div>
                ) : (
                    <div className="p-4 bg-gray-800 rounded flex flex-col h-[calc(100vh-180px)]">
                        <div className="mb-4">Chatroom</div>
                        <div className="flex flex-col gap-2 flex-1 overflow-y-auto mb-4">
                            {messages.map((msg) => (
                                <div key={msg.id} className="p-3 bg-gray-700 rounded">
                                    <span className="font-semibold">{msg.author}: </span>
                                    {msg.content}
                                </div>
                            ))}
                            <div ref={messagesEndRef} />
                        </div>
                        <form onSubmit={handleSendMessage} className="mt-auto flex">
                            <input 
                                type="text"
                                className="p-2 bg-gray-700 rounded flex-grow text-white"
                                placeholder="Type a message..."
                                value={message}
                                onChange={(e) => setMessage(e.target.value)}
                            />
                            <button type="submit" className="ml-2 px-4 py-2 bg-purple-600 rounded hover:bg-purple-700">Send</button>
                        </form>
                    </div>
                )}
            </main>

        </div>
    );
};

export default StudyGroups;