"use client";

import { useEffect, useRef, useState } from "react";
import type { BrainItem, BrainResource } from "@/types/brain";

type Screen = "upload" | "processing" | "result";

export default function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [screen, setScreen] = useState<Screen>("upload");
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  // Stores the REAL response returned by Gemini
  const [brainItem, setBrainItem] = useState<BrainItem | null>(null);

  // Stores errors from the API
  const [error, setError] = useState<string | null>(null);

  // Create and clean up the image preview URL.
  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const url = URL.createObjectURL(selectedFile);
    setPreviewUrl(url);

    return () => {
      URL.revokeObjectURL(url);
    };
  }, [selectedFile]);

  // ─────────────────────────────────────────────
  // FILE HANDLING
  // ─────────────────────────────────────────────

  const handleFileChange = (file: File | null) => {
    if (!file) return;

    if (!file.type.startsWith("image/")) {
      setError("Please upload an image.");
      return;
    }

    setError(null);
    setBrainItem(null);
    setSelectedFile(file);
  };

  // ─────────────────────────────────────────────
  // SEND IMAGE TO GEMINI
  // ─────────────────────────────────────────────

  const handleAddToBrain = async () => {
    if (!selectedFile) return;

    setScreen("processing");
    setError(null);

    try {
      const formData = new FormData();

      formData.append("file", selectedFile);

      const response = await fetch("/api/ingest", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to process image.");
      }

      // Gemini response should match our BrainItem type.
      setBrainItem(data as BrainItem);

      setScreen("result");
    } catch (error) {
      console.error("Frontend ingest error:", error);

      setError(
        error instanceof Error
          ? error.message
          : "Something went wrong while processing your image."
      );

      setScreen("upload");
    }
  };

  // ─────────────────────────────────────────────
  // ADD ANOTHER
  // ─────────────────────────────────────────────

  const handleAddAnother = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
    setBrainItem(null);
    setError(null);
    setScreen("upload");

    // Reset file input so the user can select
    // the same image again if they want.
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
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
            We&apos;re reading your content and figuring out what makes it
            useful.
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

  if (screen === "result" && brainItem) {
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
              onClick={handleAddAnother}
              className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-white/60 transition hover:bg-white/10 hover:text-white"
            >
              + Add another
            </button>
          </header>

          <section className="mx-auto mt-16 max-w-3xl">
            {/* Header */}
            <div className="mb-8">
              <p className="text-sm text-white/40">
                AI analysis complete
              </p>

              <h1 className="mt-2 text-4xl font-semibold tracking-tight">
                {brainItem.title}
              </h1>

              <p className="mt-3 text-white/50">
                {brainItem.topic}
              </p>
            </div>

            {/* Summary */}
            <section className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-xl">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Summary
              </p>

              <p className="mt-4 leading-7 text-white/75">
                {brainItem.summary}
              </p>
            </section>

            {/* Key Concepts */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Key concepts
              </p>

              {brainItem.key_concepts.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {brainItem.key_concepts.map((concept) => (
                    <span
                      key={concept}
                      className="rounded-full border border-white/10 bg-white/5 px-3 py-2 text-sm text-white/70"
                    >
                      {concept}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-white/40">
                  No key concepts were identified.
                </p>
              )}
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
                  {brainItem.resources.length} found
                </span>
              </div>

              <div className="mt-5 space-y-3">
                {brainItem.resources.length > 0 ? (
                  brainItem.resources.map((resource, index) => (
                    <Resource
                      key={`${resource.title}-${index}`}
                      resource={resource}
                    />
                  ))
                ) : (
                  <p className="rounded-2xl border border-white/10 bg-black/10 p-4 text-sm text-white/40">
                    No resources were found in this save.
                  </p>
                )}
              </div>
            </section>

            {/* Tags */}
            <section className="mt-5 rounded-3xl border border-white/10 bg-white/5 p-6">
              <p className="text-xs font-medium uppercase tracking-wider text-white/40">
                Tags
              </p>

              {brainItem.tags.length > 0 ? (
                <div className="mt-4 flex flex-wrap gap-2">
                  {brainItem.tags.map((tag) => (
                    <span
                      key={tag}
                      className="rounded-full bg-white/10 px-3 py-2 text-sm text-white/60"
                    >
                      #{tag.replace(/\s+/g, "")}
                    </span>
                  ))}
                </div>
              ) : (
                <p className="mt-4 text-sm text-white/40">
                  No tags were generated.
                </p>
              )}
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
            {/* Error message */}
            {error && (
              <div className="mb-5 rounded-2xl border border-red-400/20 bg-red-400/10 px-5 py-4 text-left text-sm text-red-200">
                {error}
              </div>
            )}

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
                    onClick={() => {
                      setSelectedFile(null);
                      setPreviewUrl(null);
                      setBrainItem(null);
                      setError(null);

                      if (fileInputRef.current) {
                        fileInputRef.current.value = "";
                      }
                    }}
                    className="rounded-full px-3 py-1.5 text-sm text-white/50 hover:bg-white/10 hover:text-white"
                  >
                    Remove
                  </button>
                </div>

                {/* Image preview */}
                {previewUrl && (
                  <div className="mt-5 overflow-hidden rounded-2xl border border-white/10 bg-black/20">
                    <img
                      src={previewUrl}
                      alt="Selected screenshot preview"
                      className="max-h-[400px] w-full object-contain"
                    />
                  </div>
                )}

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
// PROCESSING STEP
// ─────────────────────────────────────────────

function ProcessingStep({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 text-sm text-white/50">
      <div className="h-2 w-2 rounded-full bg-white/40" />
      {text}
    </div>
  );
}

// ─────────────────────────────────────────────
// RESOURCE CARD
// ─────────────────────────────────────────────

function Resource({ resource }: { resource: BrainResource }) {
  const resourceType = resource.type.replace("_", " ");

  // If Gemini found a resource but couldn't identify
  // a URL, don't create a broken/empty hyperlink.
  if (!resource.url) {
    return (
      <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/10 p-4">
        <div>
          <p className="text-xs capitalize text-white/35">
            {resourceType}
          </p>

          <p className="mt-1 text-sm text-white/75">
            {resource.title}
          </p>
        </div>

        <span className="text-xs text-white/25">
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
      <div>
        <p className="text-xs capitalize text-white/35">
          {resourceType}
        </p>

        <p className="mt-1 text-sm text-white/75">
          {resource.title}
        </p>
      </div>

      <span className="text-white/30">↗</span>
    </a>
  );
}