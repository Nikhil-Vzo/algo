import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MapPin, TrainTrack, Plane, Car, ChevronDown } from 'lucide-react';
import './Location.css';

gsap.registerPlugin(ScrollTrigger);

export default function Location() {
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLDivElement>(null);
    const contentRef = useRef<HTMLDivElement>(null);

    // Track which transit card is open on mobile
    const [expandedCard, setExpandedCard] = useState<number | null>(null);

    const toggleCard = (index: number) => {
        // Toggle off if already open, else open the new one
        setExpandedCard(expandedCard === index ? null : index);
    };

    useEffect(() => {
        const section = sectionRef.current;
        const header = headerRef.current;
        const content = contentRef.current;

        if (!section || !header || !content) return;

        // Header animation
        gsap.fromTo(header,
            { y: 50, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.8,
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 80%",
                }
            }
        );

        // Content cards stagger animation
        const cards = content.querySelectorAll('.location-card');
        gsap.fromTo(cards,
            { y: 40, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.15,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: content,
                    start: "top 75%",
                }
            }
        );

        // Map iframe fade in
        const mapIframe = content.querySelector('.location-map-container');
        if (mapIframe) {
            gsap.fromTo(mapIframe,
                { opacity: 0, scale: 0.95 },
                {
                    opacity: 1,
                    scale: 1,
                    duration: 0.8,
                    delay: 0.2,
                    ease: "power2.out",
                    scrollTrigger: {
                        trigger: content,
                        start: "top 70%",
                    }
                }
            );
        }

    }, []);

    const transitOptions = [
        {
            icon: <Plane size={28} />,
            title: "BY AIR",
            desc: "Swami Vivekananda Airport (RPR) is the nearest airport. It is approximately 40 km from the campus. You can easily hire a pre-paid taxi or cab service directly to Amity University Math, Raipur."
        },
        {
            icon: <TrainTrack size={28} />,
            title: "BY TRAIN",
            desc: "Raipur Junction Railway Station (R) is a major hub connected to all parts of India. It is located roughly 45 km from the campus. Buses and cabs are frequently available from the station."
        },
        {
            icon: <Car size={28} />,
            title: "LOCAL TRANSIT",
            desc: "Local city buses and auto-rickshaws connect the main city to the Math campus area. Navigation apps work perfectly to drop you precisely at the main gates of the campus."
        }
    ];

    return (
        <section className="location-section" ref={sectionRef} id="location">
            <div className="location-container">
                <div className="location-header" ref={headerRef}>
                    <h2>HOW TO <span className="text-red">REACH US</span></h2>
                    <p className="location-subtitle">THE TARGET: AMITY UNIVERSITY, RAIPUR</p>
                </div>

                <div className="location-grid" ref={contentRef}>
                    {/* Left Column: Transit Info */}
                    <div className="location-transit">
                        {transitOptions.map((opt, index) => {
                            const isExpanded = expandedCard === index;
                            return (
                                <div
                                    key={index}
                                    className={`location-card transit-card ${isExpanded ? 'expanded' : ''}`}
                                    onClick={() => toggleCard(index)}
                                >
                                    <div className="location-card-header-mobile">
                                        <div className="location-card-icon">
                                            {opt.icon}
                                        </div>
                                        <h3>{opt.title}</h3>
                                        {/* Chevron only shows on mobile via CSS */}
                                        <ChevronDown className="transit-chevron" />
                                    </div>
                                    <div className="location-card-content">
                                        {/* Desktop title remains hidden on mobile */}
                                        <h3 className="desktop-title">{opt.title}</h3>
                                        <p>{opt.desc}</p>
                                    </div>
                                </div>
                            );
                        })}
                    </div>

                    {/* Right Column: Embedded Map */}
                    <div className="location-map">
                        <div className="location-card map-card">
                            <div className="location-card-header">
                                <MapPin size={24} className="text-red" />
                                <h3>AMITY UNIVERSITY CHHATTISGARH</h3>
                            </div>
                            <p className="map-address">Manth (Kharora), State Highway 9, Raipur Baloda-Bazar Road, Raipur, Chhattisgarh 493225</p>

                            <div className="location-map-container">
                                {/* Explicitly pinned Amity University Raipur iframe */}
                                <iframe
                                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3714.7336181162312!2d81.82138!3d21.39967!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3a28dbb3bd1432f7%3A0xc317d7507301c23!2sAmity%20University%2C%20Raipur!5e0!3m2!1sen!2sin!4v1709123456789!5m2!1sen!2sin"
                                    width="100%"
                                    height="100%"
                                    style={{ border: 0 }}
                                    allowFullScreen={true}
                                    loading="lazy"
                                    referrerPolicy="no-referrer-when-downgrade"
                                    title="Amity University Raipur Map"
                                ></iframe>
                            </div>

                            <a
                                href="https://maps.google.com/?q=Amity+University,+Raipur"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="location-directions-btn"
                            >
                                GET DIRECTIONS
                            </a>
                        </div>
                    </div>
                </div>
            </div>
            {/* Atmospheric Background Glow */}
            <div className="location-glow" aria-hidden="true" />
        </section>
    );
}
