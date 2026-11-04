/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Projects Section
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

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
projectList.setAttribute("class", "flex flex-col gap-4");

projectsSection.appendChild(projectList);

projects.forEach((project) => {
    const titleText = project.title;
    const urlText = project.url;
    const descriptionText = project.description;

    const titleHeading = document.createElement("h3");
    titleHeading.setAttribute("class", "text-lg font-semibold");
    titleHeading.textContent = titleText;

    const titleURL = document.createElement("a");
    titleURL.setAttribute("class", "hover:text-slate-500");
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

/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Storing References
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

class Reference extends DatabaseObject {
    constructor(params) {
        super();

        const { id, name, company, email } = params;

        this.id = id;
        this.name = name;
        this.company = company;
        this.email = email;
    }

    static create(params) {
        return new Reference(params);
    }
}

/*  Reference Data Access Object  */

class ReferenceDAO {
    static seeds = [
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

    getAll() {
        throw new Error("Not Implemented");
    }

    create(reference) {
        throw new Error("Not Implemented");
    }
}

/*  Reference Session Storage  */

class SessionStorageReferenceDAO extends ReferenceDAO {
    constructor() {
        super();
        this.database = sessionStorage;
    }

    getAll() {
        const referencesAsJSON = this.database.getItem("references");

        const referencesData = referencesAsJSON
            ? JSON.parse(referencesAsJSON)
            : ReferenceDAO.seeds;

        return referencesData.map((referenceData) => {
            return Reference.create(referenceData);
        });
    }

    create(reference) {
        const existingReferences = this.getAll();

        existingReferences.push(reference);

        this.database.setItem("references", JSON.stringify(existingReferences));
    }
}

/* Reference Cookie Storage */

class CookieStorageReferenceDAO extends ReferenceDAO {
    getAll() {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("references="))
            ?.split("=")[1];

        const referencesData = cookieValue
            ? JSON.parse(cookieValue)
            : ReferenceDAO.seeds;

        return referencesData.map((referenceData) => {
            return Reference.create(referenceData);
        });
    }

    create(reference) {
        const existingReferences = this.getAll();

        existingReferences.push(reference);

        document.cookie = `references=${JSON.stringify(existingReferences)};`;
    }
}

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
        return `<span class="font-bold not-italic">${this.rating} Stars:</span> "${this.comment}"`;
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
        {
            comment: "I would definitely work with Chase on future projects.",
            rating: 5,
            referenceId: 2,
        },
        {
            comment:
                "My expectations for the project were met, I'm happy with the result.",
            rating: 4,
            referenceId: 3,
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

/* Testimonial Cookie Storage */

class CookieStorageTestimonialDAO extends TestimonialDAO {
    constructor() {
        super();
    }

    getAll() {
        const cookieValue = document.cookie
            .split("; ")
            .find((row) => row.startsWith("testimonials="))
            ?.split("=")[1];

        const testimonialsData = cookieValue
            ? JSON.parse(cookieValue)
            : TestimonialDAO.seeds;

        return testimonialsData.map((testimonialData) => {
            return Testimonial.create(testimonialData);
        });
    }

    create(testimonial) {
        const existingTestimonials = this.getAll();
        existingTestimonials.push(testimonial);
        document.cookie = `testimonials=${JSON.stringify(existingTestimonials)};`;
    }
}

/* Create Testimonials Service */

class CreateTestimonialService {
    constructor(referenceDao, testimonialDao) {
        this.referenceDao = referenceDao;
        this.testimonialDao = testimonialDao;
    }

    createReference(id, name, company, email) {
        const reference = Reference.create({ id, name, company, email });
        this.referenceDao.create(reference);
        return reference;
    }

    createTestimonial(comment, rating, referenceId) {
        const testimonial = Testimonial.create({
            comment,
            rating,
            referenceId,
        });
        this.testimonialDao.create(testimonial);
    }
}

/*  ~~~~~~~~~~~~~~~~~~~~~~~~~~~
        Render Testimonials
    ~~~~~~~~~~~~~~~~~~~~~~~~~~~  */

// const referenceDao = new SessionStorageReferenceDAO();
// const testimonialDao = new SessionStorageTestimonialDAO();

const referenceDao = new CookieStorageReferenceDAO();
const testimonialDao = new CookieStorageTestimonialDAO();

const createTestimonialService = new CreateTestimonialService(
    referenceDao,
    testimonialDao,
);

const references = referenceDao.getAll();
const testimonials = testimonialDao.getAll();

/*  Display Average Rating  */

const ratingTotal = testimonials.reduce(
    (total, testimonial) => total + testimonial.rating,
    0,
);
const averageRating = ratingTotal / testimonials.length;

const averageRatingDisplay = document.getElementById("average-rating");
averageRatingDisplay.innerText = `${averageRating.toFixed(1)} Stars`;

/*  Display Reference List and Testimonials  */

const referencesList = document.getElementById("references-list");

for (let i = 0; i < references.length; i++) {
    const referenceLi = document.createElement("li");
    const referenceHeading = document.createElement("h3");
    const referenceBody = document.createElement("p");
    const testimonialList = document.createElement("ul");

    referenceHeading.innerText = `${references[i].name}${
        references[i].company ? " | " + references[i].company : ""
    }`;
    referenceHeading.setAttribute("class", "text-lg font-semibold");

    referenceBody.innerText = `${references[i].email}`;
    referenceBody.setAttribute("class", "italic");

    const referenceTestimonials = testimonials.filter(
        (testimonial) => testimonial.referenceId === references[i].id,
    );

    referenceTestimonials.forEach((referenceTestimonial) => {
        const testimonialLi = document.createElement("li");
        testimonialLi.innerHTML = `<blockquote class="text-slate-600 italic">${referenceTestimonial.toString()}</blockquote>`;
        testimonialList.appendChild(testimonialLi);
    });

    referenceLi.appendChild(referenceHeading);
    referenceLi.appendChild(referenceBody);
    referenceLi.appendChild(testimonialList);

    referencesList.appendChild(referenceLi);
}

/* Capture Testimonial Form Data */

const referenceForm = document.getElementById("reference-form");

referenceForm.addEventListener("submit", (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    const valueName = formData.get("reference-name");
    const valueEmail = formData.get("reference-email");
    const valueCompany = formData.get("company-name");
    const valueRating = Number(formData.get("rating"));
    const valueComment = formData.get("comment");

    let reference = references.find(
        (reference) => reference.email == valueEmail,
    );

    if (!reference) {
        const newReferenceId =
            Math.max(...references.map((reference) => reference.id), 0) + 1;

        reference = createTestimonialService.createReference(
            newReferenceId,
            valueName,
            valueCompany,
            valueEmail,
        );
    }

    if (valueRating !== 0 || valueComment) {
        createTestimonialService.createTestimonial(
            valueComment,
            valueRating,
            reference.id,
        );
    }

    window.location.reload();
});
