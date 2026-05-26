"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function DeleteButton({ id }: { id: string }) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleDelete = async () => {
    // Add a popup to confirm they actually want to delete it
    if (!confirm("Are you sure you want to remove this website?")) return;
    
    setLoading(true);
    
    await fetch("/api/monitors", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });

    router.refresh();
  };

  return (
    <button 
      onClick={handleDelete} 
      disabled={loading} 
      className="text-red-500 text-sm font-medium hover:text-red-700 transition-colors disabled:opacity-50"
    >
      {loading ? "Deleting..." : "Remove"}
    </button>
  );
}