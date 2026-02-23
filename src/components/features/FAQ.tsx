import { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { FaChevronDown } from 'react-icons/fa';
import './FAQ.css';

gsap.registerPlugin(ScrollTrigger);

interface FAQItemProps {
    question: string;
    answer: string;
    isOpen: boolean;
    onClick: () => void;
}

const FAQItem = ({ question, answer, isOpen, onClick }: FAQItemProps) => {
    const contentRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (contentRef.current) {
            if (isOpen) {
                gsap.to(contentRef.current, {
                    height: 'auto',
                    opacity: 1,
                    duration: 0.4,
                    ease: 'power2.out'
                });
            } else {
                gsap.to(contentRef.current, {
                    height: 0,
                    opacity: 0,
                    duration: 0.3,
                    ease: 'power2.in'
                });
            }
        }
    }, [isOpen]);

    return (
        <div className={`faq-item ${isOpen ? 'open' : ''}`}>
            <button className="faq-question" onClick={onClick} aria-expanded={isOpen}>
                <h3>{question}</h3>
                <span className="faq-icon">
                    <FaChevronDown />
                </span>
            </button>
            <div className="faq-answer-wrapper" ref={contentRef}>
                <div className="faq-answer-content">
                    <p>{answer}</p>
                </div>
            </div>
        </div>
    );
};

export default function FAQ() {
    const [openIndex, setOpenIndex] = useState<number | null>(0); // First one open by default
    const sectionRef = useRef<HTMLElement>(null);
    const headerRef = useRef<HTMLHeadingElement>(null);

    const faqs = [
        {
            question: "WHAT IS ALGOSTORM?",
            answer: "AlgoStorm is the premier hackathon hosted by Amity University Raipur. It's an intense, high-energy environment where developers, designers, and innovators come together to build incredible software solutions within a strict time limit."
        },
        {
            question: "WHO CAN PARTICIPATE?",
            answer: "AlgoStorm is open to all university students who have a passion for technology, coding, and problem-solving. Whether you're a seasoned developer or a first-year student, you're welcome to join the heist."
        },
        {
            question: "HOW MUCH DOES IT COST?",
            answer: "Participation in AlgoStorm is completely free! We cover everything so you can focus entirely on building your project and executing your plan."
        },
        {
            question: "DO I NEED A TEAM?",
            answer: "You can participate solo or as a team of up to 4 members. If you don't have a team, don't worry! We will have team-building sessions before the hacking begins so you can find your crew."
        },
        {
            question: "WHAT SHOULD I BRING?",
            answer: "Bring your laptop, charger, a valid student ID, and your ultimate setup for coding. We'll provide the food, drinks, Wi-Fi, and workspace."
        }
    ];

    const toggleFAQ = (index: number) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    useEffect(() => {
        const section = sectionRef.current;
        const header = headerRef.current;
        if (!section || !header) return;

        // Simple reveal animation on scroll
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

        const items = section.querySelectorAll('.faq-item');
        gsap.fromTo(items,
            { y: 30, opacity: 0 },
            {
                y: 0,
                opacity: 1,
                duration: 0.6,
                stagger: 0.1,
                ease: "power2.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 70%",
                }
            }
        );
    }, []);

    return (
        <section className="faq-section" ref={sectionRef} id="faq">
            <div className="faq-container">
                <div className="faq-header" ref={headerRef}>
                    <h2>FREQUENTLY ASKED <span className="text-red">QUESTIONS</span></h2>
                    <p className="faq-subtitle">EVERYTHING YOU NEED TO KNOW BEFORE THE HEIST</p>
                </div>

                <div className="faq-list">
                    {faqs.map((faq, index) => (
                        <FAQItem
                            key={index}
                            question={faq.question}
                            answer={faq.answer}
                            isOpen={openIndex === index}
                            onClick={() => toggleFAQ(index)}
                        />
                    ))}
                </div>
            </div>
            {/* Atmospheric Background Glow */}
            <div className="faq-glow" aria-hidden="true" />
        </section>
    );
}
