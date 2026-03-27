import { defineCollection, z } from 'astro:content';

const articles = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    excerpt: z.string(),
    category: z.enum(['tutorial', 'guide', 'reference', 'opinion', 'news-analysis']),
    tags: z.array(z.string()),
    publishedAt: z.string(),
    updatedAt: z.string().optional(),
    author: z.string().default('xipeter'),
    readingTime: z.string(),
    hero: z.string().optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).optional(),
    relatedTools: z.array(z.string()).optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional()
    }).optional(),
    adEligible: z.boolean().default(true)
  })
});

const tools = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    category: z.enum(['developer', 'productivity', 'media', 'utilities', 'security']),
    intro: z.string(),
    features: z.array(z.string()),
    examples: z.array(z.object({
      title: z.string(),
      description: z.string()
    })).optional(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).optional(),
    limitations: z.array(z.string()).optional(),
    relatedArticles: z.array(z.string()).optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional(),
      keywords: z.array(z.string()).optional()
    }).optional(),
    adEligible: z.boolean().default(true)
  })
});

const promos = defineCollection({
  type: 'content',
  schema: z.object({
    brand: z.string(),
    type: z.enum(['referral', 'discount', 'trial', 'bundle']),
    region: z.string(),
    eligibility: z.string(),
    rewardSummary: z.string(),
    lastVerified: z.string(),
    stepsToRedeem: z.array(z.string()),
    disclosure: z.string(),
    faq: z.array(z.object({
      question: z.string(),
      answer: z.string()
    })).optional(),
    alternatives: z.array(z.object({
      brand: z.string(),
      offer: z.string(),
      url: z.string()
    })).optional(),
    seo: z.object({
      title: z.string().optional(),
      description: z.string().optional()
    }).optional(),
    adEligible: z.boolean().default(true)
  })
});

export const collections = {
  articles,
  tools,
  promos
};
