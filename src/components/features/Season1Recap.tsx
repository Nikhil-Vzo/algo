import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Season1Recap.css';

gsap.registerPlugin(ScrollTrigger);

const images = [
    'https://i.ibb.co/0jPJQvm7/Whats-App-Image-2026-02-20-at-1-18-22-PM.jpg',
    'https://i.ibb.co/zTx9yKQm/Whats-App-Image-2026-02-20-at-1-18-29-PM-1.jpg',
    'https://i.ibb.co/8Dscnykd/Whats-App-Image-2026-02-20-at-1-18-29-PM.jpg',
    'https://i.ibb.co/whkmswTD/Whats-App-Image-2026-02-20-at-1-18-21-PM.jpg',
    'https://i.ibb.co/MyM4sDKn/Whats-App-Image-2026-02-20-at-1-18-22-PM-1.jpg',
    'https://i.ibb.co/7JhTL6JC/Whats-App-Image-2026-02-20-at-1-18-22-PM-2.jpg',
];

export default function Season1Recap() {
    const wrapperRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const wrapper = wrapperRef.current;
        if (!wrapper) return;

        // All selectors scoped to wrapper
        const imgs = wrapper.querySelectorAll<HTMLElement>('.s1-img');
        const textWrap = wrapper.querySelector<HTMLElement>('.s1-text-wrap');
        const desc = wrapper.querySelector<HTMLElement>('.s1-desc');
        const glow = wrapper.querySelector<HTMLElement>('.s1-glow');

        if (!imgs.length || !textWrap || !desc || !glow) return;

        // Force GPU layers
        gsap.set(imgs, { force3D: true });

        // Initial state for text
        gsap.set(textWrap, { opacity: 0, yPercent: 10 });

        const tl = gsap.timeline({
            scrollTrigger: {
                trigger: wrapper,
                start: 'top top',
                end: 'bottom bottom',
                scrub: 0.8,
            },
        });

        // ── Phase 1 (0→0.15): Main Typography appears slowly first ──
        tl.to(textWrap, { opacity: 1, yPercent: 0, duration: 0.15, ease: 'power2.out' }, 0);
        tl.fromTo(glow, { opacity: 0 }, { opacity: 1, duration: 0.15, ease: 'power2.inOut' }, 0);

        // ── Phase 1b (0.15→0.25): Description appears ──
        tl.fromTo(desc, { opacity: 0, yPercent: 30 }, { opacity: 1, yPercent: 0, duration: 0.10, ease: 'power2.out' }, 0.15);

        // ── DELAYED ENTRANCE ──
        // The morph takes up the first ~25% of the scrub timeline of THIS section 
        // because pinSpacing is false, so this section is scrolling *under* the morph.
        // We delay the images so they don't even start coming up until 0.25, meaning they 
        // won't appear on screen until the SVG has completely rolled upwards.

        // ── Phase 2: Pair 1 flows from bottom to top ──
        tl.fromTo(imgs[0], { y: "150vh" }, { y: "-150vh", duration: 0.50, ease: 'none' }, 0.25);
        tl.fromTo(imgs[1], { y: "157vh" }, { y: "-150vh", duration: 0.50, ease: 'none' }, 0.27);

        // ── Phase 3: Pair 2 flows from bottom to top ──
        tl.fromTo(imgs[2], { y: "150vh" }, { y: "-150vh", duration: 0.50, ease: 'none' }, 0.35);
        tl.fromTo(imgs[3], { y: "157vh" }, { y: "-150vh", duration: 0.50, ease: 'none' }, 0.37);

        // ── Phase 4: Pair 3 flows from bottom to top ──
        tl.fromTo(imgs[4], { y: "150vh" }, { y: "-150vh", duration: 0.50, ease: 'none' }, 0.45);
        tl.fromTo(imgs[5], { y: "157vh" }, { y: "-150vh", duration: 0.50, ease: 'none' }, 0.47);

        return () => {
            tl.kill();
        };
    }, []);

    return (
        <div className="s1-wrapper" ref={wrapperRef}>
            {/* Sticky viewport — CSS handles pinning, zero layout thrash */}
            <div className="s1-sticky">
                {/* Images */}
                {images.map((src, i) => (
                    <div key={i} className={`s1-img s1-img--${i + 1}`}>
                        <img src={src} alt={`Season 1 moment ${i + 1}`} />
                    </div>
                ))}

                {/* Typography Wrapper (animated by GSAP) */}
                <div className="s1-text-wrap">
                    {/* Centered Glass Plate */}
                    <div className="s1-text">
                        <span className="s1-tag">SEASON 1</span>
                        <div className="s1-headings">
                            <p className="s1-h s1-h--sub">HOW'S</p>
                            <h2 className="s1-h s1-h--lg">THE</h2>
                            <h2 className="s1-h s1-h--hero">
                                <span className="s1-h__stroke">JOUR</span><span className="s1-h__red">NEY</span>
                            </h2>
                            <h2 className="s1-h s1-h--md">SO FAR<span className="s1-h__q">?</span></h2>
                        </div>
                        {/* Description — flows below headings */}
                        <p className="s1-desc">
                            AlgoStorm Season 1 at Amity University Raipur was where it all began — a spark
                            that turned into a storm. With 50+ teams and 200+ participants, the campus buzzed
                            with energy as innovators came together to build, break limits, and bring bold ideas to life.
                        </p>
                        {/* Optimised glow — single element, GPU opacity only */}
                        <div className="s1-glow" aria-hidden="true" />
                    </div>
                </div>
            </div>
        </div>
    );
}
