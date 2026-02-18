// --- CONFIGURATION: INSTAGRAM IMAGES ---
// Update these URLs and Categories to change the photos in the Instagram section
const INSTAGRAM_CONFIG = {
    images: [
        { url: 'assets/insta-1.png', category: 'Baby Announcement' },
        { url: 'assets/insta-2.png', category: 'Trousseau Packing' },
        { url: 'assets/insta-3.png', category: 'Handmade Cards' },
        { url: 'assets/insta-4.png', category: 'Wedding Hamper' },
        { url: 'assets/insta-5.png', category: 'Festive Decor' }
    ]
};

// --- DOMContentLoaded for Initial Setup ---
document.addEventListener("DOMContentLoaded", () => {
    // --- Touch Device Detection (for graceful degradation) ---
    const isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);

    // Hide custom cursor on touch devices
    if (isTouchDevice) {
        document.body.classList.add('touch-device');
    }

    // Render Instagram Grid dynamically
    renderInstagramGrid();

    // Initialize Global Particles
    initGlobalParticles();
});

// --- PARTICLE SYSTEM (Golden Fireflies / Explosion) ---
let particleSystem;

function initGlobalParticles() {
    const canvas = document.getElementById('global-particles');
    if (!canvas) return;

    particleSystem = new ParticleSystem(canvas);
    particleSystem.animate();
}

class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.particles = [];
        this.mode = 'float'; // CHANGED: Default to 'float' (full screen) to avoid swarm effect
        this.center = { x: this.width / 2, y: this.height / 2 };

        this.resize();
        window.addEventListener('resize', () => this.resize());

        // Create initial particles
        this.createParticles(150);
    }

    resize() {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.canvas.width = this.width;
        this.canvas.height = this.height;
        this.center = { x: this.width / 2, y: this.height / 2 };
    }

    createParticles(count) {
        for (let i = 0; i < count; i++) {
            this.particles.push(new Particle(this));
        }
    }

    explode() {
        this.mode = 'explode';
        this.particles.forEach(p => {
            // Burst outward from center
            const angle = Math.random() * Math.PI * 2;
            const speed = 5 + Math.random() * 10;
            p.vx = Math.cos(angle) * speed;
            p.vy = Math.sin(angle) * speed;
            p.mode = 'explode';
        });

        // After explosion, settle into float mode
        setTimeout(() => {
            this.mode = 'float';
            this.particles.forEach(p => p.mode = 'float');
        }, 1000);
    }

    animate() {
        this.ctx.clearRect(0, 0, this.width, this.height);

        this.particles.forEach(p => {
            p.update();
            p.draw(this.ctx);
        });

        requestAnimationFrame(() => this.animate());
    }
}

class Particle {
    constructor(system) {
        this.system = system;
        this.init();
    }

    init() {
        // Start random
        this.x = Math.random() * this.system.width;
        this.y = Math.random() * this.system.height;

        // Swarm center initially
        if (this.system.mode === 'swarm') {
            // Start near center
            const angle = Math.random() * Math.PI * 2;
            const dist = 50 + Math.random() * 100;
            this.x = this.system.center.x + Math.cos(angle) * dist;
            this.y = this.system.center.y + Math.sin(angle) * dist;
        }

        this.size = Math.random() * 2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.5;
        this.speedY = (Math.random() - 0.5) * 0.5;
        this.color = `rgba(212, 175, 55, ${Math.random() * 0.5 + 0.2})`; // Gold

        // Swarm physics
        this.angle = Math.random() * Math.PI * 2;
        this.radius = 50 + Math.random() * 100;
        this.swarmSpeed = 0.02 + Math.random() * 0.03;
    }

    update() {
        if (this.system.mode === 'swarm') {
            // Orbit center
            this.angle += this.swarmSpeed;
            this.x = this.system.center.x + Math.cos(this.angle) * this.radius;
            this.y = this.system.center.y + Math.sin(this.angle) * this.radius;

            // Pulse radius
            this.radius += Math.sin(Date.now() * 0.001) * 0.5;
        }
        else if (this.system.mode === 'explode') {
            this.x += this.vx;
            this.y += this.vy;
            this.vx *= 0.95; // Friction
            this.vy *= 0.95;
        }
        else { // Float
            this.x += this.speedX;
            this.y += this.speedY;

            // Wrap around
            if (this.x < 0) this.x = this.system.width;
            if (this.x > this.system.width) this.x = 0;
            if (this.y < 0) this.y = this.system.height;
            if (this.y > this.system.height) this.y = 0;
        }
    }

    draw(ctx) {
        ctx.fillStyle = this.color;
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fill();
    }
}

// --- Preloader Logic (Run on Window Load to ensure assets ready) ---
window.addEventListener('load', () => {
    // 0. Preloader Series - "Fluid Curtain Rise"
    const preloaderTimeline = gsap.timeline();

    // Initial State
    gsap.set('.hero-story', { scale: 1.05 });

    // Set body bg to dark to match preloader (prevent white flash)
    gsap.set('body', { backgroundColor: '#1a1613' });

    preloaderTimeline
        // 1. Reveal Logo & Bar Container (INSTANT)
        .to('.preloader-logo-main, .preloader-progress-bar', {
            opacity: 1,
            y: 0,
            duration: 0.1,
            ease: 'power2.out'
        })
        // 2. Fill Progress Bar & Explode Particles
        .to('.preloader-progress-fill', {
            width: '100%',
            duration: 1.2,
            ease: 'power2.inOut',
            onComplete: () => {
                if (window.particleSystem) window.particleSystem.explode();
            }
        })
        // 3. Fade out content
        .to('.preloader-content', {
            opacity: 0,
            y: -50,
            duration: 0.4,
            ease: 'power2.in'
        })
        // 4. CURTAIN + WAVE RISE (Slide Up)
        .to('.preloader-curtain', {
            yPercent: -120, // Move completely out of view including wave
            duration: 1.4,
            ease: 'power4.inOut'
        })
        // 5. Hero Reveal (Scale down to normal)
        .to('.hero-story', {
            scale: 1,
            duration: 1.4,
            ease: 'power2.out'
        }, '-=1.2') // Almost completely overlap with curtain rise
        // 6. HIDE PARTICLES (They should only appear on split)
        .to('.global-particles', {
            opacity: 0,
            duration: 0.5
        }, '-=0.5')
        // 7. Cleanup
        .to('.preloader-curtain', {
            display: 'none',
            onComplete: () => {
                ScrollTrigger.refresh();
                // Restore body bg (optional, or keep it if it matches theme)
                gsap.set('body', { backgroundColor: '' });
                // Force Scroll to top again just in case
                window.scrollTo(0, 0);

                // Enable Navbar Scroll Logic (Start Transparent)
                const navbar = document.querySelector('.navbar');
                window.addEventListener('scroll', () => {
                    // Only turn white if scrolled past hero (approx 100vh)
                    if (window.scrollY > window.innerHeight * 0.8) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                });
            }
        });

    // FAILSAFE: Force remove preloader if something gets stuck
    setTimeout(() => {
        const preloader = document.querySelector('.preloader-curtain');
        if (preloader && getComputedStyle(preloader).display !== 'none') {
            gsap.to(preloader, {
                yPercent: -120,
                duration: 0.5,
                onComplete: () => {
                    preloader.style.display = 'none';
                    ScrollTrigger.refresh();
                }
            });
        }
    }, 6000);
});

document.addEventListener("DOMContentLoaded", () => {
    // Force Scroll to Top on Reload
    if (history.scrollRestoration) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // --- Hanging Gallery Physics ---
    const hangingCards = document.querySelectorAll('.hanging-card');
    if (hangingCards.length > 0) {
        // Entry Animation
        gsap.from(hangingCards, {
            y: -50,
            opacity: 0,
            duration: 1.2,
            stagger: 0.1,
            ease: "elastic.out(1, 0.5)",
            scrollTrigger: {
                trigger: ".insta-grid",
                start: "top 80%"
            }
        });

        // Smooth continuous sway animation (no scroll jitter)
        gsap.ticker.add((time) => {
            hangingCards.forEach((card, i) => {
                // Unique visual offset for each card
                const offset = i * 0.8;

                // Smooth continuous sway - slightly different speeds per card
                const swayAmt = Math.sin(time * 2 + offset) * 2.5; // +/- 2.5 deg

                // Apply smooth rotation only
                gsap.set(card, { rotation: swayAmt });
            });
        });
    }





    // 1. Initialize Lenis Smooth Scroll (immediate, synced with GSAP)
    let lenis = null;
    try {
        if (typeof Lenis !== 'undefined') {
            lenis = new Lenis({
                duration: 2.5, // 2.5s for ultra-smooth "Video Mode" glide
                easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)), // Standard ease-out
                orientation: 'vertical',
                gestureOrientation: 'vertical',
                smoothWheel: true,
                wheelMultiplier: 0.5, // Reduced sensitivity for control
                touchMultiplier: 1.5,
                infinite: false,
            });

            // Sync with GSAP ScrollTrigger via gsap.ticker (not rAF)
            lenis.on('scroll', ScrollTrigger.update);
            gsap.ticker.add((time) => {
                lenis.raf(time * 1000);
            });
            gsap.ticker.lagSmoothing(0);

            // Navbar scroll effect with Lenis
            const navbar = document.querySelector('.navbar');
            if (navbar) {
                lenis.on('scroll', ({ scroll }) => {
                    if (scroll > 50) {
                        navbar.classList.add('scrolled');
                    } else {
                        navbar.classList.remove('scrolled');
                    }
                });
            }
        }
    } catch (e) {
        console.warn('Lenis smooth scroll not available:', e);
    }


    // --- Custom Cursor Logic ---
    const cursorDot = document.querySelector('.cursor-dot');
    const cursorSpotlight = document.querySelector('.cursor-spotlight');

    if (cursorDot || cursorSpotlight) {
        // Move logic
        window.addEventListener('mousemove', (e) => {
            if (cursorDot) {
                gsap.to(cursorDot, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0,
                    ease: "none"
                });
            }
            if (cursorSpotlight) {
                gsap.to(cursorSpotlight, {
                    x: e.clientX,
                    y: e.clientY,
                    duration: 0.25,
                    ease: "power2.out"
                });
            }
        });

        // Hover effect for interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .process-card, input, textarea');
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                if (cursorSpotlight) cursorSpotlight.classList.add('active');
            });
            el.addEventListener('mouseleave', () => {
                if (cursorSpotlight) cursorSpotlight.classList.remove('active');
            });
        });
    }

    // --- Scroll Progress Ring ---
    const progressRing = document.querySelector('.ring-progress');
    if (progressRing) {
        // Circumference = 2 * PI * r (r=28) => ~176
        const circumference = 2 * Math.PI * 28;
        progressRing.style.strokeDasharray = `${circumference} ${circumference}`;
        progressRing.style.strokeDashoffset = circumference;

        function setProgress(percent) {
            const offset = circumference - percent / 100 * circumference;
            progressRing.style.strokeDashoffset = offset;
        }

        window.addEventListener('scroll', () => {
            const scrollTop = window.scrollY;
            const docHeight = document.documentElement.scrollHeight - window.innerHeight;
            const scrollPercent = (scrollTop / docHeight) * 100;
            setProgress(scrollPercent);
        }, { passive: true });
    }

    // --- Magnetic Buttons Effect ---
    const magnets = document.querySelectorAll('.btn');
    magnets.forEach((magnet) => {
        magnet.addEventListener('mousemove', (e) => {
            const rect = magnet.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;

            // Move the button itself
            gsap.to(magnet, {
                duration: 0.3,
                x: x * 0.3,
                y: y * 0.3,
                ease: "power2.out"
            });

            // Move the text/icon inside slightly more (parallax)
            // Assuming the button has text or an icon
            if (magnet.children.length > 0) {
                gsap.to(magnet.children, {
                    duration: 0.3,
                    x: x * 0.2,
                    y: y * 0.2,
                    ease: "power2.out"
                });
            }
        });

        magnet.addEventListener('mouseleave', () => {
            // Reset
            gsap.to(magnet, {
                duration: 0.5,
                x: 0,
                y: 0,
                ease: "elastic.out(1, 0.3)"
            });

            if (magnet.children.length > 0) {
                gsap.to(magnet.children, {
                    duration: 0.5,
                    x: 0,
                    y: 0,
                    ease: "elastic.out(1, 0.3)"
                });
            }
        });
    });

    // 2. Initialize GSAP ScrollTrigger
    gsap.registerPlugin(ScrollTrigger, Flip);

    // =====================================================
    // HERO STORY — Scroll-Driven "Gift Unwrapping" Timeline
    // =====================================================
    const heroStory = document.querySelector('.hero-story');
    if (heroStory) {
        // --- Generate golden particles ---
        const hsParticles = heroStory.querySelector('.hs-particles');
        if (hsParticles) {
            hsParticles.innerHTML = ''; // Clear existing
            for (let i = 0; i < 40; i++) {
                const p = document.createElement('div');
                p.classList.add('hs-particle');
                const size = Math.random() * 4 + 2;
                p.style.width = size + 'px';
                p.style.height = size + 'px';
                p.style.left = Math.random() * 100 + '%';
                p.style.top = (Math.random() * 80 + 10) + '%';
                p.style.setProperty('--dur', (Math.random() * 6 + 5) + 's');
                p.style.setProperty('--delay', (Math.random() * 8) + 's');
                hsParticles.appendChild(p);
            }
        }

        // --- Set up golden thread path length ---
        const threadPath = document.querySelector('.hs-thread-path');
        let threadLen = 2200;
        if (threadPath) {
            try {
                threadLen = threadPath.getTotalLength();
            } catch (e) {
                threadLen = 2200;
            }
            threadPath.style.strokeDasharray = threadLen;
            threadPath.style.strokeDashoffset = threadLen;
        }

        // --- INITIAL STATE: Ensure Dark Panels are visible and closed ---
        gsap.set('.hs-dark-left', { xPercent: 0 });
        gsap.set('.hs-dark-right', { xPercent: 0 });

        // --- Master ScrollTrigger Timeline ---
        const heroTl = gsap.timeline({
            scrollTrigger: {
                trigger: '.hero-story',
                start: 'top top',
                end: '+=300%',
                pin: true,
                scrub: 1,
                anticipatePin: 1,
                onUpdate: function (self) {
                    // Toggle navbar dark mode based on scroll progress
                    if (self.progress > 0.65) {
                        document.body.classList.remove('hero-dark');
                    } else {
                        document.body.classList.add('hero-dark');
                    }
                    // Enable CTA pointer events at the end
                    const cta = document.querySelector('.hs-cta');
                    if (cta) {
                        if (self.progress > 0.92) {
                            cta.classList.add('active');
                        } else {
                            cta.classList.remove('active');
                        }
                    }
                },
                onLeave: function () {
                    document.body.classList.remove('hero-dark');
                },
                onEnterBack: function () {
                    document.body.classList.add('hero-dark');
                }
            }
        });

        // ===== PHASE 1: Thread draws + first text (timeline 0 → 1) =====
        // Scroll hint fades out
        heroTl.to('.hs-scroll-hint', {
            opacity: 0,
            y: 20,
            duration: 0.2,
            ease: 'power2.in'
        }, 0);

        // Golden thread draws across screen
        heroTl.to('.hs-thread-path', {
            strokeDashoffset: 0,
            duration: 0.8,
            ease: 'none'
        }, 0.05);

        // Phase 1 text reveals (staggered lines)
        heroTl.from('.hs-text-1 .hs-line', {
            y: 80,
            opacity: 0,
            stagger: 0.12,
            duration: 0.4,
            ease: 'power3.out'
        }, 0.15);


        // ===== PHASE 2: Text swap + craft elements fly in (timeline 1 → 2) =====
        // Phase 1 text exits
        heroTl.to('.hs-text-1', {
            opacity: 0,
            y: -50,
            scale: 0.95,
            duration: 0.25,
            ease: 'power2.in'
        }, 1.0);

        // Phase 2 text enters
        heroTl.to('.hs-text-2', {
            opacity: 1,
            duration: 0.05
        }, 1.25);

        heroTl.from('.hs-text-2 .hs-line', {
            y: 80,
            opacity: 0,
            stagger: 0.12,
            duration: 0.4,
            ease: 'power3.out'
        }, 1.25);

        // Craft elements pop into existence
        heroTl.to('.hs-el-1', { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }, 1.15);
        heroTl.to('.hs-el-2', { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }, 1.25);
        heroTl.to('.hs-el-3', { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }, 1.35);
        heroTl.to('.hs-el-4', { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }, 1.45);
        heroTl.to('.hs-el-5', { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }, 1.55);
        heroTl.to('.hs-el-6', { opacity: 1, scale: 1, duration: 0.3, ease: 'back.out(1.7)' }, 1.6);

        // Thread starts fading
        heroTl.to('.hs-thread', { opacity: 0.3, scale: 0.9, duration: 0.4 }, 1.6);


        // ===== PHASE 3: Convergence + dark panels split open (timeline 2 → 3) =====
        // Phase 2 text exits
        heroTl.to('.hs-text-2', {
            opacity: 0,
            scale: 0.85,
            duration: 0.25,
            ease: 'power2.in'
        }, 2.0);

        // Craft elements shrink away
        heroTl.to('.hs-el', {
            scale: 0,
            opacity: 0,
            duration: 0.3,
            stagger: 0.03,
            ease: 'power2.in'
        }, 2.0);

        // Thread disappears
        heroTl.to('.hs-thread', {
            opacity: 0,
            scale: 1.5,
            duration: 0.3
        }, 2.1);

        // Particles fade out
        heroTl.to('.hs-particles', {
            opacity: 0,
            duration: 0.4
        }, 2.2);

        // *** THE BIG MOMENT: Dark panels split open like wrapping paper! ***
        heroTl.to('.hs-dark-left', {
            xPercent: -100,
            duration: 0.8,
            ease: 'power3.inOut'
        }, 2.3);

        heroTl.to('.hs-dark-right', {
            xPercent: 100,
            duration: 0.8,
            ease: 'power3.inOut'
        }, 2.3);

        // REVEAL WARM BACKGROUND (Underneath)
        heroTl.to('.hs-warm', {
            opacity: 1,
            duration: 0.8,
            ease: 'power3.inOut'
        }, 2.3);

        // REVEAL GLOWING PARTICLES (Surprise!)
        heroTl.to('.global-particles', {
            opacity: 1,
            duration: 1.5,
            ease: 'power2.out'
        }, 2.3);


        // ===== PHASE 4: Brand reveal + CTA (timeline 3 → 4) =====
        // Brand container fades in
        heroTl.to('.hs-brand', {
            opacity: 1,
            duration: 0.3,
            ease: 'power2.out'
        }, 2.9);

        // Logo scales up with bounce
        heroTl.from('.hs-brand-logo', {
            scale: 0.3,
            opacity: 0,
            duration: 0.5,
            ease: 'back.out(1.7)'
        }, 2.9);

        // "By Sakina" script fades in
        heroTl.to('.hs-brand-script', {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        }, 3.2);

        heroTl.from('.hs-brand-script', {
            y: 25,
            duration: 0.4,
            ease: 'power2.out'
        }, 3.2);

        // CTA button appears
        heroTl.to('.hs-cta', {
            opacity: 1,
            duration: 0.4,
            ease: 'power2.out'
        }, 3.4);

        heroTl.from('.hs-cta', {
            y: 30,
            duration: 0.4,
            ease: 'power2.out'
        }, 3.4);

        // FADE OUT PARTICLES (When moving to next section)
        heroTl.to('.global-particles', {
            opacity: 0,
            duration: 0.5,
            ease: 'power1.in'
        }, '+=0.1'); // Fade out after CTA appears

        // Refresh ScrollTrigger after layout settles to fix pin calculations
        setTimeout(() => {
            ScrollTrigger.refresh();
        }, 500);
    }

    // Navbar Scroll Effect (fallback for before Lenis loads)
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    }, { passive: true });

    // Hero Parallax on Mouse Move
    // DISABLED PER USER "RANDOM MOVING" COMPLAINT
    /*
    const heroSection = document.getElementById('hero');
    heroSection.addEventListener('mousemove', (e) => {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.05;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.05;
    
        // Move background slightly
        gsap.to('.hero', {
            backgroundPosition: `calc(50% + ${moveX}px) calc(50% + ${moveY}px)`,
            duration: 1
        });
    });
    */

    // --- NEW: 3D Elements Entry & Scroll Animation ---
    // ANIMATION REMOVED TO PREVENT DISAPPEARING BUG
    // We will rely on CSS for floating and visibility.
    /*
    gsap.from(".shape-3d-gold", {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.5
    });
    
    gsap.from(".shape-3d-glass", {
        opacity: 0,
        scale: 0.8,
        y: 50,
        duration: 1.5,
        ease: "power3.out",
        delay: 0.7 
    });
    
    gsap.to(".shape-3d-gold", {
        y: -400, 
        rotation: 45, 
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1 
        }
    });
    
    gsap.to(".shape-3d-glass", {
        y: -300,
        rotation: -45,
        ease: "none",
        scrollTrigger: {
            trigger: "#hero",
            start: "top top",
            end: "bottom top",
            scrub: 1
        }
    });
    */

    // --- CONNECTED JOURNEY PATH ANIMATION ---
    const journeyLine = document.getElementById('journeyLine');
    const processCards = document.querySelectorAll('.process-card');
    const iconBoxes = document.querySelectorAll('.icon-box');

    if (journeyLine) {
        // Get the total length of the path
        const pathLength = journeyLine.getTotalLength();

        // Set initial state
        journeyLine.style.strokeDasharray = pathLength;
        journeyLine.style.strokeDashoffset = pathLength;

        // Initial hidden states for cards and icons
        gsap.set(processCards, { opacity: 0.3 });
        gsap.set(iconBoxes, { scale: 0.8, opacity: 0.5 });
        gsap.set(".step-badge", { scale: 0, rotation: -180 });

        // Create the scroll-triggered animation
        gsap.to(journeyLine, {
            strokeDashoffset: 0,
            ease: "none",
            scrollTrigger: {
                trigger: ".process-steps",
                start: "top 70%",
                end: "bottom 60%",
                scrub: 1.5, // Smooth scrub
                onUpdate: (self) => {
                    const progress = self.progress;

                    // Highlight cards based on progress
                    processCards.forEach((card, index) => {
                        const threshold = (index + 0.5) / processCards.length;
                        const iconBox = card.querySelector('.icon-box');
                        const badge = card.querySelector('.step-badge');

                        if (progress >= threshold) {
                            gsap.to(card, { opacity: 1, duration: 0.3 });
                            gsap.to(iconBox, {
                                scale: 1,
                                opacity: 1,
                                duration: 0.4,
                                ease: "back.out(1.7)"
                            });
                            gsap.to(badge, {
                                scale: 1,
                                rotation: 0,
                                duration: 0.4,
                                ease: "back.out(2)"
                            });
                            // Spotlight glow
                            iconBox.classList.add('glow-active');
                        } else {
                            gsap.to(card, { opacity: 0.3, duration: 0.3 });
                            gsap.to(iconBox, { scale: 0.8, opacity: 0.5, duration: 0.3 });
                            gsap.to(badge, { scale: 0, rotation: -180, duration: 0.3 });
                            iconBox.classList.remove('glow-active');
                        }
                    });
                }
            }
        });
    }

    // --- SHAPE MORPHING ANIMATION (Flubber) ---
    const morphPath = document.getElementById('morphPath');

    if (morphPath && typeof flubber !== 'undefined') {
        // Font Awesome icon paths (simplified versions)
        const iconPaths = [
            // Chat bubble (comment-dots)
            "M256 32C114.6 32 0 125.1 0 240c0 49.6 21.4 95 57 130.7C44.5 421.1 2.7 466 2.2 466.5c-2.2 2.3-2.8 5.7-1.5 8.7S4.8 480 8 480c66.3 0 116-31.8 140.6-51.4 32.7 12.3 69 19.4 107.4 19.4 141.4 0 256-93.1 256-208S397.4 32 256 32zM128 272c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 0c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z",
            // Palette
            "M204.3 5C104.9 24.4 24.8 104.3 5.2 203.4c-37 187 131.7 326.4 258.8 306.7 41.2-6.4 61.4-54.6 42.5-91.7-23.1-45.4 9.9-98.4 60.9-98.4h79.7c35.8 0 64.8-29.6 64.9-65.3C506.1 138.4 399.4-32.8 204.3 5zM96 320c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm32-128c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128-64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32zm128 64c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z",
            // Scissors
            "M278.06 256L444.48 89.57c12.5-12.5 12.5-32.76 0-45.25-12.5-12.5-32.76-12.5-45.25 0L256 187.94 112.77 44.32c-12.5-12.5-32.76-12.5-45.25 0-12.5 12.5-12.5 32.76 0 45.25L233.94 256 67.52 422.43c-12.5 12.5-12.5 32.76 0 45.25 6.25 6.25 14.44 9.38 22.63 9.38s16.38-3.12 22.63-9.38L256 324.06l143.23 143.62c6.25 6.25 14.44 9.38 22.63 9.38s16.38-3.12 22.63-9.38c12.5-12.5 12.5-32.76 0-45.25L278.06 256z",
            // Truck
            "M624 352h-16V243.9c0-12.7-5.1-24.9-14.1-33.9L494 110.1c-9-9-21.2-14.1-33.9-14.1H416V48c0-26.5-21.5-48-48-48H48C21.5 0 0 21.5 0 48v320c0 26.5 21.5 48 48 48h16c0 53 43 96 96 96s96-43 96-96h128c0 53 43 96 96 96s96-43 96-96h48c8.8 0 16-7.2 16-16v-32c0-8.8-7.2-16-16-16zM160 464c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm320 0c-26.5 0-48-21.5-48-48s21.5-48 48-48 48 21.5 48 48-21.5 48-48 48zm80-208H416V144h44.1l99.9 99.9V256z"
        ];

        // Set initial path
        morphPath.setAttribute('d', iconPaths[0]);

        // Create interpolators between each pair of icons
        const interpolators = [];
        for (let i = 0; i < iconPaths.length - 1; i++) {
            interpolators.push(flubber.interpolate(iconPaths[i], iconPaths[i + 1]));
        }

        // Morph on scroll
        ScrollTrigger.create({
            trigger: ".custom-section",
            start: "top 60%",
            end: "bottom 40%",
            scrub: 1,
            onUpdate: (self) => {
                const progress = self.progress;
                const totalSegments = interpolators.length;
                const segment = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
                const segmentProgress = (progress * totalSegments) - segment;

                if (interpolators[segment]) {
                    const newPath = interpolators[segment](Math.min(segmentProgress, 1));
                    morphPath.setAttribute('d', newPath);
                }
            }
        });
    }



    // =====================================================
    // GLOBAL SCROLL REVEAL ANIMATIONS
    // =====================================================

    // --- OLD HERO ANIMATIONS (REMOVED — replaced by hero-story scroll timeline above) ---
    // Hero title split, hero-content p, hero-content .btn-primary animations removed.

    // --- Section Headers (global) ---
    gsap.utils.toArray(".section-header").forEach(header => {
        gsap.from(header, {
            scrollTrigger: {
                trigger: header,
                start: "top 85%",
            },
            y: 50,
            opacity: 0,
            duration: 0.8,
            ease: "power2.out"
        });
    });

    // --- About/Featured Section (REMOVED - element doesn't exist) ---
    // gsap.from(".about-content", {
    //     scrollTrigger: {
    //         trigger: ".about-content",
    //         start: "top 80%",
    //     },
    //     y: 60,
    //     opacity: 0,
    //     duration: 1,
    //     ease: "power3.out"
    // });

    // --- Gallery Items (Handcrafted Gallery) - Only animate if exists ---
    const galleryItems = document.querySelectorAll('.gallery-item');
    if (galleryItems.length > 0) {
        gsap.from(galleryItems, {
            scrollTrigger: {
                trigger: ".gallery-grid",
                start: "top 80%",
            },
            y: 80,
            opacity: 0,
            duration: 0.8,
            stagger: 0.15,
            ease: "power3.out"
        });
    }

    // --- Testimonial Cards ---
    gsap.from(".testimonial-card", {
        scrollTrigger: {
            trigger: ".testimonials-section",
            start: "top 75%",
        },
        y: 60,
        opacity: 0,
        scale: 0.95,
        duration: 0.8,
        stagger: 0.2,
        ease: "power2.out"
    });

    // --- CTA Section (REMOVED - element doesn't exist) ---
    // gsap.from(".cta-section", {
    //     scrollTrigger: {
    //         trigger: ".cta-section",
    //         start: "top 85%",
    //     },
    //     y: 50,
    //     opacity: 0,
    //     duration: 1,
    //     ease: "power3.out"
    // });

    // --- Footer (REMOVED - element class is .footer-creative not .footer) ---
    // gsap.from(".footer", {
    //     scrollTrigger: {
    //         trigger: ".footer",
    //         start: "top 95%",
    //     },
    //     y: 40,
    //     opacity: 0,
    //     duration: 0.8,
    //     ease: "power2.out"
    // });

    // --- Footer Creative (correct class) ---
    gsap.from(".footer-creative", {
        scrollTrigger: {
            trigger: ".footer-creative",
            start: "top 95%",
        },
        y: 40,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out"
    });

    // --- Gallery/Image reveals with parallax ---
    gsap.utils.toArray(".gallery-item, .product-image").forEach(img => {
        gsap.from(img, {
            scrollTrigger: {
                trigger: img,
                start: "top 90%",
            },
            y: 40,
            opacity: 0,
            scale: 0.98,
            duration: 0.7,
            ease: "power2.out"
        });
    });

    // --- Parallax effect for hero image ---
    const heroImage = document.querySelector(".hero-image");
    if (heroImage) {
        gsap.to(heroImage, {
            scrollTrigger: {
                trigger: ".hero",
                start: "top top",
                end: "bottom top",
                scrub: 1
            },
            y: 100,
            ease: "none"
        });
    }

    // 6. Generate Global Particles
    const particleContainer = document.querySelector('.particles-container');
    const particleCount = 20;

    for (let i = 0; i < particleCount; i++) {
        const particle = document.createElement('div');
        particle.classList.add('particle');

        // Random size
        const size = Math.random() * 20 + 5;
        particle.style.width = `${size}px`;
        particle.style.height = `${size}px`;

        // Random position
        particle.style.left = `${Math.random() * 100}%`;
        particle.style.top = `${Math.random() * 100}%`;

        // Random animation delay & duration
        particle.style.animationDelay = `${Math.random() * 5}s`;
        particle.style.animationDuration = `${Math.random() * 10 + 10}s`;

        particleContainer.appendChild(particle);
    }

    // 4. Universal 3D Tilt Effect
    const tiltCards = document.querySelectorAll('.occasion-card, .gallery-item, .step-item, .testimonial-card');

    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = ((y - centerY) / centerY) * -10; // Max 10deg rotation
            const rotateY = ((x - centerX) / centerX) * 10;

            gsap.to(card, {
                duration: 0.5,
                rotateX: rotateX,
                rotateY: rotateY,
                transformPerspective: 1000,
                ease: "power1.out"
            });
        });

        card.addEventListener('mouseleave', () => {
            gsap.to(card, {
                duration: 0.5,
                rotateX: 0,
                rotateY: 0,
                ease: "power1.out"
            });
        });
    });

    /* --- Instagram Integration (Mock Data Mode) --- */

    // Config
    const IG_CONFIG = {
        USE_MOCK: true,
        ACCESS_TOKEN: 'YOUR_LONG_LIVED_ACCESS_TOKEN_HERE',
        USER_ID: 'me'
    };

    // Hashtag to Category Mapping
    const CATEGORY_MAP = {

        '#cs_cards': 'cards',
        '#cs_greetingcards': 'cards',
        '#cs_envelopes': 'envelopes',
        '#cs_dryfruits': 'dryfruits',
        '#cs_bouquet': 'bouquet',
        '#cs_groomtrousseau': 'groom_trousseau',
        '#cs_frames': 'frames',
        '#cs_baby': 'baby',


    };

    // Mock Data
    const MOCK_MEDIA = [
        {
            id: '1',
            caption: 'Birthday Trousseau with personalized decor #craftstudio_web #cs_baby',
            media_type: 'IMAGE',
            media_url: 'assets/gallery/birthday-trousseau/1.png',
            permalink: 'https://www.instagram.com/p/DNH2G9wT_j4/'
        },
        {
            id: '2',
            caption: 'First Birthday outfit and hamper #craftstudio_web #cs_baby',
            media_type: 'IMAGE',
            media_url: 'assets/gallery/birthday-trousseau/2.png',
            permalink: 'https://www.instagram.com/p/DMrhWNUTUxF/'
        },
        {
            id: '3',
            caption: 'Complete Birthday Gift Set with personalized details #craftstudio_web #cs_baby',
            media_type: 'IMAGE',
            media_url: 'assets/gallery/birthday-trousseau/3.png',
            permalink: 'https://www.instagram.com/p/Cw4vRrqN7AB/'
        },
        {
            id: '4',
            caption: 'Elegant wedding envelopes with custom calligraphy #craftstudio_web #cs_envelopes',
            media_type: 'IMAGE',
            media_url: 'assets/gallery/envelopes/1.png',
            permalink: 'https://www.instagram.com/p/DM8Qim1zz3V/'
        },
        {
            id: '5',
            caption: 'Luxury personalized money envelopes #craftstudio_web #cs_envelopes',
            media_type: 'IMAGE',
            media_url: 'assets/gallery/envelopes/2.png',
            permalink: 'https://www.instagram.com/p/DKbdyGCsb7T/'
        },
        {
            id: '6',
            caption: 'Premium Eid and festive envelopes collection #craftstudio_web #cs_envelopes',
            media_type: 'IMAGE',
            media_url: 'assets/gallery/envelopes/3.png',
            permalink: 'https://www.instagram.com/p/DHsxM3FI34o/'
        },
        {
            id: '7',
            caption: 'Decorative butterfly money holder for gifting #craftstudio_web #cs_envelopes',
            media_type: 'IMAGE',
            media_url: 'assets/gallery/envelopes/4.png',
            permalink: 'https://www.instagram.com/p/DHF7eCmoZc9/'
        },
        {
            id: '8',
            caption: 'Personalized greeting card with photo pull-out #craftstudio_web #cs_greetingcards',
            media_type: 'IMAGE',
            media_url: 'assets/gallery/greeting-cards/1.png',
            permalink: 'https://www.instagram.com/p/DLJ444OzLPV/'
        },
        {
            id: '9',
            caption: 'Elegant wedding card with floral details #craftstudio_web #cs_greetingcards',
            media_type: 'IMAGE',
            media_url: 'assets/gallery/greeting-cards/2.png',
            permalink: 'https://www.instagram.com/p/C_6EBzwNBm5/'
        },
        {
            id: '10',
            caption: '3D Pop-up Wedding Card featuring the happy couple #craftstudio_web #cs_greetingcards',
            media_type: 'IMAGE',
            media_url: 'assets/gallery/greeting-cards/3.png',
            permalink: 'https://www.instagram.com/p/C96pBHwt8EN/'
        },
        {
            id: '15',
            caption: 'Premium Dry Fruit Gifting Collection #craftstudio_web #cs_dryfruits',
            media_type: 'SMART_ALBUM',
            media_url: 'assets/gallery/dry-fruit-packing/1.png',
            album: [
                'assets/gallery/dry-fruit-packing/1.png',
                'assets/gallery/dry-fruit-packing/2.png',
                'assets/gallery/dry-fruit-packing/3.png',
                'assets/gallery/dry-fruit-packing/4.png'
            ],
            permalink: 'https://www.instagram.com/p/DIx4qtaM6E4/'
        },
        {
            id: '16',
            caption: 'Luxury Handcrafted Bouquets Collection #craftstudio_web #cs_bouquet',
            media_type: 'SMART_ALBUM',
            media_url: 'assets/gallery/bouquet/1.png',
            album: [
                'assets/gallery/bouquet/1.png',
                'assets/gallery/bouquet/2.png'
            ],
            permalink: 'https://www.instagram.com/p/DF4viPhMJg_/'
        },
        {
            id: '17',
            caption: 'The Complete Groom Trousseau Set #craftstudio_web #cs_groomtrousseau',
            media_type: 'SMART_ALBUM',
            media_url: 'assets/gallery/groom-trousseau/1.png',
            album: [
                'assets/gallery/groom-trousseau/1.png',
                'assets/gallery/groom-trousseau/2.png',
                'assets/gallery/groom-trousseau/3.png',
                'assets/gallery/groom-trousseau/4.png',
                'assets/gallery/groom-trousseau/5.png'
            ],
            permalink: 'https://www.instagram.com/p/DGuwYBtsf0C/'
        },
        {
            id: '18',
            caption: 'Exclusive Handcrafted Photo Frames Collection #craftstudio_web #cs_frames',
            media_type: 'SMART_ALBUM',
            media_url: 'assets/gallery/photo-frames/1.png',
            album: [
                'assets/gallery/photo-frames/1.png'
            ],
            permalink: 'https://www.instagram.com/p/PLACEHOLDER/'
        }
    ];

    async function initGallery() {
        const grid = document.getElementById('gallery-grid');
        grid.innerHTML = ''; // Clear loading state

        let mediaItems = [];

        if (IG_CONFIG.USE_MOCK) {
            console.log("Using Mock Instagram Data");
            mediaItems = MOCK_MEDIA;
        } else {
            // Real API Call placeholder
            // mediaItems = await fetchInstagramMedia(); 
        }

        // Process items
        const validItems = processMediaItems(mediaItems);

        // Render
        validItems.forEach(item => {
            const el = createGalleryItemElement(item);
            grid.appendChild(el);
        });

        // Initialize Tilt on new items
        // Wait a frame for DOM to update
        setTimeout(() => {
            // Re-bind tilt events for new dynamic elements
            const newItems = grid.querySelectorAll('.gallery-item');
            bindTiltEffect(newItems);
            ScrollTrigger.refresh();
        }, 100);
    }

    function processMediaItems(items) {
        let processed = [];

        items.forEach(post => {
            if (!post.caption || !post.caption.includes('#craftstudio_web')) return;

            let category = 'all';
            for (const [tag, catName] of Object.entries(CATEGORY_MAP)) {
                if (post.caption.includes(tag)) {
                    category = catName;
                    break;
                }
            }

            let hiddenIndices = [];
            const hideRegex = /\[hide-(\d+)\]/g;
            let match;
            while ((match = hideRegex.exec(post.caption)) !== null) {
                hiddenIndices.push(parseInt(match[1]));
            }

            if (post.media_type === 'CAROUSEL_ALBUM' && post.children) {
                post.children.data.forEach((child, index) => {
                    const userIndex = index + 1;
                    if (!hiddenIndices.includes(userIndex)) {
                        processed.push({
                            src: child.media_url,
                            category: category,
                            caption: post.caption,
                            link: post.permalink,
                            isChild: true
                        });
                    }
                });
            } else if (post.media_type === 'SMART_ALBUM') {
                processed.push({
                    src: post.media_url, // Cover image
                    album: post.album, // Array of images
                    category: category,
                    caption: post.caption,
                    link: post.permalink,
                    isChild: false
                });
            } else {
                if (post.media_type === 'IMAGE' || post.media_type === 'VIDEO') {
                    processed.push({
                        src: post.media_url,
                        category: category,
                        caption: post.caption,
                        link: post.permalink,
                        isChild: false
                    });
                }
            }
        });

        return processed;
    }

    function createGalleryItemElement(item) {
        const div = document.createElement('div');
        div.className = 'gallery-item';
        div.setAttribute('data-category', item.category);

        // Clean title
        let cleanTitle = item.caption.split('#')[0].trim();
        if (cleanTitle.length > 50) cleanTitle = cleanTitle.substring(0, 50) + '...';

        // Album Indicator
        const albumIcon = item.album ? '<div class="album-indicator"><i class="fas fa-layer-group"></i></div>' : '';

        div.innerHTML = `
        <div class="gallery-img-wrapper" style="background-image: url('${item.src}');"></div>
        ${albumIcon}
        <div class="gallery-overlay">
            <span>${cleanTitle || 'Handcrafted Gift'}</span>
        </div>
    `;

        div.addEventListener('click', () => {
            // Pass album array if exists, otherwise single src
            const mediaSource = item.album ? item.album : item.src;
            openProductModal(mediaSource, cleanTitle, item.category);
        });

        return div;
    }

    // Helper to re-bind tilt (since elements are new)
    function bindTiltEffect(elements) {
        elements.forEach(card => {
            card.addEventListener('mousemove', (e) => {
                const rect = card.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                const rotateX = ((y - centerY) / centerY) * -10;
                const rotateY = ((x - centerX) / centerX) * 10;

                gsap.to(card, {
                    duration: 0.5,
                    rotateX: rotateX,
                    rotateY: rotateY,
                    transformPerspective: 1000,
                    ease: "power1.out"
                });
            });

            card.addEventListener('mouseleave', () => {
                gsap.to(card, {
                    duration: 0.5,
                    rotateX: 0,
                    rotateY: 0,
                    ease: "power1.out"
                });
            });
        });
    }

    // Initialize logic
    initGallery();

    /* --- Filter Logic --- */
    const filterBtns = document.querySelectorAll('.filter-btn');

    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');
            const currentItems = document.querySelectorAll('.gallery-item');

            // Perform Filter with GSAP Flip
            const galleryGrid = document.querySelector('.gallery-grid');
            if (!galleryGrid) return;
            galleryGrid.classList.add('is-animating'); // Disable CSS sway

            const state = Flip.getState(currentItems);

            currentItems.forEach(item => {
                const category = item.getAttribute('data-category');
                if (filterValue === 'all' || category === filterValue) {
                    item.style.display = "block";
                } else {
                    item.style.display = "none";
                }
            });

            Flip.from(state, {
                duration: 0.6,
                scale: true,
                ease: "power2.inOut",
                stagger: 0.05,
                onEnter: elements => gsap.fromTo(elements, { opacity: 0 }, { opacity: 1, duration: 0.4 }),
                onLeave: elements => gsap.to(elements, { opacity: 0, duration: 0.3 }),
                onComplete: () => {
                    galleryGrid.classList.remove('is-animating');
                    ScrollTrigger.refresh();
                }
            });
        });
    });

    /* --- Modal Logic --- */
    const modal = document.getElementById('product-modal');
    const closeModalBtn = document.querySelector('.close-modal');
    const modalBackdrop = document.querySelector('.modal-backdrop');

    let currentAlbumIndex = 0;
    let currentAlbumImages = [];

    function openProductModal(mediaSource, title, category) {
        document.querySelector('.modal-cat').innerText = "Handcrafted " + category;
        document.querySelector('.modal-title').innerText = title;

        const imageCol = document.querySelector('.modal-image-col');
        imageCol.innerHTML = ''; // Clear previous

        if (Array.isArray(mediaSource)) {
            // --- ALBUM MODE ---
            currentAlbumImages = mediaSource;
            currentAlbumIndex = 0;

            // Create Container
            imageCol.style.backgroundImage = 'none';
            imageCol.style.backgroundColor = '#f9f5f0';
            imageCol.style.display = 'flex';
            imageCol.style.alignItems = 'center';
            imageCol.style.justifyContent = 'center';
            imageCol.style.position = 'relative';

            // Image Element
            const img = document.createElement('img');
            img.src = currentAlbumImages[0];
            img.style.width = '100%';
            img.style.height = '100%';
            img.style.objectFit = 'cover';
            img.style.display = 'block';
            img.style.borderRadius = 'var(--radius-md)';
            img.id = 'modal-album-img';

            // Controls
            const prevBtn = document.createElement('button');
            prevBtn.innerHTML = '<i class="fas fa-chevron-left"></i>';
            prevBtn.className = 'album-nav prev';

            const nextBtn = document.createElement('button');
            nextBtn.innerHTML = '<i class="fas fa-chevron-right"></i>';
            nextBtn.className = 'album-nav next';

            // Counter
            const counter = document.createElement('div');
            counter.className = 'album-counter';
            counter.innerText = `1 / ${currentAlbumImages.length}`;

            // Event Listeners
            prevBtn.onclick = (e) => {
                e.stopPropagation();
                currentAlbumIndex = (currentAlbumIndex - 1 + currentAlbumImages.length) % currentAlbumImages.length;
                img.src = currentAlbumImages[currentAlbumIndex];
                counter.innerText = `${currentAlbumIndex + 1} / ${currentAlbumImages.length}`;
            };

            nextBtn.onclick = (e) => {
                e.stopPropagation();
                currentAlbumIndex = (currentAlbumIndex + 1) % currentAlbumImages.length;
                img.src = currentAlbumImages[currentAlbumIndex];
                counter.innerText = `${currentAlbumIndex + 1} / ${currentAlbumImages.length}`;
            };

            imageCol.appendChild(img);
            if (currentAlbumImages.length > 1) {
                imageCol.appendChild(prevBtn);
                imageCol.appendChild(nextBtn);
                imageCol.appendChild(counter);
            }

        } else {
            // --- SINGLE IMAGE MODE ---
            imageCol.style.backgroundImage = `url('${mediaSource}')`;
            imageCol.style.display = 'block'; // Reset flex
        }

        // WhatsApp Message
        const msg = "Hi, I saw this gift on your website and want to customize something similar.";
        const encodedMsg = encodeURIComponent(msg);
        document.querySelector('.modal-cta').href = `https://wa.me/919426933778?text=${encodedMsg}`;

        const modal = document.getElementById('product-modal');
        if (modal) modal.classList.add('active');

        // Stop LENIS scrolling if it's active
        if (typeof lenis !== 'undefined') lenis.stop();
    }

    function closeModal() {
        modal.classList.remove('active');
        if (typeof lenis !== 'undefined') lenis.start();
    }

    closeModalBtn.addEventListener('click', closeModal);
    modalBackdrop.addEventListener('click', closeModal);

});

// --- Helper: Render Instagram Grid (Hanging Gallery) ---
function renderInstagramGrid() {
    const grid = document.getElementById('insta-grid');
    if (!grid) return;

    grid.innerHTML = ''; // Clear
    grid.classList.add('hanging-gallery-container'); // Switch to hanging layout mode

    // Add Rail (optional visual at top)
    const rail = document.createElement('div');
    rail.classList.add('hanging-rail');
    grid.appendChild(rail);

    INSTAGRAM_CONFIG.images.forEach((imgObj, index) => {
        const item = document.createElement('div');
        item.classList.add('hanging-card');

        // Deterministic randomness for stability
        const delay = -1 * (index * 0.8) + 's';
        const duration = (2.5 + (index * 0.3)).toFixed(1) + 's'; // Faster for visible flow

        // Varying chain lengths
        const chainLengths = ['80px', '140px', '60px', '160px', '100px'];
        const chainHeight = chainLengths[index % chainLengths.length];

        item.style.setProperty('--sway-delay', delay);
        item.style.setProperty('--sway-duration', duration);
        item.style.setProperty('--chain-height', chainHeight);

        // Debug fallback
        const url = imgObj.url || imgObj;
        const category = imgObj.category || "Handcrafted Gift";

        item.innerHTML = `
            <div class="chain" style="height: ${chainHeight}"></div>
            <div class="pin"></div>
            <div class="frame-glass">
                <img src="${url}" alt="${category}" loading="lazy">
                <div class="gloss-reflection"></div>
            </div>
            <div class="photo-caption">${category}</div>
        `;

        grid.appendChild(item);
    });
}

// === INTERSTELLAR GIFT TUNNEL ===
function initInterstellarTunnel() {
    const starfield = document.getElementById('starfield');
    const tunnelContainer = document.getElementById('tunnel-container');
    const tunnelItems = document.querySelectorAll('.tunnel-item');

    if (!starfield || tunnelItems.length === 0) return;

    // Generate starfield particles
    for (let i = 0; i < 100; i++) {
        const star = document.createElement('div');
        star.className = 'star';
        star.style.left = Math.random() * 100 + '%';
        star.style.top = Math.random() * 100 + '%';
        star.style.animationDelay = Math.random() * 8 + 's';
        star.style.animationDuration = (5 + Math.random() * 5) + 's';
        starfield.appendChild(star);
    }

    // Store initial positions
    tunnelItems.forEach(item => {
        const z = parseInt(item.dataset.z) || 0;
        item.initialZ = z;
        // Extract X and Y from inline style
        const style = item.getAttribute('style');
        const xMatch = style.match(/translateX\((-?\d+)px\)/);
        const yMatch = style.match(/translateY\((-?\d+)px\)/);
        item.initialX = xMatch ? parseInt(xMatch[1]) : 0;
        item.initialY = yMatch ? parseInt(yMatch[1]) : 0;
    });

    // Scroll-triggered animation
    gsap.registerPlugin(ScrollTrigger);

    ScrollTrigger.create({
        trigger: '.tunnel-section',
        start: 'top top',
        end: 'bottom top',
        scrub: 1.5,
        onUpdate: (self) => {
            const progress = self.progress;
            const flySpeed = 1200; // How far items fly towards camera

            tunnelItems.forEach(item => {
                const newZ = item.initialZ + (progress * flySpeed);
                const scale = Math.max(0.3, Math.min(2, 1 + newZ / 500));
                const opacity = newZ > 300 ? 0 : (newZ < -800 ? 0.3 : 1);

                gsap.set(item, {
                    z: newZ,
                    x: item.initialX * (1 - progress * 0.3),
                    y: item.initialY * (1 - progress * 0.3),
                    scale: scale,
                    opacity: opacity
                });
            });
        }
    });

    // Mouse parallax for tunnel tilt
    const tunnelSection = document.querySelector('.tunnel-section');
    if (tunnelSection && tunnelContainer) {
        tunnelSection.addEventListener('mousemove', (e) => {
            const rect = tunnelSection.getBoundingClientRect();
            const x = (e.clientX - rect.left - rect.width / 2) / rect.width;
            const y = (e.clientY - rect.top - rect.height / 2) / rect.height;

            gsap.to(tunnelContainer, {
                rotateY: x * 10,
                rotateX: -y * 10,
                duration: 0.5,
                ease: 'power2.out'
            });
        });

        tunnelSection.addEventListener('mouseleave', () => {
            gsap.to(tunnelContainer, {
                rotateY: 0,
                rotateX: 0,
                duration: 0.8,
                ease: 'power2.out'
            });
        });
    }
}

// Initialize Tunnel
initInterstellarTunnel();
