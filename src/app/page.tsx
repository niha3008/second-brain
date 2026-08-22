"use client";

import { useRef, useState } from "react";

type Screen = "upload" | "processing" | "result";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [screen, setScreen] = useState<Screen>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image.");
      return;
    }

    setSelectedFile(file);
  };

  const handleAddToBrain = () => {
    if (!selectedFile) return;

    setScreen("processing");

    // Temporary mock processing.
    // Later this will call our Gemini/Supabase backend.
    setTimeout(() => {
      setScreen("result");
    }, 3000);
  };

  // ─────────────────────────────────────────────
  // PROCESSING SCREEN
  // ─────────────────────────────────────────────

  if (screen === "processing") {
    return (
      <main className="min-h-screen bg-[#120c0d] text-white">
        <div className="mx-auto flex min-h-screen max-w-5xl flex-col items-center justify-center px-6 text-center">
          <div className="flex h-20 w-20 animate-pulse items-center justify-center rounded-3xl bg-white/10 text-3xl">
            🧠
          </div>

          <h1 className="mt-8 text-3xl font-semibold tracking-tight sm:text-4xl">
            Understanding your save...
          </h1>

          <p className="mt-4 max-w-md text-white/50">
            We're reading your content and figuring out what makes it useful.
          </p>

          <div className="mt-10 flex w-full max-w-sm flex-col gap-4 text-left">
            <ProcessingStep text="Reading the content" />
            <ProcessingStep text="Finding the main topic" />
            <ProcessingStep text="Extracting useful resources" />
            <ProcessingStep text="Connecting the dots" />
          </div>

          <div className="mt-10 h-1.5 w-64 overflow-hidden rounded-full bg-white/10">
            <div className="h-full w-1/2 animate-pulse rounded-full bg-white/70" />
          </div>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // RESULT SCREEN
  // ─────────────────────────────────────────────

  if (screen === "result") {
    return (
      <main className="min-h-screen bg-[#120c0d] text-white">
        <div className="mx-auto min-h-screen w-full max-w-5xl px-6 py-8 sm:px-10">
          <header className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
                🧠
              </div>

              <span className="text-lg font-semibold">Second Brain</span>
            </div>

            <button
              type="button"
              onClick={() => {
                setSelectedFile(null);
                setScreen("upload");
              }}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              + Add another
            </button>
          </header>

          <section className="mx-auto mt-16 max-w-3xl">
            <div className="mb-8">
              <p className="text-sm text-white/40">AI analysis complete</p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                Neural Networks
              </h1>

              <p className="mt-3 text-white/50">
                Machine Learning · Artificial Intelligence
              </p>
            </div>

            {/* Summary */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Summary
              </p>

              <p className="mt-4 leading-7 text-white/75">
                Neural networks are machine learning models inspired by the
                structure of the human brain. They learn patterns from data by
                passing information through connected layers of artificial
                neurons.
              </p>
            </section>

            {/* Concepts */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Key concepts
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                {[
                  "Neurons",
                  "Activation Functions",
                  "Backpropagation",
                  "Gradient Descent",
                  "Training",
                ].map((concept) => (
                  <span
                    key={concept}
                    className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70"
                  >
                    {concept}
                  </span>
                ))}
              </div>
            </section>

            {/* Resources */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                    Resources found
                  </p>

                  <p className="mt-1 text-sm text-white/40">
                    Resources related to this save
                  </p>
                </div>

                <span className="rounded-full bg-white/10 px-3 py-1 text-xs text-white/50">
                  3 found
                </span>
              </div>

              <div className="mt-5 space-y-3">
                <Resource
                  type="Research Paper"
                  title="A Practical Introduction to Neural Networks"
                />

                <Resource
                  type="Book"
                  title="Deep Learning — Ian Goodfellow"
                />

                <Resource
                  type="Article"
                  title="Neural Networks Explained"
                />
              </div>
            </section>

            {/* Save */}
            <button
              type="button"
              className="mt-6 w-full rounded-2xl bg-white px-5 py-4 font-medium text-black transition hover:bg-white/90"
            >
              Save to my Brain →
            </button>
          </section>
        </div>
      </main>
    );
  }

  // ─────────────────────────────────────────────
  // UPLOAD SCREEN
  // ─────────────────────────────────────────────

  return (
    <main className="min-h-screen bg-[#120c0d] text-white">
      <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col px-6 py-8 sm:px-10">
        <header className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white/10 text-xl">
              🧠
            </div>

            <span className="text-lg font-semibold">Second Brain</span>
          </div>

          <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/60">
            Your knowledge, organized.
          </span>
        </header>

        <section className="flex flex-1 flex-col items-center justify-center py-16 text-center">
          <div className="mb-6 rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60">
            Save it once. Find it when it matters.
          </div>

          <h1 className="max-w-3xl text-4xl font-semibold tracking-tight sm:text-6xl">
            Turn the things you save into{" "}
            <span className="text-white/50">knowledge.</span>
          </h1>

          <p className="mt-6 max-w-2xl text-base leading-7 text-white/55 sm:text-lg">
            Drop a screenshot, link, or piece of text. Second Brain will
            understand it, connect it to what you already know, and help you
            learn from it later.
          </p>

          <div className="mt-12 w-full max-w-2xl">
            {!selectedFile ? (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="group flex w-full flex-col items-center justify-center rounded-3xl border border-white/15 bg-white/6 px-6 py-16 backdrop-blur-xl transition-all hover:border-white/25 hover:bg-white/10"
              >
                <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/10 text-2xl transition-transform group-hover:scale-105">
                  ↑
                </div>

                <h2 className="text-lg font-medium">
                  Drop a screenshot here
                </h2>

                <p className="mt-2 text-sm text-white/45">
                  or click to browse from your device
                </p>

                <p className="mt-5 text-xs text-white/30">
                  PNG, JPG or WEBP
                </p>
              </button>
            ) : (
              <div className="rounded-3xl border border-white/15 bg-white/6 p-5 text-left backdrop-blur-xl">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium">{selectedFile.name}</p>

                    <p className="mt-1 text-sm text-white/40">
                      Ready to add to your Brain
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={() => setSelectedFile(null)}
                    className="rounded-full px-3 py-1.5 text-sm text-white/50 hover:bg-white/10 hover:text-white"
                  >
                    Remove
                  </button>
                </div>

                <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Selected screenshot preview"
                    className="max-h-[400px] w-full object-contain"
                  />
                </div>

                <button
                  type="button"
                  onClick={handleAddToBrain}
                  className="mt-5 w-full rounded-2xl bg-white px-5 py-3 font-medium text-black transition hover:bg-white/90"
                >
                  Add to Brain →
                </button>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/png,image/jpeg,image/webp"
              className="hidden"
              onChange={(event) =>
                handleFileChange(event.target.files?.[0] ?? null)
              }
            />
          </div>

          <div className="mt-6 flex flex-col gap-3 sm:flex-row">
            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              🔗 Paste a URL
            </button>

            <button
              type="button"
              className="rounded-full border border-white/10 bg-white/5 px-5 py-2.5 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              📝 Add text
            </button>
          </div>
        </section>

        <footer className="pb-4 text-center text-xs text-white/25">
          Your saved content becomes part of your personal knowledge graph.
        </footer>
      </div>
    </main>
  );
}

// ─────────────────────────────────────────────
// Small reusable components
// ─────────────────────────────────────────────

function ProcessingStep({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/50">
      <div className="h-2 w-2 rounded-full bg-white/40" />
      {text}
    </div>
  );
}

function Resource({
  type,
  title,
}: {
  type: string;
  title: string;
}) {
  return (
    <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4">
      <div>
        <p className="text-xs text-white/35">{type}</p>
        <p className="mt-1 text-sm text-white/75">{title}</p>
      </div>

      <span className="text-white/30">↗</span>
    </div>
  );
}