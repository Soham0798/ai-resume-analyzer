import type { Route } from "./+types/api.analyze";
import { prepareInstructions, AIResponseFormat } from "../../constants";

export async function action({ request }: Route.ActionArgs) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GEMINI_API_KEY is not set in environment variables" },
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

    // Convert the uploaded file to base64 for Gemini's inline_data
    const arrayBuffer = await resumeFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = resumeFile.type || "application/pdf";

    const prompt = prepareInstructions({
      jobTitle,
      jobDescription,
      AIResponseFormat,
    });

    // Call Gemini API with inline file data
    const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

    const geminiPayload = {
      contents: [
        {
          parts: [
            {
              inline_data: {
                mime_type: mimeType,
                data: base64,
              },
            },
            {
              text: prompt,
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 4096,
      },
    };

    const geminiResponse = await fetch(geminiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(geminiPayload),
    });

    if (!geminiResponse.ok) {
      const errorText = await geminiResponse.text();
      console.error("Gemini API error:", errorText);
      return Response.json(
        { error: `Gemini API error: ${geminiResponse.status}` },
        { status: 502 }
      );
    }

    const geminiData = await geminiResponse.json();
    const text =
      geminiData?.candidates?.[0]?.content?.parts?.[0]?.text || null;

    if (!text) {
      console.error("Unexpected Gemini response:", JSON.stringify(geminiData));
      return Response.json(
        { error: "Gemini returned an empty response" },
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
