export class Carousel {
    constructor(root, thumbsPerView = 4, autoInterval = null) {
        this.root = root;

        this.images = Array.from(root.querySelectorAll('.carousel-viewport img'));
        this.thumbButtons = Array.from(root.querySelectorAll('.carousel-thumbs button'));
        this.dotButtons = Array.from(root.querySelectorAll('.carousel-dots button'));

        this.track = root.querySelector('.carousel-thumbs-track');
        this.prevBtn = root.querySelector('[data-prev]');
        this.nextBtn = root.querySelector('[data-next]');
        
        this.thumbsPerView = thumbsPerView;
        this.currentIndex = 0;
        this.thumbStart = 0;

        this.autoInterval = autoInterval;
        this.autoTimer = null;
        
        this.setupThumbs();
        this.bind();
        this.update();
        this.startAuto();
    }

    setupThumbs() {
        if (!this.track) return;

        const w = 100 / this.thumbsPerView;
        this.thumbButtons.forEach(btn => {
            btn.style.flex = `0 0 ${w}%`;
        });
    }

    bind() {
        this.thumbButtons.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                this.goTo(i);
                this.resetAuto();
            });
        });

        this.dotButtons.forEach((btn, i) => {
            btn.addEventListener('click', () => {
                this.goTo(i);
                this.resetAuto();
            });
        });

        this.prevBtn.addEventListener('click', () => {
            this.move(-1);
            this.resetAuto();
        });

        this.nextBtn.addEventListener('click', () => {
            this.move(1);
            this.resetAuto();
        });
    }

    move(dir) {
        const len = this.images.length;
        this.currentIndex = (this.currentIndex + dir + len) % len;
        this.ensureThumbVisible();
        this.update();
    }

    goTo(index) {
        this.currentIndex = index;
        this.ensureThumbVisible();
        this.update();
    }

    ensureThumbVisible() {
        if (!this.track) return;

        if (this.currentIndex < this.thumbStart) {
            this.thumbStart = this.currentIndex;
        }

        if (this.currentIndex >= this.thumbStart + this.thumbsPerView) {
            this.thumbStart = this.currentIndex - this.thumbsPerView + 1;
        }
    }

    update() {
        this.images.forEach((img, i) =>
            img.classList.toggle('active', i === this.currentIndex)
        );

        this.thumbButtons.forEach((btn, i) =>
            btn.classList.toggle('active', i === this.currentIndex)
        );

        this.dotButtons.forEach((btn, i) =>
            btn.classList.toggle('active', i === this.currentIndex)
        );

        if (this.track) {
            const offset = -(100 / this.thumbsPerView) * this.thumbStart;
            this.track.style.transform = `translateX(${offset}%)`;
        }
    }

    startAuto() {
        if (this.autoInterval == null) return;

        this.autoTimer = setInterval(() => {
            this.move(1);
        }, this.autoInterval);
    }

    stopAuto() {
        if (this.autoTimer) {
            clearInterval(this.autoTimer);
            this.autoTimer = null;
        }
    }

    resetAuto() {
        if (this.autoInterval == null) return;

        this.stopAuto();
        this.startAuto();
    }
}