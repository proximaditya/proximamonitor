import prisma from "../lib/prisma";
import PingButton from "./components/PingButton";
import AddMonitorForm from "./components/AddMonitorForm";
import DeleteButton from "./components/DeleteButton";

export const dynamic = "force-dynamic";

export default async function Home() {
  const monitors = await prisma.monitor.findMany({
    include: {
      logs: {
        orderBy: { createdAt: "desc" },
        take: 1, 
      },
    },
  });

  // --- NEW FEATURE: FIND THE FASTEST WEBSITE ---
  // Get all websites that are UP and have a response time
  const upMonitors = monitors.filter(m => m.logs[0]?.status === 200 && m.logs[0]?.responseTime);
  // Find the absolute lowest response time in the array
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

        {/* Grid of Monitors */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {monitors.map((monitor) => {
            const latestLog = monitor.logs[0];
            const isUp = latestLog?.status === 200;
            
            // Check if this specific card is the fastest one!
            const isFastest = latestLog?.responseTime === fastestTime && isUp;

            return (
              <div key={monitor.id} className={`bg-white rounded-xl shadow-md p-6 border ${isFastest ? 'border-yellow-400 ring-1 ring-yellow-400' : 'border-gray-200'}`}>
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
                
                <div className="flex justify-between items-center mb-6">
                  <p className="text-gray-500 text-sm truncate pr-4">{monitor.url}</p>
                  <DeleteButton id={monitor.id} />
                </div>
                
                <div className="flex justify-between items-center text-sm pt-4 border-t border-gray-100">
                  <span className="text-gray-500">Latest Response Time:</span>
                  <div className="flex items-center gap-2">
                    {/* NEW FEATURE: Render the Badge if it's the fastest */}
                    {isFastest && (
                      <span title="Fastest Website" className="text-xl">🏆</span>
                    )}
                    <span className={`font-mono font-bold text-lg ${isFastest ? 'text-yellow-600' : 'text-gray-900'}`}>
                      {latestLog ? `${latestLog.responseTime} ms` : "No data"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}