import { NextResponse } from "next/server";
import { MongoClient, ServerApiVersion } from "mongodb";
import clientPromise from "@/utils/db";

export async function POST(request: Request) {
  try {
    const { query } = await request.json();
    console.log("\n\nQUERY: ", query);
    const client = await clientPromise;
    const collection = client.db("SamskritaVangmaya").collection("Verse");
    const results = await collection
      .aggregate([
        {
          $search: {
            text: {
              query: query,
              path: "lines.text",
            },

            scoreDetails: true,
            highlight: {
              path: "lines.text",
              //   "maxCharsToExamine": "<number-of-chars-to-examine>", // optional, defaults to 500,000
              //   "maxNumPassages": "<number-of-passages>" // optional, defaults to 5
            },
          },
        },
        {
          $lookup: {
            from: "Chapter", // Replace with your actual chapter collection name
            localField: "chapterId",
            foreignField: "_id", // Assuming chapterId in Verse refers to _id in Chapter
            as: "chapterData",
          },
        },
        {
          $lookup: {
            from: "Book", // Replace with your actual chapter collection name
            localField: "bookId",
            foreignField: "_id", // Assuming chapterId in Verse refers to _id in Chapter
            as: "bookData",
          },
        },

        {
          $unwind: "$chapterData", // Unwind the joined chapter data (might be an array)
        },
        {
          $unwind: "$bookData", // Unwind the joined book data (might be an array)
        },
        {
          $project: {
            _id: 1,
            "lines.text": 1,
            order: 1,
            // chapterId: 1,
            chapterTitle: "$chapterData.title",
            // bookId: "$chapterData.bookId",
            bookTitle: "$bookData.title",
            score: { $meta: "searchScore" },
            highlights: { $meta: "searchHighlights" },
          },
        },
      ])
      .toArray();

    // const results = await collection.find({ order: query }).toArray();
    // console.log(results);
    // process.exit(0); // Exit process with success code (0)
    return NextResponse.json(results);
  } catch (error: any) {
    console.log("\n\nERROR-------\n", error);
    return NextResponse.json({ errorMessage: error });
  }
}
