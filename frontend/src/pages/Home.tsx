import React from "react";
import { Link } from "react-router-dom"; // Import Link for navigation


interface HomeProps {
  user: {
    first_name: string;
    last_name: string;
    roster: string;
  } | null;
}


const Home: React.FC<HomeProps> = ({ user }) => {
  return (
<section className="absolute inset-0 flex flex-col justify-center items-center text-center bg-gradient-to-br from-purple-700 to-yellow-500 overflow-hidden">
    <div className="flex flex-col justify-center items-center gap-y-8 max-w-2xl">
        {/* Branding / Logo */}
        <span className="text-[26px] font-bold text-white">
          GT ClassLinker
        </span>

        {/* Headline */}
        <h1 className="text-6xl text-white font-extrabold leading-tight">
          Connect with <br /> GT Classmates!
        </h1>

        {/* Description */}
        <p className="text-lg text-white opacity-90 max-w-md">
          Find collaborators, join exciting ventures, and make an impact with fellow Jackets!
        </p>

        {/* CTA Button (Redirects to Classes Page) */}
        <Link to={user ? "/classes" : "/login"} className="mt-6">
          <button className="bg-white text-purple-700 hover:bg-purple-600 hover:text-white transition-all px-8 py-4 rounded-full text-xl font-semibold shadow-lg cursor-pointer">
            Explore Classes →
          </button>
        </Link>
      </div>
    </section>
  );
};

export default Home;
