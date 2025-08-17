import CTA from './cta';
import Features from './features';
import Footer from './footer';
import Header from './header';
import Hero from './hero';
import HowItWorks from './how-it-works';
import Integration from './integration';
import Pricing from './pricing';
import Testimonials from './testimonials';

const LandingPage = () => {
  return (
    <div className="min-h-screen">
      <Header />
      <main>
        <Hero />
        <Features />
        <HowItWorks />
        <Integration />
        <Pricing />
        <Testimonials />
        <CTA />
      </main>
      <Footer />
    </div>
  );
};
export default LandingPage;
