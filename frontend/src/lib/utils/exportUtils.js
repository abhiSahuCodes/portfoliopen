import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

// Helper: fetch an image URL and return a data URL for offline/cross-origin safety
const fetchImageAsDataURL = async (src) => {
  try {
    if (!src || typeof src !== "string") return null;
    if (src.startsWith("data:")) return src; // already a data URL

    const res = await fetch(src, { mode: "cors" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onerror = reject;
      reader.onloadend = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
  } catch (err) {
    console.warn("Could not inline image for export:", src, err);
    return null;
  }
};

// Helper: clone a node and inline <img> sources as data URLs
const cloneNodeWithInlineImages = async (node) => {
  const clone = node.cloneNode(true);
  const images = clone.querySelectorAll("img");
  await Promise.all(
    Array.from(images).map(async (img) => {
      const src = img.getAttribute("src");
      const dataUrl = await fetchImageAsDataURL(src);
      if (dataUrl) img.setAttribute("src", dataUrl);
    })
  );
  return clone;
};

// Helper: remove editor-only UI from the cloned DOM
const stripEditorUI = (root) => {
  if (!root) return;

  // Remove draggable/controls overlay
  root.querySelectorAll('[aria-label="Drag to reorder"], [aria-label="Remove section"]').forEach((el) => {
    const parent = el.closest('div');
    if (parent) parent.remove();
    else el.remove();
  });

  // Remove section edit overlays (absolute full-cover overlays)
  root.querySelectorAll('div.absolute').forEach((el) => {
    const classes = el.className || "";
    if (classes.includes('inset-0')) {
      el.remove();
    }
  });

  // Remove any explicit edit buttons that might remain
  root.querySelectorAll('button').forEach((btn) => {
    const text = (btn.textContent || '').toLowerCase();
    if (text.includes('edit')) {
      const container = btn.closest('div');
      if (container) container.remove();
      else btn.remove();
    }
  });
};

// Helper: export-only CSS adjustments for layout consistency (e.g., keep icon + text on one line)
function applyExportStyles(root) {
    const style = document.createElement('style');
    style.setAttribute('data-export-style', 'true');
    style.textContent = `
      [data-export-root] .flex.items-center {
        display: flex !important;
        flex-direction: row !important;
        align-items: center !important;
        gap: 0.75rem !important;
        flex-wrap: nowrap !important;
      }
      [data-export-root] .flex.items-center svg {
        width: 20px !important;
        height: 20px !important;
        flex: 0 0 auto !important;
        margin-right: 0.75rem !important;
        align-self: center !important;
      }
      [data-export-root] .flex.items-center span,
      [data-export-root] .flex.items-center a {
        min-width: 0 !important;
        white-space: nowrap !important;
        overflow: hidden !important;
        text-overflow: ellipsis !important;
        flex: 1 1 auto !important;
        line-height: 40px !important; /* Match icon height */
        align-self: center !important;
      }
    `;
    // Apply attribute so the scoping selector matches
    root.setAttribute('data-export-root', 'true');
    root.appendChild(style);
}

// Export portfolio as JSON
export const exportAsJSON = (portfolio) => {
  const dataStr = JSON.stringify(portfolio, null, 2);
  const dataUri =
    "data:application/json;charset=utf-8," + encodeURIComponent(dataStr);

  const exportFileDefaultName = `${portfolio.title
    .replace(/\s+/g, "-")
    .toLowerCase()}-portfolio.json`;

  const linkElement = document.createElement("a");
  linkElement.setAttribute("href", dataUri);
  linkElement.setAttribute("download", exportFileDefaultName);
  linkElement.click();
};

// Export portfolio as HTML
export const exportAsHTML = async (portfolio, elementId = "portfolio-preview") => {
  const preview = document.getElementById(elementId);
  if (preview) {
    // Serialize the actual preview DOM (for WYSIWYG consistency) and inline images
    await (document.fonts?.ready?.catch?.(() => {}));
    const cloned = await cloneNodeWithInlineImages(preview);
    stripEditorUI(cloned);
    const serialized = cloned.outerHTML;

    const htmlDocument = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${portfolio.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet" />
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    html, body { height: 100%; }
    body { margin: 0; background: #f3f4f6; font-family: Inter, sans-serif; }
    /* Ensure the exported container stays centered like in the editor */
    #portfolio-preview { margin: 2rem auto; }
  </style>
  <meta name="generator" content="PortfolioPen Export" />
  <meta name="description" content="Standalone export of portfolio preview." />
</head>
<body>
${serialized}
</body>
</html>`;

    const blob = new Blob([htmlDocument], { type: "text/html" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `${portfolio.title.replace(/\s+/g, "-").toLowerCase()}-portfolio.html`;
    link.click();
    URL.revokeObjectURL(url);
    return;
  }

  // Fallback: generate HTML from portfolio data if preview element is not available
  const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root { --primary-color: ${portfolio.theme.primaryColor || "#6E59A5"}; --secondary-color: ${portfolio.theme.secondaryColor || "#2DD4BF"}; --font-family: ${portfolio.theme.fontFamily || "Inter, sans-serif"}; }
    body { font-family: var(--font-family); margin: 0; padding: 0; color: #333; line-height: 1.6; }
    .container { max-width: 1200px; margin: 0 auto; padding: 0 20px; }
    .section { margin-bottom: 60px; padding: 20px; border-radius: 8px; }
    .header { text-align: center; padding: 100px 20px; background: linear-gradient(to right, var(--primary-color), var(--secondary-color)); color: white; }
    .header h1 { font-size: 3rem; margin-bottom: 10px; }
    .header h2 { font-size: 1.5rem; font-weight: normal; margin-bottom: 20px; }
    .about h2, .projects h2, .contact h2 { color: var(--primary-color); font-size: 2rem; border-bottom: 2px solid var(--secondary-color); padding-bottom: 10px; margin-bottom: 20px; }
    .skills { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 20px; }
    .skill { background-color: var(--secondary-color); color: white; padding: 5px 15px; border-radius: 20px; font-size: 0.9rem; }
    .project-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 30px; }
    .project { border: 1px solid #eee; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
    .project img { width: 100%; height: 200px; object-fit: cover; }
    .project-content { padding: 20px; }
    .project h3 { margin-top: 0; color: var(--primary-color); }
    .project a { display: inline-block; margin-top: 10px; color: var(--secondary-color); text-decoration: none; }
    .project a:hover { text-decoration: underline; }
    .contact-info { background-color: #f8f9fa; padding: 30px; border-radius: 8px; }
    .contact-info p { margin: 10px 0; }
    .social-links { display: flex; gap: 15px; margin-top: 20px; }
    .social-links a { color: var(--primary-color); text-decoration: none; }
    .social-links a:hover { color: var(--secondary-color); }
    @media (max-width: 768px) { .project-grid { grid-template-columns: 1fr; } .header { padding: 60px 20px; } .header h1 { font-size: 2.5rem; } }
  </style>
</head>
<body>
  ${[...portfolio.sections].sort((a, b) => a.order - b.order).map((section) => {
    switch (section.type) {
      case "header":
        return `<header class="header"><div class="container"><h1>${section.content.name}</h1><h2>${section.content.title}</h2><p>${section.content.subtitle}</p></div></header>`;
      case "about":
        return `<section class="section about"><div class="container"><h2>${section.content.title}</h2><p>${section.content.description}</p><div class="skills">${section.content.skills.map((skill) => `<span class="skill">${skill}</span>`).join("")}</div></div></section>`;
      case "projects":
        return `<section class="section projects"><div class="container"><h2>${section.content.title}</h2><div class="project-grid">${section.content.projects.map((project) => `<div class="project"><img src="${project.image}" alt="${project.title}"><div class="project-content"><h3>${project.title}</h3><p>${project.description}</p><a href="${project.link}" target="_blank">View Project</a></div></div>`).join("")}</div></div></section>`;
      case "contact":
        return `<section class="section contact"><div class="container"><h2>${section.content.title}</h2><div class="contact-info"><p>Email: <a href="mailto:${section.content.email}">${section.content.email}</a></p><p>Phone: ${section.content.phone}</p><div class="social-links">${section.content.social.twitter ? `<a href="${section.content.social.twitter}" target="_blank">Twitter</a>` : ""}${section.content.social.linkedin ? `<a href="${section.content.social.linkedin}" target="_blank">LinkedIn</a>` : ""}${section.content.social.github ? `<a href="${section.content.social.github}" target="_blank">GitHub</a>` : ""}</div></div></div></section>`;
      default:
        return "";
    }
  }).join("\n")}
</body>
</html>`;

  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${portfolio.title.replace(/\s+/g, "-").toLowerCase()}-portfolio.html`;
  link.click();
  URL.revokeObjectURL(url);
};

// Export portfolio as PDF
export const exportAsPDF = async (elementId, portfolio) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Element not found");

    // Ensure fonts are ready
    await (document.fonts?.ready?.catch?.(() => {}));

    // Clone element and inline images to avoid CORS issues during rasterization
    const cloned = await cloneNodeWithInlineImages(element);
    stripEditorUI(cloned);
    applyExportStyles(cloned);
    const tempContainer = document.createElement("div");
    tempContainer.style.position = "fixed";
    tempContainer.style.left = "-10000px";
    tempContainer.style.top = "0";
    tempContainer.style.width = `${element.offsetWidth}px`;
    tempContainer.style.background = "#ffffff";
    tempContainer.appendChild(cloned);
    document.body.appendChild(tempContainer);

    const scale = Math.max(2, window.devicePixelRatio || 1);

    // Collect link annotations BEFORE detaching the DOM, so bounding rects are valid
    const annotations = [];
    try {
      const rootRect = cloned.getBoundingClientRect();
      const anchors = cloned.querySelectorAll('a[href]');
      anchors.forEach((a) => {
        const href = a.getAttribute('href');
        if (!href) return;
        const rect = a.getBoundingClientRect();
        if (!rect || rect.width === 0 || rect.height === 0) return;
        const x = (rect.left - rootRect.left) * scale;
        const y = (rect.top - rootRect.top) * scale;
        const w = rect.width * scale;
        const h = rect.height * scale;
        annotations.push({ x, y, w, h, href });
      });
    } catch (e) {
      console.warn('Failed to collect link annotations prior to PDF render', e);
    }

    const canvas = await html2canvas(cloned, {
      scale,
      useCORS: true,
      allowTaint: false,
      backgroundColor: "#ffffff",
      logging: false,
      scrollY: -window.scrollY,
    });

    document.body.removeChild(tempContainer);

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);

    // Make links clickable by adding PDF annotations over precomputed anchor bounding boxes
    try {
      annotations.forEach(({ x, y, w, h, href }) => {
        if (typeof pdf.link === 'function') {
          pdf.link(x, y, w, h, { url: href });
        }
      });
    } catch (e) {
      console.warn('Failed to add link annotations to PDF', e);
    }

    pdf.save(`${portfolio.title.replace(/\s+/g, "-").toLowerCase()}-portfolio.pdf`);
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Failed to generate PDF. Please try again.");
  }
};

// Import portfolio from JSON
export const importFromJSON = (file) => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const portfolio = JSON.parse(event.target.result);
        resolve(portfolio);
      } catch (error) {
        reject(new Error("Invalid JSON file"));
      }
    };

    reader.onerror = () => {
      reject(new Error("Error reading file"));
    };

    reader.readAsText(file);
  });
};