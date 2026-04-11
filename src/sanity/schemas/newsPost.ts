import { defineField, defineType } from 'sanity';

export const newsPost = defineType({
  name: 'newsPost',
  title: 'News Post',
  type: 'document',
  fields: [
    defineField({ name: 'title', title: 'Title', type: 'string', validation: (r) => r.required() }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (r) => r.required(),
    }),
    defineField({ name: 'excerpt', title: 'Excerpt', type: 'text', rows: 3 }),
    defineField({ name: 'featuredImage', title: 'Featured Image', type: 'image', options: { hotspot: true } }),
    defineField({
      name: 'body',
      title: 'Body',
      type: 'array',
      of: [
        { type: 'block' },
        { type: 'image', options: { hotspot: true } },
      ],
    }),
    defineField({ name: 'publishedAt', title: 'Published At', type: 'datetime' }),
  ],
  preview: {
    select: { title: 'title', media: 'featuredImage' },
  },
  orderings: [
    { title: 'Published Date', name: 'publishedAt', by: [{ field: 'publishedAt', direction: 'desc' }] },
  ],
});
