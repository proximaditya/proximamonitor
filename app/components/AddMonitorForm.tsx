"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMonitorForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState(""); // <-- Starts blank now
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);

    await fetch("/api/monitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url }),
    });

    setName("");
    setUrl(""); // <-- Resets to blank
    setLoading(false);
    router.refresh();
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 mb-8 flex flex-col md:flex-row gap-4 items-end">
      <div className="flex-1 w-full">
        <label className="block text-sm font-medium text-gray-700 mb-1">Website Name</label>
        <input 
          type="text" 
          required 
          value={name} 
          onChange={(e) => setName(e.target.value)} 
          placeholder="e.g. Netflix"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-gray-900 outline-none"
        />
      </div>
      
      <div className="flex-1 w-full">
        {/* Updated Label text! */}
        <label className="block text-sm font-medium text-gray-700 mb-1">URL (http:// or https://)</label>
        <input 
          type="url" 
          required 
          value={url} 
          onChange={(e) => setUrl(e.target.value)} 
          placeholder="https://www.example.com"
          className="w-full border border-gray-300 rounded-lg px-4 py-2 text-gray-900 focus:ring-2 focus:ring-gray-900 outline-none"
        />
      </div>

      <button 
        type="submit" 
        disabled={loading}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-all disabled:opacity-50 h-[42px]"
      >
        {loading ? "Adding..." : "+ Add Website"}
      </button>
    </form>
  );
}