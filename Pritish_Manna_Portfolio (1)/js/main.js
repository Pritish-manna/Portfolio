(() => {
  "use strict";

  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];

  // Theme: system preference by default, then remember the user's explicit choice.
  const savedTheme = localStorage.getItem("pm-theme");
  const systemDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
  document.documentElement.dataset.theme = savedTheme || (systemDark ? "dark" : "light");

  const themeToggle = $("#themeToggle");
  themeToggle?.addEventListener("click", () => {
    const next = document.documentElement.dataset.theme === "dark" ? "light" : "dark";
    document.documentElement.dataset.theme = next;
    localStorage.setItem("pm-theme", next);
    themeToggle.setAttribute("aria-label", `Switch to ${next === "dark" ? "light" : "dark"} mode`);
  });

  // Mobile navigation.
  const menuToggle = $("#menuToggle");
  const navLinks = $("#navLinks");
  const closeMenu = () => {
    navLinks?.classList.remove("open");
    menuToggle?.setAttribute("aria-expanded", "false");
  };
  menuToggle?.addEventListener("click", () => {
    const open = navLinks.classList.toggle("open");
    menuToggle.setAttribute("aria-expanded", String(open));
  });
  $$("#navLinks a").forEach(link => link.addEventListener("click", closeMenu));

  // Rotating role line.
  const roles = ["Data & AI Enthusiast", "Machine Learning Learner", "Python Developer"];
  const typedRole = $("#typedRole");
  let roleIndex = 0;
  let roleTimer;
  function rotateRole() {
    if (!typedRole || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    roleTimer = setInterval(() => {
      roleIndex = (roleIndex + 1) % roles.length;
      typedRole.textContent = roles[roleIndex];
    }, 2600);
  }
  rotateRole();

  // Reveal-on-scroll.
  const revealItems = $$(".reveal");
  if ("IntersectionObserver" in window && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const revealObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add("visible");
          revealObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    revealItems.forEach(el => revealObserver.observe(el));
  } else {
    revealItems.forEach(el => el.classList.add("visible"));
  }

  // Active section highlighting.
  const sections = $$("main section[id]");
  const navAnchors = $$("#navLinks a");
  if ("IntersectionObserver" in window) {
    const activeObserver = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        navAnchors.forEach(a => a.classList.toggle("active", a.getAttribute("href") === `#${entry.target.id}`));
      });
    }, { rootMargin: "-35% 0px -55% 0px" });
    sections.forEach(section => activeObserver.observe(section));
  }

  // Copy buttons.
  $$(".copy-btn").forEach(button => {
    button.addEventListener("click", async () => {
      const original = button.textContent;
      try {
        await navigator.clipboard.writeText(button.dataset.copy);
        button.textContent = "Copied";
      } catch {
        button.textContent = "Select manually";
      }
      setTimeout(() => { button.textContent = original; }, 1400);
    });
  });

  // Contact form -> mailto. No backend.
  $("#contactForm")?.addEventListener("submit", event => {
    event.preventDefault();
    const form = event.currentTarget;
    const error = $("#formError");
    const name = $("#senderName").value.trim();
    const email = $("#senderEmail").value.trim();
    const subject = $("#senderSubject").value.trim();
    const message = $("#senderMessage").value.trim();

    if (!name || !email || !subject || !message) {
      error.textContent = "Please complete all fields.";
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      error.textContent = "Please enter a valid email address.";
      return;
    }
    error.textContent = "";
    const body = `Name: ${name}\nEmail: ${email}\n\n${message}`;
    window.location.href = `mailto:mpritish92@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
  });

  // Back to top.
  $("#backTop")?.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Project modal.
  const projectDetails = {
    oniongrade: {
      title: "OnionGrade AI – AI-Based Onion Quality Assessment & Grading",
      tech: ["Python", "Gemini Vision", "Streamlit", "FastAPI", "LangChain", "Pydantic"],
      body: `
        <p>AI-based prototype that assesses and grades onion quality from uploaded images, built for Smart India Hackathon 2026 problem statement SIH26031.</p>
        <div class="chips">${["Python","Gemini Vision","Streamlit","FastAPI","LangChain","Pydantic"].map(x => `<span class="chip">${x}</span>`).join("")}</div>
        <ul>
          <li>Uses vision-based analysis to detect individual onions and identify visible quality characteristics and defects.</li>
          <li>Auditable pipeline that separates AI-based visual observation from deterministic grading rules and calculations.</li>
          <li>Interactive Streamlit interface with quality metrics, defect analysis, reports, and CSV/PDF export.</li>
        </ul>
      `
    },
    deltaflow: {
      title: "Project Delta-Flow – Supply Chain / Logistics Analytics",
      body: `
        <p>Analyzed a 10,000+ record supply chain dataset for demand patterns, inventory trends, and delivery performance.</p>
        <div class="chips">${["Python","Pandas","NumPy","Matplotlib","Scikit-learn"].map(x => `<span class="chip">${x}</span>`).join("")}</div>
        <ul>
          <li>Performed data cleaning, exploratory data analysis, and feature engineering.</li>
          <li>Built forecasting and risk-scoring models to predict product demand and identify supply chain risks.</li>
          <li>Created visualizations and dashboards for inventory and logistics analysis.</li>
        </ul>
      `
    },
    banking: {
      title: "Banking & Loan Risk Analysis",
      body: `
        <p>Analyzed 10,000+ banking customer records to assess loan default risk and customer financial behavior.</p>
        <div class="chips">${["Python","Pandas","NumPy","Matplotlib","SQL","Scikit-learn"].map(x => `<span class="chip">${x}</span>`).join("")}</div>
        <ul>
          <li>Performed data cleaning, feature engineering, and risk segmentation using income, credit history, loan amount, and repayment behavior.</li>
          <li>Built a risk analysis model to estimate loan default probability and identify high-risk applicants.</li>
          <li>Developed dashboards and visualizations to support data-driven lending analysis.</li>
        </ul>
      `
    }
  };

  const modal = $("#projectModal");
  const modalTitle = $("#modalTitle");
  const modalContent = $("#modalContent");
  const modalClose = $("#modalClose");
  let lastFocused;

  function openModal(key) {
    const item = projectDetails[key];
    if (!item) return;
    lastFocused = document.activeElement;
    modalTitle.textContent = item.title;
    modalContent.innerHTML = item.body;
    modal.classList.add("open");
    document.body.classList.add("modal-lock");
    modalClose.focus();
  }
  function closeModal() {
    modal.classList.remove("open");
    document.body.classList.remove("modal-lock");
    lastFocused?.focus();
  }

  $$("[data-project]").forEach(button => button.addEventListener("click", () => openModal(button.dataset.project)));
  modalClose?.addEventListener("click", closeModal);
  modal?.addEventListener("click", event => { if (event.target === modal) closeModal(); });
  document.addEventListener("keydown", event => {
    if (event.key === "Escape" && modal.classList.contains("open")) closeModal();
    if (event.key === "Tab" && modal.classList.contains("open")) {
      const focusables = $$("button, a, input, textarea, [tabindex]:not([tabindex='-1'])", modal);
      if (!focusables.length) return;
      const first = focusables[0], last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) { event.preventDefault(); last.focus(); }
      else if (!event.shiftKey && document.activeElement === last) { event.preventDefault(); first.focus(); }
    }
  });

  // Optional GitHub REST API integration.
  const repoGrid = $("#repoGrid");
  const repoStatus = $("#repoStatus");

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, ch => ({
      "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#039;"
    }[ch]));
  }

  async function loadRepos() {
    try {
      const response = await fetch("https://api.github.com/users/Pritish-manna/repos?per_page=100&sort=updated", {
        headers: { "Accept": "application/vnd.github+json" }
      });
      if (!response.ok) throw new Error(`GitHub API returned ${response.status}`);
      const repos = await response.json();
      const top = repos.filter(repo => !repo.fork).slice(0, 6);
      if (!top.length) {
        repoGrid.innerHTML = `<div class="repo-card"><h3>No public non-fork repositories found.</h3><p>Visit the GitHub profile for the latest repository list.</p></div>`;
        repoStatus.textContent = "GitHub returned no public non-fork repositories.";
        return;
      }
      repoGrid.innerHTML = top.map(repo => `
        <a class="repo-card" href="${escapeHTML(repo.html_url)}" target="_blank" rel="noopener noreferrer">
          <h3>${escapeHTML(repo.name)}</h3>
          <p>${escapeHTML(repo.description || "No repository description provided.")}</p>
          <div class="repo-meta">
            <span>${escapeHTML(repo.language || "No language")}</span>
            <span>★ ${Number(repo.stargazers_count || 0)}</span>
          </div>
        </a>
      `).join("");
      repoStatus.textContent = `Showing up to ${top.length} public non-fork repositories from GitHub.`;
    } catch {
      repoGrid.innerHTML = `<div class="repo-card"><h3>Repository preview unavailable</h3><p>GitHub's public API could not be reached or was rate-limited. The profile link above still works.</p></div>`;
      repoStatus.textContent = "Fallback shown because the GitHub API request failed or was rate-limited.";
    }
  }
  loadRepos();

  window.addEventListener("beforeunload", () => clearInterval(roleTimer));
})();

/* Resume link safety net: if the PDF is missing on a hosted site, fall back to an email request */
(() => {
  if (!/^https?:/.test(location.protocol)) return;
  fetch("assets/Pritish_Manna_CV.pdf", { method: "HEAD" }).then(r => {
    if (r.ok) return;
    document.querySelectorAll("[data-resume], .nav-cv").forEach(a => {
      a.removeAttribute("download"); a.removeAttribute("target");
      a.href = "mailto:mpritish92@gmail.com?subject=Resume%20request"; a.textContent = "Request Resume";
    });
  }).catch(() => {});
})();
