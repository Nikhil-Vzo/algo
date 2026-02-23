import Hero from '../features/Hero';
import WhatIsAlgoStorm from '../features/WhatIsAlgoStorm';
import Season1Recap from '../features/Season1Recap';

export default function Home({ loading }: { loading: boolean }) {
    return (
        <main>
            <Hero loading={loading} />
            <WhatIsAlgoStorm />
            <Season1Recap />
        </main>
    );
}
