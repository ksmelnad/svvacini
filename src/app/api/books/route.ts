import { NextResponse } from "next/server";
import books from "@/data/allBooks.json";
import prisma from "@/utils/prismadb";

export async function GET(request: Request) {
  // const { textID } = await request.json();
  // console.log("textID", textID);

  try {
    // books.map(async (book) => {
    //   const result = await prisma.book.create({
    //     data: {
    //       sktextsdata: book.sktextsdata,
    //     },
    //   });
    // });

    const books = await prisma.book.findMany();

    return NextResponse.json(books);
  } catch (error: any) {
    return NextResponse.json({ error: error });
  }
}
