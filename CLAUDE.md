# CLAUDE.md

Portfolio / landing site for **مهندسین سایت** (a Laravel + Vue web team) that sells e-commerce websites to store owners. Persian (RTL), dark-only, fully static.

## Stack
- Nuxt 4 (`app/` directory), SSG via `pnpm generate`
- `@nuxt/content` (FAQ and testimonials as Markdown), `@nuxt/ui`, `@nuxtjs/seo`, `@nuxt/fonts`
- Tailwind CSS v4 (`@theme` in `app/assets/css/main.css`), `lenis` for smooth scroll
- Package manager: **pnpm**. Versions are pinned exactly in `package.json`.

## Commands
- `pnpm install`: install dependencies (also runs `nuxt prepare`)
- `pnpm dev`: dev server on http://localhost:3000
- `pnpm generate`: static build into `.output/public`
- `pnpm preview`: serve the generated site
- If the dev server or build behaves strangely after pulling or switching branches: `pnpm nuxt cleanup`, then retry. A stale `.nuxt` directory has caused fake errors before.

## Layout
- `app/components/`: one component per page section (`HeroSection`, `AboutSection`, `FeaturesSection`, `TestimonialsSection`, `TechStack`, `FaqSection`, `ContactSection`) plus `AppHeader`, `AppFooter`, `TestimonialCard`, `ProjectModal`
- `app/composables/`: `useScrollReveal`, `useSectionScroll` (smooth-scroll + the click-pause switch), `useTechStack` (tech logos)
- `app/pages/index.vue`: the only page; page-level SEO lives here
- `content/faq/*.md` and `content/testimonials/*.md`: content collections (schemas in `content.config.ts`)
- `public/`: fonts, images, testimonial videos. Absolute paths like `/images/...` are used in content.
- `nuxt.config.ts`: site name/description, `site.indexable`, icon bundling, fonts, color mode

## Conventions
- **Language:** all user-facing text is Persian, in a friendly, direct tone (the voice is "we", a team, not a single developer). Code comments in this repo are Persian too. Commit messages and PR text are **English**.
- **Dark-only:** the site is forced dark. Write plain dark colors; do not add `dark:` variants or light-theme classes.
- **Brand color** is `#00DC82` (`brand`). Neutral base is `#0A0A0A` (`dark`). Radii are intentionally soft and small (`rounded-lg` / `rounded-xl`), not pill-shaped everywhere.
- **Fonts:** `--font-sans` in `main.css` selects Arad or YekanBakh (one-line switch). Both `@font-face` groups are local. Do not add online font providers.
- **Persian numerals** come from `toFa()`. In RTL, a number followed by a dot is rendered in a `dir="rtl"` span so the dot sits to the left of the digits. Do not use `tabular-nums` with Arad (its `tnum` makes digits uneven).
- **Scroll reveal:** `.reveal` sets its own transition on the element, so put other transitions/transforms on an inner element, not on the `.reveal` element itself.
- **Icons** are bundled locally (`icon.clientBundle` scans `app/**/*.{vue,ts}`) and `fallbackToApi` is off. Use full literal names like `i-lucide-phone` so the scanner finds them. Never rely on the Iconify API at runtime.
- **Placeholders:** missing media (profile photo, feature images, testimonial videos) shows a dashed "coming soon" box. Keep placeholders the same size as the real media so the layout does not jump.
- No Nuxt Studio, no light/dark toggle, no `og-image` module (the OG image is the static `/images/og-image.webp`).

## Working agreements
- Make **only** the change that was asked for. Earlier large redesigns were rejected; if a request could be read as a big redesign, ask first.
- Work on a branch and open a PR (English title and description). Never push to `main` directly.
- Check visual changes in a real build at 360, 768 and 1440 px before opening the PR. If you cannot, say so in the PR.
- Do not add dependencies, change pinned versions, or touch `indexable` without being asked. `indexable: false` is intentional until launch; it must become `true` before the site goes live.
- Do not commit `node_modules`, `.nuxt`, `.output`, `.data`, `dist` or `.env` (see `.gitignore`).
- Anything the owner has to supply (real videos, screenshots, testimonial text, FAQ facts such as support duration or payment terms) is left as a clearly marked placeholder, never invented.

Review checklist: see [REVIEW.md](./REVIEW.md).
