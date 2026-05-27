"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export default function PingButton() {
  const [loading, setLoading] = useState(false);
  const [liveMode, setLiveMode] = useState(false);
  const [timeLeft, setTimeLeft] = useState(0); // Time left in seconds
  const router = useRouter();
  
  // We use a ref to store the timer so we can stop it later
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const runSinglePing = async () => {
    setLoading(true);
    await fetch("/api/ping"); 
    router.refresh(); 
    setLoading(false);
  };

  const toggleLiveMode = () => {
    if (liveMode) {
      // 🛑 STOP LIVE MODE
      setLiveMode(false);
      setTimeLeft(0);
      if (intervalRef.current) clearInterval(intervalRef.current);
    } else {
      // 🟢 START LIVE MODE (10 minutes = 600 seconds)
      setLiveMode(true);
      setTimeLeft(600);
      runSinglePing(); // Run the first ping immediately

      // Set up the repeating timer every 30 seconds
      intervalRef.current = setInterval(() => {
        runSinglePing();
        setTimeLeft((prev) => prev - 30);
      }, 30000); // 30,000 milliseconds = 30 seconds
    }
  };

  // Automatically stop when the timer hits 0
  useEffect(() => {
    if (timeLeft <= 0 && liveMode) {
      setLiveMode(false);
      if (intervalRef.current) clearInterval(intervalRef.current);
    }
  }, [timeLeft, liveMode]);

  // Cleanup the timer if the user leaves the page
  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  // Format the timer for the button (e.g., 09:30)
  const mins = Math.floor(timeLeft / 60);
  const secs = timeLeft % 60;
  const timeString = `${mins}:${secs.toString().padStart(2, '0')}`;

  return (
    <button
      onClick={toggleLiveMode}
      disabled={loading && !liveMode}
      className={`px-6 py-2 rounded-lg font-bold transition-all shadow-md flex items-center gap-2 ${
        liveMode 
          ? 'bg-red-100 text-red-600 border-2 border-red-500 hover:bg-red-200 animate-pulse' 
          : 'bg-gray-900 text-white hover:bg-gray-800'
      }`}
    >
      {liveMode ? (
        <>
          <span className="w-2 h-2 bg-red-600 rounded-full animate-ping"></span>
          Stop Live Mode ({timeString})
        </>
      ) : (
        "▶ Run Live Check"
      )}
    </button>
  );
}