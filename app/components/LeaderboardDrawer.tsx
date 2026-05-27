"use client";

import { useState } from "react";

type LeaderboardItem = {
  id: string;
  name: string;
  responseTime: number;
  serverType: string | null;
};

export default function LeaderboardDrawer({ leaderboard }: { leaderboard: LeaderboardItem[] }) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* 🚀 UPGRADED: Cute, Small, Light Blue Button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed top-1/3 right-0 bg-sky-100 text-sky-700 p-2 pl-3 rounded-l-xl shadow-md hover:bg-sky-200 transition-all z-40 flex items-center gap-1 border border-sky-300 border-r-0 text-sm font-semibold backdrop-blur-sm"
        style={{ transform: "translateY(-50%)" }}
        title="View Leaderboard"
      >
        ◀  
      </button>

      {/* Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/20 z-40 backdrop-blur-sm transition-opacity"
          onClick={() => setIsOpen(false)}
        ></div>
      )}

      {/* The Slide-Out Drawer */}
      <div className={`fixed top-0 right-0 h-full w-full md:w-80 bg-white shadow-2xl z-50 transform transition-transform duration-300 ease-in-out ${isOpen ? "translate-x-0" : "translate-x-full"} overflow-y-auto`}>
        <div className="p-5">
          <div className="flex justify-between items-center mb-6 pb-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">🏆 Leaderboard</h2>
            <button onClick={() => setIsOpen(false)} className="text-gray-400 hover:text-red-500 text-2xl transition-colors">✕</button>
          </div>

          <div className="flex flex-col gap-3">
            {leaderboard.length === 0 ? (
              <p className="text-gray-500 text-center text-sm mt-10">Run a Health Check to rank websites!</p>
            ) : (
              leaderboard.map((site, index) => {
                let medalColor = "text-gray-400";
                if (index === 0) medalColor = "text-yellow-500";
                if (index === 1) medalColor = "text-slate-400";
                if (index === 2) medalColor = "text-amber-700";

                return (
                  <div key={site.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100">
                    <span className={`text-xl font-black w-5 ${medalColor}`}>{index + 1}</span>
                    <div className="flex-1 overflow-hidden">
                      <p className="font-bold text-sm text-gray-800 truncate">{site.name}</p>
                      <p className="text-[10px] font-mono text-gray-500 truncate">{site.serverType || "Unknown"}</p>
                    </div>
                    <span className="font-mono font-bold text-gray-900">{site.responseTime} <span className="text-[10px] text-gray-400">ms</span></span>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </>
  );
}