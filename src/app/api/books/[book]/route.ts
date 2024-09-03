import { NextRequest, NextResponse } from "next/server";
import prisma from "@/utils/prismadb";

export async function GET(
  request: NextRequest,
  { params }: { params: { book: string } }
) {
  // const book = request.nextUrl.searchParams.get("book");

  //   const { book } = await request.json();

  console.log("Book:", params.book);

  try {
    console.log("Prisma started");
    const bookData = await prisma.book.findFirst({
      where: {
        bookId: params.book,
      },
      include: {
        chapters: {
          orderBy: {
            order: "asc",
          },
          include: {
            paragraphs: {
              orderBy: {
                order: "asc",
              },
            },
            sections: {
              orderBy: {
                order: "asc",
              },
              include: {
                paragraphs: {
                  orderBy: {
                    order: "asc",
                  },
                },
                subsections: {
                  orderBy: {
                    order: "asc",
                  },
                  include: {
                    paragraphs: {
                      include: {
                        commentaries: true,
                      },
                     
                    }
                  }
                }
              },
            },
          },
        },
      },
    });

    // console.log("Prisma ended");
    // console.log("Book Data:", bookData);

    if (!bookData) return new NextResponse("No book found", { status: 404 });

    return NextResponse.json(bookData);
  } catch (error: any) {
    console.error("Error occurred:", error.message);
    console.error(error.stack);
    return NextResponse.json({ error: error });
  }
}
