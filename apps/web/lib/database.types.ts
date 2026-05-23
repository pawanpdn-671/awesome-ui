export interface StaticContentRow {
  key: string;
  value: Record<string, unknown>;
  created_at: string;
  updated_at: string;
}

export interface ComponentRow {
  id: string;
  name: string;
  category: string;
  description: string;
  version: string;
  imports: string;
  props: unknown[];
  slots: unknown[];
  preview_code: string;
  examples: Record<string, string>;
  created_at: string;
  updated_at: string;
}

export interface DocsContentRow {
  id: number;
  source: string;
  content: string;
  created_at: string;
}

export interface Database {
  public: {
    Tables: {
      static_content: {
        Row: StaticContentRow;
        Insert: Pick<StaticContentRow, "key" | "value">;
        Update: Partial<Pick<StaticContentRow, "value">>;
      };
      components: {
        Row: ComponentRow;
        Insert: Omit<ComponentRow, "created_at" | "updated_at">;
        Update: Partial<Omit<ComponentRow, "id" | "created_at" | "updated_at">>;
      };
      docs_content: {
        Row: DocsContentRow;
        Insert: Pick<DocsContentRow, "source" | "content">;
        Update: Partial<Pick<DocsContentRow, "source" | "content">>;
      };
    };
  };
}

export type StaticContentKey = "landing" | "docs" | "section_builder";
