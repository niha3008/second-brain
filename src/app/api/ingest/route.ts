import { GoogleGenAI } from "@google/genai";
import type { BrainItem } from "@/types/brain";

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

const brainItemSchema = {
  type: "object",
  properties: {
    title: {
      type: "string",
      description: "A concise title for the saved content.",
    },
    topic: {
      type: "string",
      description:
        "The main topic or subject of the saved content. Keep it concise.",
    },
    summary: {
      type: "string",
      description:
        "A clear summary explaining the useful information in the saved content.",
    },
    key_concepts: {
      type: "array",
      items: {
        type: "string",
      },
      description: "The most important concepts a learner should remember.",
    },
    resources: {
      type: "array",
      items: {
        type: "object",
        properties: {
          type: {
            type: "string",
            enum: [
              "research_paper",
              "book",
              "article",
              "video",
              "github",
              "course",
              "other",
            ],
          },
          title: {
            type: "string",
          },
          url: {
            type: "string",
          },
        },
        required: ["type", "title", "url"],
      },
    },
    tags: {
      type: "array",
      items: {
        type: "string",
      },
    },
  },
  required: [
    "title",
    "topic",
    "summary",
    "key_concepts",
    "resources",
    "tags",
  ],
};

export async function POST(request: Request) {
  try {
    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        { error: "GEMINI_API_KEY is not configured." },
        { status: 500 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        { error: "No image file was provided." },
        { status: 400 }
      );
    }

    if (!file.type.startsWith("image/")) {
      return Response.json(
        { error: "Only image files are supported." },
        { status: 400 }
      );
    }

    const imageBuffer = await file.arrayBuffer();

    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    const prompt = `
You are the AI engine for Second Brain, an AI-powered personal knowledge system.

Analyze the uploaded screenshot and turn it into a useful structured knowledge item.

Your goals:

1. Identify what the saved content is about.
2. Give it a concise, useful title.
3. Identify the main topic.
4. Summarize the useful information.
5. Extract the most important concepts.
6. Identify learning resources mentioned or visibly referenced in the screenshot.
7. Generate useful tags.

IMPORTANT RESOURCE RULES:

- Only include resources that are actually visible, explicitly mentioned, or clearly referenced in the screenshot.
- NEVER invent a URL.
- If a resource is mentioned but no URL is visible, return an empty string for its URL.
- Do not fabricate books, papers, websites, GitHub repositories, courses, or videos.
- If there are no resources, return an empty resources array.

The output must match the provided JSON schema exactly.
`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash-lite",
      contents: [
        {
          inlineData: {
            mimeType: file.type,
            data: imageBase64,
          },
        },
        prompt,
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: brainItemSchema,
      },
    });

    if (!response.text) {
      return Response.json(
        { error: "Gemini returned an empty response." },
        { status: 502 }
      );
    }

    const brainItem = JSON.parse(response.text) as BrainItem;

    return Response.json(brainItem);
  } catch (error) {
    console.error("Ingest error:", error);

    return Response.json(
      {
        error: "Failed to process the image.",
      },
      { status: 500 }
    );
  }
}