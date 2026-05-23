import { cache } from "react";
import { supabase, queryWithRetry } from "./supabase";
import type { StaticContentRow, ComponentRow, DocsContentRow, StaticContentKey } from "./database.types";
import { components as localComponents } from "@/texts/component-data";
import type { ComponentDoc } from "@/texts/component-data";
import { textFallbacks } from "@/texts/defaults";

export const componentPreviews = localComponents.reduce<Record<string, React.ReactNode>>((acc, c) => {
  acc[c.id] = c.preview;
  return acc;
}, {});

interface TtlCacheEntry<T> {
  data: T;
  ts: number;
}

function ttlCache<T>(ttlMs: number) {
  const store = new Map<string, TtlCacheEntry<T>>();
  return {
    get(key: string): T | null {
      const entry = store.get(key);
      if (!entry) return null;
      if (Date.now() - entry.ts > ttlMs) {
        store.delete(key);
        return null;
      }
      return entry.data;
    },
    set(key: string, data: T): void {
      store.set(key, { data, ts: Date.now() });
    },
  };
}

const staticTextsCache = ttlCache<Record<string, Record<string, unknown>>>(60_000);
const singleKeyTextCache = ttlCache<Record<string, unknown>>(60_000);

export const getStaticTextsFromDb = cache(async (): Promise<Record<string, Record<string, unknown>>> => {
  const cached = staticTextsCache.get("all");
  if (cached) return cached;

  const { data, error } = await queryWithRetry<StaticContentRow[]>(() =>
    supabase.from("static_content").select("key, value")
  );

  if (error || !data) {
    if (error) console.error("getStaticTextsFromDb error:", error);
    return {};
  }

  const result: Record<string, Record<string, unknown>> = {};
  for (const row of data) {
    if (row.key) {
      result[row.key] = (row.value ?? {}) as Record<string, unknown>;
    }
  }

  staticTextsCache.set("all", result);
  return result;
});

export const getStaticTexts = cache(async () => {
  const dbTexts = await getStaticTextsFromDb();
  return {
    landing: dbTexts.landing ?? null,
    docs: dbTexts.docs ?? null,
    section_builder: dbTexts.section_builder ?? null,
  } as { landing: any; docs: any; section_builder: any };
});

export const getStaticTextsByKey = cache(async (key: StaticContentKey): Promise<Record<string, unknown> | null> => {
  const cached = singleKeyTextCache.get(key);
  if (cached) return cached;

  const { data, error } = await queryWithRetry<StaticContentRow[]>(() =>
    supabase.from("static_content").select("value").eq("key", key)
  );

  if (error || !data || data.length === 0) {
    if (error) console.error(`getStaticTextsByKey(${key}) error:`, error);
    return null;
  }

  const value = data[0]!.value as Record<string, unknown>;
  singleKeyTextCache.set(key, value);
  return value;
});

const serverTextsCache = ttlCache<any>(60_000);

export const getStaticTextsServer = cache(async (): Promise<any> => {
  const cached = serverTextsCache.get("merged");
  if (cached) return cached;

  const dbTexts = await getStaticTexts();

  const merged: Record<string, unknown> = { ...textFallbacks as Record<string, unknown> };

  if (dbTexts.landing) {
    for (const key of Object.keys(dbTexts.landing)) {
      merged[key] = dbTexts.landing[key];
    }
  }

  if (dbTexts.docs) {
    for (const key of Object.keys(dbTexts.docs)) {
      merged[key] = dbTexts.docs[key];
    }
  }

  if (dbTexts.section_builder) {
    for (const key of Object.keys(dbTexts.section_builder)) {
      merged[key] = dbTexts.section_builder[key];
    }
  }

  serverTextsCache.set("merged", merged);
  return merged;
});

const componentCache = ttlCache<ComponentDoc | null>(120_000);

export const getComponentFromDb = cache(async (id: string): Promise<ComponentDoc | null> => {
  const cached = componentCache.get(id);
  if (cached !== undefined) return cached;

  const { data, error } = await queryWithRetry<ComponentRow[]>(() =>
    supabase.from("components").select("*").eq("id", id)
  );

  if (error || !data || data.length === 0) {
    if (error) console.error(`getComponentFromDb(${id}) error:`, error);
    componentCache.set(id, null);
    return null;
  }

  const item = data[0]!;
  const doc: ComponentDoc = {
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    version: item.version,
    imports: item.imports,
    props: item.props as ComponentDoc["props"],
    slots: item.slots as ComponentDoc["slots"],
    preview: componentPreviews[item.id] || null,
    previewCode: item.preview_code,
    examples: item.examples as ComponentDoc["examples"],
  };

  componentCache.set(id, doc);
  return doc;
});

const allComponentsCache = ttlCache<ComponentDoc[]>(120_000);

export const getAllComponentsFromDb = cache(async (): Promise<ComponentDoc[]> => {
  const cached = allComponentsCache.get("all");
  if (cached) return cached;

  const { data, error } = await queryWithRetry<ComponentRow[]>(() =>
    supabase.from("components").select("*")
  );

  if (error || !data) {
    if (error) console.error("getAllComponentsFromDb error:", error);
    return [];
  }

  const docs: ComponentDoc[] = data.map((item) => ({
    id: item.id,
    name: item.name,
    category: item.category,
    description: item.description,
    version: item.version,
    imports: item.imports,
    props: item.props as ComponentDoc["props"],
    slots: item.slots as ComponentDoc["slots"],
    preview: componentPreviews[item.id] || null,
    previewCode: item.preview_code,
    examples: item.examples as ComponentDoc["examples"],
  }));

  allComponentsCache.set("all", docs);
  return docs;
});

const docsCache = ttlCache<{ source: string; content: string }[]>(120_000);

export const getDocsFromDb = cache(async () => {
  const cached = docsCache.get("all");
  if (cached) return cached;

  const { data, error } = await queryWithRetry<DocsContentRow[]>(() =>
    supabase.from("docs_content").select("source, content")
  );

  if (error || !data) {
    if (error) console.error("getDocsFromDb error:", error);
    return [];
  }

  docsCache.set("all", data);
  return data;
});
