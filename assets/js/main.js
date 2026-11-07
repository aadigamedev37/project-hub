/**
 * Project Hub - Main Application Script
 * Dynamically loads and filters projects from data/projects.json
 */

(function () {
  'use strict';

  // State
  let projects = [];
  let currentCategory = 'all';
  let searchQuery = '';

  // DOM Elements
  const projectsGrid = document.getElementById('projects-grid');
  const categoryChipsContainer = document.getElementById('category-chips');
  const searchInput = document.getElementById('search-input');
  const clearSearchBtn = document.getElementById('clear-search-btn');
  const resultsCounter = document.getElementById('results-counter');
  const themeToggleBtn = document.getElementById('theme-toggle-btn');

  // Initialize Theme
  initTheme();

  // Load Data on DOM Ready
  document.addEventListener('DOMContentLoaded', loadProjects);

  /**
   * Theme Switcher (Dark / Light) with LocalStorage persistence
   */
  function initTheme() {
    const savedTheme = localStorage.getItem('hub-theme');
    const prefersDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    const initialTheme = savedTheme || (prefersDark ? 'dark' : 'light');

    document.documentElement.setAttribute('data-theme', initialTheme);
    updateThemeIcon(initialTheme);

    if (themeToggleBtn) {
      themeToggleBtn.addEventListener('click', () => {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('hub-theme', newTheme);
        updateThemeIcon(newTheme);
      });
    }
  }

  function updateThemeIcon(theme) {
    if (!themeToggleBtn) return;
    if (theme === 'dark') {
      themeToggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <circle cx="12" cy="12" r="5"></circle>
          <line x1="12" y1="1" x2="12" y2="3"></line>
          <line x1="12" y1="21" x2="12" y2="23"></line>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line>
          <line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line>
          <line x1="1" y1="12" x2="3" y2="12"></line>
          <line x1="21" y1="12" x2="23" y2="12"></line>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line>
          <line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>
        </svg>
      `;
      themeToggleBtn.setAttribute('aria-label', 'Switch to light mode');
    } else {
      themeToggleBtn.innerHTML = `
        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
        </svg>
      `;
      themeToggleBtn.setAttribute('aria-label', 'Switch to dark mode');
    }
  }

  /**
   * Fetch projects from data/projects.json using relative path
   */
  async function loadProjects() {
    try {
      // Use relative path so it functions at domain root, subpath, and GitHub Pages
      const response = await fetch('data/projects.json');
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      projects = await response.json();
      setupCategories();
      setupSearch();
      renderProjects();
    } catch (err) {
      console.error('Failed to load project data:', err);
      renderErrorState(err);
    }
  }

  /**
   * Build dynamic category filters
   */
  function setupCategories() {
    if (!categoryChipsContainer) return;

    // Collect unique non-empty categories
    const categories = new Set();
    projects.forEach(p => {
      if (p.category && p.category.trim()) {
        categories.add(p.category.trim());
      }
    });

    const categoryList = ['all', ...Array.from(categories)];

    categoryChipsContainer.innerHTML = categoryList.map(cat => {
      const isAll = cat === 'all';
      const label = isAll ? 'All Projects' : cat;
      const count = isAll ? projects.length : projects.filter(p => (p.category || '').toLowerCase() === cat.toLowerCase()).length;
      return `
        <button type="button" 
                class="filter-chip ${cat === currentCategory ? 'active' : ''}" 
                data-category="${escapeHtml(cat)}"
                aria-pressed="${cat === currentCategory}">
          ${escapeHtml(label)} (${count})
        </button>
      `;
    }).join('');

    categoryChipsContainer.addEventListener('click', (e) => {
      const chip = e.target.closest('.filter-chip');
      if (!chip) return;

      const category = chip.getAttribute('data-category');
      currentCategory = category;

      // Update active states
      document.querySelectorAll('.filter-chip').forEach(c => {
        const isActive = c === chip;
        c.classList.toggle('active', isActive);
        c.setAttribute('aria-pressed', isActive ? 'true' : 'false');
      });

      renderProjects();
    });
  }

  /**
   * Search listener
   */
  function setupSearch() {
    if (!searchInput) return;

    searchInput.addEventListener('input', (e) => {
      searchQuery = e.target.value.trim().toLowerCase();
      if (clearSearchBtn) {
        clearSearchBtn.classList.toggle('active', searchQuery.length > 0);
      }
      renderProjects();
    });

    if (clearSearchBtn) {
      clearSearchBtn.addEventListener('click', () => {
        searchInput.value = '';
        searchQuery = '';
        clearSearchBtn.classList.remove('active');
        searchInput.focus();
        renderProjects();
      });
    }
  }

  /**
   * Filter and render project cards
   */
  function renderProjects() {
    if (!projectsGrid) return;

    const filtered = projects.filter(project => {
      // Category filter
      const matchesCategory = currentCategory === 'all' || 
        (project.category && project.category.toLowerCase() === currentCategory.toLowerCase());

      // Search query filter
      const matchesSearch = !searchQuery || 
        (project.title && project.title.toLowerCase().includes(searchQuery)) ||
        (project.description && project.description.toLowerCase().includes(searchQuery)) ||
        (project.category && project.category.toLowerCase().includes(searchQuery));

      return matchesCategory && matchesSearch;
    });

    // Update counter
    if (resultsCounter) {
      const total = projects.length;
      const count = filtered.length;
      resultsCounter.textContent = `Showing ${count} of ${total} project${total === 1 ? '' : 's'}`;
    }

    if (filtered.length === 0) {
      projectsGrid.innerHTML = `
        <div class="empty-state">
          <div class="empty-state-icon">🔍</div>
          <h3 class="empty-state-title">No matching projects found</h3>
          <p class="empty-state-desc">Try clearing your search query or selecting another category.</p>
          <button type="button" class="btn-reset" id="reset-filters-btn">Clear All Filters</button>
        </div>
      `;

      const resetBtn = document.getElementById('reset-filters-btn');
      if (resetBtn) {
        resetBtn.addEventListener('click', () => {
          currentCategory = 'all';
          searchQuery = '';
          if (searchInput) searchInput.value = '';
          if (clearSearchBtn) clearSearchBtn.classList.remove('active');
          setupCategories();
          renderProjects();
        });
      }
      return;
    }

    projectsGrid.innerHTML = filtered.map(renderProjectCard).join('');

    // Attach image error handlers dynamically to switch to fallback
    projectsGrid.querySelectorAll('img.card-img').forEach(img => {
      img.addEventListener('error', function () {
        const cardMedia = this.closest('.card-media');
        const category = this.getAttribute('data-category') || 'Project';
        const title = this.getAttribute('data-title') || '';
        if (cardMedia) {
          cardMedia.innerHTML = getFallbackPlaceholderHTML(category, title);
        }
      });
    });
  }

  /**
   * Generate card HTML
   */
  function renderProjectCard(project) {
    const hasImage = project.image && project.image.trim().length > 0;
    const hasLiveUrl = project.liveUrl && project.liveUrl.trim().length > 0;
    const hasSourceUrl = project.sourceUrl && project.sourceUrl.trim().length > 0;
    const isFeatured = Boolean(project.featured);
    const category = project.category || 'General';

    // Format media block: real image with graceful fallback on error, or immediate fallback
    let mediaHtml = '';
    if (hasImage) {
      mediaHtml = `
        <img class="card-img" 
             src="${escapeHtml(project.image)}" 
             alt="${escapeHtml(project.title)} preview" 
             loading="lazy"
             data-category="${escapeHtml(category)}"
             data-title="${escapeHtml(project.title)}">
      `;
    } else {
      mediaHtml = getFallbackPlaceholderHTML(category, project.title);
    }

    // Badges
    const featuredBadge = isFeatured ? `
      <span class="badge-featured">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
        </svg>
        Featured
      </span>
    ` : '';

    const categoryBadge = category ? `
      <span class="badge-category">${escapeHtml(category)}</span>
    ` : '';

    // Action buttons (Only rendered when URLs are provided)
    let actionsHtml = '';
    if (hasLiveUrl || hasSourceUrl) {
      const liveBtn = hasLiveUrl ? `
        <a href="${escapeHtml(project.liveUrl)}" 
           class="btn btn-primary" 
           ${isExternal(project.liveUrl) ? 'target="_blank" rel="noopener noreferrer"' : ''}
           aria-label="Open live project ${escapeHtml(project.title)}">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
            <polyline points="15 3 21 3 21 9"></polyline>
            <line x1="10" y1="14" x2="21" y2="3"></line>
          </svg>
          Live Project
        </a>
      ` : '';

      const sourceBtn = hasSourceUrl ? `
        <a href="${escapeHtml(project.sourceUrl)}" 
           class="btn btn-secondary" 
           target="_blank" 
           rel="noopener noreferrer"
           aria-label="View source code for ${escapeHtml(project.title)} on GitHub">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <polyline points="16 18 22 12 16 6"></polyline>
            <polyline points="8 6 2 12 8 18"></polyline>
          </svg>
          Source Code
        </a>
      ` : '';

      actionsHtml = `
        <div class="card-actions">
          ${liveBtn}
          ${sourceBtn}
        </div>
      `;
    }

    return `
      <article class="project-card" id="project-${escapeHtml(project.id || '')}">
        <div class="card-media">
          <div class="card-badges">
            ${featuredBadge}
            ${categoryBadge}
          </div>
          ${mediaHtml}
        </div>
        <div class="card-body">
          <h3 class="card-title">${escapeHtml(project.title || 'Untitled Project')}</h3>
          <p class="card-desc">${escapeHtml(project.description || 'No description provided.')}</p>
          ${actionsHtml}
        </div>
      </article>
    `;
  }

  /**
   * Tasteful fallback media placeholder for cards without screenshots
   */
  function getFallbackPlaceholderHTML(category, title) {
    const initials = (title || 'PR')
      .split(' ')
      .map(w => w[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();

    return `
      <div class="fallback-placeholder">
        <div class="fallback-icon">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
            <rect x="2" y="3" width="20" height="14" rx="2" ry="2"></rect>
            <line x1="8" y1="21" x2="16" y2="21"></line>
            <line x1="12" y1="17" x2="12" y2="21"></line>
          </svg>
        </div>
        <span class="fallback-tag">${escapeHtml(initials)} • ${escapeHtml(category || 'PROJECT')}</span>
      </div>
    `;
  }

  /**
   * Fallback error state when data cannot be retrieved (e.g. file:// restriction)
   */
  function renderErrorState(err) {
    if (!projectsGrid) return;
    projectsGrid.innerHTML = `
      <div class="empty-state">
        <div class="empty-state-icon">⚠️</div>
        <h3 class="empty-state-title">Unable to load project catalog</h3>
        <p class="empty-state-desc" style="max-width: 500px; margin: 0 auto 16px;">
          If viewing locally via the <code>file://</code> protocol, your browser may block <code>fetch()</code> requests. 
          Please preview through a local web server (e.g., <code>python -m http.server</code> or VS Code Live Server).
        </p>
        <div style="font-family: var(--font-mono); font-size: 0.8rem; color: var(--text-muted); background: var(--bg-surface-subtle); padding: 8px 14px; border-radius: var(--radius-sm); display: inline-block;">
          ${escapeHtml(err.message || String(err))}
        </div>
      </div>
    `;
  }

  /**
   * Helper to check if URL is external
   */
  function isExternal(url) {
    if (!url) return false;
    return url.startsWith('http://') || url.startsWith('https://') || url.startsWith('//');
  }

  /**
   * Basic HTML Sanitization
   */
  function escapeHtml(str) {
    if (typeof str !== 'string') return '';
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }
})();
