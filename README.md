# alexandermervar.com

My personal site — a blog, projects page, and podcast feed built with [Astro](https://astro.build), deployed on [Netlify](https://netlify.com), served at a domain registered through [Hover](https://hover.com), and version-controlled here on GitHub.

See `STYLE_GUIDE.md` for the visual design system.

---

## Things you'll do all the time

These are the things you'll do repeatedly. Everything else in this README is background knowledge.

---

### Write a blog post

1. Create a new file in `src/content/blog/`. Name it whatever you want the URL to be — `my-post.md` becomes `/blog/my-post`.

2. Paste this at the top and fill it in:

```markdown
---
title: "Your Post Title"
description: "One sentence. Shows up in listings and the RSS feed."
pubDate: 2026-05-03
tags: ["tag-one", "tag-two"]
draft: false
---

Your post goes here. Write in plain **Markdown**.
```

3. Write below the second `---`. Everything there is your post body.

4. Set `draft: true` while you're still writing — it won't appear anywhere on the site until you change it to `false`.

5. When you're ready to publish:

```bash
cd ~/Projects/alexandermervar.com
git add src/content/blog/your-post.md
git commit -m "post: your post title"
git push
```

Netlify picks it up automatically. The site rebuilds in about 60 seconds and your post is live.

**What Markdown looks like:**

```markdown
# Heading

Regular paragraph text. **Bold**, *italic*, `inline code`.

[Link text](https://example.com)

![Image alt text](/images/my-photo.jpg)

- Bullet one
- Bullet two

> Blockquote

Footnote in text.[^1]

[^1]: The footnote content, rendered at the bottom of the post.

---   ← horizontal rule
```

Put images in `public/images/` and reference them as `/images/filename.jpg`. Footnotes work out of the box with the `[^1]` syntax — they auto-number and link back and forth.

---

### Add or update a project

Edit `src/pages/projects.astro` directly. The file is plain HTML-in-Astro — copy an existing `<li>` block, update the link, title, and description. Push to deploy.

---

### Publish a podcast episode

1. Put your MP3 in `public/podcast/` — or upload it somewhere like [Backblaze B2](https://www.backblaze.com/cloud-storage) if you'd rather not store audio in the repo.

2. Right-click the MP3 → Get Info → note the size in bytes.

3. Create a new file in `src/content/podcast/`. Name it anything — `episode-2.json`:

```json
{
  "title": "Episode 2 — Your Topic",
  "description": "What this episode is about.",
  "pubDate": "2026-05-03",
  "audioUrl": "https://alexandermervar.com/podcast/episode-2.mp3",
  "duration": "32:15",
  "fileSize": 46137344
}
```

`duration` can be `MM:SS` or `HH:MM:SS`. `fileSize` is the number you got from Get Info, in bytes.

4. Push it:

```bash
git add src/content/podcast/episode-2.json public/podcast/episode-2.mp3
git commit -m "podcast: episode 2"
git push
```

---

### Deploy (how pushing works)

Every `git push` to `main` triggers a Netlify rebuild. You don't do anything else.

```bash
git add .
git commit -m "describe what you changed"
git push
```

Watch it build at [app.netlify.com](https://app.netlify.com) if you're curious. Live in ~60 seconds.

---

### Run the site locally (optional)

If you want to preview before pushing:

```bash
cd ~/Projects/alexandermervar.com
npm install        # first time only
npm run dev
```

Open `http://localhost:4321`. Changes you make to any file reload instantly.

---

---

## The rest — what everything is and why

The sections below explain the full stack in detail. You don't need to read them to use the site.

---

## Table of contents

1. [What this site is](#what-this-site-is)
2. [The stack, explained](#the-stack-explained)
   - [Astro](#astro)
   - [Content Collections](#content-collections)
   - [RSS feeds](#rss-feeds)
   - [Podcast RSS (iTunes namespace)](#podcast-rss-itunes-namespace)
   - [Netlify](#netlify)
   - [GitHub](#github)
   - [Hover (domain registrar)](#hover-domain-registrar)
   - [DNS — how the domain points to Netlify](#dns--how-the-domain-points-to-netlify)
3. [Project structure](#project-structure)
4. [Things to fill in](#things-to-fill-in)

---

## What this site is

A minimal personal site with:

- A **home page** at `/`
- A **blog** at `/blog` — markdown files that get turned into HTML pages at build time
- A **projects page** at `/projects` — a hand-edited list of public work and repos
- An **RSS feed** at `/rss.xml` — a machine-readable list of blog posts that RSS readers (like [NetNewsWire](https://netnewswire.com) or [Feedly](https://feedly.com)) can subscribe to
- A **podcast feed** at `/podcast.xml` — an iTunes-compatible RSS feed that podcast apps (like [Overcast](https://overcast.fm) or [Pocket Casts](https://pocketcasts.com)) can subscribe to
- Zero client-side JavaScript — everything is plain HTML and CSS, generated ahead of time at build

---

## The stack, explained

### Astro

[Astro](https://astro.build) is a **static site generator**. You write pages in `.astro` files — which look like HTML with a small JavaScript frontmatter block at the top — and Astro compiles them into plain `.html` files. When someone visits the site, the server sends pure HTML. No JavaScript framework to download, no hydration step, no client-side rendering. Just fast, simple pages.

Astro's guiding idea is called **"zero JS by default"** — you opt *in* to interactivity rather than opting out of it. For a blog and podcast feed this is exactly right; there is nothing interactive here. Every page is just content.

The configuration lives in `astro.config.mjs`. The only settings in use are:

- `site` — the full URL of the live site; Astro uses this to generate absolute links inside RSS feeds
- `output: 'static'` — tells Astro to generate a static HTML file for every page at build time, rather than a server that renders pages on demand

**Good resources:**
- [Astro docs](https://docs.astro.build) — thorough and well-written
- [Why Astro?](https://docs.astro.build/en/concepts/why-astro/) — the team's own explanation of the design philosophy
- [Understanding SSG vs SSR](https://www.netlify.com/blog/2021/12/14/what-is-a-static-site-generator/) — Netlify's primer on static site generation

---

### Content Collections

[Content Collections](https://docs.astro.build/en/guides/content-collections/) are Astro's system for managing structured content. In this project there are two collections: `blog` (markdown files) and `podcast` (JSON files).

The schema for both lives in `src/content.config.ts`. A schema is a description of exactly what fields each piece of content must have. Astro uses [Zod](https://zod.dev) for this — a TypeScript-first validation library. If you add a blog post with a typo in the date or a missing `title`, the build fails immediately with a clear error rather than silently producing a broken page.

**Blog posts** are markdown files in `src/content/blog/`. The block between the two `---` lines at the top is called **frontmatter** — it's YAML metadata (title, date, tags, etc.) that maps to the schema. Everything below the second `---` is the post body, written in plain [markdown](https://www.markdownguide.org/getting-started/).

**Podcast episodes** are JSON files in `src/content/podcast/`. JSON works better than markdown here because episodes don't have a body — they're just structured metadata about an audio file.

**The loader system (Astro v6):** Content is pulled in by "loaders". The `glob()` loader scans a directory for files matching a pattern. `glob({ pattern: '**/*.md', base: './src/content/blog' })` means "find every `.md` file, anywhere inside `src/content/blog`". You can nest posts in subdirectories by year or category and the loader picks them all up automatically.

**Good resources:**
- [Content Collections docs](https://docs.astro.build/en/guides/content-collections/)
- [Zod documentation](https://zod.dev) — understanding schema validation
- [Markdown guide](https://www.markdownguide.org) — a comprehensive reference for markdown syntax
- [What is frontmatter?](https://jekyllrb.com/docs/front-matter/) — Jekyll (an older static site generator) coined the term; the concept is identical

---

### RSS feeds

[RSS](https://en.wikipedia.org/wiki/RSS) (Really Simple Syndication) is a decades-old open standard for publishing a list of content updates in a machine-readable XML format. An RSS reader (like [NetNewsWire](https://netnewswire.com), [Reeder](https://reederapp.com), or [Feedly](https://feedly.com)) periodically fetches the feed URL and shows you anything new. It's the original "subscribe without an algorithm" — no platform, no feed curation, just the content you asked for.

The blog RSS feed is generated by `src/pages/rss.xml.js`. It uses Astro's official [`@astrojs/rss`](https://docs.astro.build/en/guides/rss/) package, which handles the XML boilerplate. You hand it a list of items (title, description, pubDate, link) and it produces a valid [RSS 2.0](https://www.rssboard.org/rss-specification) document.

The `<link rel="alternate" type="application/rss+xml">` tags in the `<head>` of every page are called **autodiscovery** links. They're invisible to readers but tell browsers and RSS apps where to find the feed — so something like NetNewsWire can detect it just from the homepage URL without you having to paste the feed URL manually.

**Good resources:**
- [RSS 2.0 specification](https://www.rssboard.org/rss-specification) — the actual standard
- [@astrojs/rss docs](https://docs.astro.build/en/guides/rss/)
- [About RSS](https://aboutrss.github.io/about/) — a good explainer on what RSS is and why it matters
- [NetNewsWire](https://netnewswire.com) — free, open source RSS reader for Mac and iOS

---

### Podcast RSS (iTunes namespace)

A podcast feed is also RSS, but with extra fields that podcast apps understand. Apple defined the [`itunes:` XML namespace](https://podcasters.apple.com/support/823-podcast-requirements) when they added podcasts to iTunes in 2005, and it became the industry standard that every podcast app (Apple Podcasts, Spotify, Overcast, Pocket Casts, etc.) supports.

The podcast feed is hand-built in `src/pages/podcast.xml.js` rather than using `@astrojs/rss`, because the iTunes namespace requires tags the RSS library doesn't generate. The feed includes:

- `<itunes:author>` — who makes the show
- `<itunes:owner>` — contact info for Apple Podcasts (name + email); this is not displayed publicly
- `<itunes:image>` — cover art URL (must be at least 1400×1400px for Apple Podcasts)
- `<itunes:category>` — which category your show appears under in Apple Podcasts
- `<itunes:explicit>` — content rating (`true` or `false`)

Each episode is an `<item>` that includes:
- `<enclosure>` — the actual audio file URL, its size in bytes, and MIME type (`audio/mpeg` for MP3)
- `<itunes:duration>` — length of the episode (used by apps to show a progress bar)

To get listed: submit the feed URL at [podcastsconnect.apple.com](https://podcastsconnect.apple.com) for Apple Podcasts and [podcasters.spotify.com](https://podcasters.spotify.com) for Spotify.

**Good resources:**
- [Apple Podcasts RSS requirements](https://podcasters.apple.com/support/823-podcast-requirements)
- [iTunes category list](https://podcasters.apple.com/support/1691-apple-podcasts-categories)
- [Podcast namespace spec](https://github.com/Podcastindex-org/podcast-namespace) — a modern community-driven extension of the iTunes namespace, worth knowing about

---

### Netlify

[Netlify](https://netlify.com) hosts the site. It connects to this GitHub repo and automatically rebuilds and redeploys whenever you push to `main`.

The build process on Netlify is:

1. Clone the repo
2. Run `npm install` (installs dependencies fresh — no node_modules from your laptop)
3. Run `npm run build` (Astro compiles everything into the `dist/` folder)
4. Deploy `dist/` to Netlify's global CDN

The `netlify.toml` at the project root tells Netlify exactly what to do. It's intentionally minimal — just the build command, the publish directory, and the Node.js version.

Netlify also handles:
- **HTTPS automatically** — free SSL certificates provisioned via [Let's Encrypt](https://letsencrypt.org), renewed automatically
- **Deploy previews** — pull requests get their own live preview URL before merging
- **Instant rollbacks** — every deploy is stored; you can roll back to any previous version in one click from the Netlify dashboard

**Good resources:**
- [Netlify docs](https://docs.netlify.com)
- [Astro on Netlify](https://docs.astro.build/en/guides/deploy/netlify/)
- [What is a CDN?](https://www.cloudflare.com/learning/cdn/what-is-a-cdn/) — Cloudflare's plain-English explainer
- [Let's Encrypt](https://letsencrypt.org/about/) — the nonprofit that issues free SSL certificates

---

### GitHub

[GitHub](https://github.com) stores the code and acts as the trigger for Netlify deploys. Every `git push` to `main` fires a Netlify webhook, which kicks off a new build automatically.

The `.gitignore` file lists things that should *not* be committed:

| Entry | Why it's excluded |
|---|---|
| `node_modules/` | npm packages; large and always reinstalled from `package.json` |
| `dist/` | Build output; regenerated fresh on every deploy |
| `.astro/` | Astro's internal type-generation cache |
| `.env` | Environment variables / secrets — **never commit these** |

**Good resources:**
- [Git handbook](https://guides.github.com/introduction/git-handbook/)
- [GitHub flow](https://guides.github.com/introduction/flow/) — a lightweight branching workflow
- [Oh Shit, Git!](https://ohshitgit.com) — plain-English fixes for common git mistakes

---

### Hover (domain registrar)

[Hover](https://hover.com) is where the domain `alexandermervar.com` is registered. A **domain registrar** is a company that holds the lease on your domain name. You pay them annually to keep the rights to the domain. Hover is well regarded for having a clean interface and not upselling you on things you don't need.

The registrar controls **where DNS queries for your domain go** — specifically, which **nameservers** are authoritative for it. By default those are Hover's own nameservers. To route traffic through Netlify's CDN, you point the DNS records at Hover to Netlify's servers.

---

### DNS — how the domain points to Netlify

DNS (Domain Name System) is the phone book of the internet — it translates `alexandermervar.com` into an IP address that browsers can connect to. There are a few record types involved:

| Record type | What it does |
|---|---|
| `A` | Maps a domain to an IPv4 address |
| `AAAA` | Maps a domain to an IPv6 address |
| `CNAME` | Maps a domain to another domain name (an alias) |
| `NS` | Delegates a domain to specific nameservers |

**Current DNS setup in Hover:**

| Type | Hostname | Value |
|---|---|---|
| `A` | `@` (root domain) | `75.2.60.5` (Netlify load balancer) |
| `CNAME` | `www` | `alexandermervar.netlify.app` |
| `CNAME` | `oscars` | `oscars-mervar-party.netlify.app` |

The `oscars` record means `oscars.alexandermervar.com` resolves to the Oscars party site automatically.

**Good resources:**
- [Netlify custom domains docs](https://docs.netlify.com/domains-https/custom-domains/)
- [How DNS works (comic)](https://howdns.works) — a genuinely good visual explainer
- [What is DNS propagation?](https://www.cloudflare.com/learning/dns/what-is-dns/) — Cloudflare's explainer

---

## Project structure

```
alexandermervar.com/
├── astro.config.mjs          # Astro config (site URL, output mode)
├── netlify.toml              # Netlify build settings
├── package.json              # npm dependencies and scripts
├── STYLE_GUIDE.md            # Visual design system reference
├── src/
│   ├── content.config.ts     # Schema definitions for blog + podcast collections
│   ├── content/
│   │   ├── blog/             # Blog posts as .md files  ← you work here
│   │   └── podcast/          # Podcast episodes as .json files  ← and here
│   ├── layouts/
│   │   └── BaseLayout.astro  # Shared HTML shell (head, nav, footer, feed links)
│   ├── pages/
│   │   ├── index.astro          # Home page
│   │   ├── blog/
│   │   │   ├── index.astro      # Blog listing page (/blog)
│   │   │   └── [...slug].astro  # Individual post pages (/blog/post-name)
│   │   ├── projects.astro       # Projects page (/projects)
│   │   ├── rss.xml.js           # Blog RSS feed (/rss.xml)
│   │   └── podcast.xml.js       # Podcast RSS feed (/podcast.xml)
│   └── styles/
│       └── global.css           # Site-wide stylesheet (mirrors public/styles/)
└── public/                   # Static assets (copied as-is into dist/)
    ├── favicon.ico
    ├── favicon-16x16.png
    ├── favicon-32x32.png
    ├── apple-touch-icon.png
    ├── android-chrome-192x192.png
    ├── android-chrome-512x512.png
    ├── podcast/              # Put MP3s here if self-hosting audio
    └── styles/
        └── global.css        # The stylesheet served to browsers
```

---

## Things to fill in

Open `src/pages/podcast.xml.js` and update the constants at the top before submitting to Apple Podcasts or Spotify:

| Constant | What it needs |
|---|---|
| `PODCAST_TITLE` | Your show's name |
| `PODCAST_DESCRIPTION` | A paragraph describing the show |
| `PODCAST_EMAIL` | Contact email shown to Apple Podcasts (not publicly displayed) |
| `PODCAST_IMAGE` | URL to your cover art — must be at least 1400×1400px JPEG or PNG |
| `PODCAST_CATEGORY` | Pick from the [iTunes category list](https://podcasters.apple.com/support/1691-apple-podcasts-categories) |
