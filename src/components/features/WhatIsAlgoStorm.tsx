import { useEffect, useRef, useState } from 'react';
import { motion, useInView } from 'framer-motion';
import './WhatIsAlgoStorm.css';

const CHARACTERS = '!/|~#.^+*$#%nwf';

function BaffleText({ text, inView }: { text: string; inView: boolean }) {
    const [displayText, setDisplayText] = useState(text);

    useEffect(() => {
        if (!inView) {
            setDisplayText(text.replace(/[^\s]/g, () => CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)]));
            return;
        }

        let iteration = 0;
        const interval = setInterval(() => {
            setDisplayText(() =>
                text
                    .split('')
                    .map((letter, index) => {
                        if (index < iteration) {
                            return text[index];
                        }
                        if (letter === ' ' || letter === '\n') return letter;
                        return CHARACTERS[Math.floor(Math.random() * CHARACTERS.length)];
                    })
                    .join('')
            );

            iteration += text.length / 50; // Controls the speed of reveal

            if (iteration >= text.length) {
                clearInterval(interval);
                setDisplayText(text);
            }
        }, 40); // 40ms interval

        return () => clearInterval(interval);
    }, [inView, text]);

    return (
        <span className="baffle-text">
            {displayText.split('\n').map((line, i) => (
                <span key={i}>
                    {line}
                    {i !== displayText.split('\n').length - 1 && <br />}
                </span>
            ))}
        </span>
    );
}

const WhatIsAlgoStorm = () => {
    const ref = useRef<HTMLDivElement>(null);
    const isInView = useInView(ref, { margin: "-20% 0px" });

    return (
        <section className="what-is-algostorm-section" ref={ref}>
            <div className="container algostorm-container">
                <motion.div
                    initial={{ opacity: 0, y: 50 }}
                    animate={isInView ? { opacity: 1, y: 0 } : {}}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="content-wrapper"
                >
                    <div className="baffle-header">
                        <BaffleText text="What is ALGOSTORM ?" inView={isInView} />
                    </div>
                    <p className="baffle-paragraph">
                        <BaffleText
                            text="AlgoStorm is a 24-hour innovation-driven hackathon organized at Amity University Chhattisgarh by Piratage: The Ethical Hacking Club, under ASET and AIIT. It brings together passionate developers, designers, and problem-solvers to collaborate and build impactful tech solutions to real-world challenges."
                            inView={isInView}
                        />
                    </p>
                </motion.div>
            </div>
        </section>
    );
};

export default WhatIsAlgoStorm;
