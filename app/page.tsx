import prisma from "../lib/prisma";
import PingButton from "./components/PingButton";
import AddMonitorForm from "./components/AddMonitorForm";
import DeleteButton from "./components/DeleteButton";
import LeaderboardDrawer from "./components/LeaderboardDrawer";

export const dynamic = "force-dynamic";

export default async function Home() {
  const monitors = await prisma.monitor.findMany({
    include: {
      logs: { orderBy: { createdAt: "desc" }, take: 10 },
    },
  });

  // Calculate ranks and sort data for the Leaderboard Drawer
  const upMonitors = monitors.filter(m => m.logs[0]?.status === 200 && m.logs[0]?.responseTime);
  const sortedTimes = Array.from(new Set(upMonitors.map(m => m.logs[0].responseTime))).sort((a, b) => a - b);
  const fastestTime = sortedTimes.length > 0 ? sortedTimes[0] : null;

  // Prepare clean data to pass into the Drawer component
  const leaderboardData = upMonitors
    .map(m => ({
      id: m.id,
      name: m.name,
      responseTime: m.logs[0].responseTime,
      serverType: m.serverType,
    }))
    .sort((a, b) => a.responseTime - b.responseTime);

  return (
    <main className="min-h-screen bg-gray-50 p-10 relative">
      
      {/* 🚀 NEW FEATURE: The Slide-Out Drawer */}
      <LeaderboardDrawer leaderboard={leaderboardData} />

      <div className="max-w-5xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">ProximaMonitor</h1>
            <p className="text-gray-500 text-sm md:text-base">Real-time API and Website Health Dashboard</p>
          </div>
          <PingButton /> 
        </div>

        <AddMonitorForm />

        {monitors.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center mt-8">
            <span className="text-4xl mb-4 block">📡</span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No websites tracked yet</h3>
            <p className="text-gray-500">Use the form above to add your first website and start monitoring!</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monitors.map((monitor) => {
            const latestLog = monitor.logs[0];
            const isUp = latestLog?.status === 200;
            const responseTime = latestLog?.responseTime;

            let rank = -1;
            if (isUp && responseTime) rank = sortedTimes.indexOf(responseTime) + 1;

            let borderStyle = 'border-gray-200';
            let textStyle = 'text-gray-900';
            let icon = null;

            if (rank === 1) {
              borderStyle = 'border-yellow-400 ring-1 ring-yellow-400 shadow-yellow-100';
              textStyle = 'text-yellow-600'; icon = '🏆';
            } else if (rank === 2) {
              borderStyle = 'border-slate-400 ring-1 ring-slate-300';
              textStyle = 'text-slate-600'; icon = '🥈';
            } else if (rank === 3) {
              borderStyle = 'border-amber-700/50 ring-1 ring-amber-700/30';
              textStyle = 'text-amber-700'; icon = '🥉';
            }

            const chartLogs = [...monitor.logs].reverse(); 
            const maxTime = Math.max(...chartLogs.map(l => l.responseTime), 100); 

            return (
              <div key={monitor.id} className={`bg-white rounded-xl shadow-md p-6 border transition-all hover:shadow-lg ${borderStyle}`}>
                
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{monitor.name}</h2>
                  {isUp ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>UP
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>DOWN
                    </span>
                  )}
                </div>
                
                <div className="flex justify-between items-center mb-4">
                  <p className="text-gray-500 text-sm truncate pr-4">{monitor.url}</p>
                  <DeleteButton id={monitor.id} />
                </div>

                {/* 🚀 NEW FEATURE: The Tech Stack Badge */}
                <div className="mb-6">
                  <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md font-mono border border-gray-200">
                    💻 Tech: <span className="font-bold">{monitor.serverType || "Unknown"}</span>
                  </span>
                </div>
                
                <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100 mb-4">
                  <span className="text-gray-500">Latest Response:</span>
                  <div className="flex items-center gap-2">
                    {icon && <span className="text-xl drop-shadow-sm">{icon}</span>}
                    <span className={`font-mono font-bold text-lg ${textStyle}`}>
                      {latestLog ? `${latestLog.responseTime} ms` : "No data"}
                    </span>
                  </div>
                </div>

                {chartLogs.length > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <div className="h-10 w-full flex items-end gap-1">
                      {chartLogs.map((log) => {
                        const heightPercent = Math.max((log.responseTime / maxTime) * 100, 5); 
                        return (
                          <div key={log.id} title={`${log.responseTime}ms`}
                            className={`w-full rounded-t-sm opacity-80 hover:opacity-100 transition-all cursor-crosshair ${log.status === 200 ? 'bg-blue-400' : 'bg-red-500'}`} 
                            style={{ height: `${heightPercent}%` }}
                          ></div>
                        );
                      })}
                    </div>
                  </div>
                )}
                
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}