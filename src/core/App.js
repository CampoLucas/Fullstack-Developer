import { JSONLoader } from "./JSONLoader.js";
import { Carousel } from "../elements/Carousel.js";

const dataPath = "./data";
const langPath = "./i18n";
const imgPath = "./assets/img";
const defaultLang = "en";

export class App {
    constructor() {
        this.json = new JSONLoader();

        this.home = null;
        this.experience = [];
        this.projects = [];
        this.skills = [];

        this.lang = null;
        this.defaultLang = null;
    }

    async init() {
        this.beginLoad();

        // Get the structure json
        const structData = await this.json.loadAllFromFolder(dataPath, [
            "home",
            "experience",
            "projects",
            "skills"
        ]);
        
        this.home = structData.home;
        this.experience = structData.experience;
        this.projects = structData.projects;
        this.skills = structData.skills;
        
        // Get the language from the url
        const lang = getLangFromURL();

        const langData = await this.json.load(`${langPath}/${lang}.json`);
        this.lang = langData;

        if (lang !== defaultLang) {
            const defaultLangData = await this.json.load(`${langPath}/${defaultLang}.json`);
            this.defaultLang = defaultLangData;
        }

        this.renderHome();
        document.querySelectorAll('[data-carousel]').forEach(el => {
            new Carousel(el);
        });

        this.endLoad();
    }

    renderHome() {
        this.renderHero();
        this.renderAbout();
    }

    renderHero() {
        const hero = this.home.hero;
        const baseId = hero.baseId;
        
        // Title
        const heroTitleEl = document.getElementById("hero-title");
        const heroTitleBlocks = this.t(baseId, hero.titleId);
        this.renderStylizedText(heroTitleEl, heroTitleBlocks);

        // Roles
        const heroRolesEl = document.getElementById("hero-roles");
        const heroRoles = this.t(baseId, hero.rolesId);
        this.renderStylizedRoles(heroRolesEl, heroRoles, "hero-role", "ceparator");

        // Image
        const heroImg = document.getElementById("hero-pic");
        heroImg.src = hero.picture.img;
        heroImg.alt = this.t(baseId, hero.picture.altId) ?? "";
    }

    renderAbout() {
        const about = this.home.about;
        const baseId = about.baseId;

        // Description
        const aboutDescEl = document.getElementById("about-desc");
        const aboutParagraphs = this.t(baseId, about.descriptionId);
        this.renderParagraphs(aboutDescEl, aboutParagraphs, ["text", "description"]);

        // Image
        const aboutImg = document.getElementById("about-pic");
        if (aboutImg) {
            aboutImg.src = about.picture.img;
            aboutImg.alt = this.t(baseId, about.picture.altId) ?? "";
        }

        // Contacts
        const contactsEl = document.getElementById("about-contacts");
        this.renderContactInfo(contactsEl, about.contact, "contact-link", "contact-sep");

        // Buttons
        const buttonsEl = document.getElementById("about-buttons");
        this.renderContactButtons(buttonsEl, about.buttons, baseId);
    }

    renderContactButtons(container, buttons, baseId = null) {
        container.innerHTML = "";

        for (let i = 0; i < buttons.length; i++) {
            const btn = buttons[i];

            if (!btn) {
                console.log(`WARNING: [renderContactButtons] Button from the index ${i} is null.`)
                continue;
            }

            const isLink = btn.type && btn.type !== "email";
            const a = document.createElement("a");
            
            
            a.href = isLink ? btn.link : `mailto:${btn.link}`;
            a.classList.add("icon", "social-link", btn.icon);
            a.title = this.t(baseId, btn.hoverTextId) ?? "";
            //a.setAttribute("aria-label", btn.label ?? null);

            if (isLink) {
                a.target = "_blank";
                a.rel = "noopener noreferrer";
            }

            container.appendChild(a);
        }
    }

    beginLoad() {
        const app = document.getElementById("app");
        app.setAttribute("aria-busy", "true");
    }

    endLoad() {
        const app = document.getElementById("app");
        app.setAttribute("aria-busy", "false");
    }

    // Helpers
    
    t(id) {
        if (!id) return null;
        return this.lang[id] ?? this.defaultLang?.[id] ?? null;
    }

    t(baseId, key) {
        return (
            this.lang?.[baseId]?.[key] ??
            this.defaultLang?.[baseId]?.[key] ??
            null
        );
    }
    
    renderStylizedText(container, blocks) {
        container.innerHTML = "";
        
        if (!blocks) return;

        const length = blocks.length;
        for (let i = 0; i < length; i++) {
            const block = blocks[i];
            if (!block) {
                console.log(`WARNING: [renderStylizedText] Block from the index ${i} is null.`)
                continue;
            }

            const span = document.createElement("span");
            span.textContent = block.text;
            span.className = block.style;
            container.appendChild(span);

        }
    }

    renderStylizedRoles(container, blocks, elementClass, ceparatorClass = null) {
        container.innerHTML = "";

        if (!blocks) return;
        const length = blocks.length;
        for (let i = 0; i < length; i++) {
            const block = blocks[i];
            if (!block) {
                console.log(`WARNING: [renderStylizedRoles] Block from the index ${i} is null.`)
                continue;
            }

            const span = document.createElement("span");
            span.classList.add(elementClass);
            span.textContent = block;
            container.appendChild(span);

            if (ceparatorClass && i < length - 1) {
                const sep = document.createElement("span");
                sep.classList.add(elementClass);
                sep.classList.add(ceparatorClass);
                sep.textContent = " | ";
                container.appendChild(sep);
            }
        }
    }

    renderParagraphs(container, paragraphs, classes = null) {
        container.innerHTML = "";
        
        if (!paragraphs) return;

        paragraphs.forEach(text => {
            const p = document.createElement("p");
            if (classes && classes.length !== 0) {
                for (let i = 0; i < classes.length; i++) {
                    const c = classes[i];
                    if (!c) continue;

                    p.classList.add(c);
                }
            }
            p.textContent = text;
            container.appendChild(p);
        });
    }

    renderContactInfo(container, contact, contactClass = null, ceparatorClass = null) {
        container.innerHTML = "";

        if (contact?.email) {
            const email = document.createElement("a");
            email.href = `mailto:${contact.email}`;
            email.textContent = contact.email;
            if (contactClass) email.classList.add(contactClass);
            container.appendChild(email);
        }

        const ceparator = document.createElement("span");
        ceparator.textContent = "•";
        if (ceparatorClass) ceparator.classList.add(ceparatorClass);
        container.appendChild(ceparator);

        if (contact?.phone) {
            const phone = document.createElement("a");
            phone.href = `tel:${contact.phone}`
            phone.textContent = contact.phone;
            if (contactClass) phone.classList.add(contactClass);
            container.appendChild(phone);
        }
    }
    
}

const app = new App();
await app.init();



function getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");

    return lang ? lang : "en";
}