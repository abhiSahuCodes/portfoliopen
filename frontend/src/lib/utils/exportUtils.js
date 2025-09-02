import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";

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
export const exportAsHTML = (portfolio) => {
  // Generate HTML document based on portfolio data
  const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${portfolio.title}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <style>
    :root {
      --primary-color: ${portfolio.theme.primaryColor || "#6E59A5"};
      --secondary-color: ${portfolio.theme.secondaryColor || "#2DD4BF"};
      --font-family: ${portfolio.theme.fontFamily || "Inter, sans-serif"};
    }
    body {
      font-family: var(--font-family);
      margin: 0;
      padding: 0;
      color: #333;
      line-height: 1.6;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 0 20px;
    }
    .section {
      margin-bottom: 60px;
      padding: 20px;
      border-radius: 8px;
    }
    .header {
      text-align: center;
      padding: 100px 20px;
      background: linear-gradient(to right, var(--primary-color), var(--secondary-color));
      color: white;
    }
    .header h1 {
      font-size: 3rem;
      margin-bottom: 10px;
    }
    .header h2 {
      font-size: 1.5rem;
      font-weight: normal;
      margin-bottom: 20px;
    }
    .about h2, .projects h2, .contact h2 {
      color: var(--primary-color);
      font-size: 2rem;
      border-bottom: 2px solid var(--secondary-color);
      padding-bottom: 10px;
      margin-bottom: 20px;
    }
    .skills {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
      margin-top: 20px;
    }
    .skill {
      background-color: var(--secondary-color);
      color: white;
      padding: 5px 15px;
      border-radius: 20px;
      font-size: 0.9rem;
    }
    .project-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
      gap: 30px;
    }
    .project {
      border: 1px solid #eee;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    }
    .project img {
      width: 100%;
      height: 200px;
      object-fit: cover;
    }
    .project-content {
      padding: 20px;
    }
    .project h3 {
      margin-top: 0;
      color: var(--primary-color);
    }
    .project a {
      display: inline-block;
      margin-top: 10px;
      color: var(--secondary-color);
      text-decoration: none;
    }
    .project a:hover {
      text-decoration: underline;
    }
    .contact-info {
      background-color: #f8f9fa;
      padding: 30px;
      border-radius: 8px;
    }
    .contact-info p {
      margin: 10px 0;
    }
    .social-links {
      display: flex;
      gap: 15px;
      margin-top: 20px;
    }
    .social-links a {
      color: var(--primary-color);
      text-decoration: none;
    }
    .social-links a:hover {
      color: var(--secondary-color);
    }
    @media (max-width: 768px) {
      .project-grid {
        grid-template-columns: 1fr;
      }
      .header {
        padding: 60px 20px;
      }
      .header h1 {
        font-size: 2.5rem;
      }
    }
  </style>
</head>
<body>
  ${[...portfolio.sections]
    .sort((a, b) => a.order - b.order)
    .map((section) => {
      switch (section.type) {
        case "header":
          return `
  <header class="header">
    <div class="container">
      <h1>${section.content.name}</h1>
      <h2>${section.content.title}</h2>
      <p>${section.content.subtitle}</p>
    </div>
  </header>`;

        case "about":
          return `
  <section class="section about">
    <div class="container">
      <h2>${section.content.title}</h2>
      <p>${section.content.description}</p>
      <div class="skills">
        ${section.content.skills
          .map((skill) => `<span class="skill">${skill}</span>`)
          .join("")}
      </div>
    </div>
  </section>`;

        case "projects":
          return `
  <section class="section projects">
    <div class="container">
      <h2>${section.content.title}</h2>
      <div class="project-grid">
        ${section.content.projects
          .map(
            (project) => `
        <div class="project">
          <img src="${project.image}" alt="${project.title}">
          <div class="project-content">
            <h3>${project.title}</h3>
            <p>${project.description}</p>
            <a href="${project.link}" target="_blank">View Project</a>
          </div>
        </div>
        `
          )
          .join("")}
      </div>
    </div>
  </section>`;

        case "contact":
          return `
  <section class="section contact">
    <div class="container">
      <h2>${section.content.title}</h2>
      <div class="contact-info">
        <p>Email: <a href="mailto:${section.content.email}">${
            section.content.email
          }</a></p>
        <p>Phone: ${section.content.phone}</p>
        <div class="social-links">
          ${
            section.content.social.twitter
              ? `<a href="${section.content.social.twitter}" target="_blank">Twitter</a>`
              : ""
          }
          ${
            section.content.social.linkedin
              ? `<a href="${section.content.social.linkedin}" target="_blank">LinkedIn</a>`
              : ""
          }
          ${
            section.content.social.github
              ? `<a href="${section.content.social.github}" target="_blank">GitHub</a>`
              : ""
          }
        </div>
      </div>
    </div>
  </section>`;

        default:
          return "";
      }
    })
    .join("\n")}
</body>
</html>
  `;

  // Create and download the HTML file
  const blob = new Blob([htmlContent], { type: "text/html" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${portfolio.title
    .replace(/\s+/g, "-")
    .toLowerCase()}-portfolio.html`;
  link.click();

  // Clean up
  URL.revokeObjectURL(url);
};

// Export portfolio as PDF
export const exportAsPDF = async (elementId, portfolio) => {
  try {
    const element = document.getElementById(elementId);
    if (!element) throw new Error("Element not found");

    const canvas = await html2canvas(element, {
      scale: 1,
      useCORS: true,
      logging: false,
    });

    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF({
      orientation: "portrait",
      unit: "px",
      format: [canvas.width, canvas.height],
    });

    pdf.addImage(imgData, "PNG", 0, 0, canvas.width, canvas.height);
    pdf.save(
      `${portfolio.title.replace(/\s+/g, "-").toLowerCase()}-portfolio.pdf`
    );
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
