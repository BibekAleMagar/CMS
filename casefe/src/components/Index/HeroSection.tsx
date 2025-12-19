import Link from "next/link";
import React from "react";

const Hero: React.FC = () => {
  return (
    <header className="relative h-screen bg-cover bg-center" style={{ backgroundImage: `url('https://images.pexels.com/photos/2570062/pexels-photo-2570062.jpeg')` }}>
      <div className="absolute inset-0 bg-black/60 z-10"></div>

      <div className="relative z-20 flex flex-col items-center justify-center h-full text-center px-4">
        <h1 className="text-white text-4xl md:text-6xl font-bold mb-4 animate-fadeInUp">
          Case Management System
        </h1>
        <p className="text-white text-lg md:text-2xl mb-6 animate-fadeInUp delay-500">
          Transform how you manage cases with a platform that organizes, tracks, and resolves tasks seamlessly—helping your team stay efficient and focused
        </p>
        <Link
            href="/login"
          className="bg-blue-500 hover:bg-blue-700 text-white font-semibold px-6 py-3 rounded-md transition-all duration-300 animate-fadeInUp delay-1000"
        >
          Get Started
        </Link>
      </div>
    </header>
  );
};

export default Hero;
