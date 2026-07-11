document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════
    //  CUSTOM CURSOR — Fixed alignment
    // ══════════════════════════════════════
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorOutline = document.querySelector('.cursor-outline');

    if (cursorDot && cursorOutline) {
        let mouseX = -100, mouseY = -100;
        let outlineX = -100, outlineY = -100;
        let dotW = 6, dotH = 6;
        let outlineW = 36, outlineH = 36;

        window.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;
        });

        const tick = () => {
            // Dot follows instantly — centered on cursor
            cursorDot.style.transform = `translate(${mouseX - dotW / 2}px, ${mouseY - dotH / 2}px)`;

            // Outline trails with easing — centered on cursor
            outlineX += (mouseX - outlineX) * 0.15;
            outlineY += (mouseY - outlineY) * 0.15;

            // Read current outline size for centering (handles hovering size change)
            const rect = cursorOutline.getBoundingClientRect();
            outlineW = rect.width;
            outlineH = rect.height;

            cursorOutline.style.transform = `translate(${outlineX - outlineW / 2}px, ${outlineY - outlineH / 2}px)`;

            requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);

        // Hover detection
        const applyHover = () => {
            document.querySelectorAll('a, button, .hover-target, input, textarea').forEach(el => {
                el.addEventListener('mouseenter', () => cursorOutline.classList.add('hovering'));
                el.addEventListener('mouseleave', () => cursorOutline.classList.remove('hovering'));
            });
        };
        applyHover();

        // Hide off-window
        document.addEventListener('mouseleave', () => {
            cursorDot.style.opacity = '0';
            cursorOutline.style.opacity = '0';
        });
        document.addEventListener('mouseenter', () => {
            cursorDot.style.opacity = '1';
            cursorOutline.style.opacity = '1';
        });
    }

    // ══════════════════════════════════════
    //  NAVBAR — Scroll shrink (no hide)
    // ══════════════════════════════════════
    const navbar = document.getElementById('navbar');
    if (navbar) {
        let ticking = false;
        window.addEventListener('scroll', () => {
            if (!ticking) {
                requestAnimationFrame(() => {
                    if (window.scrollY > 80) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                    ticking = false;
                });
                ticking = true;
            }
        });
    }

    // ══════════════════════════════════════
    //  MOBILE MENU
    // ══════════════════════════════════════
    const menuToggle = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    if (menuToggle && mobileMenu) {
        let isOpen = false;
        menuToggle.addEventListener('click', () => {
            isOpen = !isOpen;
            mobileMenu.classList.toggle('open', isOpen);
            const bars = menuToggle.querySelectorAll('span');
            if (isOpen) {
                bars[0].style.transform = 'rotate(45deg) translate(3px, 3px)';
                bars[0].style.width = '24px';
                bars[1].style.transform = 'rotate(-45deg) translate(2px, -2px)';
                bars[1].style.width = '24px';
                document.body.style.overflow = 'hidden';
            } else {
                bars[0].style.transform = '';
                bars[0].style.width = '';
                bars[1].style.transform = '';
                bars[1].style.width = '';
                document.body.style.overflow = '';
            }
        });
    }

    // ══════════════════════════════════════
    //  PRELOADER
    // ══════════════════════════════════════
    const preloader = document.getElementById('preloader');
    const counter = document.getElementById('loader-counter');

    if (preloader && counter) {
        document.body.style.overflow = 'hidden';
        let progress = 0;

        const updateLoader = () => {
            progress += Math.floor(Math.random() * 10) + 2;
            if (progress > 100) progress = 100;
            counter.innerText = progress;

            if (progress < 100) {
                setTimeout(updateLoader, Math.floor(Math.random() * 80) + 30);
            } else {
                setTimeout(() => {
                    if (window.initHeroAnimation) {
                        window.initHeroAnimation();
                    } else {
                        preloader.style.opacity = '0';
                        preloader.style.transition = 'opacity 0.6s ease';
                        setTimeout(() => {
                            preloader.style.display = 'none';
                            document.body.style.overflow = '';
                        }, 600);
                    }
                }, 350);
            }
        };
        setTimeout(updateLoader, 200);
    } else {
        setTimeout(() => {
            if (window.initStandardReveals) window.initStandardReveals();
        }, 50);
    }

    // ══════════════════════════════════════
    //  MAGNETIC CURSOR PULL
    // ══════════════════════════════════════
    const magneticElements = document.querySelectorAll('.btn-primary, .btn-outline, .nav-logo');
    
    magneticElements.forEach(el => {
        // Wrap content in a span if not already to transform independently
        if (!el.querySelector('.magnetic-inner')) {
            const inner = document.createElement('span');
            inner.className = 'magnetic-inner block relative z-10 pointer-events-none transition-transform duration-300 ease-out';
            inner.innerHTML = el.innerHTML;
            el.innerHTML = '';
            el.appendChild(inner);
            el.classList.add('magnetic-wrap');
        }

        const inner = el.querySelector('.magnetic-inner');

        el.addEventListener('mousemove', (e) => {
            const rect = el.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            // Pull element bounds
            el.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px)`;
            // Pull text harder
            if (inner) inner.style.transform = `translate(${x * 0.15}px, ${y * 0.15}px)`;
        });

        el.addEventListener('mouseleave', () => {
            el.style.transform = `translate(0px, 0px)`;
            if (inner) inner.style.transform = `translate(0px, 0px)`;
        });
    });

    // ══════════════════════════════════════
    //  3D TILT EFFECT
    // ══════════════════════════════════════
    const tiltCards = document.querySelectorAll('.book-tilt-card');
    
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            // Calculate rotation based on cursor position relative to center
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = ((y - centerY) / centerY) * -10; // Max tilt 10deg
            const rotateY = ((x - centerX) / centerX) * 10;
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // ══════════════════════════════════════
    //  MAGIC PARTICLES GENERATOR
    // ══════════════════════════════════════
    function createParticles() {
        const containers = document.querySelectorAll('.particles-container');
        
        containers.forEach(container => {
            const numParticles = 40; // Number of particles per container
            
            for (let i = 0; i < numParticles; i++) {
                const particle = document.createElement('div');
                
                // Randomly assign size class
                const isLarge = Math.random() > 0.8;
                particle.className = `particle ${isLarge ? 'large' : ''}`;
                
                // Random positions
                const posX = Math.random() * 100; // 0 to 100%
                const posY = Math.random() * 100;
                
                // Random animation delay and duration
                const delay = Math.random() * 8; // 0 to 8s
                const duration = 6 + Math.random() * 4; // 6 to 10s
                
                particle.style.left = `${posX}%`;
                particle.style.top = `${posY}%`;
                particle.style.setProperty('--delay', `${delay}s`);
                particle.style.setProperty('--duration', `${duration}s`);
                
                container.appendChild(particle);
            }
        });
    }
    
    createParticles();

    // ══════════════════════════════════════
    //  FAQ ACCORDION LOGIC
    // ══════════════════════════════════════
    const faqItems = document.querySelectorAll('.faq-item');
    faqItems.forEach(item => {
        const trigger = item.querySelector('.faq-trigger');
        const content = item.querySelector('.faq-content');
        const icon = item.querySelector('.faq-icon');
        
        trigger.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');
            
            // Close all others
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                const otherContent = otherItem.querySelector('.faq-content');
                const otherIcon = otherItem.querySelector('.faq-icon');
                if (otherContent) otherContent.style.height = '0px';
                if (otherIcon) otherIcon.style.transform = 'rotate(0deg)';
            });
            
            // Toggle current
            if (!isOpen) {
                item.classList.add('active');
                content.style.height = content.scrollHeight + 'px';
                icon.style.transform = 'rotate(180deg)';
            }
        });
    });

});
