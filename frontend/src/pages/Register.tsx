import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { register } from "../api/client";
import { useAuth } from "../context/AuthContext";

export default function Register() {
  const navigate = useNavigate();
  const { refresh } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<string[]>([]);

  const { mutate, isPending } = useMutation({
    mutationFn: () => register(email, password),
    onSuccess: () => { refresh(); navigate("/"); },
    onError: (err: any) => setErrors(err.response?.data?.errors ?? ["Registration failed."]),
  });

  return (
    <div className="min-h-[60vh] flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow p-8 w-full max-w-md">
        <h1 className="text-3xl font-bold text-walmart-blue mb-1">Create Account</h1>
        <p className="text-gray-500 text-sm mb-6">Join ShopMart today</p>

        <div className="space-y-4">
          <input
            type="email" placeholder="Email address" value={email} onChange={e => setEmail(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue"
          />
          <input
            type="password" placeholder="Password (min 6 chars)" value={password} onChange={e => setPassword(e.target.value)}
            className="w-full border border-gray-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-walmart-blue"
          />
          {errors.map((e, i) => <p key={i} className="text-red-500 text-sm">{e}</p>)}
          <button
            onClick={() => mutate()} disabled={isPending}
            className="w-full bg-walmart-blue text-white font-bold py-3 rounded-full hover:bg-walmart-dark transition disabled:opacity-50"
          >
            {isPending ? "Creating account..." : "Create Account"}
          </button>
          <p className="text-center text-sm text-gray-500">
            Already have an account?{" "}
            <Link to="/login" className="text-walmart-blue font-semibold hover:underline">Sign in</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
