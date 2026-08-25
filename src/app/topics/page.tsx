import Link from "next/link";

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

type Topic = {
  name: string;
  count: number;
  concepts: number;
  resources: number;
};

type PageProps = {
  searchParams: Promise<{
    topic?: string;
  }>;
};

async function getBrainItems(): Promise<BrainItem[]> {
  const { data, error } = await supabase
    .from("brain_items")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Supabase topics fetch error:", error);
    throw new Error(error.message);
  }

  return (data ?? []) as BrainItem[];
}

export default async function TopicsPage({ searchParams }: PageProps) {
  let items: BrainItem[] = [];
  let error = false;

  const { topic: selectedTopic } = await searchParams;

  try {
    items = await getBrainItems();
  } catch (err) {
    console.error("Topics fetch error:", err);
    error = true;
  }

  const topics = buildTopics(items);

  const filteredItems = selectedTopic
    ? items.filter(
        (item) =>
          item.topic.trim().toLowerCase() ===
          selectedTopic.trim().toLowerCase()
      )
    : [];

  const totalConcepts = items.reduce(
    (total, item) => total + (item.key_concepts?.length ?? 0),
    0
  );

  const selectedTopicData = selectedTopic
    ? topics.find(
        (topic) =>
          topic.name.trim().toLowerCase() ===
          selectedTopic.trim().toLowerCase()
      )
    : null;

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
            <NavItem href="/dashboard" icon="🧠" label="Brain" />

            <NavItem
              href="/topics"
              icon="📚"
              label="Topics"
              active
            />

            <NavItem href="/dashboard" icon="🔖" label="Saves" />

            <NavItem
              href="/resources"
              icon="📖"
              label="Resources"
            />
          </nav>

          <div className="mt-auto">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-4">
              <p className="text-sm font-medium">Your Brain</p>

              <p className="mt-1 text-xs leading-5 text-white/40">
                {items.length}{" "}
                {items.length === 1 ? "save has" : "saves have"} been turned
                into organized knowledge.
              </p>
            </div>
          </div>
        </aside>

        {/* Main */}
        <div className="flex-1">
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
              href="/add"
              className="rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-white/90"
            >
              + Add to Brain
            </Link>
          </header>

          <div className="mx-auto max-w-6xl px-6 py-10 sm:px-10">
            {/* Hero */}
            <section>
              <p className="text-sm text-white/40">
                {topics.length}{" "}
                {topics.length === 1 ? "area" : "areas"} of knowledge
              </p>

              <h2 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                Explore what you know.
              </h2>

              <p className="mt-3 max-w-2xl text-white/45">
                Every save is automatically organized into topics, so you can
                see how your knowledge grows over time.
              </p>
            </section>

            {/* Error */}
            {error && (
              <div className="mt-8 rounded-2xl border border-red-400/20 bg-red-400/10 p-5 text-sm text-red-200">
                We couldn&apos;t load your topics. Please refresh and try
                again.
              </div>
            )}

            {/* Stats */}
            <section className="mt-10 grid gap-4 sm:grid-cols-3">
              <StatCard
                value={String(topics.length)}
                label="Topics"
                description="Areas you've explored"
              />

              <StatCard
                value={String(items.length)}
                label="Saves"
                description="Across all topics"
              />

              <StatCard
                value={String(totalConcepts)}
                label="Concepts"
                description="Ideas you've discovered"
              />
            </section>

            {/* Selected topic */}
            {selectedTopic && selectedTopicData && (
              <section className="mt-12">
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-xs font-medium uppercase tracking-wider text-white/30">
                      Selected topic
                    </p>

                    <h3 className="mt-2 text-2xl font-semibold">
                      {selectedTopicData.name}
                    </h3>

                    <p className="mt-2 text-sm text-white/40">
                      {selectedTopicData.count}{" "}
                      {selectedTopicData.count === 1
                        ? "saved item"
                        : "saved items"}{" "}
                      · {selectedTopicData.concepts} concepts ·{" "}
                      {selectedTopicData.resources} resources
                    </p>
                  </div>

                  <Link
                    href="/topics"
                    className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/50 transition hover:bg-white/10 hover:text-white"
                  >
                    View all topics
                  </Link>
                </div>

                {filteredItems.length > 0 ? (
                  <div className="mt-5 grid gap-4 sm:grid-cols-2">
                    {filteredItems.map((item) => (
                      <SavedItemCard key={item.id} item={item} />
                    ))}
                  </div>
                ) : (
                  <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-8 text-center">
                    <p className="font-medium text-white/70">
                      No saved items found
                    </p>

                    <p className="mt-2 text-sm text-white/35">
                      This topic does not have any saved items yet.
                    </p>
                  </div>
                )}
              </section>
            )}

            {/* Topics */}
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
                  {topics.length}{" "}
                  {topics.length === 1 ? "topic" : "topics"}
                </span>
              </div>

              {topics.length > 0 ? (
                <div className="mt-5 grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
                  {topics.map((topic) => (
                    <TopicCard
                      key={topic.name}
                      topic={topic}
                      selected={selectedTopic === topic.name}
                    />
                  ))}
                </div>
              ) : (
                <div className="mt-5 rounded-3xl border border-white/10 bg-white/5 px-6 py-16 text-center">
                  <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white/10">
                    📚
                  </div>

                  <h3 className="mt-5 font-medium">
                    No topics yet
                  </h3>

                  <p className="mx-auto mt-2 max-w-sm text-sm leading-6 text-white/35">
                    Upload and save your first screenshot to start building
                    your knowledge map.
                  </p>

                  <Link
                    href="/add"
                    className="mt-5 inline-flex rounded-full bg-white px-4 py-2 text-sm font-medium text-black transition hover:bg-white/90"
                  >
                    Add your first save
                  </Link>
                </div>
              )}
            </section>
          </div>
        </div>
      </div>
    </main>
  );
}

function buildTopics(items: BrainItem[]): Topic[] {
  const topicMap = new Map<
    string,
    {
      count: number;
      concepts: number;
      resources: number;
    }
  >();

  for (const item of items) {
    const topic = item.topic?.trim();

    if (!topic) continue;

    const existing = topicMap.get(topic);

    topicMap.set(topic, {
      count: (existing?.count ?? 0) + 1,
      concepts:
        (existing?.concepts ?? 0) +
        (item.key_concepts?.length ?? 0),
      resources:
        (existing?.resources ?? 0) +
        (item.resources?.length ?? 0),
    });
  }

  return Array.from(topicMap.entries())
    .map(([name, stats]) => ({
      name,
      ...stats,
    }))
    .sort((a, b) => b.count - a.count);
}

function TopicCard({
  topic,
  selected,
}: {
  topic: Topic;
  selected: boolean;
}) {
  return (
    <Link
      href={`/topics?topic=${encodeURIComponent(topic.name)}`}
      className={`group rounded-3xl border p-6 transition ${
        selected
          ? "border-white/30 bg-white/10"
          : "border-white/10 bg-white/5 hover:border-white/20 hover:bg-white/[0.07]"
      }`}
    >
      <div className="flex items-start justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/10 text-sm text-white/60">
          ✦
        </div>

        <span className="text-white/20 transition group-hover:text-white/60">
          →
        </span>
      </div>

      <h4 className="mt-6 text-base font-medium text-white/80 transition group-hover:text-white">
        {topic.name}
      </h4>

      <p className="mt-2 text-sm leading-6 text-white/35">
        Knowledge saved under this topic.
      </p>

      <div className="mt-6 grid grid-cols-3 gap-2 border-t border-white/10 pt-5">
        <TopicStat
          value={topic.count}
          label={topic.count === 1 ? "Save" : "Saves"}
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

function SavedItemCard({ item }: { item: BrainItem }) {
  return (
    <Link
      href={`/item/${item.id}`}
      className="group rounded-2xl border border-white/10 bg-white/5 p-5 transition hover:border-white/20 hover:bg-white/[0.07]"
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

      <p className="mt-3 line-clamp-2 text-sm leading-6 text-white/35">
        {item.summary}
      </p>

      <div className="mt-5 flex items-center justify-between border-t border-white/10 pt-4">
        <span className="text-xs text-white/30">
          {item.key_concepts?.length ?? 0} concepts
        </span>

        <span className="text-white/25 transition group-hover:text-white/60">
          →
        </span>
      </div>
    </Link>
  );
}

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
