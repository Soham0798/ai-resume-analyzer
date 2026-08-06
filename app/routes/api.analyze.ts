import type { Route } from "./+types/api.analyze";
import { prepareInstructions, AIResponseFormat } from "../../constants";

export async function action({ request }: Route.ActionArgs) {
  const apiKey = process.env.GROQ_API_KEY;
  if (!apiKey) {
    return Response.json(
      { error: "GROQ_API_KEY is not set in environment variables" },
      { status: 500 }
    );
  }

  try {
    const formData = await request.formData();
    const resumeText = (formData.get("resumeText") as string) || "";
    const jobTitle = (formData.get("jobTitle") as string) || "";
    const jobDescription = (formData.get("jobDescription") as string) || "";

    if (!resumeText.trim()) {
      return Response.json(
        { error: "No resume text provided" },
        { status: 400 }
      );
    }

    const prompt = prepareInstructions({
      jobTitle,
      jobDescription,
      AIResponseFormat,
    });

    // Call Groq API (OpenAI-compatible)
    const groqUrl = "https://api.groq.com/openai/v1/chat/completions";

    const groqPayload = {
      model: "llama-3.3-70b-versatile",
      messages: [
        {
          role: "user",
          content: `Here is the resume text:\n\n---\n${resumeText}\n---\n\n${prompt}`,
        },
      ],
      temperature: 0.4,
      max_tokens: 4096,
    };

    const groqResponse = await fetch(groqUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify(groqPayload),
    });

    if (!groqResponse.ok) {
      const errorText = await groqResponse.text();

      return Response.json(
        { error: `Groq API error: ${groqResponse.status}` },
        { status: 502 }
      );
    }

    const groqData = await groqResponse.json();
    const text = groqData?.choices?.[0]?.message?.content || null;

    if (!text) {

      return Response.json(
        { error: "Groq returned an empty response" },
        { status: 502 }
      );
    }

    return Response.json({ content: text });
  } catch (err) {

    return Response.json(
      {
        error:
          err instanceof Error ? err.message : "Internal server error",
      },
      { status: 500 }
    );
  }
}
