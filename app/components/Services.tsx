import AnimatedSection from './AnimatedSection';
import Section3D from './Section3D';
import TimelineAnimation from './TimelineAnimation';

export default function Services() {
  const services = [
    {
      icon: '🌐',
      title: 'Pembuatan Website',
      description:
        'Website modern, responsive, dan SEO-friendly untuk bisnis Anda. Dari landing page hingga e-commerce yang lengkap.',
      features: ['Responsive Design', 'SEO Optimized', 'Fast Loading', 'CMS Integration'],
    },
    {
      icon: '📱',
      title: 'Aplikasi Mobile',
      description:
        'Aplikasi mobile native dan cross-platform untuk iOS dan Android dengan performa optimal dan user experience yang memukau.',
      features: ['iOS & Android', 'Cross-Platform', 'Native Performance', 'App Store Ready'],
    },
    {
      icon: '🎨',
      title: 'UI/UX Design',
      description:
        'Desain interface yang menarik dan user-friendly dengan fokus pada pengalaman pengguna yang optimal.',
      features: ['User Research', 'Wireframing', 'Prototyping', 'Design System'],
    },
    {
      icon: '🛠️',
      title: 'Custom Development',
      description:
        'Solusi custom development sesuai kebutuhan bisnis Anda dengan teknologi terbaru dan best practices.',
      features: ['Custom Solution', 'Scalable Architecture', 'API Integration', 'Cloud Deployment'],
    },
    {
      icon: '⚡',
      title: 'Optimasi & Maintenance',
      description:
        'Layanan optimasi performa, security update, dan maintenance untuk menjaga website/aplikasi Anda tetap optimal.',
      features: ['Performance Tuning', 'Security Updates', 'Regular Backups', '24/7 Support'],
    },
    {
      icon: '💼',
      title: 'Konsultasi IT',
      description:
        'Konsultasi strategi digital, teknologi, dan solusi IT untuk membantu transformasi digital bisnis Anda.',
      features: ['Tech Strategy', 'Digital Transformation', 'Best Practices', 'Expert Advice'],
    },
  ];

  return (
    <section
      id="services"
      className="py-24 bg-white dark:bg-zinc-950 relative overflow-hidden"
    >
      <Section3D type="geometric" color={0x548742} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Layanan Kami
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Solusi lengkap untuk semua kebutuhan digital Anda dengan kualitas
              terbaik dan harga kompetitif
            </p>
          </div>
        </AnimatedSection>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => (
            <AnimatedSection
              key={index}
              animation="fadeInUp"
              delay={index * 100}
            >
              <div
                className="group relative p-8 bg-gradient-to-br from-white to-zinc-50 dark:from-zinc-900 dark:to-zinc-800 rounded-2xl border border-zinc-200 dark:border-zinc-700 hover:border-[#548742] dark:hover:border-[#82b04f] transition-all duration-300 hover:shadow-2xl hover:-translate-y-2 transform hover:scale-105"
              >
              {/* Icon */}
              <div className="text-5xl mb-4 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-300">
                {service.icon}
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-3">
                {service.title}
              </h3>

              {/* Description */}
              <p className="text-zinc-600 dark:text-zinc-400 mb-6 leading-relaxed">
                {service.description}
              </p>

              {/* Features */}
              <ul className="space-y-2">
                {service.features.map((feature, idx) => (
                  <li
                    key={idx}
                    className="flex items-center text-sm text-zinc-700 dark:text-zinc-300"
                  >
                    <svg
                      className="w-5 h-5 text-[#548742] mr-2"
                      fill="none"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M5 13l4 4L19 7" />
                    </svg>
                    {feature}
                  </li>
                ))}
              </ul>

              {/* Hover Effect Gradient */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#548742]/0 to-[#82b04f]/0 group-hover:from-[#548742]/5 group-hover:to-[#82b04f]/5 rounded-2xl transition-all duration-300 pointer-events-none"></div>
              </div>
            </AnimatedSection>
          ))}
        </div>
      </div>
    </section>
  );
}

