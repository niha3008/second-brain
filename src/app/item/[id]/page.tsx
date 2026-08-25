import Link from "next/link";
import { supabase } from "@/lib/supabase/server";

type BrainResource = {
  type: string;
  title: string;
  url: string;
};

type BrainItem = {
  id: string;
  title: string;
  topic: string;
  summary: string;
  key_concepts: string[];
  resources: BrainResource[];
  tags: string[];
  created_at: string;
};

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

async function getBrainItem(id: string): Promise<BrainItem | null> {
  const { data, error } = await supabase
    .from("brain_items")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Supabase item fetch error:", error);
    return null;
  }

  return data as BrainItem;
}

export default async function SavedItemPage({ params }: PageProps) {
  const { id } = await params;

  const item = await getBrainItem(id);

  if (!item) {
    return (
      <main className="min-h-screen bg-[#120c0d] text-white">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col items-center justify-center px-6 text-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl">
            🧠
          </div>

          <h1 className="mt-6 text-2xl font-semibold">
            Brain item not found
          </h1>

          <p className="mt-3 max-w-md text-sm leading-6 text-white/40">
            We couldn&apos;t find the saved item you&apos;re looking for. It
            may have been removed or the link may be invalid.
          </p>

          <Link
            href="/dashboard"
            className="mt-8 rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            Back to Brain
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#120c0d] text-white">
      <div className="mx-auto w-full max-w-6xl px-6 py-8 sm:px-10">
        {/* Header */}
        <header className="flex items-center justify-between border-b border-white/10 pb-6">
          <Link
            href="/dashboard"
            className="flex items-center gap-3 text-white/60 transition hover:text-white"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
              🧠
            </div>

            <span className="text-lg font-semibold text-white">
              Second Brain
            </span>
          </Link>

          <Link
            href="/add"
            className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
          >
            + Add to Brain
          </Link>
        </header>

        {/* Breadcrumb */}
        <div className="mt-8">
          <Link
            href="/dashboard"
            className="text-sm text-white/35 transition hover:text-white/70"
          >
            ← Back to Brain
          </Link>
        </div>

        {/* Main content */}
        <section className="mx-auto mt-10 max-w-4xl">
          {/* Header */}
          <div>
            <p className="text-sm text-white/40">
              Saved knowledge
            </p>

            <h1 className="mt-2 text-4xl font-semibold tracking-tight sm:text-5xl">
              {item.title}
            </h1>

            <div className="mt-4 flex flex-wrap items-center gap-2">
              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/50">
                {item.topic}
              </span>

              <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-sm text-white/35">
                Saved {new Date(item.created_at).toLocaleDateString()}
              </span>
            </div>
          </div>

          {/* Summary */}
          <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-white/35">
              Summary
            </p>

            <p className="mt-5 text-base leading-8 text-white/70">
              {item.summary}
            </p>
          </section>

          {/* Key concepts */}
          <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-white/35">
              Key concepts
            </p>

            {item.key_concepts?.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {item.key_concepts.map((concept) => (
                  <span
                    key={concept}
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/65"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-white/35">
                No key concepts were identified.
              </p>
            )}
          </section>

          {/* Resources */}
          <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/35">
                  Resources
                </p>

                <p className="mt-2 text-sm text-white/35">
                  Useful resources discovered from this save.
                </p>
              </div>

              <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/40">
                {item.resources?.length ?? 0} found
              </span>
            </div>

            {item.resources?.length > 0 ? (
              <div className="mt-5 space-y-3">
                {item.resources.map((resource, index) => (
                  <ResourceCard
                    key={`${resource.title}-${index}`}
                    resource={resource}
                  />
                ))}
              </div>
            ) : (
              <p className="mt-5 rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/35">
                No resources were found in this save.
              </p>
            )}
          </section>

          {/* Tags */}
          <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
            <p className="text-xs font-medium uppercase tracking-wider text-white/35">
              Tags
            </p>

            {item.tags?.length > 0 ? (
              <div className="mt-5 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full bg-white/10 px-3 py-2 text-sm text-white/55"
                  >
                    #{tag.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            ) : (
              <p className="mt-5 text-sm text-white/35">
                No tags were generated.
              </p>
            )}
          </section>

          {/* Bottom navigation */}
          <div className="mt-8 flex flex-col gap-3 pb-12 sm:flex-row sm:justify-between">
            <Link
              href="/dashboard"
              className="rounded-2xl border border-white/10 bg-white/5 px-5 py-3 text-center text-sm text-white/55 transition hover:bg-white/10 hover:text-white"
            >
              ← Back to Brain
            </Link>

            <Link
              href="/add"
              className="rounded-2xl bg-white px-5 py-3 text-center text-sm font-medium text-black transition hover:bg-white/90"
            >
              + Add another save
            </Link>
          </div>
        </section>
      </div>
    </main>
  );
}

function ResourceCard({
  resource,
}: {
  resource: BrainResource;
}) {
  const resourceType = resource.type.replaceAll("_", " ");

  if (!resource.url) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4">
        <div className="min-w-0">
          <p className="text-xs capitalize text-white/35">
            {resourceType}
          </p>

          <p className="mt-1 text-sm text-white/75">
            {resource.title}
          </p>
        </div>

        <span className="ml-4 shrink-0 text-xs text-white/25">
          No link found
        </span>
      </div>
    );
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-white/20 hover:bg-white/5"
    >
      <div className="min-w-0">
        <p className="text-xs capitalize text-white/35">
          {resourceType}
        </p>

        <p className="mt-1 truncate text-sm text-white/75">
          {resource.title}
        </p>
      </div>

      <span className="ml-4 shrink-0 text-white/30">
        ↗
      </span>
    </a>
  );
}