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

    titleURL.addEventListener("click", (event) => {
        event.preventDefault();
        descriptionParagraph.classList.toggle("active");
    });

    const projectItem = document.createElement("li");
    projectItem.classList.add("project");

    titleURL.appendChild(titleHeading);
    projectItem.appendChild(titleURL);
    projectItem.appendChild(descriptionParagraph);
    projectList.appendChild(projectItem);
});

/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Storage Blueprints
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

class DatabaseObject {
    toString() {
        throw new Error("Not Implemented");
    }
}

/*  Seed Data  */

const references = [
    {
        id: 1,
        name: "Woodrow Hamilton",
        company: "Hamilton Inc.",
        email: "woodie3@hamiltoninc.com",
    },
    {
        id: 2,
        name: "Mason Matheson",
        company: "Pro Installers",
        email: "notmason@proinstallers.com",
    },
    {
        id: 3,
        name: "Harry Zahn",
        company: "Crystal Park Digital",
        email: "harryz@cpdigital.com",
    },
];

/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Storing Testimonials
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

class Testimonial extends DatabaseObject {
    constructor(params) {
        super();
        const { comment, rating, referenceId } = params;

        this.comment = comment;
        this.rating = rating;
        this.referenceId = referenceId;
    }

    toString() {
        return `${this.rating} Stars: ${this.comment}`;
    }

    static create(params) {
        return new Testimonial(params);
    }
}

/*  Testimonial Data Access Object  */

class TestimonialDAO {
    static seeds = [
        {
            comment: "Chase was very timely, efficient, and easy to work with.",
            rating: 4,
            referenceId: 1,
        },
        {
            comment:
                "He also made everything so easy to understand and follow.",
            rating: 5,
            referenceId: 1,
        },
        {
            comment:
                "I was skeptical at first but Chase exceeded my expectations.",
            rating: 5,
            referenceId: 2,
        },
    ];

    getAll() {
        throw new Error("Not Implemented");
    }

    create(testimonial) {
        throw new Error("Not Implemented");
    }
}

/*  Testimonial Session Storage  */

class SessionStorageTestimonialDAO extends TestimonialDAO {
    constructor() {
        super();
        this.database = sessionStorage;
    }

    getAll() {
        const testimonialsAsJSON = this.database.getItem("testimonials");

        const testimonialsData = testimonialsAsJSON
            ? JSON.parse(testimonialsAsJSON)
            : TestimonialDAO.seeds;

        return testimonialsData.map((testimonialData) => {
            return Testimonial.create(testimonialData);
        });
    }

    create(testimonial) {
        const existingTestimonials = this.getAll();
        existingTestimonials.push(testimonial);
        this.database.setItem(
            "testimonials",
            JSON.stringify(existingTestimonials),
        );
    }
}

/* Create Testimonials Service */

class CreateTestimonialService {
    constructor(testimonialDao) {
        this.testimonialDao = testimonialDao;
    }

    createTestimonial(comment, rating, referenceId) {
        const testimonialData = { comment, rating, referenceId };
        this.testimonialDao.create(testimonialData);
    }
}

/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Render Testimonials
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

const testimonialDao = new SessionStorageTestimonialDAO();

const referencesList = document.getElementById("references-list");
const testimonials = testimonialDao.getAll();

/*  Get Average Rating  */

const ratingTotal = testimonials.reduce(
    (total, testimonial) => total + testimonial.rating,
    0,
);
const averageRating = ratingTotal / testimonials.length;

const averageRatingDisplay = document.getElementById("average-rating");

averageRatingDisplay.innerText = averageRating.toFixed(1);

for (let i = 0; i < references.length; i++) {
    const referenceLi = document.createElement("li");
    const referenceData = document.createElement("h3");
    const testimonialList = document.createElement("ul");

    referenceData.innerText +=
        references[i].name + " at " + references[i].email;
    referenceData.innerText += references[i].company
        ? " with " + references[i].company + " "
        : "";

    const referenceTestimonials = testimonials.filter(
        (testimonial) => testimonial.referenceId === references[i].id,
    );

    referenceTestimonials.forEach((referenceTestimonial) => {
        const testimonialLi = document.createElement("li");
        testimonialLi.innerText = referenceTestimonial.toString();
        testimonialList.appendChild(testimonialLi);
    });

    referenceLi.appendChild(referenceData);
    referenceLi.appendChild(testimonialList);

    referencesList.appendChild(referenceLi);
}
