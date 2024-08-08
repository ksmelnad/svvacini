import { createClient } from "solr-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const client = createClient({
    port: "8983",
    core: "svvacini-index-2",
  });

  try {
    const { queryString, texts } = await request.json();
    console.log(queryString, texts);

    const query = client
      .query()
      .q({ line: queryString })
      .df("line")
      .fq({ field: "book_title", value: texts })
      .start(0)
      .rows(200);

    const obj = await client.search(query);
    console.log(obj);

    return NextResponse.json(obj);
  } catch (error) {
    return NextResponse.json({ errorMessage: error });
  }
}
