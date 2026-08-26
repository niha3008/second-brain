import Link from "next/link";
import { createClient } from "@/lib/supabase/server";

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

async function getBrainItems(): Promise<BrainItem[]> {
    const supabase = await createClient();
    
    const { data, error } = await supabase
    .from("brain_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase dashboard fetch error:", error);
    throw new Error(error.message);
  }

  return (data ?? []) as BrainItem[];
}

export default async function DashboardPage() {
  let items: BrainItem[] = [];
  let error = false;

  try {
    items = await getBrainItems();
  } catch (err) {
    console.error("Dashboard fetch error:", err);
    error = true;
  }

  const topics = buildTopics(items);
  const resources = buildResources(items);

  const totalResources = items.reduce(
    (total, item) => total + item.resources.length,
    0
  );

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
            <NavItem href="/dashboard" icon="🧠" label="Brain" active />

            <NavItem href="/topics" icon="📚" label="Topics" />

            <NavItem href="/dashboard" icon="🔖" label="Saves" />

            <NavItem href="/resources" icon="📖" label="Resources" />
          </nav>

          <div className="mt-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium">Your Brain</p>

              <p className="mt-1 text-xs leading-5 text-white/40">
                {items.length}{" "}
                {items.length === 1 ? "save has" : "saves have"} been turned
                into organized knowledge.
              </p>

              <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/10">
                <div className="h-full w-full rounded-full bg-white/60" />
              </div>

              <p className="mt-2 text-xs text-white/30">
                {items.length > 0 ? "Organized" : "No saves yet"}
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
              href="/add"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              + Add to Brain
            </Link>
          </header>

          <div className="mx-auto max-w-7xl px-6 py-10 sm:px-10">
            {/* Welcome */}
            <section>
              <p className="text-sm text-white/40">
                {items.length}{" "}
                {items.length === 1 ? "thing saved" : "things saved"}
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Your knowledge, organized.
              </h2>

              <p className="mt-3 max-w-2xl text-white/45">
                Everything you&apos;ve saved, transformed into topics,
                concepts and resources you can actually use.
              </p>
            </section>

            {/* Error */}
            {error && (
              <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200">
                We couldn&apos;t load your Brain items. Please refresh and try
                again.
              </div>
            )}

            {/* Stats */}
            <section className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard
                value={String(items.length)}
                label="Saved items"
                description="Things you've captured"
              />

              <StatCard
                value={String(topics.length)}
                label="Topics"
                description="Areas of knowledge"
              />

              <StatCard
                value={String(totalResources)}
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

                <Link
                  href="/dashboard"
                  className="text-sm text-white/40 transition hover:text-white"
                >
                  View all →
                </Link>
              </div>

              {items.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {items.slice(0, 6).map((item) => (
                    <SavedItemCard key={item.id} item={item} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="Your Brain is empty"
                  description="Upload your first screenshot to start building your knowledge."
                />
              )}
            </section>

            {/* Topics */}
            <section className="mt-14">
              <div className="flex items-end justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/35">
                    Knowledge map
                  </p>

                  <h2 className="mt-2 text-xl font-semibold">
                    Your topics
                  </h2>
                </div>

                <Link
                  href="/topics"
                  className="text-sm text-white/40 transition hover:text-white"
                >
                  Explore →
                </Link>
              </div>

              {topics.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                  {topics.slice(0, 4).map((topic) => (
                    <TopicCard key={topic.name} topic={topic} />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No topics yet"
                  description="Topics will appear as you save more knowledge."
                />
              )}
            </section>

            {/* Resources */}
            <section className="mt-14 pb-12">
              <div className="flex items-end justify-between">
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

                <Link
                  href="/resources"
                  className="text-sm text-white/40 transition hover:text-white"
                >
                  View library →
                </Link>
              </div>

              {resources.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  {resources.slice(0, 4).map((resource) => (
                    <ResourceCard
                      key={resource.label}
                      resource={resource}
                    />
                  ))}
                </div>
              ) : (
                <EmptyState
                  title="No resources yet"
                  description="Resources will appear here when they are found in your saved content."
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
   Types
───────────────────────────────────────────── */

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

/* ─────────────────────────────────────────────
   Data helpers
───────────────────────────────────────────── */

function buildTopics(items: BrainItem[]): Topic[] {
  const topicMap = new Map<string, number>();

  for (const item of items) {
    const topic = item.topic.trim();

    if (!topic) continue;

    topicMap.set(topic, (topicMap.get(topic) ?? 0) + 1);
  }

  return Array.from(topicMap.entries())
    .map(([name, count]) => ({
      name,
      count,
      description: `${count} ${
        count === 1 ? "saved item" : "saved items"
      } in this area`,
    }))
    .sort((a, b) => b.count - a.count);
}

function buildResources(items: BrainItem[]): ResourceCategory[] {
  const counts = new Map<string, number>();

  for (const item of items) {
    for (const resource of item.resources ?? []) {
      const type = resource.type || "other";

      counts.set(type, (counts.get(type) ?? 0) + 1);
    }
  }

  const labels: Record<string, { label: string; icon: string }> = {
    research_paper: {
      label: "Research Papers",
      icon: "📄",
    },
    book: {
      label: "Books",
      icon: "📚",
    },
    article: {
      label: "Articles",
      icon: "🔗",
    },
    video: {
      label: "Videos",
      icon: "🎥",
    },
    github: {
      label: "GitHub",
      icon: "💻",
    },
    course: {
      label: "Courses",
      icon: "🎓",
    },
    other: {
      label: "Other",
      icon: "📌",
    },
  };

  return Array.from(counts.entries())
    .map(([type, count]) => ({
      label: labels[type]?.label ?? type,
      icon: labels[type]?.icon ?? "📌",
      count,
    }))
    .sort((a, b) => b.count - a.count);
}

/* ─────────────────────────────────────────────
   Components
───────────────────────────────────────────── */

function NavItem({
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
      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${
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

function SavedItemCard({ item }: { item: BrainItem }) {
  const concepts = item.key_concepts?.length ?? 0;

  return (
    <Link
      href={`/item/${item.id}`}
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
          🧠
        </div>

        <span className="rounded-full bg-white/5 px-2.5 py-1 text-[11px] text-white/35">
          Saved
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
          {concepts} concepts
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
    <Link
      href={`/topics?topic=${encodeURIComponent(topic.name)}`}
      className="block rounded-2xl border border-white/10 bg-white/5 p-5 text-left transition hover:border-white/20 hover:bg-white/[0.07]"
    >
      <div className="flex items-center justify-between">
        <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-white/10 text-sm">
          ✦
        </span>

        <span className="text-xs text-white/30">
          {topic.count} {topic.count === 1 ? "save" : "saves"}
        </span>
      </div>

      <h3 className="mt-5 text-sm font-medium text-white/80">
        {topic.name}
      </h3>

      <p className="mt-2 text-xs leading-5 text-white/35">
        {topic.description}
      </p>
    </Link>
  );
}

function ResourceCard({
  resource,
}: {
  resource: ResourceCategory;
}) {
  return (
    <Link
      href={`/resources?type=${encodeURIComponent(resource.label)}`}
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
          {resource.count}{" "}
          {resource.count === 1 ? "resource" : "resources"}
        </p>
      </div>
    </Link>
  );
}

function EmptyState({
  title,
  description,
}: {
  title: string;
  description: string;
}) {
  return (
    <div className="mt-5 rounded-2xl border border-white/10 bg-white/5 p-8 text-center">
      <p className="font-medium text-white/70">{title}</p>

      <p className="mt-2 text-sm text-white/35">{description}</p>
    </div>
  );
}