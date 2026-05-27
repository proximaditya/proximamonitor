import prisma from "../lib/prisma";
import PingButton from "./components/PingButton";
import AddMonitorForm from "./components/AddMonitorForm";
import DeleteButton from "./components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  // 1. Fetch the last 10 logs instead of just 1!
  const monitors = await prisma.monitor.findMany({
    include: {
      logs: {
        orderBy: { createdAt: "desc" },
        take: 10, 
      },
    },
  });

  // Find the absolute lowest response time for the trophy
  const upMonitors = monitors.filter(m => m.logs[0]?.status === 200 && m.logs[0]?.responseTime);
  const fastestTime = upMonitors.length > 0 
    ? Math.min(...upMonitors.map(m => m.logs[0].responseTime)) 
    : null;

  return (
    <main className="min-h-screen bg-gray-50 p-10">
      <div className="max-w-5xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-10">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">ProximaMonitor</h1>
            <p className="text-gray-500 text-sm md:text-base">Real-time API and Website Health Dashboard</p>
          </div>
          
          <PingButton /> 
        </div>

        {/* Add Website Form */}
        <AddMonitorForm />

        {/* UI UPGRADE: The Empty State */}
        {monitors.length === 0 && (
          <div className="bg-white rounded-xl border-2 border-dashed border-gray-300 p-12 text-center mt-8">
            <span className="text-4xl mb-4 block">📡</span>
            <h3 className="text-xl font-bold text-gray-700 mb-2">No websites tracked yet</h3>
            <p className="text-gray-500">Use the form above to add your first website and start monitoring!</p>
          </div>
        )}

        {/* Grid of Monitors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monitors.map((monitor) => {
            const latestLog = monitor.logs[0];
            const isUp = latestLog?.status === 200;
            const isFastest = latestLog?.responseTime === fastestTime && isUp;

            // Prepare data for the Mini Bar Chart
            const chartLogs = [...monitor.logs].reverse(); // Oldest to newest (left to right)
            const maxTime = Math.max(...chartLogs.map(l => l.responseTime), 100); // Scale the graph

            return (
              <div key={monitor.id} className={`bg-white rounded-xl shadow-md p-6 border transition-all hover:shadow-lg ${isFastest ? 'border-yellow-400 ring-1 ring-yellow-400' : 'border-gray-200'}`}>
                
                {/* Card Header */}
                <div className="flex justify-between items-center mb-4">
                  <h2 className="text-xl font-semibold text-gray-800">{monitor.name}</h2>
                  
                  {isUp ? (
                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                      UP
                    </span>
                  ) : (
                    <span className="bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-bold flex items-center gap-2">
                      <span className="w-2 h-2 bg-red-500 rounded-full"></span>
                      DOWN
                    </span>
                  )}
                </div>
                
                {/* URL and Delete Button */}
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-500 text-sm truncate pr-4">{monitor.url}</p>
                  <DeleteButton id={monitor.id} />
                </div>
                
                {/* Latest Time */}
                <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100 mb-4">
                  <span className="text-gray-500">Latest Response:</span>
                  <div className="flex items-center gap-2">
                    {isFastest && <span title="Fastest Website" className="text-xl">🏆</span>}
                    <span className={`font-mono font-bold text-lg ${isFastest ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {latestLog ? `${latestLog.responseTime} ms` : "No data"}
                    </span>
                  </div>
                </div>

                {/* UI UPGRADE: Mini Bar Chart (Sparkline) */}
                {chartLogs.length > 0 && (
                  <div className="mt-2 p-3 bg-gray-50 rounded-lg">
                    <p className="text-[10px] uppercase font-bold text-gray-400 mb-2 tracking-wider">History (Last 10)</p>
                    <div className="h-10 w-full flex items-end gap-1">
                      {chartLogs.map((log) => {
                        // Calculate how tall the bar should be based on the max time
                        const heightPercent = Math.max((log.responseTime / maxTime) * 100, 5); 
                        const isBarUp = log.status === 200;
                        
                        return (
                          <div 
                            key={log.id} 
                            title={`${log.responseTime}ms`}
                            className={`w-full rounded-t-sm opacity-80 hover:opacity-100 transition-all cursor-crosshair ${isBarUp ? 'bg-blue-400' : 'bg-red-500'}`} 
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