import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "../components/Button";
import { Spinner } from "../components/Spinner";
import { useStore } from "../context/StoreContext";

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState("taylor@example.com");
  const [password, setPassword] = useState("password");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { login, state } = useStore();
  const { isAuthenticated, isAdmin } = state.auth;
  const navigate = useNavigate();

  useEffect(() => {
    if (isAuthenticated) {
      navigate(isAdmin ? "/admin" : "/profile");
    }
  }, [isAuthenticated, isAdmin, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      // The useEffect will handle navigation
    } catch (err) {
      setError("Failed to login. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[70vh] bg-gray-50 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
        </div>
        <div className="bg-white p-8 shadow-lg rounded-lg">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm mt-1"
                placeholder="Email address"
              />
            </div>
            <div>
              <label htmlFor="password">Password</label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="appearance-none rounded-md relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-accent focus:border-accent sm:text-sm mt-1"
                placeholder="Password"
              />
            </div>
            {error && <p className="text-sm text-red-600">{error}</p>}
            <div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? <Spinner /> : "Sign in"}
              </Button>
            </div>
            {/* <div className="text-sm text-center text-gray-600">
                             <p>Admin: <span className="font-mono">taylor@example.com</span> / <span className="font-mono">password</span></p>
                             <p>Customer: <span className="font-mono">john@example.com</span> / <span className="font-mono">password</span></p>
                        </div> */}
            <div className="text-sm text-center">
              <Link
                to="/forgot-password"
                className="font-medium text-accent hover:text-blue-500"
              >
                Forgot your password?
              </Link>
              <span className="mx-2 text-gray-400">|</span>
              <Link
                to="/register"
                className="font-medium text-accent hover:text-blue-500"
              >
                Create an account
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
