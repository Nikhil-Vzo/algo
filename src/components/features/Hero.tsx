import { useRef, useState, useEffect } from 'react';
import heroImg from '../../assets/images/hero-img.webp';
import faceImg from '../../assets/images/face-1.png';
import heistOverlay from '../../assets/images/heist-overlay.webp';
import { HyperText } from '../ui/HyperText';
import './Hero.css';

interface HeroProps {
    loading?: boolean;
}

export default function Hero({ loading = false }: HeroProps) {
    const sectionRef = useRef<HTMLDivElement>(null);
    const [mouse, setMouse] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => {
            if (!sectionRef.current) return;
            const rect = sectionRef.current.getBoundingClientRect();
            const x = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
            const y = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
            setMouse({ x, y });
        };

        const section = sectionRef.current;
        section?.addEventListener('mousemove', handleMouseMove);
        return () => section?.removeEventListener('mousemove', handleMouseMove);
    }, []);

    const parallax = (depth: number) => ({
        transform: `translate(${mouse.x * depth}px, ${mouse.y * depth}px)`,
    });

    const faces = Array.from({ length: 20 });

    return (
        <section className="hero" id="hero" ref={sectionRef}>
            {/* ── Layer 1: Background Overlay (heist crowd) ── */}
            <div className="hero__overlay" style={parallax(-8)}>
                <img src={heistOverlay} alt="" className="hero__overlay-img" />
            </div>

            {/* ── Vignette ── */}
            <div className="hero__vignette" />

            {/* ── Grain texture ── */}
            <div className="hero__grain" />

            {/* ── Layer 2: Year Digits (behind hero) ── */}
            <div className="hero__year" style={parallax(-12)}>
                <span className="hero__year-digit hero__year-left">2</span>
                <span className="hero__year-digit hero__year-right">6</span>
            </div>

            {/* ── Mobile Version Text (For Phones Only) ── */}
            <div className="hero__mobile-version">
                <span className="hero__mobile-version-text">2.0</span>
            </div>

            {/* ── Hidden year digits (peek behind hero figure) ── */}
            <div className="hero__year-hidden" style={parallax(-10)}>
                <span className="hero__year-digit-hidden">0</span>
                <span className="hero__year-digit-hidden">2</span>
            </div>

            {/* ── Layer 3: Main Title Text ── */}
            <div className="hero__title-wrap" style={parallax(-15)}>
                <h1 className="hero__title">
                    {loading ? (
                        <>
                            <span className="hero__title-algo">ALGO</span>
                            <span className="hero__title-storm">STORM</span>
                        </>
                    ) : (
                        <>
                            <HyperText
                                as="span"
                                className="hero__title-algo"
                                duration={1000}
                                delay={200}
                                animateOnHover={true}
                            >
                                ALGO
                            </HyperText>
                            <HyperText
                                as="span"
                                className="hero__title-storm"
                                duration={1000}
                                delay={600}
                                animateOnHover={true}
                            >
                                STORM
                            </HyperText>
                        </>
                    )}
                </h1>
            </div>

            {/* ── Layer 4: Center Hero Image ── */}
            <div className="hero__figure-wrap" style={parallax(-5)}>
                <div className="hero__figure-glow" />
                <div className="hero__figure">
                    <img src={heroImg} alt="Money Heist Hero" className="hero__figure-img" loading="eager" fetchPriority="high" decoding="sync" />
                </div>
            </div>

            {/* ── Layer 5: Bottom Crime Scene Tape ── */}
            <div className="hero__marquee-wrap">
                <div className="hero__marquee-strip">
                    <div className="hero__marquee-track">
                        {faces.map((_, i) => (
                            <div key={`a-${i}`} className="hero__marquee-face">
                                <img src={faceImg} alt="" className="hero__marquee-face-img" />
                            </div>
                        ))}
                        {faces.map((_, i) => (
                            <div key={`a2-${i}`} className="hero__marquee-face">
                                <img src={faceImg} alt="" className="hero__marquee-face-img" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* ── Red pulse glow ── */}
            <div className="hero__pulse-glow" />
        </section>
    );
}
