import { JSONLoader } from "./JSONLoader.js";
import { Carousel } from "../ui/elements/Carousel.js";
import { Renderer } from "../ui/Renderer.js";

const dataPath = "./data";
const langPath = "./i18n";
const imgPath = "./assets/img";
const defaultLang = "en";

export class App {
    constructor() {
        this.json = new JSONLoader();
        this.renderer = new Renderer(this);

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

        this.renderer.init();
        // document.querySelectorAll('[data-carousel]').forEach(el => {
        //     new Carousel(el, 5, 4000);
        // });

        this.endLoad();
    }

    beginLoad() {
        const app = document.getElementById("app");
        app.setAttribute("aria-busy", "true");
    }

    endLoad() {
        const app = document.getElementById("app");
        app.setAttribute("aria-busy", "false");
    }
    
}

const app = new App();
await app.init();



function getLangFromURL() {
    const params = new URLSearchParams(window.location.search);
    const lang = params.get("lang");

    return lang ? lang : "en";
}