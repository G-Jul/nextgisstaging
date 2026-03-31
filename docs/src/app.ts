function wrapTables(): void {
  const tables = document.querySelectorAll<HTMLTableElement>(".document table");

  tables.forEach((table) => {
    if (table.parentElement?.classList.contains("table-wrapper")) return;

    const wrapper = document.createElement("div");
    wrapper.className = "table-wrapper";

    table.parentNode?.insertBefore(wrapper, table);
    wrapper.appendChild(table);
  });
}

function initExternalLinks(): void {
  const links = document.querySelectorAll<HTMLAnchorElement>('a[href^="http"]');

  links.forEach((link) => {
    const href = link.getAttribute("href");
    if (!href) return;

    const isExternal = !href.includes(window.location.hostname);
    if (!isExternal) return;

    link.setAttribute("target", "_blank");
    link.setAttribute("rel", "noopener noreferrer");
  });
}

document.addEventListener("DOMContentLoaded", () => {
  wrapTables();
  initExternalLinks();
});
