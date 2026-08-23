"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import Sidebar from "@/components/layout/sidebar";

type Topic = {
  id: string;
  name: string;
  description: string;
  saves: number;
  concepts: number;
  resources: number;
  icon: string;
};

const topics: Topic[] = [
  {
    id: "ai-machine-learning",
    name: "AI & Machine Learning",
    description:
      "Neural networks, LLMs, transformers, deep learning and AI research.",
    saves: 8,
    concepts: 42,
    resources: 12,
    icon: "✦",
  },
  {
    id: "web-development",
    name: "Web Development",
    description:
      "React, Next.js, APIs, frontend architecture and modern web development.",
    saves: 12,
    concepts: 31,
    resources: 8,
    icon: "◈",
  },
  {
    id: "computer-science",
    name: "Computer Science",
    description:
      "Algorithms, databases, system design, operating systems and architecture.",
    saves: 9,
    concepts: 27,
    resources: 15,
    icon: "⌘",
  },
  {
    id: "finance",
    name: "Finance",
    description:
      "Fintech, financial markets, investing and financial technology.",
    saves: 5,
    concepts: 14,
    resources: 7,
    icon: "◫",
  },
  {
    id: "programming",
    name: "Programming",
    description:
      "Python, software engineering, design patterns and programming concepts.",
    saves: 7,
    concepts: 24,
    resources: 9,
    icon: "</>",
  },
  {
    id: "productivity",
    name: "Productivity",
    description:
      "Learning systems, workflows, note-taking and personal productivity.",
    saves: 4,
    concepts: 11,
    resources: 6,
    icon: "↗",
  },
];

export default function TopicsPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredTopics = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();

    if (!query) {
      return topics;
    }

    return topics.filter(
      (topic) =>
        topic.name.toLowerCase().includes(query) ||
        topic.description.toLowerCase().includes(query)
    );
  }, [searchQuery]);

  return (
    <main className="min-h-screen bg-[#120c0d] text-white">
      <div className="flex min-h-screen">
        <Sidebar active="topics" />

        <div className="flex-1">
          {/* Header */}
          <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-10">
            <div>
              <p className="text-sm text-white/35">
                Your knowledge map
              </p>

              <h1 className="mt-1 text-xl font-semibold">
                Topics
              </h1>
            </div>

            <Link
              href="/"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              + Add to Brain
            </Link>
          </header>

          <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
            {/* Hero */}
            <section>
              <p className="text-sm text-white/40">
                {topics.length} areas of knowledge
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Explore what you know.
              </h2>

              <p className="mt-3 max-w-2xl text-white/45">
                Every save is automatically organized into topics, so you can
                see how your knowledge grows over time.
              </p>
            </section>

            {/* Search */}
            <section className="mt-10">
              <div className="relative max-w-2xl">
                <span className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-white/30">
                  🔍
                </span>

                <input
                  type="text"
                  value={searchQuery}
                  onChange={(event) =>
                    setSearchQuery(event.target.value)
                  }
                  placeholder="Search your topics..."
                  className="w-full rounded-2xl border border-white/10 bg-white/5 py-4 pl-12 pr-5 text-sm text-white outline-none placeholder:text-white/25 transition focus:border-white/20 focus:bg-white/[0.07]"
                />
              </div>
            </section>

            {/* Stats */}
            <section className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard
                value="18"
                label="Topics"
                description="Areas you've explored"
              />

              <StatCard
                value="34"
                label="Saves"
                description="Across all topics"
              />

              <StatCard
                value="149"
                label="Concepts"
                description="Ideas you've discovered"
              />
            </section>

            {/* Topic grid */}
            <section className="mt-12 pb-12">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/30">
                    Knowledge map
                  </p>

                  <h3 className="mt-2 text-xl font-semibold">
                    Your topics
                  </h3>
                </div>

                <span className="rounded-full bg-white/5 px-3 py-1.5 text-xs text-white/35">
                  {filteredTopics.length}{" "}
                  {filteredTopics.length === 1
                    ? "topic"
                    : "topics"}
                </span>
              </div>

              {filteredTopics.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {filteredTopics.map((topic) => (
                    <TopicCard
                      key={topic.id}
                      topic={topic}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  searchQuery={searchQuery}
                  onClear={() => setSearchQuery("")}
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
   Topic Card
───────────────────────────────────────────── */

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <Link
      href={`/topics/${topic.id}`}
      className="group rounded-3xl border border-white/10 bg-white/5 p-6 transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sm text-white/60">
          {topic.icon}
        </div>

        <span className="text-white/20 transition group-hover:text-white/60">
          →
        </span>
      </div>

      <h4 className="mt-6 text-base font-medium text-white/80 transition group-hover:text-white">
        {topic.name}
      </h4>

      <p className="mt-2 text-sm leading-6 text-white/35">
        {topic.description}
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
        <TopicStat
          value={topic.saves}
          label="Saves"
        />

        <TopicStat
          value={topic.concepts}
          label="Concepts"
        />

        <TopicStat
          value={topic.resources}
          label="Resources"
        />
      </div>
    </Link>
  );
}

/* ─────────────────────────────────────────────
   Topic Stat
───────────────────────────────────────────── */

function TopicStat({
  value,
  label,
}: {
  value: number;
  label: string;
}) {
  return (
    <div>
      <p className="text-sm font-medium text-white/65">
        {value}
      </p>

      <p className="mt-1 text-[11px] text-white/25">
        {label}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Stats
───────────────────────────────────────────── */

function StatCard({
  value,
  label,
  description,
}: {
  value: string;
  label: string;
  description: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-5">
      <p className="text-3xl font-semibold">
        {value}
      </p>

      <p className="mt-2 text-sm font-medium text-white/75">
        {label}
      </p>

      <p className="mt-1 text-xs text-white/35">
        {description}
      </p>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Empty State
───────────────────────────────────────────── */

function EmptyState({
  searchQuery,
  onClear,
}: {
  searchQuery: string;
  onClear: () => void;
}) {
  return (
    <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center">
      <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
        🔍
      </div>

      <h3 className="mt-5 font-medium">
        No topics found
      </h3>

      <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
        Nothing matched &quot;{searchQuery}&quot;.
      </p>

      <button
        type="button"
        onClick={onClear}
        className="mt-5 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
      >
        Clear search
      </button>
    </div>
  );
}