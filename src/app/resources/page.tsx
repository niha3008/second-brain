"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

type ResourceType =
  | "Research Paper"
  | "Book"
  | "Article"
  | "Video"
  | "GitHub"
  | "Course";

type Resource = {
  id: string;
  title: string;
  type: ResourceType;
  topic: string;
  source: string;
  url: string;
  description: string;
};

const resources: Resource[] = [
  {
    id: "attention-is-all-you-need",
    title: "Attention Is All You Need",
    type: "Research Paper",
    topic: "AI & Machine Learning",
    source: "Neural Networks",
    url: "https://example.com/attention",
    description:
      "The foundational research paper introducing the Transformer architecture and self-attention.",
  },
  {
    id: "deep-learning-goodfellow",
    title: "Deep Learning",
    type: "Book",
    topic: "AI & Machine Learning",
    source: "Neural Networks",
    url: "https://example.com/deep-learning",
    description:
      "A comprehensive introduction to deep learning, neural networks and modern machine learning.",
  },
  {
    id: "neural-networks-explained",
    title: "Neural Networks Explained",
    type: "Article",
    topic: "AI & Machine Learning",
    source: "Neural Networks",
    url: "https://example.com/neural-networks",
    description:
      "A beginner-friendly explanation of how neural networks learn patterns from data.",
  },
  {
    id: "backpropagation-guide",
    title: "Backpropagation Explained",
    type: "Video",
    topic: "AI & Machine Learning",
    source: "Neural Networks",
    url: "https://example.com/backpropagation",
    description:
      "A visual walkthrough of backpropagation and how neural networks update their weights.",
  },
  {
    id: "awesome-machine-learning",
    title: "Awesome Machine Learning",
    type: "GitHub",
    topic: "AI & Machine Learning",
    source: "Machine Learning Resources",
    url: "https://github.com/",
    description:
      "A curated collection of machine learning frameworks, libraries, courses and resources.",
  },
  {
    id: "react-documentation",
    title: "React Documentation",
    type: "Article",
    topic: "Web Development",
    source: "React Hooks",
    url: "https://react.dev/",
    description:
      "Official documentation covering React fundamentals, hooks and modern React development.",
  },
  {
    id: "designing-data-intensive",
    title: "Designing Data-Intensive Applications",
    type: "Book",
    topic: "Computer Science",
    source: "System Design Basics",
    url: "https://example.com/data-intensive",
    description:
      "A guide to building reliable, scalable and maintainable data systems.",
  },
  {
    id: "system-design-primer",
    title: "System Design Primer",
    type: "GitHub",
    topic: "Computer Science",
    source: "System Design Basics",
    url: "https://github.com/",
    description:
      "A collection of system design concepts and interview preparation material.",
  },
  {
    id: "fintech-landscape",
    title: "Modern Fintech Landscape",
    type: "Article",
    topic: "Finance",
    source: "Fintech Trends 2026",
    url: "https://example.com/fintech",
    description:
      "An overview of emerging technologies and trends shaping financial services.",
  },
  {
    id: "python-patterns",
    title: "Python Design Patterns",
    type: "Course",
    topic: "Programming",
    source: "Python Design Patterns",
    url: "https://example.com/python",
    description:
      "A practical introduction to reusable software design patterns in Python.",
  },
];

const filters: Array<"All" | ResourceType> = [
  "All",
  "Research Paper",
  "Book",
  "Article",
  "Video",
  "GitHub",
  "Course",
];

export default function ResourcesPage() {
  const [activeFilter, setActiveFilter] =
    useState<"All" | ResourceType>("All");

  const [searchQuery, setSearchQuery] = useState("");

  const filteredResources = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    return resources.filter((resource) => {
      const matchesFilter =
        activeFilter === "All" || resource.type === activeFilter;

      const matchesSearch =
        query.length === 0 ||
        resource.title.toLowerCase().includes(query) ||
        resource.topic.toLowerCase().includes(query) ||
        resource.source.toLowerCase().includes(query) ||
        resource.description.toLowerCase().includes(query);

      return matchesFilter && matchesSearch;
    });
  }, [activeFilter, searchQuery]);

  const resourceCount = filteredResources.length;

  return (
    <main className="min-h-screen bg-[#120c0d] text-white">
      <div className="flex min-h-screen">
        {/* Sidebar */}
        <aside className="hidden w-64 shrink-0 border-r border-white/10 bg-black/10 px-5 py-6 lg:flex lg:flex-col">
          <Link href="/" className="flex items-center gap-3 px-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
              🧠
            </div>

            <span className="text-lg font-semibold tracking-tight">
              Second Brain
            </span>
          </Link>

          <nav className="mt-10 space-y-2">
            <SidebarLink
              href="/dashboard"
              icon="🏠"
              label="Brain"
            />

            <SidebarLink
              href="/dashboard"
              icon="📚"
              label="Topics"
            />

            <SidebarLink
              href="/dashboard"
              icon="🔖"
              label="Saves"
            />

            <SidebarLink
              href="/resources"
              icon="📖"
              label="Resources"
              active
            />
          </nav>

          <div className="mt-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium">
                Your Resource Library
              </p>

              <p className="mt-1 text-xs leading-5 text-white/40">
                Resources discovered across everything you&apos;ve saved.
              </p>

              <div className="mt-4 grid grid-cols-2 gap-2">
                <MiniStat
                  value="12"
                  label="Papers"
                />

                <MiniStat
                  value="7"
                  label="Books"
                />
              </div>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          {/* Header */}
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
              href="/"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              + Add to Brain
            </Link>
          </header>

          <div className="mx-auto max-w-5xl px-6 py-10 sm:px-10">
            {/* Hero */}
            <section>
              <p className="text-sm text-white/40">
                {resources.length} resources discovered
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Everything worth coming back to.
              </h2>

              <p className="mt-3 max-w-2xl text-white/45">
                Second Brain collects the useful papers, books, articles,
                videos and other resources hidden inside the things you save.
              </p>
            </section>

            {/* Search */}
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

            {/* Filters */}
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

            {/* Result count */}
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
                {resourceCount}{" "}
                {resourceCount === 1 ? "resource" : "resources"}
              </span>
            </div>

            {/* Resource list */}
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

/* ─────────────────────────────────────────────
   Resource row
───────────────────────────────────────────── */

function ResourceRow({
  resource,
}: {
  resource: Resource;
}) {
  return (
    <a
      href={resource.url}
      target="_blank"
      rel="noopener noreferrer"
      className="group block rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-start gap-4">
        {/* Icon */}
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white/10 text-xl">
          {getResourceIcon(resource.type)}
        </div>

        {/* Content */}
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

          <p className="mt-2 max-w-3xl text-xs leading-5 text-white/35 sm:text-sm">
            {resource.description}
          </p>

          {/* Source */}
          <div className="mt-4 flex flex-wrap items-center gap-2">
            <span className="text-xs text-white/25">
              Found in
            </span>

            <span className="rounded-full bg-white/5 px-2.5 py-1 text-xs text-white/45">
              {resource.source}
            </span>
          </div>
        </div>

        {/* Open */}
        <div className="hidden shrink-0 items-center gap-2 text-sm text-white/25 transition group-hover:text-white/70 sm:flex">
          Open
          <span>↗</span>
        </div>
      </div>
    </a>
  );
}

/* ─────────────────────────────────────────────
   Sidebar
───────────────────────────────────────────── */

function SidebarLink({
  href,
  icon,
  label,
  active = false,
}: {
  href: string;
  icon: string;
  label: string;
  active?: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-white/10 text-white"
          : "text-white/40 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span>{icon}</span>

      <span>{label}</span>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Mini stat
───────────────────────────────────────────── */

function MiniStat({
  value,
  label,
}: {
  value: string;
  label: string;
}) {
  return (
    <div className="rounded-xl bg-white/5 p-3">
      <p className="text-lg font-semibold">
        {value}
      </p>

      <p className="mt-1 text-[10px] text-white/30">
        {label}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Empty state
───────────────────────────────────────────── */

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
          : "There aren't any resources in this category yet."}
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

/* ─────────────────────────────────────────────
   Helpers
───────────────────────────────────────────── */

function getResourceIcon(type: ResourceType) {
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