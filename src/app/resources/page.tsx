"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import Sidebar from "@/components/layout/sidebar";

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
  resources: BrainResource[];
  created_at?: string;
};

type Resource = {
  id: string;
  title: string;
  type: string;
  topic: string;
  source: string;
  url: string;
};

const filters = [
  "All",
  "Research Paper",
  "Book",
  "Article",
  "Video",
  "GitHub",
  "Course",
];

export default function ResourcesPage() {
  const [items, setItems] = useState<BrainItem[]>([]);
  const [activeFilter, setActiveFilter] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchItems() {
      try {
        setLoading(true);
        setError(null);

        const response = await fetch("/api/items");

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Failed to load Brain items."
          );
        }

        setItems(data);
      } catch (error) {
        console.error("Resources fetch error:", error);

        setError(
          error instanceof Error
            ? error.message
            : "Failed to load your resources."
        );
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  const resources = useMemo<Resource[]>(() => {
    const result: Resource[] = [];

    for (const item of items) {
      for (const resource of item.resources ?? []) {
        result.push({
          id: `${item.id}-${resource.title}-${result.length}`,
          title: resource.title,
          type: formatResourceType(resource.type),
          topic: item.topic,
          source: item.title,
          url: resource.url,
        });
      }
    }

    return result;
  }, [items]);

  const filteredResources = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return resources.filter((resource) => {
      const matchesFilter =
        activeFilter === "All" ||
        resource.type === activeFilter;

      const matchesSearch =
        query.length === 0 ||
        resource.title.toLowerCase().includes(query) ||
        resource.topic.toLowerCase().includes(query) ||
        resource.source.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery, resources]);

  if (loading) {
    return (
      <main className="min-h-screen bg-[#120c0d] text-white">
        <div className="flex min-h-screen">
          <Sidebar active="resources" />

          <div className="flex flex-1 items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 animate-pulse items-center justify-center rounded-2xl bg-white/10 text-xl">
                🧠
              </div>

              <p className="mt-4 text-sm text-white/40">
                Loading your resources...
              </p>
            </div>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#120c0d] text-white">
      <div className="flex min-h-screen">
        <Sidebar active="resources" />

        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-10">
            <div>
              <p className="text-sm text-white/35">
                Your knowledge library
              </p>

              <h1 className="mt-1 text-xl font-semibold">
                Resources
              </h1>
            </div>

            <Link
              href="/add"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              + Add to Brain
            </Link>
          </header>

          <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
            <section>
              <p className="text-sm text-white/40">
                {resources.length}{" "}
                {resources.length === 1
                  ? "resource"
                  : "resources"}{" "}
                discovered
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything worth coming back to.
              </h2>

              <p className="mt-3 max-w-2xl text-white/45">
                Second Brain collects useful resources hidden inside the
                things you save.
              </p>
            </section>

            {error && (
              <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-sm text-red-200">
                {error}
              </div>
            )}

            <section className="mt-10">
              <div className="relative">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  🔍
                </span>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search resources, topics or saves..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-5 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/20 focus:bg-white/[0.07]"
                />
              </div>
            </section>

            <section className="mt-5 overflow-x-auto">
              <div className="flex min-w-max gap-2">
                {filters.map((filter) => {
                  const active = activeFilter === filter;

                  return (
                    <button
                      key={filter}
                      type="button"
                      onClick={() => setActiveFilter(filter)}
                      className={`rounded-full px-4 py-2 text-sm transition ${
                        active
                          ? "bg-white text-black"
                          : "border border-white/10 bg-white/5 text-white/45 hover:bg-white/10 hover:text-white"
                      }`}
                    >
                      {filter}
                    </button>
                  );
                })}
              </div>
            </section>

            <div className="mt-10 flex items-center justify-between">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/30">
                  Library
                </p>

                <h3 className="mt-1 text-lg font-semibold">
                  {activeFilter === "All"
                    ? "All resources"
                    : activeFilter}
                </h3>
              </div>

              <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/35">
                {filteredResources.length}{" "}
                {filteredResources.length === 1
                  ? "resource"
                  : "resources"}
              </span>
            </div>

            <section className="mt-5 space-y-3 pb-12">
              {filteredResources.length > 0 ? (
                filteredResources.map((resource) => (
                  <ResourceRow
                    key={resource.id}
                    resource={resource}
                  />
                ))
              ) : (
                <EmptyState
                  searchQuery={searchQuery}
                  onClear={() => {
                    setSearchQuery("");
                    setActiveFilter("All");
                  }}
                />
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function ResourceRow({
  resource,
}: {
  resource: Resource;
}) {
  const hasUrl = resource.url.trim().length > 0;

  const content = (
    <div className="flex items-start gap-4">
      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
        {getResourceIcon(resource.type)}
      </div>

      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/35">
            {resource.type}
          </span>

          <span className="text-white/15">•</span>

          <span className="text-xs text-white/35">
            {resource.topic}
          </span>
        </div>

        <h4 className="mt-2 text-sm font-medium text-white/80 transition group-hover:text-white sm:text-base">
          {resource.title}
        </h4>

        <div className="mt-4 flex flex-wrap items-center gap-2">
          <span className="text-xs text-white/25">
            Found in
          </span>

          <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/45">
            {resource.source}
          </span>
        </div>
      </div>

      <div className="hidden shrink-0 items-center gap-2 text-sm text-white/25 transition group-hover:text-white/70 sm:flex">
        {hasUrl ? "Open" : "No link"}
        {hasUrl && <span>↗</span>}
      </div>
    </div>
  );

  if (!hasUrl) {
    return (
      <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
        {content}
      </div>
    );
  }

  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      {content}
    </a>
  );
}

function formatResourceType(type: string) {
  switch (type) {
    case "research_paper":
      return "Research Paper";

    case "github":
      return "GitHub";

    case "course":
      return "Course";

    case "book":
      return "Book";

    case "article":
      return "Article";

    case "video":
      return "Video";

    default:
      return "Other";
  }
}

function getResourceIcon(type: string) {
  switch (type) {
    case "Research Paper":
      return "📄";

    case "Book":
      return "📚";

    case "Article":
      return "🔗";

    case "Video":
      return "🎥";

    case "GitHub":
      return "💻";

    case "Course":
      return "🎓";

    default:
      return "🔖";
  }
}

function EmptyState({
  searchQuery,
  onClear,
}: {
  searchQuery: string;
  onClear: () => void;
}) {
  return (
    <div className="rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10 text-xl">
        🔍
      </div>

      <h3 className="mt-5 font-medium">
        No resources found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
        {searchQuery
          ? `Nothing matched "${searchQuery}". Try a different search term.`
          : "There aren't any resources in your saved content yet."}
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
      >
        Clear filters
      </button>
    </div>
  );
}