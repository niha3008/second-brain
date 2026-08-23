export type ResourceType =
  | "research_paper"
  | "book"
  | "article"
  | "video"
  | "github"
  | "course"
  | "other";

export interface BrainResource {
  type: ResourceType;
  title: string;
  url: string;
}

export interface BrainItem {
  title: string;
  topic: string;
  summary: string;
  key_concepts: string[];
  resources: BrainResource[];
  tags: string[];
}