export class Carousel {
    constructor(root) {
        this.root = root;
        this.images = Array.from(root.querySelectorAll('.carousel-viewport img'));
        this.indicators = Array.from(root.querySelectorAll('.carousel-indicators button'));
        this.prevBtn = root.querySelector('[data-prev]');
        this.nextBtn = root.querySelector('[data-next]');
        this.index = 0;

        this.bind();
        this.update();
    }

    bind() {
        this.indicators.forEach(btn => {
            btn.addEventListener('click', () => {
                this.index = Number(btn.dataset.index);
                this.update();
            });
        });

        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prev());
        }

        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.next());
        }
    }

    prev() {
        this.index = (this.index - 1 + this.images.length) % this.images.length;
        this.update();
    }

    next() {
        this.index = (this.index + 1) % this.images.length;
        this.update();
    }

    update() {
        this.images.forEach((img, i) => {
            img.classList.toggle('active', i === this.index);
        });

        this.indicators.forEach((btn, i) => {
            btn.classList.toggle('active', i === this.index);
        });
    }
}