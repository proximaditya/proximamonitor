import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  const monitors = await prisma.monitor.findMany();
  const results = [];

  for (const monitor of monitors) {
    const startTime = Date.now();
    let status = 500; 
    let serverSignature = monitor.serverType; 

    try {
      const response = await fetch(monitor.url, { method: "GET" });
      status = response.status; 
      
      // Grab the hidden Server Header!
      const headerServer = response.headers.get("server");
      if (headerServer) {
        serverSignature = headerServer;
      }
    } catch (error) {
      status = 500; 
    }

    const responseTime = Date.now() - startTime; 

    await prisma.pingLog.create({
      data: { monitorId: monitor.id, status, responseTime },
    });

    await prisma.monitor.update({
      where: { id: monitor.id },
      data: { serverType: serverSignature },
    });

    results.push({ name: monitor.name, status, responseTime });
  }

  return NextResponse.json({ message: "Ping cycle complete", results });
}