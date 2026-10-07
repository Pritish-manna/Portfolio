# Pritish Manna Portfolio

A production-ready, single-page personal portfolio built with plain HTML5, CSS, and vanilla JavaScript. It has no framework, build step, or npm dependency and can be hosted directly on GitHub Pages.

## Files

```text
Pritish_Manna_Portfolio/
├── index.html
├── css/
│   └── style.css
├── js/
│   └── main.js
├── assets/
│   ├── pritish-manna-profile.jpg
│   └── Pritish_Manna_CV.pdf        # included (replace with your latest CV anytime, keep the same name)
└── README.md
```

> The page uses the requested external `css/style.css` and `js/main.js` files, so the structure is ready to extend without a build step.

## Run locally

### Option 1: Open directly
Double-click `index.html`. The portfolio works without a build step.

### Option 2: Use a local server
From the portfolio folder:

```bash
python -m http.server 8000
```

Then open:

```text
http://localhost:8000
```

A local server is useful for testing the client-side GitHub API request and browser behavior.

## Placeholders / customization

1. **Resume PDF**
   - Add your final PDF as:
     `assets/Pritish_Manna_CV.pdf`
   - The hero's Download Resume button already points there.
   - TODO is included in `index.html`.

2. **Profile photo**
   - The supplied profile photo is already included as:
     `assets/pritish-manna-profile.jpg`
   - Replace that file if a different photo is preferred.

3. **Project GitHub links**
   - The current project GitHub buttons intentionally point to the provided GitHub profile:
     `https://github.com/Pritish-manna`
   - Replace each button URL with the actual project repository URL when available.
   - TODO comments identify each location.

4. **Live demos**
   - Live Demo buttons are disabled because no project demo URLs were provided.
   - Add a URL and remove the `btn-disabled` / `disabled` state when a real demo is available.

5. **Graduation year / CGPA**
   - No graduation year or CGPA was supplied.
   - The page deliberately does not invent either. A TODO comment marks the education area.

6. **Canonical / Open Graph URLs**
   - The current canonical and social metadata use the supplied GitHub profile as a safe placeholder destination.
   - Update them after publishing the site to a final domain.

## GitHub Pages deployment

1. Create a new GitHub repository, for example `portfolio`.
2. Keep the repository public if you want a standard free GitHub Pages setup.
3. Upload all files while preserving the folder structure.
4. Commit and push the files.
5. On GitHub, open **Settings → Pages**.
6. Under **Build and deployment**, choose **Deploy from a branch**.
7. Select the branch containing `index.html`, usually `main`.
8. Select the root folder `/ (root)`.
9. Save.
10. GitHub will provide the published Pages URL.
11. Update the canonical and Open Graph URL values in `index.html` to your actual published URL.

## Customize colors

Open `css/style.css` and edit the CSS variables near the top:

```css
:root {
  --bg: #f6f8fc;
  --surface: #ffffff;
  --text: #111827;
  --muted: #5f6b7a;
  --accent: #087f8c;
  --accent-2: #6d5dfc;
}
```

The dark theme has its own `[data-theme="dark"]` variable set.

## Customize fonts

Google Fonts are loaded in the `<head>`:

- `Manrope` for body/UI text
- `DM Mono` for code-style accents

To change them, replace the Google Fonts URL and the matching CSS `font-family` values. Keep system fallbacks in place for resilience.

## Features

- Responsive layout for mobile, tablet, and desktop
- System-aware dark/light mode with localStorage persistence
- Mobile navigation
- Rotating hero role line
- Scroll reveal animations
- Active navigation link highlighting
- Accessible project modal with keyboard support
- Client-side contact validation and `mailto:` draft
- Copy-to-clipboard contact buttons
- Optional GitHub public repository API integration
- GitHub API failure/rate-limit fallback
- SEO metadata and Person JSON-LD
- Reduced-motion support
- No framework, npm package, or build process

## Data accuracy

The portfolio content is limited to the supplied source information. It does not invent dates, graduation year, CGPA, testimonials, project metrics beyond the supplied 10,000+ figures, awards, or company claims.
