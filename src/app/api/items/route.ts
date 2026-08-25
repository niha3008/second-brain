import type { BrainItem } from "@/types/brain";
import { supabase } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { data, error } = await supabase
      .from("brain_items")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Supabase fetch error:", error);

      return Response.json(
        {
          error: error.message,
        },
        {
          status: 500,
        }
      );
    }

    return Response.json(data ?? [], {
      status: 200,
    });
  } catch (error) {
    console.error("Get items error:", error);

    return Response.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Failed to fetch Brain items.",
      },
      {
        status: 500,
      }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as BrainItem;

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