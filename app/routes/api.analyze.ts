import type { Route } from "./+types/api.analyze";
import { prepareInstructions, AIResponseFormat } from "../../constants";

export async function action({ request }: Route.ActionArgs) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "OPENAI_API_KEY is not set in environment variables" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const resumeFile = formData.get("resume") as File | null;
    const jobTitle = (formData.get("jobTitle") as string) || "";
    const jobDescription = (formData.get("jobDescription") as string) || "";

    if (!resumeFile) {
      return Response.json(
        { error: "No resume file provided" },
        { status: 400 }
      );
    }

    // Convert the uploaded file to base64
    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = resumeFile.type || "application/pdf";

    const prompt = prepareInstructions({
      jobTitle,
      jobDescription,
      AIResponseFormat,
    });

    // Call OpenAI Chat Completions API with file input
    const openaiUrl = "https://api.openai.com/v1/chat/completions";

    const openaiPayload = {
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "file",
              file: {
                filename: resumeFile.name || "resume.pdf",
                file_data: `data:${mimeType};base64,${base64}`,
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      temperature: 0.4,
      max_tokens: 4096,
    };

    const openaiResponse = await fetch(openaiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(openaiPayload),
    });

    if (!openaiResponse.ok) {
      const errorText = await openaiResponse.text();
      console.error("OpenAI API error:", errorText);
      return Response.json(
        { error: `OpenAI API error: ${openaiResponse.status}` },
        { status: 502 }
      );
    }

    const openaiData = await openaiResponse.json();
    const text = openaiData?.choices?.[0]?.message?.content || null;

    if (!text) {
      console.error("Unexpected OpenAI response:", JSON.stringify(openaiData));
      return Response.json(
        { error: "OpenAI returned an empty response" },
        { status: 502 }
      );
    }

    return Response.json({ content: text });
  } catch (err) {
    console.error("Analyze API error:", err);
    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
