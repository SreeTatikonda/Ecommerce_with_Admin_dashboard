import { useParams, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { payOrder } from "../api/client";
import { CreditCard } from "lucide-react";

export default function PaymentPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { mutate, isPending, error } = useMutation({
    mutationFn: () => payOrder(Number(id)),
    onSuccess: () => navigate("/orders"),
  });

  return (
    <div className="max-w-md mx-auto px-4 py-16">
      <div className="bg-white rounded-2xl shadow p-8 text-center">
        <CreditCard size={64} className="mx-auto text-walmart-blue mb-4" />
        <h1 className="text-2xl font-bold text-gray-800 mb-2">Complete Payment</h1>
        <p className="text-gray-500 mb-2">Order #{id}</p>
        <p className="text-sm text-gray-400 mb-6">This is a mock payment — no real charge will occur.</p>

        <div className="bg-gray-50 rounded-xl p-4 mb-6 text-left space-y-2">
          <p className="text-sm text-gray-500">Card Number</p>
          <p className="font-mono text-gray-700">•••• •••• •••• 4242</p>
          <p className="text-sm text-gray-500 mt-2">Cardholder</p>
          <p className="font-mono text-gray-700">DEMO USER</p>
        </div>

        {error && <p className="text-red-500 text-sm mb-4">{(error as any)?.response?.data?.error ?? "Payment failed."}</p>}

        <button
          onClick={() => mutate()}
          disabled={isPending}
          className="w-full bg-walmart-yellow text-walmart-blue font-bold py-3 rounded-full hover:bg-yellow-400 transition disabled:opacity-50"
        >
          {isPending ? "Processing..." : "Pay Now (Mock)"}
        </button>
      </div>
    </div>
  );
}
