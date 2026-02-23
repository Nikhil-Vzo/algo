import './Loader.css';

interface LoaderProps {
    hidden: boolean;
}

export default function Loader({ hidden }: LoaderProps) {
    const word = 'ALGOSTORM';

    return (
        <div className={`site-loader ${hidden ? 'site-loader--hidden' : ''}`}>
            <div className="site-loader__wrapper">
                {word.split('').map((letter, i) => (
                    <span
                        key={i}
                        className={`site-loader__letter ${i >= 4 ? 'site-loader__letter--accent' : ''}`}
                    >
                        {letter}
                    </span>
                ))}
                <div className="site-loader__scan" />
            </div>
        </div>
    );
}
