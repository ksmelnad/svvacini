import { createClient } from "solr-client";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  const client = createClient({
    port: "8983",
    core: "sktextindex",
  });

  try {
    const { queryString, texts } = await request.json();

    const query = client
      .query()
      .q({ word: queryString })
      .df("word")
      .fq({ field: "name", value: texts })
      .start(0)
      .rows(200);

    const obj = await client.search(query);

    return NextResponse.json(obj);
  } catch (error) {
    return NextResponse.json({ errorMessage: error });
  }
}
