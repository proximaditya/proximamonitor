import { NextResponse } from "next/server";
import prisma from "../../../lib/prisma";

export async function POST(request: Request) {
  // Grab the data sent from the frontend form
  const body = await request.json();
  const { name, url } = body;

  // Save the new website to the database
  const newMonitor = await prisma.monitor.create({
    data: {
      name,
      url,
      interval: 5,
    },
  });

  // Return a success message
  return NextResponse.json(newMonitor);
}

export async function DELETE(request: Request) {
  const body = await request.json();
  const { id } = body;

  // 1. Delete all the ping history for this website first
  await prisma.pingLog.deleteMany({ where: { monitorId: id } });

  // 2. Delete the website itself
  await prisma.monitor.delete({ where: { id } });

  return NextResponse.json({ message: "Website deleted successfully" });
}