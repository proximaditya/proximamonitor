"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AddMonitorForm() {
  const [name, setName] = useState("");
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(""); // Holds the limit warning
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); 
    setLoading(true);
    setErrorMsg("");

    const response = await fetch("/api/monitors", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, url }),
    });

    if (!response.ok) {
      // If the API says 429 Too Many Requests, grab the error message!
      const data = await response.json();
      setErrorMsg(data.error || "Something went wrong.");
      setLoading(false);
      return;
    }

    setName("");
    setUrl(""); 
    setLoading(false);
    router.refresh();
  };

  return (
    <div className="mb-8">
      <form onSubmit={handleSubmit} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 flex flex-col md:flex-row gap-4 items-end">
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

      {/* NEW FEATURE: Error Message Display */}
      {errorMsg && (
        <div className="mt-3 bg-red-50 text-red-600 p-3 rounded-lg border border-red-200 text-sm font-medium">
          ⚠️ {errorMsg}
        </div>
      )}
    </div>
  );
}