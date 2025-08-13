import { NextResponse } from "next/server";
import { Document } from "mongodb";
import clientPromise from "@/utils/db";

interface SearchRequestBody {
  query?: string;
}

export async function POST(request: Request) {
  try {
    const { query }: SearchRequestBody = await request.json();

    if (!query || typeof query !== "string" || query.trim() === "") {
      return NextResponse.json(
        { errorMessage: "Search query is missing or invalid." },
        { status: 400 }
      );
    }

    console.log("\n\nQUERY: ", query);
    const client = await clientPromise;
    const collection = client.db("SamskritaVangmaya").collection("Verse");
    const pipeline: Document[] = [
      {
        $search: {
          index: "default",
          text: {
            query: query,
            path: "lines.text",
          },

          scoreDetails: true,
          highlight: {
            path: "lines.text",
          },
        },
      },
      {
        $lookup: {
          from: "Chapter", // Replace with your actual chapter collection name
          localField: "chapterId",
          foreignField: "_id",
          as: "chapterData",
        },
      },
      {
        $lookup: {
          from: "Book", // Replace with your actual chapter collection name
          localField: "bookId",
          foreignField: "_id",
          as: "bookData",
        },
      },
      {
        // Use preserveNullAndEmptyArrays to keep documents even if the lookup found no match.
        // This helps in debugging, as you'll see documents with empty/null chapterData
        // instead of them disappearing from the result set.
        $unwind: {
          path: "$chapterData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $unwind: {
          path: "$bookData",
          preserveNullAndEmptyArrays: true,
        },
      },
      {
        $project: {
          _id: 1,
          "lines.text": 1,
          order: 1,
          chapterTitle: "$chapterData.title",
          bookTitle: "$bookData.title",
          score: { $meta: "searchScore" },
          highlights: { $meta: "searchHighlights" },
        },
      },
    ];

    const results = await collection.aggregate(pipeline).toArray();

    console.log(results);
    return NextResponse.json(results);
  } catch (error) {
    console.error("\n\nERROR-------\n", error);
    const message =
      error instanceof Error ? error.message : "An unknown error occurred.";
    return NextResponse.json({ errorMessage: message }, { status: 500 });
  }
}
