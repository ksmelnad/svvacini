import { NextResponse } from 'next/server';
import OpenAI from 'openai';

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY, // This is the default and can be omitted
});

export async function POST(request: Request) {
    try {
        const {userQuery} = await request.json()

        const params: OpenAI.Chat.ChatCompletionCreateParams = {
            messages: [
                {
                    role: "system",
                    content:
                      "Your task is to answer the question as truthfully and briefly as possible with at most 100 words.",
                  },
                { role: 'user', content: userQuery }],
            model: 'gpt-3.5-turbo',
            max_tokens: 100
          };
          const chatCompletion: OpenAI.Chat.ChatCompletion = await client.chat.completions.create(params);

          if(chatCompletion) {
            return NextResponse.json(chatCompletion.choices[0].message.content, {status: 200})
          } else {
            return NextResponse.json("No response from OpenAI", {status: 500})
          }
        
    } catch (error) {
        return NextResponse.json("Internal Server Error", {status: 500})
    }
  
}