// app/api/generate-tasks/route.ts
import { NextResponse } from "next/server";
import { Groq } from "groq-sdk";

// Initialize Groq client
const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: Request) {
  try {
    const { text, projectId } = await req.json();

    if (!text) {
      return NextResponse.json({ error: "Text input is required" }, { status: 400 });
    }

    // Prompt engineering for the LLM
    const prompt = `
Given the following project description, generate a list of specific, actionable tasks.
Each task should have:
1. A clear, concise title (max 80 characters)
2. A detailed description explaining what needs to be done
3. Relevant tags (1-3 tags)

Do NOT include due dates or time estimates.
Format your response as a JSON array of task objects with properties: title, description, and tags (array of strings).

Project description: "${text}"
    `;

    // Call Groq API (or another LLM of your choice)
    const completion = await groq.chat.completions.create({
      model: "llama3-70b-8192", // or another suitable model
      messages: [
        {
          role: "user",
          content: prompt,
        },
      ],
      temperature: 0.7,
      max_tokens: 4000,
      response_format: { type: "json_object" },
    });

    // Parse the response
    const responseContent = completion.choices[0].message.content;
    let parsedResponse;

    try {
      if (responseContent) {
        parsedResponse = JSON.parse(responseContent);
      }

      // Ensure the response has the expected format
      if (!Array.isArray(parsedResponse.tasks)) {
        throw new Error("Invalid response format");
      }
    } catch (error) {
      console.error("Failed to parse LLM response:", error);
      return NextResponse.json({ error: "Failed to generate valid tasks" }, { status: 500 });
    }

    return NextResponse.json({ tasks: parsedResponse.tasks });
  } catch (error: any) {
    console.error("Error in generate-tasks API:", error);

    return NextResponse.json(
      { error: error.message || "Failed to generate tasks" },
      { status: 500 }
    );
  }
}
