// PhotoWall3D.js
class PhotoWall3D {
    /**
     * @param {string} containerId - 容器的ID
     * @param {Array<string>} imageList - 图片URL数组
     * @param {Object} options - 可选配置
     */
    constructor(containerId, imageList, options = {}) {
        this.containerId = containerId;
        this.imageList = imageList;

        // 默认配置
        this.config = Object.assign({
            rows: 5,              // 行数
            colsPerRow: 38,       // 每行列数
            baseRadius: 700,      // 基础半径
            rowHeight: -8,        // 行高偏移
            autoPlaySpeed: 0.15,  // 自动旋转速度 (每帧角度增量)
            dragSensitivity: 0.2  // 拖拽灵敏度
        }, options);

        this.stage = null;
        this.overlay = null;
        this.container = null;

        // 动画与交互状态
        this.rotationY = 0;      // 当前旋转角度
        this.isDragging = false; // 是否正在拖拽
        this.startX = 0;         // 拖拽起始X
        this.lastRotation = 0;   // 拖拽起始时的角度
        this.isPaused = false;   // 是否处于放大查看状态
        this.isDragClick = false; // 用于区分点击和拖拽

        this.init();
    }

    init() {
        this.container = document.getElementById(this.containerId);
        if (!this.container) {
            console.error(`PhotoWall3D: 找不到容器元素 #${this.containerId}`);
            return;
        }

        if (typeof gsap === 'undefined') {
            console.error('PhotoWall3D: 依赖 GSAP 库，请先引入 GSAP (https://greensock.com/)');
            return;
        }

        this.container.classList.add('pw-container');
        this.createStageStructure(this.container);
        this.generatePhotoCards();
        this.bindEvents();
        this.startAnimationLoop();
    }

    createStageStructure(container) {
        this.stage = document.createElement('div');
        this.stage.className = 'pw-stage';
        container.appendChild(this.stage);

        this.overlay = document.createElement('div');
        this.overlay.className = 'pw-overlay';
        document.body.appendChild(this.overlay);
    }

    generatePhotoCards() {
        const { rows, colsPerRow, baseRadius, rowHeight } = this.config;
        const images = (this.imageList && this.imageList.length > 0)
            ? this.imageList
            : ['https://via.placeholder.com/200x200?text=No+Image'];

        let cardIndex = 0;

        for (let r = 0; r < rows; r++) {
            const offsetFactor = (r - (rows - 1) / 2) / ((rows - 1) / 2);
            const tiltDegrees = offsetFactor * -20;
            const currentRadius = baseRadius;

            for (let i = 0; i < colsPerRow; i++) {
                const card = document.createElement('div');
                card.className = 'pw-card';

                const imgUrl = images[cardIndex % images.length];
                cardIndex++;

                const angle = (360 / colsPerRow) * i;
                const staggerOffset = i % 2 === 1 ? 20 : -20;
                const yOffset = (r - (rows - 1) / 2) * rowHeight + staggerOffset;

                gsap.set(card, {
                    transform: `rotateY(${angle}deg) rotateX(${tiltDegrees}deg) translateZ(${currentRadius}px) translateY(${yOffset}px)`
                });

                card.innerHTML = `<img src="${imgUrl}" loading="lazy" alt="photo">`;

                // 阻止图片原生拖拽
                card.querySelector('img').ondragstart = (e) => e.preventDefault();

                card.addEventListener('click', (e) => {
                    // 如果刚才发生了拖拽，则视为不是点击，不触发放大
                    if (this.isDragClick) return;
                    e.stopPropagation();
                    this.handleCardClick(card);
                });

                this.stage.appendChild(card);
            }
        }
    }

    bindEvents() {
        // --- 鼠标事件 ---
        this.container.addEventListener('mousedown', (e) => {
            if (this.isPaused) return;
            this.isDragging = true;
            this.startX = e.clientX;
            this.lastRotation = this.rotationY;
            this.isDragClick = false;
        });

        window.addEventListener('mousemove', (e) => {
            if (!this.isDragging) return;
            e.preventDefault();

            const deltaX = e.clientX - this.startX;
            // 移动超过5像素视为拖拽
            if (Math.abs(deltaX) > 5) {
                this.isDragClick = true;
            }

            this.rotationY = this.lastRotation + (deltaX * this.config.dragSensitivity);
        });

        window.addEventListener('mouseup', () => {
            this.isDragging = false;
            // 延迟重置，确保 click 事件能读取到状态
            setTimeout(() => { this.isDragClick = false; }, 50);
        });

        // --- 触摸屏事件 ---
        this.container.addEventListener('touchstart', (e) => {
            if (this.isPaused) return;
            this.isDragging = true;
            this.startX = e.touches[0].clientX;
            this.lastRotation = this.rotationY;
            this.isDragClick = false;
        }, { passive: false });

        window.addEventListener('touchmove', (e) => {
            if (!this.isDragging) return;
            const deltaX = e.touches[0].clientX - this.startX;
            if (Math.abs(deltaX) > 5) this.isDragClick = true;
            this.rotationY = this.lastRotation + (deltaX * this.config.dragSensitivity);
        }, { passive: false });

        window.addEventListener('touchend', () => {
            this.isDragging = false;
            setTimeout(() => { this.isDragClick = false; }, 50);
        });
    }

    startAnimationLoop() {
        gsap.ticker.add(() => {
            if (this.isPaused) return;

            // 如果不在拖拽，自动旋转
            if (!this.isDragging) {
                this.rotationY -= this.config.autoPlaySpeed;
            }

            // 更新舞台角度
            gsap.set(this.stage, {
                rotationY: this.rotationY
            });
        });
    }

    handleCardClick(originalCard) {
        this.isPaused = true;

        const rect = originalCard.getBoundingClientRect();
        const clone = originalCard.cloneNode(true);
        clone.className = 'pw-clone-card';

        gsap.set(clone, {
            top: rect.top,
            left: rect.left,
            width: rect.width,
            height: rect.height,
            transform: 'none',
            margin: 0
        });
        document.body.appendChild(clone);

        originalCard.style.visibility = 'hidden';
        this.overlay.style.display = 'block';

        gsap.to(this.overlay, {
            backgroundColor: 'rgba(0,0,0,0.85)',
            backdropFilter: 'blur(10px)',
            duration: 0.5
        });

        // 响应式计算最大宽高
        const maxSize = Math.min(window.innerWidth * 0.9, window.innerHeight * 0.9, 600);

        gsap.to(clone, {
            duration: 0.8,
            top: '50%',
            left: '50%',
            xPercent: -50,
            yPercent: -50,
            width: maxSize,
            height: maxSize,
            borderRadius: "10px",
            ease: "expo.out"
        });

        const closeZoom = (e) => {
            if (e) e.stopPropagation();
            const endRect = originalCard.getBoundingClientRect();

            clone.onclick = null;
            this.overlay.onclick = null;

            const tl = gsap.timeline({
                onComplete: () => {
                    this.isPaused = false;
                    if (clone.parentNode) clone.remove();
                    this.overlay.style.display = 'none';
                    gsap.set(originalCard, { clearProps: "opacity,visibility" });
                }
            });

            tl.to(clone, {
                duration: 0.6,
                top: endRect.top,
                left: endRect.left,
                xPercent: 0,
                yPercent: 0,
                width: endRect.width,
                height: endRect.height,
                borderRadius: "30px",
                ease: "power3.inOut"
            }, 0);

            gsap.set(originalCard, { visibility: 'visible', opacity: 0 });
            tl.to(clone, { opacity: 0, duration: 0.2 }, 0.2);
            tl.to(originalCard, { opacity: 1, duration: 0.2 }, 0.4);

            gsap.to(this.overlay, {
                backgroundColor: 'rgba(0,0,0,0)',
                backdropFilter: 'blur(0px)',
                duration: 0.5
            });
        };

        clone.onclick = closeZoom;
        this.overlay.onclick = closeZoom;
    }
}