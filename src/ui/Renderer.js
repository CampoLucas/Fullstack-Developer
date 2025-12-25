import { Carousel } from "./elements/Carousel.js";

export class Renderer {
    constructor(app) {
        this.app = app;
        this.carousels = [];
    }

    init() {
        this.renderHero();
        this.renderAbout();
        this.renderExperiences();


    }

    renderHero() {
        if (!this.app) {
        }
        const hero = this.app.home.hero;
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

        // Buttons
        const btnCnt = document.getElementById("hero-btn-cnt");
        this.renderContactButtons(btnCnt, hero.buttons, baseId);
        
    }

    renderAbout() {
        const about = this.app.home.about;
        const baseId = about.baseId;

        // Title
        const titleEl = document.getElementById("about-title");
        titleEl.textContent = this.t(baseId, about.titleId);

        // Description
        const aboutDescEl = document.getElementById("about-desc");
        const aboutParagraphs = this.t(baseId, about.descriptionId);
        this.renderParagraphs(aboutDescEl, aboutParagraphs, ["header-description"]);

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

    renderExperiences() {
        const experience = this.app.experience.experience;
        const baseId = experience.baseId;
        console.log();

        // Title
        const titleEl = document.getElementById("experience-title");
        titleEl.textContent = this.t(baseId, experience.titleId);

        // test
        const experiencesEl = document.getElementById("experiences-cnt");
        experiencesEl.innerHTML = "";
        
        const experiences = experience.experiences;
        const temp = document.getElementById("game-experience");
        for (let i = 0; i < experiences.length; i++) {
            this.renderExperience(experiencesEl, temp, experiences[i], this.t(baseId, experiences[i].baseId));
        }
    }

    renderExperience(container, template, experience, baseId) {
        // Clone template
        const clone = template.content.firstElementChild.cloneNode(true);
        container.appendChild(clone);
        
        // Set the title section
        const titleEl = clone.querySelector("#exp-role");
        titleEl.textContent = `${baseId[experience.roleId]}`;
        
        const subTitle = clone.querySelector("#exp-company");
        subTitle.textContent = `${baseId[experience.companyId]} - ${baseId[experience.productId]}`;
        
        const thirdTitle = clone.querySelector("#exp-period");
        thirdTitle.textContent = `${baseId[experience.periodId]}`;

        // Add the img carousel
        const imgCnt = clone.querySelector("#carousel-cnt");
        const carouselTemp = document.getElementById("game-carousel");
        this.addImgCarousel(imgCnt, carouselTemp, experience.images, baseId[experience.productId]);

        // Add the experience description
        const descCnt = clone.querySelector("#description-cnt");
        this.renderCustomText(descCnt, baseId[experience.blocksId]);

    }

    addImgCarousel(container, template, images, alt) {
        container.innerHTML = "";
        
        // clone template
        const clone = template.content.firstElementChild.cloneNode(true);
        container.appendChild(clone);

        this.carousels.push(new Carousel(clone, 5, 4000, images, alt));
    }

    

    // Helpers
    
    t(id) {
        if (!id) return null;
        return this.app.lang[id] ?? this.app.defaultLang?.[id] ?? null;
    }

    t(baseId, key) {
        return (
            this.app.lang?.[baseId]?.[key] ??
            this.app.defaultLang?.[baseId]?.[key] ??
            null
        );
    }

    getNestedText(firstId, secondId, key) {
        return this.t(firstId, secondId)?.[key] ?? null;
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

    renderCustomText(container, blocks) {
        container.innerHTML = "";

        if (!blocks) return;

        const length = blocks.length;
        console.log(length)
        for (let i = 0; i < length; i++) {
            const block = blocks[i];
            if (!block) {
                console.log(`WARNING: [renderCustomText] Block from the index ${i} is null.`)
                continue;
            }
            console.log(block.type)
            switch (block.type) {
                case "desc":
                    container.appendChild(this.getDescEl(block));
                    break;
                case "ul":
                    container.appendChild(this.getUlEl(block, "list"));
                    break;
                case "hr-ul":
                    container.appendChild(this.getUlEl(block, "info-tags", "info-tag"));
                    break;
            }

        }
        
    }

    getBlockCntEl() {
        const cntEl = document.createElement("div");
        cntEl.classList.add("block-cnt");

        return cntEl;
    }

    getDescEl(block) {
        const cntEl = this.getBlockCntEl();
        
        if (block.title) {
            const titleEl = document.createElement("h3");
            titleEl.textContent = block.title;
            cntEl.appendChild(titleEl);
        } 
        
        const textEl = document.createElement("p");
        textEl.textContent = block.text;
        cntEl.appendChild(textEl);

        return cntEl;
    }

    getUlEl(block, styleClass, itemClass = null) {
        const cntEl = this.getBlockCntEl();
        
        if (block.title) {
            const titleEl = document.createElement("h3");
            titleEl.textContent = block.title;
            cntEl.appendChild(titleEl);
        }

        if (!block.items) return cntEl;

        const ulEl = document.createElement("ul");
        ulEl.classList.add(styleClass);
        for (let i = 0; i < block.items.length; i++) {
            const liEl = document.createElement("li");
            liEl.textContent = block.items[i];

            if (itemClass) {
                liEl.classList = itemClass;
            }

            ulEl.appendChild(liEl);
        }

        cntEl.appendChild(ulEl);



        return cntEl;
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

    renderContactButtons(container, buttons, baseId = null) {
        container.innerHTML = "";

        for (let i = 0; i < buttons.length; i++) {
            const btn = buttons[i];

            if (!btn) {
                console.log(`WARNING: [renderContactButtons] Button from the index ${i} is null.`)
                continue;
            }

            if (btn.disabled) continue;

            const isLink = btn.type && btn.type !== "email";
            const a = document.createElement("a");
            
            // add the mailto
            a.href = isLink ? btn.link : `mailto:${btn.link}`;
            
            if (btn.classList) {
                for (let i = 0; i <= btn.classList.length; i++) {
                    a.classList.add(btn.classList[i]);
                }
            }

            if (btn.label) {
                a.textContent = this.t(baseId, btn.label);
            }

            a.title = this.t(baseId, btn.hoverTextId) ?? "";

            if (isLink && btn.newTab) {
                a.target = "_blank";
                a.rel = "noopener noreferrer";
            }

            container.appendChild(a);
        }
    }
}