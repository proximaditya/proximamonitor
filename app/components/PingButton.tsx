"use client"; // This tells Next.js this file runs in the browser, so it can handle 'onClick'

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function PingButton() {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const runPing = async () => {
    setLoading(true);
    //this one Cal our secret Ping Engine API in the background
    await fetch("/api/ping"); 
    
    // 2. Tell Next.js to refresh the homepage to show the new response times!
    router.refresh(); 
    
    setLoading(false);
  };

  return (
    <button
      onClick={runPing}
      disabled={loading}
      className="bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-sm"
    >
      {loading ? "Running Check..." : "▶ Run Health Check"}
    </button>
  );
}