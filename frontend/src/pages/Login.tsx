import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { login } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const { mutate, isPending } = useMutation({
    mutationFn: () => login(email, password),
    onSuccess: () => { refresh(); navigate("/"); },
    onError: (err: any) => setError(err.response?.data?.error ?? "Login failed."),
  });

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-walmart-blue mb-1">Sign In</h1>
        <p className="text-gray-500 text-sm mb-6">Welcome back to ShopMart</p>

        <div className="space-y-4">
          <input
            type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue"
          />
          <input
            type="password" placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && mutate()}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            onClick={() => mutate()} disabled={isPending}
            className="w-full bg-walmart-blue text-white font-bold py-3 rounded-full hover:bg-walmart-dark transition disabled:opacity-50"
          >
            {isPending ? "Signing in..." : "Sign In"}
          </button>
          <p className="text-center text-sm text-gray-500">
            Don't have an account?{" "}
            <Link to="/register" className="text-walmart-blue font-semibold hover:underline">Create one</Link>
          </p>
          <div className="bg-blue-50 rounded-lg p-3 text-xs text-gray-600">
            <p><strong>Admin:</strong> admin@example.com / Admin123!</p>
            <p><strong>User:</strong> user@example.com / User123!</p>
          </div>
        </div>
      </div>
    </div>
  );
}
