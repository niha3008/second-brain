import type { BrainItem } from "@/types/brain";
import { createClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json(
        {
          error: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

    const { data, error } = await supabase
      .from("brain_items")
      .select("*")
      .eq("user_id", user.id)
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
    const supabase = await createClient();

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser();

    if (userError || !user) {
      return Response.json(
        {
          error: "You must be logged in.",
        },
        {
          status: 401,
        }
      );
    }

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
        user_id: user.id,
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