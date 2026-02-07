"use client";

import Link from "next/link";
import React, { useState } from "react";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BETTER_AUTH_URL || "http://localhost:8000"}/api/v1/auth/login`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          (errorData.detail && errorData.detail[0]?.msg) ||
          errorData.detail ||
          "Login failed"
        );
      }

      const result = await response.json();

      sessionStorage.setItem("token", result.access_token);

      setSuccess("Login successful! Redirecting...");
      setTimeout(() => {
        window.location.href = "/add";
      }, 1000);
    } catch (err: any) {
      console.error("Login error:", err);
      setError(err.message || "Login failed. Please check your credentials.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-100 via-purple-100 to-white px-4 py-16">
      <div className="max-w-md w-full bg-white/80 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-purple-200/40">
        {/* Title */}
        <div className="text-center">
          <h2 className="text-4xl font-extrabold text-black">Welcome Back</h2>
          <p className="text-gray-600 mt-1">Login to continue</p>
        </div>

        {/* Alerts */}
        <form className="mt-8 space-y-5" onSubmit={handleSignIn}>
          {error && (
            <div className="p-3 bg-red-100 border border-red-300 text-red-700 rounded-lg text-sm">
              {error}
            </div>
          )}

          {success && (
            <div className="p-3 bg-green-100 border border-green-300 text-green-700 rounded-lg text-sm">
              {success}
            </div>
          )}

          {/* Email */}
          <div>
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900 shadow-sm"
              placeholder="Enter your email"
            />
          </div>

          {/* Password */}
          <div>
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-purple-500 focus:border-purple-500 text-gray-900 shadow-sm"
              placeholder="Enter your password"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg shadow-md hover:opacity-90 transition font-semibold"
          >
            Sign In
          </button>
        </form>

        {/* Links */}
        <div className="mt-6 text-center space-y-2">
          <Link
            href="/auth/signup"
            className="text-sm text-blue-700 hover:text-orange-600 font-medium transition"
          >
            Dont have an account? Sign up
          </Link>

          <br />

          <Link
            href="/"
            className="text-sm text-purple-700 hover:text-orange-600 font-medium transition"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;