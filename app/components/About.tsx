import AnimatedSection from './AnimatedSection';
import Section3D from './Section3D';

export default function About() {
  const values = [
    {
      icon: '🎯',
      title: 'Fokus pada Kualitas',
      description: 'Setiap proyek dikerjakan dengan standar kualitas tinggi dan best practices industri.',
    },
    {
      icon: '⚡',
      title: 'Cepat & Efisien',
      description: 'Tim berpengalaman yang mampu menyelesaikan proyek tepat waktu tanpa mengorbankan kualitas.',
    },
    {
      icon: '🤝',
      title: 'Kolaborasi Terbuka',
      description: 'Komunikasi transparan dan kolaborasi aktif dengan klien di setiap tahap proyek.',
    },
    {
      icon: '💡',
      title: 'Inovasi Berkelanjutan',
      description: 'Selalu mengikuti perkembangan teknologi terbaru untuk memberikan solusi terbaik.',
    },
  ];

  const team = [
    { name: 'Frontend Developer', count: '8+' },
    { name: 'Backend Developer', count: '6+' },
    { name: 'UI/UX Designer', count: '4+' },
    { name: 'Project Manager', count: '3+' },
  ];

  return (
    <section
      id="about"
      className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden"
    >
      <Section3D type="geometric" color={0x315d36} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Tentang KlabatDev
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Kami adalah tim profesional yang berkomitmen untuk memberikan solusi
              digital terbaik bagi bisnis Anda
            </p>
          </div>
        </AnimatedSection>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
          {/* Left: Story */}
          <AnimatedSection animation="fadeInLeft">
            <div className="space-y-6">
              <h3 className="text-3xl font-bold text-zinc-900 dark:text-white">
                Cerita Kami
              </h3>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                KlabatDev didirikan dengan visi untuk membantu bisnis dan individu
                mewujudkan ide digital mereka menjadi kenyataan. Dengan pengalaman
                bertahun-tahun di industri teknologi, kami telah membantu puluhan
                klien dari berbagai sektor untuk mencapai tujuan digital mereka.
              </p>
              <p className="text-zinc-600 dark:text-zinc-400 leading-relaxed">
                Kami percaya bahwa setiap proyek adalah kesempatan untuk menciptakan
                sesuatu yang luar biasa. Dengan kombinasi kreativitas, teknologi
                terkini, dan dedikasi tinggi, kami siap menjadi partner terpercaya
                untuk perjalanan digital Anda.
              </p>
              <div className="pt-4">
                <a
                  href="#contact"
                  className="inline-block px-6 py-3 bg-gradient-to-r from-[#548742] to-[#82b04f] text-white rounded-full font-semibold hover:shadow-lg hover:scale-105 transition-all duration-300"
                >
                  Hubungi Kami
                </a>
              </div>
            </div>
          </AnimatedSection>

          {/* Right: Stats */}
          <AnimatedSection animation="fadeInRight">
            <div className="grid grid-cols-2 gap-6">
              {team.map((item, index) => (
                <AnimatedSection
                  key={index}
                  animation="scaleIn"
                  delay={index * 100}
                >
                  <div className="p-6 bg-gradient-to-br from-[#f0f7ed] to-[#e8f5e3] dark:from-zinc-800 dark:to-zinc-900 rounded-2xl border border-zinc-200 dark:border-zinc-700 text-center hover:shadow-lg transition-all duration-300 transform hover:scale-105">
                    <div className="text-4xl font-bold text-[#548742] dark:text-[#82b04f] mb-2">
                      {item.count}
                    </div>
                    <div className="text-zinc-700 dark:text-zinc-300 font-medium">
                      {item.name}
                    </div>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </AnimatedSection>
        </div>

        {/* Values */}
        <AnimatedSection animation="fadeInUp">
          <div>
            <h3 className="text-3xl font-bold text-zinc-900 dark:text-white text-center mb-12">
              Nilai-Nilai Kami
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {values.map((value, index) => (
                <AnimatedSection
                  key={index}
                  animation="fadeInUp"
                  delay={index * 100}
                >
                  <div
                    className="p-6 bg-zinc-50 dark:bg-zinc-900 rounded-xl border border-zinc-200 dark:border-zinc-800 hover:border-[#548742] dark:hover:border-[#82b04f] transition-all duration-300 hover:shadow-lg transform hover:scale-105"
                  >
                <div className="text-4xl mb-4">{value.icon}</div>
                <h4 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {value.title}
                </h4>
                <p className="text-zinc-600 dark:text-zinc-400 text-sm leading-relaxed">
                  {value.description}
                </p>
                  </div>
                </AnimatedSection>
              ))}
            </div>
          </div>
        </AnimatedSection>
      </div>
    </section>
  );
}

