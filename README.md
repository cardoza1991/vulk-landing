# VULK Landing Page

Static Cloudflare Pages landing page for VULK.

## Files

- `index.html` - single-page site markup and front-end waitlist form.
- `styles.css` - responsive dark theme styling.
- `vulk_hero.png` - hero image asset.
- `wrangler.toml` - Cloudflare Pages configuration.

## Deploy

1. Install Wrangler if needed:

   ```bash
   npm install -g wrangler
   ```

2. Log in to Cloudflare:

   ```bash
   wrangler login
   ```

3. Deploy from the project root:

   ```bash
   wrangler pages deploy .
   ```

## Waitlist Form

The form currently posts to a placeholder Formspree URL. Replace the `action`
attribute in `index.html` with a real Formspree endpoint or a Cloudflare Pages
Function endpoint before launch.
