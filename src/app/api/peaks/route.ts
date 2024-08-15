import { NextResponse } from "next/server";
import { auth } from "../auth/[...nextauth]/auth";
import prisma from "@/utils/prismadb";

export async function GET(request: Request) {
  try {
    const peaksResult = await prisma.peaks.findMany();
    return NextResponse.json(peaksResult);
  } catch (error: any) {
    return NextResponse.json({ error: error });
  }
}

export async function POST(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      {
        message: "Not authorised!",
      },
      { status: 401 }
    );
  }

  try {
    const { title, points } = await request.json();

    const existingPeaks = await prisma.peaks.findFirst({
      where: { title: title },
    });

    if (existingPeaks) {
      return NextResponse.json(
        {
          message: "A title already exists! Try new title.",
        },
        { status: 500 }
      );
    }

    const peaksWrite = await prisma.peaks.create({
      data: {
        user: {
          connect: {
            email: session?.user?.email!,
          },
        },
        title,
        points,
      },
    });

    return NextResponse.json(peaksWrite, { status: 201 });
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
