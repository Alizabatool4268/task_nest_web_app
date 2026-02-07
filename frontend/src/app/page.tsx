import React from 'react';
import Link from 'next/link';
import Navigation from '../components/Navigation';
import Image from 'next/image';
import Footer from '@/components/Footer';


const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* HERO SECTION */}
      <section className="w-full bg-gradient-to-r from-blue-400 via-purple-500 to-blue-600 text-white py-20 px-6">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-10">
          
          {/* Left Content */}
          <div className="flex-1 text-center md:text-left space-y-6">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold drop-shadow-lg">
              Welcome to <span className="text-orange-300">TASKNEST</span>
            </h1>

            <p className="text-lg sm:text-xl text-blue-100 max-w-lg mx-auto md:mx-0">
              Organize smarter, work faster, and manage everything in one clean, powerful interface.
            </p>

            <div className="flex flex-col sm:flex-row justify-center md:justify-start gap-4 mt-6">
              <Link
                href="/tasks"
                className="px-6 py-3 bg-white text-blue-800 font-semibold rounded-xl shadow-md hover:bg-orange-400 hover:text-white transition-all duration-300"
              >
                View Tasks
              </Link>

              <Link
                href="/add"
                className="px-6 py-3 bg-orange-500 text-white font-semibold rounded-xl shadow-md hover:bg-orange-600 transition-all duration-300"
              >
                Add New Task
              </Link>
            </div>
          </div>

          {/* Right Image */}
          <div className="flex justify-center">
            <Image
              src="/Images/notepad.jpg"
              alt="Hero Image"
              width={350}
              height={350}
              className="rounded-2xl shadow-xl border-2 border-white/30"
            />
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 max-w-6xl mt-16">

        {/* FEATURES SECTION */}
        <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl shadow-lg p-10">
          <h2 className="text-3xl font-bold text-center text-black mb-10">Why Choose TaskNest?</h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            
            {/* Card 1 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all border border-purple-100">
              <h3 className="text-xl font-semibold text-purple-700 mb-3">📌 Task Management</h3>
              <p className="text-gray-700">
                Add, edit, complete, and delete your tasks in the smoothest workflow.
              </p>
            </div>

            {/* Card 2 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all border border-blue-100">
              <h3 className="text-xl font-semibold text-blue-700 mb-3">⭐ Priority Tracking</h3>
              <p className="text-gray-700">
                Highlight important tasks so you always stay ahead.
              </p>
            </div>

            {/* Card 3 */}
            <div className="p-6 bg-white rounded-xl shadow-md hover:shadow-2xl transition-all border border-orange-100">
              <h3 className="text-xl font-semibold text-orange-600 mb-3">📱 Responsive Design</h3>
              <p className="text-gray-700">
                Access TaskNest from your laptop, tablet, or phone with ease.
              </p>
            </div>
          </div>
        </div>

        {/* HOW IT WORKS SECTION */}
        <section className="mt-20 py-16 px-6 bg-white">
          <h2 className="text-3xl font-bold text-center text-black mb-10">How TaskNest Works</h2>

          <div className="flex flex-col md:flex-row items-center gap-10">
            
            {/* Left Image */}
            <div className="flex-1 flex justify-center">
              <Image
                src="/Images/todo_tasks.jpg"
                width={350}
                height={350}
                alt="How To Use Image"
                className="rounded-xl shadow-xl border"
              />
            </div>

            {/* Right Text */}
            <div className="flex-1 space-y-6">
              <div className="bg-blue-50 p-6 rounded-xl shadow">
                <h3 className="font-bold text-blue-700 text-lg">1️⃣ Create a Task</h3>
                <p className="text-gray-700">Add title, priority, due date, and recurrence.</p>
              </div>

              <div className="bg-purple-50 p-6 rounded-xl shadow">
                <h3 className="font-bold text-purple-700 text-lg">2️⃣ Manage It</h3>
                <p className="text-gray-700">Edit, complete, or delete anytime.</p>
              </div>

              <div className="bg-orange-50 p-6 rounded-xl shadow">
                <h3 className="font-bold text-orange-600 text-lg">3️⃣ Stay Organized</h3>
                <p className="text-gray-700">Track deadlines & stay on top of your work.</p>
              </div>
            </div>
          </div>
        </section>

        {/* CUSTOMER TESTIMONIALS */}
        <section className="mt-20 py-16 bg-gradient-to-br from-blue-50 via-purple-50 to-white px-6 rounded-2xl shadow-inner">
          <h2 className="text-3xl font-bold text-center text-black mb-12">
            What Our Customers Say
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            
            {/* Testimonial 1 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-blue-100 hover:shadow-xl transition-all">
              <p className="text-gray-700 italic">
                “TaskNest helped me organize my study schedule and manage deadlines. Super clean UI!”
              </p>
              <p className="mt-4 font-bold text-blue-700">— Sara Ahmed</p>
              <p className="text-sm text-gray-500">University Student</p>
            </div>

            {/* Testimonial 2 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-purple-100 hover:shadow-xl transition-all">
              <p className="text-gray-700 italic">
                “Finally a task manager that isn’t confusing. Everything is simple and fast!”
              </p>
              <p className="mt-4 font-bold text-purple-700">— Ali Khan</p>
              <p className="text-sm text-gray-500">Freelancer</p>
            </div>

            {/* Testimonial 3 */}
            <div className="bg-white p-6 rounded-xl shadow-md border border-orange-100 hover:shadow-xl transition-all">
              <p className="text-gray-700 italic">
                “I love the clean design and the recurrence feature. It keeps my workflow smooth.”
              </p>
              <p className="mt-4 font-bold text-orange-600">— Fatima Noor</p>
              <p className="text-sm text-gray-500">Project Manager</p>
            </div>

          </div>
        </section>


        <div className="mt-10 text-center text-gray-600 text-sm">
          <p>Your tasks are securely stored in our database.</p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default HomePage;