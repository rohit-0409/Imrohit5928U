# RuffiC portfolio

A responsive, static single-page portfolio for an independent Roblox developer. Open `index.html` directly, or host the contents of this folder on any static web host. No build step or package install is required.

## Personalize the site

Edit [`portfolio-data.js`](./portfolio-data.js) to update the intro image, email, games, visit counts, and video reel. Add, remove, or reorder entries in the `games` and `videos` arrays. Games support a title, visit count, image path, and alt text. The game images move continuously from right to left. Videos support a title and a YouTube URL or 11-character video ID; the page embeds a playable player and shows only its title and player.

The game entries have placeholder titles and blank visits. Replace them with your game names, verified counts, and gameplay images. The current game images are sample illustrations, not Roblox gameplay screenshots. The video entries have placeholder titles and blank YouTube URLs; add your titles and URLs to load the embeds.

You can click the intro image frame to choose an image for an immediate preview; that selection is saved only in that browser. To make it part of the published site, copy the image into `assets/` and set `profile.heroImage` to its relative path in `portfolio-data.js`.

The contact button uses the email in `profile.email`. Replace `hello@example.com` before publishing. The site loads DM Sans, DM Mono, and Instrument Serif from Google Fonts; system font fallbacks are included for offline use.

## Files

- `index.html` — sections, navigation, and content structure.
- `styles.css` — visual design, responsive layouts, and motion preferences.
- `site.js` — marquee, YouTube embeds, image selection, mobile navigation, and 3D hover tilt.
- `portfolio-data.js` — editable portfolio data.
- `assets/` — sample game art; replace it with real captures.

