import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(request: Request) {
  const body = await request.json();
  const { name, url } = body;

  // --- NEW FEATURE: 10 WEBSITES PER HOUR LIMIT ---
  // 1. Calculate the exact time 1 hour ago
  const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);

  // 2. Count how many websites were added since that time
  const recentMonitors = await prisma.monitor.count({
    where: {
      createdAt: { gte: oneHourAgo },
    },
  });

  // 3. If they hit 10, reject the request!
  if (recentMonitors >= 10) {
    return NextResponse.json(
      { error: "Rate limit reached. Maximum 10 websites can be added per hour to prevent spam." },
      { status: 429 } // 429 is the official HTTP code for "Too Many Requests"
    );
  }

  // If they are under the limit, proceed normally!
  const newMonitor = await prisma.monitor.create({
    data: { name, url, interval: 5 },
  });

  return NextResponse.json(newMonitor);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;

  await prisma.pingLog.deleteMany({ where: { monitorId: id } });
  await prisma.monitor.delete({ where: { id } });

  return NextResponse.json({ message: "Website deleted successfully" });
}