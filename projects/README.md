# Storing Small Static Projects Here

This directory (`projects/`) is designed to host lightweight, self-contained static web applications directly inside your repository.

---

## 1. Directory Structure

Each static project should have its own dedicated subfolder with an `index.html` file and any accompanying assets:

```text
projects/
├── calculator/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── pomodoro-timer/
│   ├── index.html
│   └── app.js
└── markdown-previewer/
    ├── index.html
    └── styles.css
```

---

## 2. Adding a Static Project to `data/projects.json`

When registering a static project that lives in this folder, set its `liveUrl` to the **relative path from the root of the hub**:

```json
{
  "id": "calculator-app",
  "title": "Minimalist Calculator",
  "description": "A sleek, responsive calculator built with vanilla JavaScript and CSS Grid.",
  "category": "Tools",
  "image": "assets/images/projects/calculator.png",
  "liveUrl": "projects/calculator/index.html",
  "sourceUrl": "https://github.com/USERNAME/REPOSITORY/tree/main/projects/calculator",
  "featured": false
}
```

> **Important**: Notice that `liveUrl` begins with `projects/...` (relative to `index.html` at the hub root), **not** `/projects/...` and **not** `../projects/...`. This ensures the link works whether your GitHub Pages site is hosted at `https://USERNAME.github.io/` or inside a subpath like `https://USERNAME.github.io/project-hub/`.

---

## 3. Crucial Note: Adjusting Root-Relative Asset Paths

If you are moving an existing project into `projects/your-project/`, check its HTML and CSS files for **root-relative paths** that start with a leading slash `/`:

### ❌ Problematic (breaks inside subfolders):
```html
<link rel="stylesheet" href="/style.css">
<script src="/js/app.js"></script>
<img src="/images/logo.png">
```
*Why this breaks:* The leading slash `/` forces the browser to look at the domain root (e.g., `https://username.github.io/style.css`), completely bypassing your subfolder and resulting in 404 errors.

###  Correct (works everywhere):
Use **relative paths** without a leading slash:
```html
<link rel="stylesheet" href="style.css">
<!-- or -->
<link rel="stylesheet" href="./style.css">
<script src="js/app.js"></script>
<img src="images/logo.png">
```

---

## 4. External Projects

If a project is already hosted on its own domain, Vercel, Netlify, or another GitHub repository, you **do not** need to copy its files here. Simply configure its full external URL (`https://...`) in `data/projects.json`.
