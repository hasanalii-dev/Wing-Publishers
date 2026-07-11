gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    // ══════════════════════════════════════
    //  PRELOADER → HERO REVEAL
    // ══════════════════════════════════════
    window.initHeroAnimation = () => {
        const tl = gsap.timeline({
            onComplete: () => {
                document.body.style.overflow = '';
                gsap.set('#preloader', { display: 'none' });
                initMarquee();         // Start marquee after reveal
                initScrollAnimations(); // Start scroll-based reveals
            }
        });

        tl.to('#loader-counter', {
            opacity: 0, y: -20,
            duration: 0.4, ease: 'power2.in'
        })
        .to('#preloader img', {
            opacity: 0, scale: 0.8,
            duration: 0.3, ease: 'power2.in'
        }, '<0.1')
        .to('#preloader', {
            yPercent: -100,
            duration: 0.9,
            ease: 'power4.inOut'
        })
        .to('.animate-reveal', {
            opacity: 1, y: 0,
            duration: 0.8,
            stagger: 0.1,
            ease: 'power2.out'
        }, '-=0.4');
    };

    // ══════════════════════════════════════
    //  STANDARD REVEALS (non-index pages)
    // ══════════════════════════════════════
    window.initStandardReveals = () => {
        gsap.to('.animate-reveal', {
            opacity: 1, y: 0,
            duration: 0.7,
            stagger: 0.1,
            ease: 'power2.out',
            delay: 0.1
        });
        initScrollAnimations();
        initMarquee();
    };

    // ══════════════════════════════════════
    //  SCROLL-TRIGGERED REVEALS
    // ══════════════════════════════════════
    function initScrollAnimations() {
        // Stagger children
        document.querySelectorAll('.stagger-reveal').forEach(section => {
            gsap.to(section.children, {
                scrollTrigger: {
                    trigger: section,
                    start: 'top 88%',
                    toggleActions: 'play none none none'
                },
                opacity: 1, y: 0,
                duration: 0.7,
                stagger: 0.08,
                ease: 'power2.out'
            });
        });

        // Fade-up individual elements
        document.querySelectorAll('[data-reveal]').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, y: 30 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1, y: 0,
                    duration: 0.7,
                    delay: parseFloat(el.dataset.reveal) || 0,
                    ease: 'power2.out'
                }
            );
        });

        // Scale-in elements
        document.querySelectorAll('[data-scale-reveal]').forEach(el => {
            gsap.fromTo(el,
                { opacity: 0, scale: 0.9 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    opacity: 1, scale: 1,
                    duration: 0.8,
                    ease: 'power2.out'
                }
            );
        });

        // Parallax text (contact page watermark)
        document.querySelectorAll('.parallax-text').forEach(text => {
            gsap.to(text, {
                scrollTrigger: {
                    trigger: text.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: 1
                },
                x: '10%',
                ease: 'none'
            });
        });

        // Horizontal line reveals
        document.querySelectorAll('.line-reveal').forEach(line => {
            gsap.fromTo(line,
                { scaleX: 0 },
                {
                    scrollTrigger: {
                        trigger: line,
                        start: 'top 90%',
                        toggleActions: 'play none none none'
                    },
                    scaleX: 1,
                    duration: 1,
                    ease: 'power3.out',
                    transformOrigin: 'left center'
                }
            );
        });

        // Counter animation
        document.querySelectorAll('[data-count]').forEach(el => {
            const target = parseInt(el.dataset.count);
            const suffix = el.dataset.suffix || '';
            gsap.fromTo(el,
                { innerText: 0 },
                {
                    scrollTrigger: {
                        trigger: el,
                        start: 'top 88%',
                        toggleActions: 'play none none none'
                    },
                    innerText: target,
                    duration: 2,
                    ease: 'power2.out',
                    snap: { innerText: 1 },
                    onUpdate: function() {
                        el.innerText = Math.floor(parseFloat(el.innerText)) + suffix;
                    }
                }
            );
        });
    }

    // ══════════════════════════════════════
    //  MARQUEE — CSS-driven infinite loop
    // ══════════════════════════════════════
    function initMarquee() {
        const tracks = document.querySelectorAll('.marquee-track');
        if (!tracks.length) return;

        tracks.forEach(track => {
            const firstChild = track.children[0];
            if (!firstChild) return;

            // Clone the content block once for seamless loop
            const clone = firstChild.cloneNode(true);
            track.appendChild(clone);

            // Measure the width of one content block
            const contentWidth = firstChild.offsetWidth;

            // Apply CSS animation
            const speed = parseFloat(track.dataset.speed) || 50; // px per second
            const duration = contentWidth / speed;

            track.style.animation = `marqueeScroll ${duration}s linear infinite`;
            track.style.width = 'max-content';

            // Inject the keyframes if not already present
            if (!document.getElementById('marquee-keyframes')) {
                const style = document.createElement('style');
                style.id = 'marquee-keyframes';
                style.textContent = `
                    @keyframes marqueeScroll {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }
                `;
                document.head.appendChild(style);
            }
        });
    }

    // Kick off scroll animations immediately if no preloader on this page
    if (!document.getElementById('preloader')) {
        initScrollAnimations();
        initMarquee();
    }
    
    // ══════════════════════════════════════
    //  ADVANCED ANIMATIONS (Splits & Parallax)
    // ══════════════════════════════════════
    
    // Text Split Reveal (Recursive wrapper to preserve HTML structure)
    function splitTextNodes(el) {
        const childNodes = Array.from(el.childNodes);
        childNodes.forEach(node => {
            if (node.nodeType === Node.TEXT_NODE) {
                const text = node.textContent;
                if (text.trim() !== '') {
                    // Split by whitespace but keep the whitespace as separate array items
                    const words = text.split(/(\s+)/);
                    const fragment = document.createDocumentFragment();
                    words.forEach(word => {
                        if (word.trim() === '') {
                            fragment.appendChild(document.createTextNode(word));
                        } else {
                            const wrapper = document.createElement('span');
                            wrapper.className = 'split-line';
                            const inner = document.createElement('span');
                            inner.className = 'split-line-inner';
                            inner.textContent = word;
                            wrapper.appendChild(inner);
                            fragment.appendChild(wrapper);
                        }
                    });
                    el.replaceChild(fragment, node);
                }
            } else if (node.nodeType === Node.ELEMENT_NODE) {
                if (node.tagName !== 'BR') {
                    splitTextNodes(node);
                }
            }
        });
    }

    document.querySelectorAll('.split-text').forEach(el => {
        splitTextNodes(el);

        gsap.from(el.querySelectorAll('.split-line-inner'), {
            scrollTrigger: {
                trigger: el,
                start: 'top 90%',
                toggleActions: 'play none none none'
            },
            y: '100%',
            opacity: 0,
            duration: 0.8,
            stagger: 0.05,
            ease: 'power3.out'
        });
    });

    // Parallax Image Masks
    document.querySelectorAll('.parallax-img').forEach(img => {
        gsap.to(img, {
            scrollTrigger: {
                trigger: img.parentElement,
                start: 'top bottom',
                end: 'bottom top',
                scrub: true
            },
            y: '20%', // Slide down relative to container
            ease: 'none'
        });
    });

    // Process Timeline Progress Line
    const timelineProgress = document.getElementById('timeline-progress');
    if (timelineProgress) {
        gsap.to(timelineProgress, {
            scrollTrigger: {
                trigger: timelineProgress.parentElement,
                start: 'top 60%',
                end: 'bottom 60%',
                scrub: 1
            },
            height: '100%',
            ease: 'none'
        });
    }

});
