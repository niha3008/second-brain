"use client";

import Link from "next/link";
import { useState } from "react";

type SavedItem = {
  id: string;
  title: string;
  topic: string;
  type: "Screenshot" | "Article" | "Video" | "Text";
  concepts: number;
};

type Topic = {
  name: string;
  count: number;
  description: string;
};

type ResourceCategory = {
  label: string;
  count: number;
  icon: string;
};

const recentItems: SavedItem[] = [
  {
    id: "neural-networks",
    title: "Neural Networks",
    topic: "AI & Machine Learning",
    type: "Screenshot",
    concepts: 5,
  },
  {
    id: "react-hooks",
    title: "React Hooks",
    topic: "Web Development",
    type: "Article",
    concepts: 7,
  },
  {
    id: "system-design",
    title: "System Design Basics",
    topic: "Computer Science",
    type: "Video",
    concepts: 4,
  },
  {
    id: "fintech-trends",
    title: "Fintech Trends 2026",
    topic: "Finance",
    type: "Screenshot",
    concepts: 6,
  },
  {
    id: "python-patterns",
    title: "Python Design Patterns",
    topic: "Programming",
    type: "Article",
    concepts: 8,
  },
  {
    id: "database-indexing",
    title: "Database Indexing",
    topic: "Computer Science",
    type: "Text",
    concepts: 5,
  },
];

const topics: Topic[] = [
  {
    name: "AI & Machine Learning",
    count: 8,
    description: "Models, neural networks, LLMs and AI research",
  },
  {
    name: "Web Development",
    count: 12,
    description: "React, Next.js, APIs and frontend development",
  },
  {
    name: "Computer Science",
    count: 9,
    description: "Algorithms, systems, databases and architecture",
  },
  {
    name: "Finance",
    count: 5,
    description: "Fintech, markets, investing and financial systems",
  },
];

const resourceCategories: ResourceCategory[] = [
  {
    label: "Research Papers",
    count: 12,
    icon: "📄",
  },
  {
    label: "Books",
    count: 7,
    icon: "📚",
  },
  {
    label: "Articles",
    count: 18,
    icon: "🔗",
  },
  {
    label: "GitHub",
    count: 5,
    icon: "💻",
  },
];

export default function DashboardPage() {
  const [activeNav, setActiveNav] = useState("Brain");

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
            <NavItem
              icon="🏠"
              label="Brain"
              active={activeNav === "Brain"}
              onClick={() => setActiveNav("Brain")}
            />

            <NavItem
              icon="📚"
              label="Topics"
              active={activeNav === "Topics"}
              onClick={() => setActiveNav("Topics")}
            />

            <NavItem
              icon="🔖"
              label="Saves"
              active={activeNav === "Saves"}
              onClick={() => setActiveNav("Saves")}
            />

            <NavItem
              icon="📖"
              label="Resources"
              active={activeNav === "Resources"}
              onClick={() => setActiveNav("Resources")}
            />
          </nav>

          <div className="mt-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium">Your Brain</p>

              <p className="mt-1 text-xs leading-5 text-white/40">
                34 saves have been turned into organized knowledge.
              </p>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-[68%] rounded-full bg-white/60" />
              </div>

              <p className="mt-2 text-xs text-white/30">
                68% organized
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
          <header className="flex items-center justify-between border-b border-white/10 px-6 py-5 sm:px-10">
            <div>
              <p className="text-sm text-white/35">
                Your knowledge space
              </p>

              <h1 className="mt-1 text-xl font-semibold">
                Your Second Brain
              </h1>
            </div>

            <Link
              href="/"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              + Add to Brain
            </Link>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
            {/* Welcome */}
            <section>
              <p className="text-sm text-white/40">
                34 things saved
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Your knowledge, organized.
              </h2>

              <p className="mt-3 max-w-2xl text-white/45">
                Everything you&apos;ve saved, transformed into topics,
                concepts and resources you can actually use.
              </p>
            </section>

            {/* Stats */}
            <section className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard
                value="34"
                label="Saved items"
                description="Things you've captured"
              />

              <StatCard
                value="18"
                label="Topics"
                description="Areas of knowledge"
              />

              <StatCard
                value="42"
                label="Resources"
                description="Papers, books & links"
              />
            </section>

            {/* Recently added */}
            <section className="mt-12">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/35">
                    Your latest knowledge
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Recently added
                  </h2>
                </div>

                <button
                  type="button"
                  className="text-sm text-white/40 transition hover:text-white"
                >
                  View all →
                </button>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                {recentItems.map((item) => (
                  <SavedItemCard
                    key={item.id}
                    item={item}
                  />
                ))}
              </div>
            </section>

            {/* Topics */}
            <section className="mt-14">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/35">
                  Knowledge map
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Your topics
                </h2>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {topics.map((topic) => (
                  <TopicCard
                    key={topic.name}
                    topic={topic}
                  />
                ))}
              </div>
            </section>

            {/* Resources */}
            <section className="mt-14 pb-12">
              <div>
                <p className="text-xs font-medium uppercase tracking-wider text-white/35">
                  Your library
                </p>

                <h2 className="mt-2 text-xl font-semibold">
                  Resources
                </h2>

                <p className="mt-2 text-sm text-white/40">
                  Useful resources discovered across everything you&apos;ve
                  saved.
                </p>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {resourceCategories.map((resource) => (
                  <ResourceCard
                    key={resource.label}
                    resource={resource}
                  />
                ))}
              </div>
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   Components
───────────────────────────────────────────── */

function NavItem({
  icon,
  label,
  active,
  onClick,
}: {
  icon: string;
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
        active
          ? "bg-white/10 text-white"
          : "text-white/40 hover:bg-white/5 hover:text-white"
      }`}
    >
      <span>{icon}</span>
      <span>{label}</span>
    </button>
  );
}

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
      <p className="text-3xl font-semibold">{value}</p>

      <p className="mt-2 text-sm font-medium text-white/75">
        {label}
      </p>

      <p className="mt-1 text-xs text-white/35">
        {description}
      </p>
    </div>
  );
}

function SavedItemCard({ item }: { item: SavedItem }) {
  return (
    <Link
      href={`/item/${item.id}`}
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          {getTypeIcon(item.type)}
        </div>

        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/35">
          {item.type}
        </span>
      </div>

      <h3 className="mt-5 font-medium text-white/90 group-hover:text-white">
        {item.title}
      </h3>

      <p className="mt-2 text-xs text-white/40">
        {item.topic}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-white/30">
          {item.concepts} concepts
        </span>

        <span className="text-white/25 transition group-hover:text-white/60">
          →
        </span>
      </div>
    </Link>
  );
}

function TopicCard({ topic }: { topic: Topic }) {
  return (
    <button
      type="button"
      className="rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm">
          ✦
        </span>

        <span className="text-xs text-white/30">
          {topic.count} saves
        </span>
      </div>

      <h3 className="mt-5 text-sm font-medium text-white/80">
        {topic.name}
      </h3>

      <p className="mt-2 text-xs leading-5 text-white/35">
        {topic.description}
      </p>
    </button>
  );
}

function ResourceCard({
  resource,
}: {
  resource: ResourceCategory;
}) {
  return (
    <button
      type="button"
      className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
        {resource.icon}
      </div>

      <div>
        <p className="text-sm font-medium text-white/75">
          {resource.label}
        </p>

        <p className="mt-1 text-xs text-white/35">
          {resource.count} resources
        </p>
      </div>
    </button>
  );
}

function getTypeIcon(type: SavedItem["type"]) {
  switch (type) {
    case "Screenshot":
      return "📸";
    case "Article":
      return "📄";
    case "Video":
      return "🎥";
    case "Text":
      return "📝";
    default:
      return "📌";
  }
}