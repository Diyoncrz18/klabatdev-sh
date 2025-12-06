import AnimatedSection from './AnimatedSection';
import Section3D from './Section3D';

export default function Portfolio() {
  const projects = [
    {
      title: 'E-Commerce Platform',
      category: 'Website',
      description:
        'Platform e-commerce modern dengan fitur lengkap untuk penjualan online, manajemen inventory, dan payment gateway terintegrasi.',
      image: '/project-1.jpg',
      tech: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe'],
      link: '#',
    },
    {
      title: 'Mobile Banking App',
      category: 'Mobile App',
      description:
        'Aplikasi mobile banking dengan keamanan tinggi, fitur transfer, pembayaran, dan investasi yang user-friendly.',
      image: '/project-2.jpg',
      tech: ['React Native', 'Node.js', 'MongoDB', 'Firebase'],
      link: '#',
    },
    {
      title: 'SaaS Dashboard',
      category: 'Web App',
      description:
        'Dashboard SaaS untuk manajemen bisnis dengan analytics, reporting, dan integrasi berbagai tools bisnis.',
      image: '/project-3.jpg',
      tech: ['React', 'Python', 'PostgreSQL', 'AWS'],
      link: '#',
    },
    {
      title: 'Food Delivery App',
      category: 'Mobile App',
      description:
        'Aplikasi food delivery dengan real-time tracking, multiple payment methods, dan rating system.',
      image: '/project-4.jpg',
      tech: ['Flutter', 'Node.js', 'MongoDB', 'Socket.io'],
      link: '#',
    },
    {
      title: 'Corporate Website',
      category: 'Website',
      description:
        'Website perusahaan dengan design modern, portfolio showcase, dan integrated CMS untuk konten management.',
      image: '/project-5.jpg',
      tech: ['Next.js', 'Contentful', 'Tailwind CSS', 'Vercel'],
      link: '#',
    },
    {
      title: 'Healthcare Management',
      category: 'Web App',
      description:
        'Sistem manajemen kesehatan dengan appointment booking, patient records, dan telemedicine features.',
      image: '/project-6.jpg',
      tech: ['Vue.js', 'Laravel', 'MySQL', 'Docker'],
      link: '#',
    },
  ];

  const categories = ['Semua', 'Website', 'Mobile App', 'Web App'];

  return (
    <section
      id="portfolio"
      className="py-24 bg-gradient-to-b from-zinc-50 to-white dark:from-zinc-950 dark:to-zinc-900 relative overflow-hidden"
    >
      <Section3D type="particles" color={0x82b04f} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Portfolio Kami
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Lihat beberapa proyek terbaik yang telah kami selesaikan untuk klien
              dari berbagai industri
            </p>
          </div>
        </AnimatedSection>

        {/* Category Filter */}
        <AnimatedSection animation="fadeInDown" delay={200}>
          <div className="flex flex-wrap justify-center gap-4 mb-12">
            {categories.map((category, idx) => (
              <button
                key={category}
                className="px-6 py-2 rounded-full bg-white dark:bg-zinc-800 text-zinc-700 dark:text-zinc-300 border border-zinc-200 dark:border-zinc-700 hover:bg-[#548742] hover:text-white hover:border-[#548742] transition-all duration-300 font-medium transform hover:scale-110"
                style={{ animationDelay: `${idx * 50}ms` }}
              >
                {category}
              </button>
            ))}
          </div>
        </AnimatedSection>

        {/* Projects Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <AnimatedSection
              key={index}
              animation="fadeInUp"
              delay={index * 100}
            >
              <div
                className="group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform hover:scale-105"
              >
              {/* Project Image Placeholder */}
              <div className="relative h-64 bg-gradient-to-br from-[#82b04f] to-[#548742] overflow-hidden group-hover:scale-110 transition-transform duration-500">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-6xl opacity-30 group-hover:opacity-50 group-hover:scale-125 transition-all duration-300">🚀</div>
                </div>
                <div className="absolute top-4 right-4 px-3 py-1 bg-white/90 dark:bg-zinc-900/90 rounded-full text-xs font-semibold text-zinc-900 dark:text-white">
                  {project.category}
                </div>
              </div>

              {/* Project Content */}
              <div className="p-6">
                <h3 className="text-xl font-bold text-zinc-900 dark:text-white mb-2">
                  {project.title}
                </h3>
                <p className="text-zinc-600 dark:text-zinc-400 mb-4 text-sm leading-relaxed">
                  {project.description}
                </p>

                {/* Tech Stack */}
                <div className="flex flex-wrap gap-2 mb-4">
                  {project.tech.map((tech, idx) => (
                    <span
                      key={idx}
                      className="px-3 py-1 bg-zinc-100 dark:bg-zinc-700 text-zinc-700 dark:text-zinc-300 rounded-full text-xs font-medium"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* View Project Button */}
                <a
                  href={project.link}
                  className="inline-flex items-center text-[#548742] dark:text-[#82b04f] font-semibold hover:gap-2 transition-all duration-300 group"
                >
                  Lihat Detail
                  <svg
                    className="w-5 h-5 ml-1 transform group-hover:translate-x-1 transition-transform"
                    fill="none"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path d="M9 5l7 7-7 7" />
                  </svg>
                </a>
              </div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#548742]/90 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                <button className="px-6 py-3 bg-white text-[#548742] rounded-full font-semibold hover:scale-105 transition-transform">
                  View Project
                </button>
              </div>
              </div>
            </AnimatedSection>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            Tertarik dengan portfolio kami? Mari diskusikan proyek Anda!
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#548742] to-[#82b04f] text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Konsultasi Proyek Anda
          </a>
        </div>
      </div>
    </section>
  );
}

