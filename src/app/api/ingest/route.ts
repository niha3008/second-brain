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
      description:
        "The most important concepts a learner should remember.",
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
    // ─────────────────────────────────────────────
    // CHECK GEMINI API KEY
    // ─────────────────────────────────────────────

    if (!process.env.GEMINI_API_KEY) {
      return Response.json(
        {
          error: "GEMINI_API_KEY is not configured.",
        },
        {
          status: 500,
        }
      );
    }

    // ─────────────────────────────────────────────
    // READ UPLOADED FILE
    // ─────────────────────────────────────────────

    const formData = await request.formData();

    const file = formData.get("file");

    if (!(file instanceof File)) {
      return Response.json(
        {
          error: "No image file was provided.",
        },
        {
          status: 400,
        }
      );
    }

    // ─────────────────────────────────────────────
    // VALIDATE IMAGE
    // ─────────────────────────────────────────────

    if (!file.type.startsWith("image/")) {
      return Response.json(
        {
          error: "Only image files are supported.",
        },
        {
          status: 400,
        }
      );
    }

    // ─────────────────────────────────────────────
    // CONVERT IMAGE TO BASE64
    // ─────────────────────────────────────────────

    const imageBuffer = await file.arrayBuffer();

    const imageBase64 = Buffer.from(imageBuffer).toString("base64");

    // ─────────────────────────────────────────────
    // GEMINI PROMPT
    // ─────────────────────────────────────────────

    const prompt = `
You are the AI engine for Second Brain, an AI-powered personal knowledge system.

Analyze the uploaded screenshot and turn it into a useful structured knowledge item.

Your goals:

1. Identify what the saved content is about.
2. Give it a concise and useful title.
3. Identify the main topic.
4. Write a clear summary of the useful information.
5. Extract the most important concepts a learner should remember.
6. Identify learning resources mentioned or visibly referenced in the screenshot.
7. Generate useful tags.

RESOURCE RULES:

- Only include resources that are actually visible, explicitly mentioned, or clearly referenced in the screenshot.
- NEVER invent a URL.
- If a resource is mentioned but no URL is visible, return an empty string for its URL.
- Do not fabricate books, research papers, websites, GitHub repositories, courses, or videos.
- If there are no resources, return an empty resources array.

IMPORTANT:

- Preserve the meaning of the original content.
- Do not make claims that are not supported by the screenshot.
- Keep the summary concise but useful for a college student.
- Return valid structured JSON matching the provided schema.
`;

    // ─────────────────────────────────────────────
    // SEND IMAGE TO GEMINI
    // ─────────────────────────────────────────────

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

    // ─────────────────────────────────────────────
    // CHECK GEMINI RESPONSE
    // ─────────────────────────────────────────────

    if (!response.text) {
      return Response.json(
        {
          error: "Gemini returned an empty response.",
        },
        {
          status: 502,
        }
      );
    }

    // ─────────────────────────────────────────────
    // PARSE GEMINI JSON
    // ─────────────────────────────────────────────

    const brainItem = JSON.parse(response.text) as BrainItem;

    return Response.json(brainItem);
  } catch (error) {
    console.error("Ingest error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to process the image.",
      },
      {
        status: 500,
      }
    );
  }
}