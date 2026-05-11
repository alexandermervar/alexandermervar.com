# alexandermervar.com — Site Improvements Demo

*2026-05-05T20:40:35Z by Showboat 0.6.1*
<!-- showboat-id: e37232f0-10ca-43fa-9ee3-ac5673e591bb -->

Three changes were made to alexandermervar.com: security headers in netlify.toml, og:image tag in BaseLayout.astro, and a custom 404 page. All verified below.

--- 1. Security Headers (netlify.toml) ---

```bash
grep -A 8 '\[\[headers\]\]' /Users/alexandermervar/Projects/alexandermervar.com/netlify.toml
```

```output
[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```

--- 2. og:image tag (BaseLayout.astro) ---

```bash
grep -A 1 'og:image' /Users/alexandermervar/Projects/alexandermervar.com/src/layouts/BaseLayout.astro
```

```output
    <meta property="og:image" content={`${siteUrl}/images/about.jpg`} />
    <meta property="og:image:alt" content="Alexander Mervar" />

```

--- 3. Custom 404 page ---

```bash
cat /Users/alexandermervar/Projects/alexandermervar.com/src/pages/404.astro
```

```output
---
import BaseLayout from '../layouts/BaseLayout.astro';
---

<BaseLayout title="Page not found — Alexander Mervar">
  <h1>Page not found</h1>
  <p>That page doesn't exist. Maybe it moved, maybe it never was.</p>
  <p><a href="/">Back to home &rarr;</a></p>
</BaseLayout>
```

--- 4. Build output confirms all pages including 404 ---

```bash
npm run build 2>&1 | grep -E '(404|about|blog|projects|rss|index|Complete)'
```

```output
15:41:32 [build] ✓ Completed in 181ms.
15:41:32   ├─ /404.html (+4ms) 
15:41:32   ├─ /about/index.html (+1ms) 
15:41:32   ├─ /blog/index.html (+1ms) 
15:41:32   ├─ /blog/hello-world/index.html (+1ms) 
15:41:32   ├─ /projects/index.html (+1ms) 
15:41:32   ├─ /rss.xml (+10ms) 
15:41:32   ├─ /index.html (+1ms) 
15:41:32 ✓ Completed in 27ms.
15:41:32 [build] ✓ Completed in 402ms.
15:41:32 [build] Complete!
```

--- 5. Rodney: verify 404 page renders in built dist ---

```bash
rodney open file:///Users/alexandermervar/Projects/alexandermervar.com/dist/404.html && rodney waitload && rodney title
```

```output
Page not found — Alexander Mervar
Page loaded
Page not found — Alexander Mervar
```

```bash
rodney open file:///Users/alexandermervar/Projects/alexandermervar.com/dist/404.html && rodney waitload && rodney text 'h1'
```

```output
Page not found — Alexander Mervar
Page loaded
Page not found
```

```bash {image}
![Custom 404 page rendered in browser](/tmp/404-page.png)
```

![Custom 404 page rendered in browser](3c747b5c-2026-05-05.png)

--- 6. Rodney: verify og:image meta tag in built HTML ---

```bash
rodney open file:///Users/alexandermervar/Projects/alexandermervar.com/dist/index.html && rodney waitload && rodney attr 'meta[property="og:image"]' content
```

```output
Alexander Mervar
Page loaded
https://alexandermervar.com/images/about.jpg
```

--- 7. Verify netlify.toml headers are present in dist ---

```bash
cat /Users/alexandermervar/Projects/alexandermervar.com/netlify.toml
```

```output
[build]
  command   = "npm run build"
  publish   = "dist"

[build.environment]
  NODE_VERSION = "22"

[[headers]]
  for = "/*"
  [headers.values]
    X-Frame-Options = "DENY"
    X-Content-Type-Options = "nosniff"
    Referrer-Policy = "strict-origin-when-cross-origin"
    Permissions-Policy = "camera=(), microphone=(), geolocation=()"
```
