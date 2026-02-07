"use client";

import React, { useState } from 'react';
import Link from 'next/link';

const SignupPage = () => {
  const [name, setName] = useState(''); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || 'https://aliza5-task-nest.hf.space'}/api/v1/auth/signup`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, password }),
          credentials: 'include',
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Registration failed');
      }

      const result = await response.json();
      window.location.href = '/tasks';
      return result;
    } catch (err) {
      console.error('Registration error:', err);
      throw err;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await handleSignUp(name, email, password);
      setSuccess(true);
      setError('');
    } catch (err: any) {
      setError(err.message || 'An error occurred during registration');
      console.error(err);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-100 to-gray-300 px-6">
        <div className="max-w-md w-full backdrop-blur-xl bg-white/40 shadow-xl rounded-2xl p-8">
          <div className="rounded-lg bg-green-50 p-4 border border-green-200">
            <h3 className="text-lg font-semibold text-green-800">
              Registration Successful 🎉
            </h3>
            <p className="text-sm text-green-700 mt-1">
              Please check your email to verify your account.
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white px-6">
      <div className="max-w-md w-full backdrop-blur-xl bg-white/40 p-10 shadow-2xl rounded-2xl border border-white/30">
        <h2 className="text-3xl text-center font-bold text-gray-800 mb-6">
          Create Your Account
        </h2>

        {error && (
          <div className="rounded-md bg-red-100 border border-red-300 p-3 mb-4 text-sm text-red-700">
            {error}
          </div>
        )}

        <form className="space-y-5" onSubmit={handleSubmit}>
          <div>
            <input
              type="text"
              id="name"
              value={name}
              required
              onChange={(e) => setName(e.target.value)}
              placeholder="Full Name"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500
              focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/70"
            />
          </div>

          <div>
            <input
              type="email"
              id="email"
              value={email}
              required
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email Address"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500
              focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/70"
            />
          </div>

          <div>
            <input
              type="password"
              id="password"
              value={password}
              required
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Password"
              className="w-full px-4 py-3 rounded-lg border border-gray-300 text-gray-800 placeholder-gray-500
              focus:ring-2 focus:ring-indigo-400 focus:outline-none bg-white/70"
            />
          </div>

          <button
            type="submit"
            className="w-full py-3 rounded-lg bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold
            hover:opacity-90 transition shadow-lg"
          >
            Sign Up
          </button>
        </form>

        <p className="text-center text-orange-600 mt-4">
          Already have an account?{" "}
          <Link href="/auth/login" className="text-orange-600 font-medium hover:underline">
            Sign in
          </Link>
        </p>

        <p className="text-center mt-3">
          <Link href="/" className="text-purple-700 hover:text-indigo-700 ">
            Back to Home
          </Link>
        </p>
      </div>
    </div>
  );
};

export default SignupPage;