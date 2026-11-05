import { defineContentConfig, defineCollection, z } from '@nuxt/content'

export default defineContentConfig({
  collections: {
    testimonials: defineCollection({
      type: 'page',
      source: 'testimonials/**/*.md',
      schema: z.object({
        name: z.string(),
        role: z.string().optional(),
        company: z.string().optional(),
        avatar: z.string().optional(),
        video: z.string().optional(),
        website: z.string().optional(),
        // اسکرین‌شات‌های سایت کارفرما؛ اولی کاورِ کارته و بقیه تو گالریِ مودال نشون داده میشن
        images: z.array(z.string()).default([]),
        visible: z.boolean().default(true)
      })
    }),

    faq: defineCollection({
      type: 'page',
      source: 'faq/**/*.md',
      schema: z.object({
        question: z.string(),
        order: z.number().default(0)
      })
    })
  }
})
