const STORAGE_KEY = "portfolio-theme";

function getPreferredTheme() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored === "light" || stored === "dark") return stored;
  return window.matchMedia("(prefers-color-scheme: light)").matches ? "light" : "dark";
}

function applyTheme(theme) {
  document.documentElement.setAttribute("data-theme", theme);
  localStorage.setItem(STORAGE_KEY, theme);
  window.dispatchEvent(new CustomEvent("themechange", { detail: { theme } }));

  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    const isLight = theme === "light";
    btn.setAttribute("aria-label", isLight ? "Switch to dark mode" : "Switch to light mode");
    btn.setAttribute("aria-pressed", isLight ? "true" : "false");
    const icon = btn.querySelector(".theme-toggle-icon");
    if (icon) icon.textContent = isLight ? "☀" : "☾";
  });
}

function initTheme() {
  applyTheme(getPreferredTheme());

  document.querySelectorAll(".theme-toggle").forEach((btn) => {
    btn.addEventListener("click", () => {
      const next = document.documentElement.getAttribute("data-theme") === "light" ? "dark" : "light";
      applyTheme(next);
    });
  });
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", initTheme);
} else {
  initTheme();
}

export { applyTheme, getPreferredTheme };
