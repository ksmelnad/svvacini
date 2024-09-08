import prisma from "@/utils/prismadb";
import { Book } from "@prisma/client";
import books from "@/data/books.json";
import booksMeta from "@/data/books-meta/booksMeta.json";
import AudioBookRender from "@/components/AudioBookRender";
import { writeFile, writeFileSync } from "fs";
import { BookWithRelations } from "@/utils/types";
// import {Book } from "@prisma/client"
interface BooksData {
  name: string;
  books: SingleBook[];
}
interface SingleBook {
  book: string;
  book_id: string;
  category?: string;
  author: string;
  audio?: string;
}

const getBook = async (slug: string): Promise<BookWithRelations | null> => {
  try {
    const bookData = await prisma.book.findFirst({
      where: {
        bookId: slug,
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
            verses: {
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
                verses: {
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
                      orderBy: {
                        order: "asc",
                      },
                      include: {
                        commentaries: true,
                      },
                    },
                    verses: {
                      orderBy: {
                        order: "asc",
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    });

    // writeFileSync("src/data/bookData.json", JSON.stringify(bookData), "utf-8");
    // console.log("Saved bookData!");
    return bookData as BookWithRelations | null;
  } catch (error) {
    console.error(error);
    return null;
  }
};

// Return a list of `params` to populate the [slug] dynamic segment

// export const fetchCache = "auto";

export async function generateStaticParams() {
  const slugs: { slug: string }[] = [];

  books.forEach((category: { books: SingleBook[] }) => {
    category.books.forEach((book) => {
      slugs.push({ slug: book.book_id });
    });
  });

  return slugs;

  // return books.map((booksData: BooksData) => ({
  //   slug: booksData.books.map((book) => slug : book.book_id),
  // }));
}

export default async function Page({ params }: { params: { slug: string } }) {
  const bookData = await getBook(params?.slug);
  // const bookMeta = booksMeta.find((book) => book.id === params?.slug);
  // console.log(bookData);

  return <AudioBookRender bookData={bookData} />;
}
