import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './Prizes.css';

gsap.registerPlugin(ScrollTrigger);

export default function Prizes() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const bountyRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const section = sectionRef.current;
        const header = headerRef.current;
        const bountyContainer = bountyRef.current;

        if (!section || !header || !bountyContainer) return;

        // Header animation
        gsap.fromTo(header,
            { y: 50, opacity: 0, filter: "blur(10px)" },
            {
                y: 0,
                opacity: 1,
                filter: "blur(0px)",
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                }
            }
        );

        // Bounty rows stagger animation
        const rows = bountyContainer.querySelectorAll('.bounty-row');
        gsap.fromTo(rows,
            { x: -50, opacity: 0, skewX: 10 },
            {
                x: 0,
                opacity: 1,
                skewX: 0,
                duration: 0.8,
                stagger: 0.2,
                ease: "back.out(1.5)",
                scrollTrigger: {
                    trigger: bountyContainer,
                    start: "top 75%",
                }
            }
        );

    }, []);

    const bounties = [
        {
            rank: "01",
            title: "THE MASTERMIND",
            subtitle: "FIRST PLACE TARGET",
            amount: "15,000",
            status: "WANTED ALIVE"
        },
        {
            rank: "02",
            title: "THE ENFORCER",
            subtitle: "SECOND PLACE TARGET",
            amount: "10,000",
            status: "HIGH PRIORITY"
        },
        {
            rank: "03",
            title: "THE HACKER",
            subtitle: "THIRD PLACE TARGET",
            amount: "5,000",
            status: "REWARD OFFERED"
        }
    ];

    return (
        <section className="prizes-section" ref={sectionRef} id="prizes">
            <div className="prizes-container">

                <div className="prizes-header" ref={headerRef}>
                    <div className="glitch-wrapper">
                        <h2 className="glitch-text" data-text="O TARGET TARGET ">TARGETS ACQUIRED</h2>
                    </div>
                    <p className="prizes-subtitle">ACTIVE BOUNTIES ON THE BOARD</p>
                </div>

                <div className="bounty-board" ref={bountyRef}>
                    {bounties.map((bounty, index) => (
                        <div key={index} className={`bounty-row bounty-rank-${bounty.rank}`}>

                            {/* Left Side: Rank & Title */}
                            <div className="bounty-info">
                                <div className="bounty-rank">
                                    <span className="rank-hash">#</span>{bounty.rank}
                                </div>
                                <div className="bounty-names">
                                    <div className="bounty-status">{bounty.status}</div>
                                    <h3 className="bounty-title">{bounty.title}</h3>
                                    <div className="bounty-sub">{bounty.subtitle}</div>
                                </div>
                            </div>

                            {/* Right Side: The Cash */}
                            <div className="bounty-reward">
                                <div className="reward-label">REWARD</div>
                                <div className="reward-amount">
                                    <span className="currency">₹</span>{bounty.amount}
                                </div>
                            </div>

                            {/* Decorative scanline overlay on each row */}
                            <div className="bounty-scanline"></div>
                        </div>
                    ))}
                </div>

            </div>

            {/* Brutalist Background Elements */}
            <div className="prizes-bg-grid" aria-hidden="true" />
            <div className="prizes-vignette" aria-hidden="true" />
        </section>
    );
}
