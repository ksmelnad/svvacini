import { NextResponse } from "next/server";
import { auth } from "../../auth/[...nextauth]/auth";
import prisma from "@/utils/prismadb";


export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
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
    const { points } = await request.json();
    const peaksUpdate = await prisma.peaks.update({
      where: {
        id: params.id,
      },
      data: {
        points,
      },
    });

    return NextResponse.json(peaksUpdate, { status: 200 });
  } catch (error) {
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
