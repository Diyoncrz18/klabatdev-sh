import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Services from './components/Services';
import Portfolio from './components/Portfolio';
import About from './components/About';
import Team from './components/Team';
import Contact from './components/Contact';
import Footer from './components/Footer';
import Background3DWrapper from './components/3d/Background3DWrapper';

export default function Home() {
  return (
    <main className="min-h-screen relative">
      <Background3DWrapper />
      <div className="relative z-20">
        <Navbar />
        <Hero />
        <Services />
        <Portfolio />
        <About />
        <Team />
        <Contact />
        <Footer />
      </div>
    </main>
  );
}
