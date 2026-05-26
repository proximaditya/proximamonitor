import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function GET() {
  const monitors = await prisma.monitor.findMany();
  const results = [];

  for (const monitor of monitors) {
    const startTime = Date.now();
    let status = 500; 

    try {
      const response = await fetch(monitor.url, { method: "GET" });
      status = response.status; 
    } catch (error) {
      status = 500; 
    }

    const responseTime = Date.now() - startTime; 

    await prisma.pingLog.create({
      data: {
        monitorId: monitor.id,
        status: status,
        responseTime: responseTime,
      },
    });

    results.push({ name: monitor.name, status, responseTime });
  }

  return NextResponse.json({ message: "Ping cycle complete", results });
}