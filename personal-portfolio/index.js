const projects = [
    {
        title: "Agency Intelligence Platform",
        url: "#",
        description:
            "A SaaS platform for marketing agencies that connects advertising, CRM, sales, and revenue data to provide attribution, lead quality analysis, client health monitoring, and actionable business intelligence.",
    },
    {
        title: "Tracking & Attribution Auditor",
        url: "#",
        description:
            "A diagnostic tool that helps agencies identify broken or missing marketing tracking, including conversion events, campaign parameters, CRM attribution, and other data needed to accurately connect marketing activity to revenue.",
    },
    {
        title: "Chronocodium Portfolio & Digital Twin",
        url: "#",
        description:
            "A custom-built portfolio and content management system for showcasing software, marketing, data, and creative projects, with an AI-powered digital twin that can answer questions about my experience and work.",
    },
];

const projectsSection = document.getElementById("projects");
const projectList = document.createElement("ul");
projectsSection.appendChild(projectList);

projects.forEach((project) => {
    const titleText = project.title;
    const urlText = project.url;
    const descriptionText = project.description;

    const titleHeading = document.createElement("h3");
    titleHeading.textContent = titleText;

    const titleURL = document.createElement("a");
    titleURL.setAttribute("href", urlText);
    titleURL.setAttribute("target", "_blank");

    const descriptionParagraph = document.createElement("p");
    descriptionParagraph.textContent = descriptionText;

    const projectItem = document.createElement("li");
    projectItem.classList.add("project");

    titleURL.appendChild(titleHeading);
    projectItem.appendChild(titleURL);
    projectItem.appendChild(descriptionParagraph);
    projectList.appendChild(projectItem);
});
