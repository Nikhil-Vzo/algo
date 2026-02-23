import React, { useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import morphSvg from '../../assets/images/svg.svg';
import './MorphTransition.css';

gsap.registerPlugin(ScrollTrigger);

interface MorphTransitionProps {
    children: React.ReactNode;
}

export default function MorphTransition({ children }: MorphTransitionProps) {
    const containerRef = useRef<HTMLDivElement>(null);
    const svgRef = useRef<HTMLImageElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const container = containerRef.current;
        const svg = svgRef.current;
        const content = contentRef.current;

        if (!container || !svg || !content) return;

        let ctx = gsap.context(() => {
            // A more lightweight scrolltrigger without heavy scrub dependencies
            const tl = gsap.timeline({
                scrollTrigger: {
                    trigger: container,
                    start: 'top top',
                    end: '+=80%', // Shorter scroll distance
                    pin: true,
                    pinSpacing: false,
                    scrub: 0.3, // Smoother scrub
                }
            });

            const isMobile = window.innerWidth < 768;
            const endScale = isMobile ? 1.3 : 1.8;
            const endRotationX = isMobile ? 15 : 45;

            const startY = window.innerHeight * 1.2;
            const endY = -window.innerHeight * 1.2;

            tl.set(content, { autoAlpha: 0 }, 0.4);

            // One massive smooth arc taking up the entire scrub
            tl.fromTo(svg,
                { y: startY, scale: 1.2, rotationX: -40, opacity: 1, force3D: true },
                { y: endY, scale: endScale, rotationX: endRotationX, duration: 1, ease: 'power1.inOut', force3D: true },
                0
            );

        }, containerRef);

        return () => ctx.revert();
    }, []);

    return (
        <div className="morph-transition-react-wrapper">
            <div
                ref={containerRef}
                className="morph-transition-container"
            >
                <div className="morph-content-wrapper" ref={contentRef}>
                    {children}
                </div>

                <div className="morph-svg-wrapper">
                    <img
                        ref={svgRef}
                        src={morphSvg}
                        alt="Transition Reveal"
                        className="morph-svg-image"
                    />
                </div>
            </div>
        </div>
    );
}
