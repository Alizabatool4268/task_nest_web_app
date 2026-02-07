import React from "react";

const Footer = () => {
  return (
    <footer className="w-full bg-blue-900 text-white mt-20 py-8">
      <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8">

        {/* Brand */}
        <div>
          <h2 className="text-2xl font-bold tracking-wide">TaskNest</h2>
          <p className="text-gray-200 mt-2 text-sm">
            Organize your tasks with ease and stay productive every day.
          </p>
        </div>

        {/* Quick Links */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Quick Links</h3>
          <ul className="space-y-2 text-gray-200">
            <li><a href="/" className="hover:text-orange-400 transition">Home</a></li>
            <li><a href="/auth/login" className="hover:text-orange-400 transition">Login</a></li>
            <li><a href="/auth/signup" className="hover:text-orange-400 transition">Signup</a></li>
            <li><a href="/add" className="hover:text-orange-400 transition">Create Task</a></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-lg font-semibold mb-3">Connect</h3>
          <p className="text-gray-200 text-sm">We’d love to hear from you.</p>
          <div className="flex gap-4 mt-3">
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-blue-900
              hover:bg-orange-400 hover:text-white transition"
            >
              📧
            </a>
            <a
              href="#"
              className="w-9 h-9 flex items-center justify-center rounded-full bg-white text-blue-900
              hover:bg-orange-400 hover:text-white transition"
            >
              🌐
            </a>
          </div>
        </div>

      </div>

      {/* Bottom note */}
      <p className="text-center text-gray-300 text-sm mt-10">
        © {new Date().getFullYear()} TaskNest · Built for productivity ✨
      </p>
    </footer>
  );
};

export default Footer;
