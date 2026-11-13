# Review checklist

## Always
- The PR does one thing. Pure refactors only move or rename code.
- `pnpm generate` succeeds (the Build workflow runs it on every PR).
- For visual changes, the PR says which widths were checked (360 / 768 / 1440 px) or that it was not checked.
- No new dependency, no version change, no `indexable` change unless that is the point of the PR.

## Content and copy
- All visible text is Persian, friendly and direct, written in the team's voice ("we"), not about a single developer.
- No invented claims: prices, durations, guarantees, client names, ratings or testimonials must come from the owner.
- Numbers use Persian digits (`toFa`). A number followed by a dot keeps the `dir="rtl"` span.
- FAQ and testimonial front matter matches `content.config.ts`. No unknown or unused fields.
- Media paths in `content/` match real files in `public/` (check the exact file name and extension).

## Layout and design
- Themes: colors come from the semantic tokens (`bg-page`, `text-fg`, `bg-card`, `text-brand-ink`), not hard-coded white/black; both night and day must look right.
- Looks right at 360, 768 and 1440 px: no horizontal scroll, no clipped text, no overlapping elements, header fits on small phones.
- Radii and colors follow the existing scale (`rounded-lg` / `rounded-xl`, `brand`, `dark`). No new glows, gradients or decorative effects unless requested.
- Placeholders have the same size as the real media, so adding the real file does not move the layout.
- `.reveal` elements keep their own transition; other transitions live on an inner element.

## Performance
- No request to a third-party host at runtime (icons, fonts, scripts). Icons use literal `i-lucide-*` / `i-simple-icons-*` names so they are bundled.
- New images are WebP and sized close to their display size (about 2x). New videos use `preload="metadata"`.
- No new client-side library for something CSS or the existing code can do.

## SEO
- One `h1`. Headings keep a sensible order. Every `<img>` has an `alt`.
- Page title and description are set in `app/pages/index.vue`; the site description in `nuxt.config.ts` stays consistent with them.
- `site.indexable` is `false` until launch. Flag any PR that changes it.

## Accessibility
- Interactive elements are real buttons or links, reachable by keyboard, with visible focus.
- Text contrast on the dark background stays readable (avoid going below roughly `text-fg/60` for body text, in both themes).
- Motion has a reduced-motion fallback where it is more than a small fade.

## Safety
- No secrets, tokens, phone numbers or links that were not given by the owner, and no personal file paths.
- No `node_modules`, `.nuxt`, `.output`, `.data`, `dist` or `.env` in the diff.
- External links that open a new tab use `rel="noopener noreferrer"`.
