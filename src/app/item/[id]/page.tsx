import Link from "next/link";
import { mockBrainItem } from "@/lib/mock-data";

type PageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function SavedItemPage({ params }: PageProps) {
  const { id } = await params;

  // For now, every mock item displays our Neural Networks example.
  // Later, this ID will be used to fetch the real item from Supabase.
  const item = mockBrainItem;

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
            href="/"
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
            ← Back to your Brain
          </Link>
        </div>

        {/* Main content */}
        <section className="mt-12 grid gap-8 lg:grid-cols-[1fr_320px]">
          {/* Main column */}
          <div>
            {/* Title */}
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/45">
                  Saved screenshot
                </span>

                <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/45">
                  {item.topic}
                </span>
              </div>

              <h1 className="mt-5 text-4xl font-semibold tracking-tight sm:text-5xl">
                {item.title}
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-white/45">
                AI analyzed this save and turned it into structured knowledge.
              </p>
            </div>

            {/* Summary */}
            <section className="mt-10 rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl sm:p-8">
              <SectionLabel>Summary</SectionLabel>

              <p className="mt-5 text-base leading-8 text-white/70">
                {item.summary}
              </p>
            </section>

            {/* Concepts */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <SectionLabel>Key concepts</SectionLabel>

              <p className="mt-2 text-sm text-white/35">
                The main ideas identified in this save.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                {item.key_concepts.map((concept, index) => (
                  <div
                    key={concept}
                    className="flex items-center gap-4 rounded-2xl border border-white/10 bg-black/10 p-4"
                  >
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white/10 text-xs text-white/40">
                      {index + 1}
                    </span>

                    <span className="text-sm text-white/70">
                      {concept}
                    </span>
                  </div>
                ))}
              </div>
            </section>

            {/* Resources */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <div className="flex items-start justify-between gap-4">
                <div>
                  <SectionLabel>Resources found</SectionLabel>

                  <p className="mt-2 text-sm text-white/35">
                    Useful resources discovered in or related to this save.
                  </p>
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1.5 text-xs text-white/40">
                  {item.resources.length}
                </span>
              </div>

              <div className="mt-6 space-y-3">
                {item.resources.map((resource) => (
                  <a
                    key={resource.title}
                    href={resource.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="group flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-black/10 p-4 transition hover:border-white/20 hover:bg-white/5"
                  >
                    <div className="flex min-w-0 items-center gap-4">
                      <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-white/10 text-lg">
                        {getResourceIcon(resource.type)}
                      </div>

                      <div className="min-w-0">
                        <p className="text-xs capitalize text-white/35">
                          {resource.type.replace("_", " ")}
                        </p>

                        <p className="mt-1 truncate text-sm text-white/75">
                          {resource.title}
                        </p>
                      </div>
                    </div>

                    <span className="shrink-0 text-white/25 transition group-hover:text-white/70">
                      ↗
                    </span>
                  </a>
                ))}
              </div>
            </section>

            {/* Connected knowledge */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <SectionLabel>Connected knowledge</SectionLabel>

              <p className="mt-2 max-w-xl text-sm leading-6 text-white/40">
                Second Brain can eventually connect this save to other things
                you&apos;ve saved about the same topic.
              </p>

              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <RelatedItem
                  title="Deep Learning Fundamentals"
                  topic="AI & Machine Learning"
                />

                <RelatedItem
                  title="Backpropagation Explained"
                  topic="AI & Machine Learning"
                />

                <RelatedItem
                  title="Transformers & Attention"
                  topic="AI & Machine Learning"
                />

                <RelatedItem
                  title="Machine Learning Roadmap"
                  topic="AI & Machine Learning"
                />
              </div>
            </section>

            {/* Learn next */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6 sm:p-8">
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10">
                  🎯
                </div>

                <div>
                  <SectionLabel>What to learn next</SectionLabel>

                  <p className="mt-1 text-sm text-white/35">
                    A possible path based on this topic.
                  </p>
                </div>
              </div>

              <div className="mt-7 space-y-3">
                <LearningStep
                  number="01"
                  title="Understand neurons"
                  description="How individual artificial neurons process information."
                  complete
                />

                <LearningStep
                  number="02"
                  title="Learn backpropagation"
                  description="How neural networks learn from their mistakes."
                  current
                />

                <LearningStep
                  number="03"
                  title="Explore optimization"
                  description="How gradient descent improves model performance."
                />

                <LearningStep
                  number="04"
                  title="Explore CNNs & Transformers"
                  description="How neural networks are adapted for different problems."
                />
              </div>
            </section>

            {/* Tags */}
            <section className="mt-5 pb-12">
              <SectionLabel>Tags</SectionLabel>

              <div className="mt-4 flex flex-wrap gap-2">
                {item.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/45"
                  >
                    #{tag.replace(/\s+/g, "")}
                  </span>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <aside className="lg:sticky lg:top-8 lg:self-start">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-white/35">
                Knowledge snapshot
              </p>

              <div className="mt-6 space-y-5">
                <Snapshot
                  label="Topic"
                  value={item.topic}
                />

                <Snapshot
                  label="Concepts"
                  value={`${item.key_concepts.length} identified`}
                />

                <Snapshot
                  label="Resources"
                  value={`${item.resources.length} found`}
                />

                <Snapshot
                  label="Tags"
                  value={`${item.tags.length} tags`}
                />
              </div>
            </div>

            <div className="mt-4 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-sm font-medium">
                Ready to learn?
              </p>

              <p className="mt-2 text-xs leading-5 text-white/35">
                Later, Second Brain can generate a short learning session
                from this save and test you on what you learned.
              </p>

              <button
                type="button"
                className="mt-5 w-full rounded-2xl bg-white px-4 py-3 text-sm font-medium text-black transition hover:bg-white/90"
              >
                Start learning →
              </button>
            </div>
          </aside>
        </section>
      </div>
    </main>
  );
}

/* ─────────────────────────────────────────────
   Reusable components
───────────────────────────────────────────── */

function SectionLabel({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <p className="text-xs font-medium uppercase tracking-wider text-white/40">
      {children}
    </p>
  );
}

function Snapshot({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div>
      <p className="text-xs text-white/30">{label}</p>

      <p className="mt-1 text-sm leading-5 text-white/70">
        {value}
      </p>
    </div>
  );
}

function RelatedItem({
  title,
  topic,
}: {
  title: string;
  topic: string;
}) {
  return (
    <button
      type="button"
      className="group rounded-2xl border border-white/10 bg-black/10 p-4 text-left transition hover:border-white/20 hover:bg-white/5"
    >
      <p className="text-sm text-white/70 transition group-hover:text-white">
        {title}
      </p>

      <p className="mt-2 text-xs text-white/30">
        {topic}
      </p>
    </button>
  );
}

function LearningStep({
  number,
  title,
  description,
  complete = false,
  current = false,
}: {
  number: string;
  title: string;
  description: string;
  complete?: boolean;
  current?: boolean;
}) {
  return (
    <div
      className={`flex gap-4 rounded-2xl border p-4 ${
        current
          ? "border-white/20 bg-white/10"
          : "border-white/10 bg-black/10"
      }`}
    >
      <div
        className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-xl text-xs ${
          complete
            ? "bg-white text-black"
            : current
              ? "bg-white/15 text-white"
              : "bg-white/5 text-white/30"
        }`}
      >
        {complete ? "✓" : number}
      </div>

      <div>
        <p
          className={`text-sm font-medium ${
            current ? "text-white" : "text-white/70"
          }`}
        >
          {title}
        </p>

        <p className="mt-1 text-xs leading-5 text-white/35">
          {description}
        </p>
      </div>
    </div>
  );
}

function getResourceIcon(type: string) {
  switch (type) {
    case "research_paper":
      return "📄";
    case "book":
      return "📚";
    case "article":
      return "🔗";
    case "video":
      return "🎥";
    case "github":
      return "💻";
    case "course":
      return "🎓";
    default:
      return "🔖";
  }
}