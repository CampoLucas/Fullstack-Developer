const popupTemplate = "popup-template";

export class PopupHandler {
    constructor(app) {
        this.app = app;
        this.handleRoute = this.handleRoute.bind(this);
    }

    init() {
        // problem here... this event is called before the app can get the json
        // handleRoute needs to await until the app can get the jsons
        //window.addEventListener("load", this.handleRoute);
        window.addEventListener("hashchange", this.handleRoute);

        this.app.ready.then(() => {
            this.handleRoute();
        })
    }

    handleRoute() {
        const slug = location.hash.slice(1);
        console.log("handleRoute");

        this.removePopup();

        if (!slug) return;

        // check if there is a project with that id
        const project = this.app.projects.projects.projects.find(p => p.baseId.toLowerCase() === slug.toLowerCase());
        if (project) {
            console.log(`loading project: ${project.id}`);
            //document.body.style.overflow = "hidden";
            document.body.classList.add("popup-open");
            this.createPopup(project);
        }
        else {
            console.log(`Project not found`);
        }

    }

    createPopup(project) {
        const template = document.getElementById(popupTemplate);

        if (!template) {
            console.log(`WARNING: Couldn't find the tamplate "${popupTemplate}"`);
            return;
        }

        const popup = template.content.firstElementChild.cloneNode(true);
        document.body.appendChild(popup);

        const cnt = document.getElementById("popup-viewport");
        const temp = document.getElementById("game-project");
        const render = this.app.renderer;
        const projects = this.app.projects.projects;
        const baseId = projects.baseId;

        render.renderProject(cnt, temp, project, render.t(baseId, project.baseId));
        const closeBtn = popup.querySelector("#close-popup-btn");
        closeBtn.onclick = () => {
            history.pushState("", document.title, window.location.pathname);
            this.removePopup();
        }


        // const popup = document.createElement("div");
        // popup.className = "popup";

        // popup.innerHTML = `
        //     <div class="popup-content">
        //     <h2>Popup: ${project.id}</h2>
        //     <p>This only exists when the hash exists.</p>
        //     <button id="close">Close</button>
        //     </div>
        // `;

        // popup.querySelector("#close").onclick = () => {
        //     history.pushState("", document.title, window.location.pathname);
        //     this.removePopup();
        // };

        // document.body.appendChild(popup);
    }

    removePopup() {
        //document.body.style.overflow = "";
        document.body.classList.remove("popup-open");
        document.querySelector(".popup")?.remove();
    }
}