import { pipeline } from '@xenova/transformers';

export interface DocumentChunk {
  text: string;
  embedding: number[];
  source: string;
}

class DocumentProcessor {
  private embeddingModel: any = null;
  private chunks: DocumentChunk[] = [];
  private initialized = false;

  async initialize() {
    if (this.initialized) return;
    try {
      this.embeddingModel = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
      this.initialized = true;
    } catch (e) {
      console.warn('Embedding model failed to load, falling back to keyword search', e);
    }
  }

  async chunkDocument(text: string): Promise<string[]> {
    const sentences = text.split(/(?<=[.!?])\s+/);
    const chunks: string[] = [];
    let currentChunk = '';

    for (const sentence of sentences) {
      if ((currentChunk + sentence).length > 500) {
        if (currentChunk) chunks.push(currentChunk);
        currentChunk = sentence;
      } else {
        currentChunk += (currentChunk ? ' ' : '') + sentence;
      }
    }
    if (currentChunk) chunks.push(currentChunk);

    return chunks;
  }

  async addDocuments(texts: string[], source: string) {
    for (const text of texts) {
      if (this.embeddingModel) {
        const embedding = await this.getEmbedding(text);
        this.chunks.push({ text, embedding, source });
      } else {
        this.chunks.push({ text, embedding: [], source });
      }
    }
  }

  async getEmbedding(text: string): Promise<number[]> {
    if (!this.embeddingModel) return [];
    const result = await this.embeddingModel(text, { pooling: 'mean', normalize: true });
    return Array.from(result.data);
  }

  async findSimilar(query: string, topK: number = 3): Promise<DocumentChunk[]> {
    if (this.chunks.length === 0) return [];

    if (this.embeddingModel) {
      const queryEmbedding = await this.getEmbedding(query);
      const scored = this.chunks.map(chunk => ({
        chunk,
        score: this.cosineSimilarity(queryEmbedding, chunk.embedding),
      }));
      scored.sort((a, b) => b.score - a.score);
      return scored.slice(0, topK).map(s => s.chunk);
    }

    const queryLower = query.toLowerCase();
    const queryTerms = queryLower.split(/\s+/).filter(t => t.length > 2);
    const scored = this.chunks.map(chunk => {
      const textLower = chunk.text.toLowerCase();
      const score = queryTerms.length > 0 ? queryTerms.filter(t => textLower.includes(t)).length / queryTerms.length : 0;
      return { chunk, score };
    });
    scored.sort((a, b) => b.score - a.score);
    return scored.slice(0, topK).filter(s => s.score > 0).map(s => s.chunk);
  }

  private cosineSimilarity(a: number[], b: number[]): number {
    if (a.length === 0 || b.length === 0) return 0;
    let dot = 0, magA = 0, magB = 0;
    for (let i = 0; i < a.length; i++) {
      dot += (a[i] ?? 0) * (b[i] ?? 0);
      magA += (a[i] ?? 0) * (a[i] ?? 0);
      magB += (b[i] ?? 0) * (b[i] ?? 0);
    }
    if (magA === 0 || magB === 0) return 0;
    return dot / (Math.sqrt(magA) * Math.sqrt(magB));
  }
}

export const docProcessor = new DocumentProcessor();
