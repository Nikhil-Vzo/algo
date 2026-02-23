import React, { useState, useEffect, useRef } from 'react';
import Lenis from '@studio-freight/lenis';
import teamCategories from '../data/teamData';
import './TeamsPage.css';

/* ═══════════════════════════════════════════
   CONFIG
   ═══════════════════════════════════════════ */
const CONFIG = {
    zGapCards: 800,        // Z-distance between members
    zGapCategory: 3000,    // Z-distance between categories
    camSpeed: 2.5,
    starCount: 150,
};

// Item types for our 3D world
type RenderItem =
    | { type: 'category'; name: string; baseZ: number; rot: number }
    | { type: 'card'; member: any; categoryName: string; x: number; y: number; rot: number; baseZ: number }
    | { type: 'star'; x: number; y: number; baseZ: number };


/* ═══════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════ */
export default function TeamsPage() {
    // Scroll completely to top on direct link
    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    const [fps, setFps] = useState(60);
    const [velocity, setVelocity] = useState(0);
    const [coord, setCoord] = useState(0);

    const worldRef = useRef<HTMLDivElement>(null);
    const viewportRef = useRef<HTMLDivElement>(null);
    const itemsRef = useRef<{ id: string, el: HTMLElement, item: RenderItem }[]>([]);

    const stateRef = useRef({
        scroll: 0,
        velocity: 0,
        targetSpeed: 0,
        mouseX: 0,
        mouseY: 0,
        lastTime: 0,
    });

    // Extract items data once
    const { renderItems, totalZLength } = React.useMemo(() => {
        const items: RenderItem[] = [];
        let currentZ = 0;

        teamCategories.forEach((cat) => {
            // Drop a huge text item for the category
            items.push({
                type: 'category',
                name: cat.name,
                baseZ: currentZ,
                rot: 0 // Keep text perfectly horizontal
            });
            currentZ -= CONFIG.zGapCategory;

            // Drop a card for every member
            cat.members.forEach((m) => {
                const angle = Math.random() * Math.PI * 2;
                // Keep cards bounded. On mobile, force tighter radius so they appear huge in center
                const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;
                const baseRadiusX = isMobile ? 80 : 200;
                const randRadiusX = isMobile ? 120 : 300;
                const baseRadiusY = isMobile ? 100 : 200;
                const randRadiusY = isMobile ? 150 : 300;

                const radiusX = baseRadiusX + Math.random() * randRadiusX;
                const radiusY = baseRadiusY + Math.random() * randRadiusY;

                const x = Math.cos(angle) * radiusX;
                // squash vertical slightly, less squashing on mobile to use screen height
                const y = Math.sin(angle) * (radiusY * (isMobile ? 0.9 : 0.7));
                const rot = (Math.random() - 0.5) * 30;

                items.push({
                    type: 'card',
                    member: m,
                    categoryName: cat.name,
                    baseZ: currentZ,
                    x, y, rot
                });
                currentZ -= CONFIG.zGapCards;
            });
            currentZ -= CONFIG.zGapCategory; // Extra padding between groups
        });

        // Add background stars floating randomly deep into the tunnel loop
        const loopSize = Math.abs(currentZ);
        for (let i = 0; i < CONFIG.starCount; i++) {
            items.push({
                type: 'star',
                x: (Math.random() - 0.5) * 3000,
                y: (Math.random() - 0.5) * 3000,
                baseZ: -Math.random() * loopSize * 1.5,
            });
        }

        return { renderItems: items, totalZLength: Math.abs(currentZ) };
    }, []);

    // Effect for Lenis and RAF Engine
    useEffect(() => {
        if (!worldRef.current || !viewportRef.current) return;

        const lenis = new Lenis({
            lerp: 0.05, // Lowered from 0.08 for even smoother scrolling
        });

        lenis.on('scroll', ({ scroll, velocity: v }: any) => {
            stateRef.current.scroll = scroll;
            stateRef.current.targetSpeed = v;
        });

        // Mouse tracking for parallax tilt
        const onMouseMove = (e: MouseEvent) => {
            stateRef.current.mouseX = (e.clientX / window.innerWidth - 0.5) * 2;
            stateRef.current.mouseY = (e.clientY / window.innerHeight - 0.5) * 2;
        };
        window.addEventListener('mousemove', onMouseMove);

        let rafId: number;
        const tick = (time: number) => {
            lenis.raf(time);
            const st = stateRef.current;

            // Compute FPS
            const delta = time - st.lastTime;
            st.lastTime = time;
            if (Math.round(time) % 10 < 1 && delta > 0) setFps(Math.round(1000 / delta));

            // Smooth velocity - reduced multiplier for smoother camera reaction
            st.velocity += (st.targetSpeed - st.velocity) * 0.05;

            // HUD feedback updates
            if (Math.round(time) % 5 === 0) {
                setVelocity(st.velocity);
                setCoord(st.scroll);
            }

            // --- 3D RENDER UPDATES ---

            // 1. Camera Shake and Tilt
            const shakeX = Math.random() * st.velocity * 0.1;
            const tiltX = st.mouseY * 5 - st.velocity * 0.5;
            const tiltY = st.mouseX * 5 + shakeX;
            worldRef.current!.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;

            // 2. Dynamic Warp Perspective FOV
            const isMobile = window.innerWidth < 768;
            const baseFov = isMobile ? 600 : 1000;
            const fov = baseFov - Math.min(Math.abs(st.velocity) * 10, baseFov * 0.6);
            viewportRef.current!.style.perspective = `${fov}px`;

            // 3. Process every registered DOM element in 3D
            const cameraZ = st.scroll * CONFIG.camSpeed;

            itemsRef.current.forEach(({ el, item }) => {
                if (!el) return;

                // Where is this item relative to the camera pulling forward?
                let relZ = item.baseZ + cameraZ;

                // Determine if item is visible or culled
                // Using pure distance, no infinite wrap so user hits bottom of page naturally
                let vizZ = relZ;

                // Opacity / Culling Math
                let alpha = 1;
                // Hide if super deep
                if (vizZ < -8000) alpha = 0;
                // Fade in from distance
                else if (vizZ < -6000) alpha = (vizZ + 8000) / 2000;
                // Fade out when it passes behind the camera (positive Z)
                if (vizZ > 100 && item.type !== 'star') alpha = 1 - ((vizZ - 100) / 300);

                if (alpha < 0) alpha = 0;

                // Only touch DOM if changed/visible to save frames
                if (alpha > 0.01 || el.style.opacity !== '0') {
                    el.style.opacity = alpha.toString();

                    if (alpha > 0.01) {
                        let trans = '';

                        if (item.type === 'star') {
                            const stretch = Math.max(1, Math.min(1 + Math.abs(st.velocity) * 0.1, 10));
                            trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px) scale3d(1, 1, ${stretch})`;
                        } else if (item.type === 'category') {
                            trans = `translate3d(-50%, -50%, ${vizZ}px) rotateZ(${item.rot}deg)`;
                            // Glitch offset shift on text during high speed
                            if (Math.abs(st.velocity) > 0.5) {
                                const offset = st.velocity * 1.5;
                                el.style.textShadow = `${offset}px 0 red, ${-offset}px 0 cyan`;
                            } else {
                                el.style.textShadow = 'none';
                            }
                        } else if (item.type === 'card') {
                            // Float cards gently
                            const t = time * 0.001;
                            const float = Math.sin(t + item.x) * 10;
                            // Add velocity stretch
                            const zSkew = Math.min(Math.abs(st.velocity) * 2, 20) * Math.sign(st.velocity);
                            trans = `translate3d(${item.x}px, ${item.y}px, ${vizZ}px) rotateZ(${item.rot}deg) rotateY(${float}deg) rotateX(${zSkew}deg)`;
                        }

                        el.style.transform = trans;
                        el.style.visibility = 'visible';
                    } else {
                        el.style.visibility = 'hidden';
                    }
                }
            });

            rafId = requestAnimationFrame(tick);
        };

        rafId = requestAnimationFrame(tick);

        return () => {
            window.removeEventListener('mousemove', onMouseMove);
            cancelAnimationFrame(rafId);
            lenis.destroy();
        };
    }, [renderItems]);


    return (
        <>
            <section className="team-section" id="team">

                {/* OVERLAYS */}
                <div className="team-scanlines" />
                <div className="team-vignette" />
                <div className="team-noise" />

                {/* CYBER HUD */}
                <div className="team-hud">
                    <div className="team-hud-top">
                        <span>SYS.READY</span>
                        <div className="team-hud-line" />
                        <span>FPS: <strong>{fps}</strong></span>
                    </div>
                    <div className="team-center-nav">
                        SCROLL VELOCITY // <strong>{Math.abs(velocity).toFixed(2)}</strong>
                    </div>
                    <div className="team-hud-bottom">
                        <span>COORD: <strong>{coord.toFixed(0)}</strong></span>
                        <div className="team-hud-line" />
                        <span>VER 2.0.4 [BETA]</span>
                    </div>
                </div>

                {/* 3D WORLD */}
                <div className="team-viewport" ref={viewportRef}>
                    <div className="team-world" ref={worldRef}>
                        {renderItems.map((item, i) => {
                            const uid = `${item.type}-${i}`;

                            // Register ref shortcut to avoid expensive DOM queries
                            const registerRef = (el: HTMLDivElement | null) => {
                                if (el && !itemsRef.current.find(x => x.id === uid)) {
                                    itemsRef.current.push({ id: uid, el, item });
                                }
                            };

                            if (item.type === 'star') {
                                return <div key={uid} ref={registerRef} className="team-star" />;
                            }

                            if (item.type === 'category') {
                                return (
                                    <div key={uid} ref={registerRef} className="team-item">
                                        <div className="team-big-text">{item.name}</div>
                                    </div>
                                );
                            }

                            if (item.type === 'card') {
                                const isNikhil = item.member && item.member.name === 'Nikhil Yadav';
                                const initials = item.member.name.split(' ').map((w: string) => w[0]).join('').slice(0, 2);
                                return (
                                    <div key={uid} ref={registerRef} className={`team-item ${isNikhil ? 'team-item--nikhil' : ''}`}>
                                        <div className={`team-3d-card ${isNikhil ? 'team-3d-card--is-nikhil' : ''}`}>
                                            <div className="team-3d-card-header">
                                                <span className="team-3d-card-id">ID-{String(Math.abs(item.member.id)).padStart(4, '0')}</span>
                                                <div style={{ width: 10, height: 10, background: isNikhil ? '#00f3ff' : '#ff003c' }} />
                                            </div>

                                            <h2 className="team-member-name">{item.member.name}</h2>

                                            {item.member.image ? (
                                                <div className="team-3d-card-img-wrap">
                                                    <img src={item.member.image} alt={item.member.name} className="team-3d-card-img" loading="lazy" />
                                                </div>
                                            ) : (
                                                <div className="team-3d-card-img-wrap" style={{
                                                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                                                    background: '#1a1a1a', fontSize: '3rem', fontWeight: 900, color: 'rgba(255,0,60,0.2)'
                                                }}>
                                                    {initials}
                                                </div>
                                            )}

                                            <div className="team-3d-card-footer">
                                                <span>CAT: {item.categoryName}</span>
                                                <span className="team-member-role">{item.member.role || (item.member.lead ? 'Lead' : 'Member')}</span>
                                            </div>
                                            <div style={{ position: 'absolute', bottom: '2rem', right: '2rem', fontSize: '4rem', opacity: 0.1, fontWeight: 900 }}>
                                                0{i % 9}
                                            </div>
                                        </div>
                                    </div>
                                );
                            }
                            return null;
                        })}
                    </div>
                </div>

            </section>

            {/* FAKE SCROLL PROXY FOR HEIGHT */}
            {/* Creates scrollbar matching total Z length / cam speed */}
            <div className="team-scroll-proxy" style={{ height: `${totalZLength / CONFIG.camSpeed + window.innerHeight * 2}px` }} />

        </>
    );
}
