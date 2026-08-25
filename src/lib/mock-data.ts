import type { BrainItem } from "@/types/brain";

export const mockBrainItem: BrainItem = {
  title: "Neural Networks",
  topic: "Machine Learning · Artificial Intelligence",

  summary:
    "Neural networks are machine learning models inspired by the structure of the human brain. They learn patterns from data by passing information through connected layers of artificial neurons.",

  key_concepts: [
    "Neurons",
    "Activation Functions",
    "Backpropagation",
    "Gradient Descent",
    "Training",
  ],

  resources: [
    {
      type: "research_paper",
      title: "A Practical Introduction to Neural Networks",
      url: "https://example.com/research-paper",
    },
    {
      type: "book",
      title: "Deep Learning — Ian Goodfellow",
      url: "https://example.com/deep-learning",
    },
    {
      type: "article",
      title: "Neural Networks Explained",
      url: "https://example.com/neural-networks",
    },
  ],

  tags: [
    "AI",
    "Machine Learning",
    "Deep Learning",
  ],
};