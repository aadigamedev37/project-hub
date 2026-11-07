# Personal Project Hub

A clean, responsive, and lightweight portfolio hub designed to showcase web applications, tools, and client projects. Engineered for seamless deployment to **GitHub Pages** with zero build steps or dependencies.

---

## 📁 Repository Structure

```text
project-hub/
├── index.html                  # Main portfolio showcase interface
├── .nojekyll                   # Bypasses Jekyll processing on GitHub Pages
├── assets/
│   ├── css/
│   │   └── styles.css          # Modern responsive styling & theme variables
│   ├── js/
│   │   └── main.js             # Dynamic project rendering, search & filtering
│   └── images/
│       └── projects/           # Screenshots & thumbnails for your projects
├── data/
│   └── projects.json           # Catalog of your projects (edit this to add projects)
├── projects/                   # Optional: folder for small static sub-projects
│   └── README.md               # Guide on formatting static subfolder projects
└── README.md                   # This documentation & deployment guide
```

---

## 🎯 How Project Links Work

This hub supports two types of projects:

### 1. External Projects (Hosted Elsewhere)
If your project is already live on its own custom domain, Vercel, Netlify, Render, or another hosting provider (like the NAVRAI salon site), simply provide its full URL (e.g., `https://navraibeauty.com/`). You **do not** copy any project files into this repository.

### 2. Internal Static Projects (Hosted in this Repository)
If you have small static HTML/CSS/JS experiments or mini-tools:
1. Create a folder inside `projects/` (e.g., `projects/my-app/`).
2. Put its `index.html` and assets inside that folder.
3. In `data/projects.json`, set `"liveUrl": "projects/my-app/index.html"`.

> ⚠️ **Important on Relative Paths**: Ensure your subfolder projects do not use root-relative links like `<link href="/style.css">`. Instead, use `<link href="style.css">` or `./style.css` so they resolve correctly inside subfolders.

---

## 📝 How to Add a Project

To add a new project, you only need to edit **`data/projects.json`**—no need to touch `index.html`!

### Step 1: Add a Screenshot (Optional)
Place a screenshot image (e.g., `1200x675` or `16:9` ratio recommended, `.png`, `.jpg`, or `.webp`) in `assets/images/projects/`:
```text
assets/images/projects/my-project.png
```
*Note: If you do not have a screenshot yet, leave `"image": ""` empty. The hub will automatically render an elegant fallback card with a category monogram and pattern.*

### Step 2: Add an Entry in `data/projects.json`
Open `data/projects.json` and add a new object to the array:

```json
[
  {
    "id": "navrai-studio",
    "title": "NAVRAI Makeup & Beauty Studio",
    "description": "A website for my family’s makeup and beauty business.",
    "category": "Websites",
    "image": "",
    "liveUrl": "https://navraibeauty.com/",
    "sourceUrl": "",
    "featured": true
  },
  {
    "id": "recipe-finder",
    "title": "TasteCraft Recipe Engine",
    "description": "An interactive culinary search app filtering recipes by dietary preference and ingredients.",
    "category": "Web Apps",
    "image": "assets/images/projects/recipe-finder.png",
    "liveUrl": "https://tastecraft.example.com",
    "sourceUrl": "https://github.com/USERNAME/tastecraft",
    "featured": true
  }
]
```

### Supported Fields:

| Field | Type | Description |
|---|---|---|
| `id` | `string` | Unique identifier (e.g., `"portfolio-v1"`). |
| `title` | `string` | Project display name. |
| `description` | `string` | Short 1–2 sentence summary of the project. |
| `category` | `string` | Category name (e.g., `"Websites"`, `"Web Apps"`, `"Tools"`, `"Experiments"`). Categories are automatically grouped into filter buttons. |
| `image` | `string` | Relative path to screenshot (e.g., `"assets/images/projects/preview.png"`), external image URL, or `""` for automatic fallback. |
| `liveUrl` | `string` | Link to the live app or site. If omitted or empty (`""`), the "Live Project" button is hidden. |
| `sourceUrl` | `string` | Link to the GitHub repository. If omitted or empty (`""`), the "Source Code" button is hidden. |
| `featured` | `boolean` | Set to `true` to display a gold "Featured" badge on the card. |

---

## 📋 Sample Entries You Can Copy

### Template A: External Project with Source Code
```json
{
  "id": "task-flow",
  "title": "TaskFlow Productivity Board",
  "description": "A Kanban task management app with drag-and-drop workflow and local storage persistence.",
  "category": "Web Apps",
  "image": "assets/images/projects/taskflow.png",
  "liveUrl": "https://taskflow.vercel.app",
  "sourceUrl": "https://github.com/USERNAME/taskflow",
  "featured": false
}
```

### Template B: Subfolder Static Project Hosted Here
```json
{
  "id": "unit-converter",
  "title": "Universal Unit Converter",
  "description": "A quick utility for converting metrics, currencies, and temperatures.",
  "category": "Tools",
  "image": "assets/images/projects/converter.png",
  "liveUrl": "projects/unit-converter/index.html",
  "sourceUrl": "https://github.com/USERNAME/project-hub/tree/main/projects/unit-converter",
  "featured": false
}
```

### Template C: Closed-Source Client Project (Live link only)
```json
{
  "id": "elite-interiors",
  "title": "Elite Interiors Portfolio",
  "description": "An architectural showcase site with high-resolution gallery and booking request form.",
  "category": "Websites",
  "image": "assets/images/projects/elite.png",
  "liveUrl": "https://eliteinteriors.example.com",
  "sourceUrl": "",
  "featured": false
}
```

---

## 💻 How to Preview Locally

Modern web browsers restrict loading local JSON files via the `file://` protocol due to security (CORS) rules. Always preview the hub using a lightweight local web server.

### Option 1: Python (Recommended)
Open your terminal inside the `project-hub` folder and run:
```bash
python -m http.server 8000
```
Then visit: **`http://localhost:8000`** in your browser.

### Option 2: Node.js / npx
```bash
npx serve .
```

### Option 3: VS Code Live Server
If you use VS Code, install the **Live Server** extension, right-click `index.html`, and choose **Open with Live Server**.

---

## 🚀 How to Publish on GitHub Pages

### Step 1: Initialize Git and Push to GitHub
1. Create a new repository on [GitHub](https://github.com/new).
2. Open your terminal in the `project-hub` directory and initialize git:
   ```bash
   git init
   git add .
   git commit -m "Initial commit: personal project hub"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPOSITORY.git
   git push -u origin main
   ```

### Step 2: Enable GitHub Pages
1. On GitHub, navigate to your repository's **Settings** tab.
2. In the left sidebar, click **Pages** (under the "Code and automation" section).
3. Under **Build and deployment**:
   - **Source**: Select `Deploy from a branch`.
   - **Branch**: Select `main` branch and `/ (root)` folder.
4. Click **Save**.
5. Wait 1–2 minutes. GitHub will provide your live URL at the top of the Pages settings page!

---

## 🌐 Account Site vs. Project Repository

Understanding how GitHub Pages URLs work:

| Repository Name | Live URL | Description |
|---|---|---|
| `USERNAME.github.io` | `https://USERNAME.github.io/` | **User Account Site**: Serves directly at the root of your GitHub username domain. You can only have one per GitHub account. |
| `project-hub` (or any other name) | `https://USERNAME.github.io/project-hub/` | **Project Repository**: Serves under a subpath matching your repository name. |

> **Why this hub is special**: All CSS, JavaScript, and data URLs in this project use strict **relative paths** (`assets/...`, `data/...`). This means the site works identically regardless of whether you choose an account site or a project repository name!

---

## 🔒 What GitHub Pages CAN and CANNOT Do

### What GitHub Pages Supports:
- HTML, CSS, JavaScript files.
- Client-side frameworks and libraries.
- Static assets (images, PDFs, fonts, SVG).
- Client-side APIs (calling public REST endpoints via `fetch`).

### What GitHub Pages DOES NOT Support:
- **No Server-Side Code**: You cannot execute Node.js (`server.js`), Python (`Flask`/`Django`), PHP, Ruby, or Go on GitHub Pages.
- **No Databases**: There is no MySQL, PostgreSQL, or MongoDB server attached.
- *Tip*: If you have a full-stack project with a backend, host the backend on a service like Render, Railway, or Fly.io, and place the link under `"liveUrl"` in this hub.

---

## 🛡️ Security Best Practices

Because GitHub Pages repositories are usually public:
- **NEVER commit sensitive credentials**: Do not commit `.env` files, API keys, passwords, database credentials, or secret tokens.
- **NEVER commit private client files**: Keep personal client contracts, raw confidential customer data, or proprietary private source files out of public repositories.
- If an API key is needed on the frontend, ensure it is restricted by domain in the API provider's console.
