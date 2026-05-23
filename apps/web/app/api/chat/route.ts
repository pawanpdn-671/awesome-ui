import { NextRequest, NextResponse } from 'next/server';
import Groq from 'groq-sdk';
import { docProcessor } from '@/lib/document-processor';
import { docsDatabase } from '@/lib/docs-database';
import { getDocsFromDb } from '@/lib/db-texts';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function loadRootEnv() {
  const paths = [
    resolve(process.cwd(), '../../.env'),
    resolve(process.cwd(), '../.env'),
    resolve(process.cwd(), '.env'),
  ];
  for (const p of paths) {
    if (existsSync(p)) {
      const content = readFileSync(p, 'utf-8');
      const match = content.match(/^GROQ_API_KEY=(.+)$/m);
      if (match && match[1]) return match[1].trim();
    }
  }
  return undefined;
}

function getGroq() {
  const key = process.env.GROQ_API_KEY || loadRootEnv();
  if (!key) throw new Error('GROQ_API_KEY not configured');
  return new Groq({ apiKey: key });
}

let isInitialized = false;
let groq: Groq | null = null;

async function initializeDocs() {
  if (isInitialized) return;

  try {
    await docProcessor.initialize();
    
    // Fetch docs from Supabase
    let docsContent = await getDocsFromDb();
    
    // Fallback to local config if Supabase is offline/empty
    if (!docsContent || docsContent.length === 0) {
      console.log('Supabase docs empty or offline. Falling back to local docsDatabase.');
      docsContent = docsDatabase.getAllDocs();
    }

    for (const doc of docsContent) {
      const chunks = await docProcessor.chunkDocument(doc.content);
      await docProcessor.addDocuments(chunks, doc.source);
    }

    isInitialized = true;
  } catch (e) {
    console.error('Doc processor init error:', e);
    isInitialized = true;
  }
}

export async function POST(req: NextRequest) {
  try {
    await initializeDocs();

    const { message, conversationHistory = [] } = await req.json();

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    if (!groq) groq = getGroq();

    const relevantChunks = await docProcessor.findSimilar(message);

    const context = relevantChunks
      .map(chunk => `[Source: ${chunk.source}]\n${chunk.text}`)
      .join('\n\n---\n\n');

    const systemPrompt = `You are Pawan, a support assistant for AwesomeUI — a universal UI platform that works across React, Next.js, Vue, Angular, Svelte, SolidJS, and React Native.

RULES (STRICT - MUST FOLLOW):
1. ONLY answer based on the "DOCUMENTATION CONTEXT" provided below
2. If the answer is not in the context, say: "I can only help with questions about AwesomeUI. Please check our documentation at https://awesomeui.dev/docs"
3. NEVER use your general knowledge or training data
4. ALWAYS cite the source when you provide information
5. Be concise, friendly, and helpful
6. If someone asks who you are, say you're Pawan's documentation assistant for AwesomeUI
7. Do not mention internal implementation details like chunking, embeddings, or vector search

DOCUMENTATION CONTEXT:
${context || "No relevant documentation found for this query."}`;

    const messages = [
      { role: 'system', content: systemPrompt },
      ...conversationHistory.slice(-5),
      { role: 'user', content: message },
    ];

    const completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: messages as any,
      temperature: 0.3,
      max_tokens: 500,
      top_p: 0.9,
    });

    const reply = completion.choices[0]?.message?.content || 'No response generated.';
    const sources = relevantChunks.map(c => c.source);

    return NextResponse.json({ reply, sources, usedContext: !!context });
  } catch (error) {
    console.error('Chat error:', error);
    return NextResponse.json(
      { error: 'Failed to process your request. Please try again.' },
      { status: 500 }
    );
  }
}
