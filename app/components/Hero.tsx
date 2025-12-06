import Link from 'next/link';
import AnimatedSection from './AnimatedSection';

export default function Hero() {
  return (
    <section
      id="home"
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-transparent"
    >
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-[#82b04f] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob float"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-[#548742] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-2000 float" style={{ animationDelay: '1s' }}></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-[#b1bda4] rounded-full mix-blend-multiply filter blur-xl opacity-20 animate-blob animation-delay-4000 float" style={{ animationDelay: '2s' }}></div>
      </div>

      <div className="relative z-30 w-full py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Backdrop untuk readability - lebih transparan agar gunung terlihat */}
          <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-white/30 to-white/40 dark:from-zinc-900/40 dark:via-zinc-950/40 dark:to-zinc-900/40 -z-10 rounded-3xl blur-sm"></div>
          <div className="relative space-y-8 text-left">
          {/* Badge */}
          <AnimatedSection animation="fadeInDown" delay={200}>
            <div className="inline-flex items-center px-4 py-2 rounded-full bg-[#d9ead0] dark:bg-[#315d36]/30 text-[#315d36] dark:text-[#82b04f] text-sm font-medium pulse-glow">
              <span className="mr-2 animate-pulse"></span>
              Software House Terpercaya
            </div>
          </AnimatedSection>

          {/* Main Heading */}
          <AnimatedSection animation="fadeInUp" delay={400}>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight" style={{ fontFamily: 'var(--font-poppins)' }}>
              <span className="block text-zinc-900 dark:text-white fade-in-up stagger-1">
                Transformasi Ide Anda
              </span>
              <span className="block mt-2 bg-gradient-to-r from-[#548742] to-[#82b04f] bg-clip-text text-transparent gradient-animate fade-in-up stagger-2">
                Menjadi Solusi Digital
              </span>
            </h1>
          </AnimatedSection>

          {/* Description */}
          <AnimatedSection animation="fadeInUp" delay={600}>
            <p className="text-lg md:text-xl text-zinc-600 dark:text-zinc-300 leading-relaxed">
              Kami adalah tim profesional yang siap membantu mewujudkan visi digital
              Anda. <br /> Dari website hingga aplikasi mobile, kami hadir untuk memberikan
              solusi terbaik.
            </p>
          </AnimatedSection>

          {/* CTA Buttons */}
             <AnimatedSection animation="fadeInUp" delay={800}>
               <div className="flex flex-col sm:flex-row items-start justify-start gap-4 pt-4">
              <Link
                href="#contact"
                className="px-8 py-4 bg-gradient-to-r from-[#548742] to-[#82b04f] text-white rounded-full font-semibold text-base hover:shadow-2xl hover:scale-110 transition-all duration-300 pulse-glow relative overflow-hidden group"
              >
                <span className="relative z-10">Konsultasi Gratis</span>
                <span className="absolute inset-0 bg-gradient-to-r from-[#82b04f] to-[#548742] opacity-0 group-hover:opacity-100 transition-opacity duration-300"></span>
              </Link>
              <Link
                href="#portfolio"
                className="px-8 py-4 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-white rounded-full font-semibold text-base border-2 border-zinc-200 dark:border-zinc-700 hover:border-[#548742] dark:hover:border-[#82b04f] transition-all duration-300 hover:scale-105 hover:shadow-lg"
              >
                Lihat Portfolio
              </Link>
            </div>
          </AnimatedSection>

          {/* Stats */}
          <AnimatedSection animation="fadeInUp" delay={1000}>
             <div className="grid grid-cols-2 md:grid-cols-4 gap-8 pt-16">
              <AnimatedSection animation="scaleIn" delay={1200}>
                <div className="text-left transform hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-[#548742] dark:text-[#82b04f]">
                    50+
                  </div>
                  <div className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-2">
                    Proyek Selesai
                  </div>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="scaleIn" delay={1400}>
                <div className="text-left transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-[#82b04f] dark:text-[#b1bda4]">
                    30+
                  </div>
                  <div className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-2">
                    Klien Puas
                  </div>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="scaleIn" delay={1600}>
                <div className="text-left transform hover:scale-110 transition-transform duration-300">
                  <div className="text-3xl md:text-4xl font-bold text-[#315d36] dark:text-[#548742]">
                    5+
                  </div>
                  <div className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-2">
                    Tahun Pengalaman
                  </div>
                </div>
              </AnimatedSection>
              <AnimatedSection animation="scaleIn" delay={1800}>
                <div className="text-left transform hover:scale-110 transition-transform duration-300">
                  <div className="text-2xl md:text-3xl font-bold text-[#548742] dark:text-[#82b04f]">
                    100%
                  </div>
                  <div className="text-sm md:text-base text-zinc-600 dark:text-zinc-400 mt-2">
                    Kepuasan Klien
                  </div>
                </div>
              </AnimatedSection>
            </div>
          </AnimatedSection>
          </div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 animate-bounce">
        <svg
          className="w-6 h-6 text-zinc-400"
          fill="none"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path d="M19 14l-7 7m0 0l-7-7m7 7V3" />
        </svg>
      </div>
    </section>
  );
}

