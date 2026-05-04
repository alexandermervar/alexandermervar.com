import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const blog = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/blog' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const podcast = defineCollection({
  loader: glob({ pattern: '**/*.json', base: './src/content/podcast' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    pubDate: z.coerce.date(),
    audioUrl: z.string().url(),
    duration: z.string(), // e.g. "45:30" (HH:MM:SS or MM:SS)
    fileSize: z.number(), // bytes
  }),
});

export const collections = { blog, podcast };
