// import { getServerSession } from "next-auth/next";
// import { authOptions } from "@/lib/auth";
// import { NextRequest, NextResponse } from 'next/server';

// import OpenAI from 'openai';

// const client = new OpenAI({
//   baseURL: "https://api.cohere.ai/compatibility/v1",
//   apiKey: process.env['COHERE_API_KEY'], // This is the default and can be omitted
// });

// export async function POST(request: NextRequest) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const { prompt } = await request.json();

//     const response = await client.chat.completions.create({
//       model: "command-r-plus", // use turbo
//       messages: [{
//         role: 'system',
//         content: "You are a helpful assistant that summarizes text. You will be given a transcript of a video or audio file. You will need to summarize the transcript in a way that is easy to understand and follow. You will also need to include the timestamps of the transcript in the summary (if applicable).",
//       },
//       {
//         role: 'system',
//         content: "Do so in a structured manner with headers, subheaders, links, etc. If it is a slideshow, describe each slide.",
//       },
//       {
//         role: 'system',
//         content: "Convert ur markdown syntax to HTML",
//       },
//       {
//         role: 'user',
//         content: 'Summarize: ' + JSON.stringify(text)
//       },
//       ],
//       temperature: 0.5,
//       max_tokens: 1000,
//     })


//     return NextResponse.json(set);
//   } catch (error) {
//     console.error('Error in POST /api/sets:', error);
//     return NextResponse.json(
//       { error: 'Internal server error' },
//       { status: 500 }
//     );
//   }
// } 