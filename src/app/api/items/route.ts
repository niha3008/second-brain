import type { BrainItem } from "@/types/brain";
import { supabase } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    // Read the BrainItem sent by the frontend
    const body = (await request.json()) as BrainItem;

    // Basic validation
    if (!body.title || !body.topic || !body.summary) {
      return Response.json(
        {
          error: "Invalid BrainItem data.",
        },
        {
          status: 400,
        }
      );
    }

    // Save the BrainItem to Supabase
    const { data, error } = await supabase
      .from("brain_items")
      .insert({
        title: body.title,
        topic: body.topic,
        summary: body.summary,
        key_concepts: body.key_concepts ?? [],
        resources: body.resources ?? [],
        tags: body.tags ?? [],
      })
      .select()
      .single();

    // Supabase returned an error
    if (error) {
      console.error("Supabase insert error:", error);

      return Response.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    // Successfully saved
    return Response.json(data, {
      status: 201,
    });
  } catch (error) {
    console.error("Save item error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Invalid request.",
      },
      {
        status: 400,
      }
    );
  }
}