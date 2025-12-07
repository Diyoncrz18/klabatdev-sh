import Image from "next/image";
import { useState } from "react";
import AnimatedSection from "./AnimatedSection";
import Section3D from "./Section3D";

// Komponen untuk foto dengan fallback
function TeamPhoto({
  src,
  alt,
  name,
}: {
  src: string;
  alt: string;
  name: string;
}) {
  const [imgSrc, setImgSrc] = useState(src);
  const [showPlaceholder, setShowPlaceholder] = useState(false);

  return (
    <>
      {!showPlaceholder && (
        <div className="absolute inset-0 w-full h-full">
          {/* Subtle overlay untuk foto agar lebih blend dengan background */}
          <div className="absolute inset-0 bg-gradient-to-t from-slate-900/30 via-transparent to-transparent z-10 pointer-events-none" />
          <Image
            src={imgSrc}
            alt={alt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
            onError={() => {
              // Fallback ke placeholder jika gambar tidak ditemukan
              setShowPlaceholder(true);
            }}
          />
        </div>
      )}
      {showPlaceholder && (
        <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
          {/* Modern gradient overlay untuk placeholder */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20" />

          {/* Mesh gradient pattern */}
          <div
            className="absolute inset-0 opacity-20"
            style={{
              backgroundImage: `
                radial-gradient(at 20% 30%, rgba(99, 102, 241, 0.3) 0px, transparent 50%),
                radial-gradient(at 80% 70%, rgba(139, 92, 246, 0.3) 0px, transparent 50%)
              `,
            }}
          />

          <div className="text-8xl opacity-30 text-white relative z-10 font-light">
            {name.charAt(0)}
          </div>
        </div>
      )}
    </>
  );
}

export default function Team() {
  return (
    <section
      id="team"
      className="py-24 bg-gradient-to-b from-white to-zinc-50 dark:from-zinc-950 dark:to-zinc-900 relative overflow-hidden"
    >
      <Section3D type="particles" color={0x7ade6c} />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <AnimatedSection animation="fadeInUp">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold text-zinc-900 dark:text-white mb-4">
              Tim Kami
            </h2>
            <p className="text-xl text-zinc-600 dark:text-zinc-400 max-w-2xl mx-auto">
              Kenali tim profesional yang siap membantu mewujudkan visi digital
              Anda
            </p>
          </div>
        </AnimatedSection>

        {/* Team Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <AnimatedSection animation="fadeInUp" delay={0}>
            <div className="group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform hover:scale-105">
              {/* Photo Container */}
              <div className="relative h-80 overflow-hidden">
                {/* Estetik Background dengan gradient modern dan elegant */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
                  {/* Animated gradient overlay untuk depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/10 via-transparent to-transparent" />

                  {/* Mesh gradient pattern untuk texture modern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        radial-gradient(at 20% 30%, rgba(99, 102, 241, 0.3) 0px, transparent 50%),
                        radial-gradient(at 80% 70%, rgba(139, 92, 246, 0.3) 0px, transparent 50%),
                        radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.2) 0px, transparent 50%)
                      `,
                    }}
                  />

                  {/* Subtle noise texture */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                {/* Elegant border glow dengan multiple layers */}
                <div className="absolute inset-0 border border-white/5 rounded-t-2xl pointer-events-none z-20" />
                <div className="absolute inset-[1px] border border-white/10 rounded-t-2xl pointer-events-none z-20" />

                {/* Photo dengan fallback */}
                <TeamPhoto
                  src="/imgprofile/grantly.png"
                  alt="Grantly Sorongan"
                  name="Grantly Sorongan"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <div className="flex gap-4">
                    <a
                      href="https://www.linkedin.com/in/grantly-antonio-edward-sorongan-87109b349/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/grenly-del"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
                      aria-label="GitHub"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="mailto:grantly@gmail.com"
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
                      aria-label="Email"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 text-center">
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Grantly Sorongan
                </h3>

                {/* Position */}
                <p className="text-[#548742] dark:text-[#82b04f] font-semibold mb-3">
                  Software Engineer
                </p>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0}>
            <div className="group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform hover:scale-105">
              {/* Photo Container */}
              <div className="relative h-80 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/10 via-transparent to-transparent" />

                  {/* Mesh gradient pattern untuk texture modern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        radial-gradient(at 20% 30%, rgba(99, 102, 241, 0.3) 0px, transparent 50%),
                        radial-gradient(at 80% 70%, rgba(139, 92, 246, 0.3) 0px, transparent 50%),
                        radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.2) 0px, transparent 50%)
                      `,
                    }}
                  />

                  {/* Subtle noise texture */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                {/* Elegant border glow dengan multiple layers */}
                <div className="absolute inset-0 border border-white/5 rounded-t-2xl pointer-events-none z-20" />
                <div className="absolute inset-[1px] border border-white/10 rounded-t-2xl pointer-events-none z-20" />

                {/* Photo dengan fallback */}
                <TeamPhoto
                  src="/imgprofile/dion.png"
                  alt="Dion Kobi"
                  name="Dion Kobi"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <div className="flex gap-4">
                    <a
                      href="https://www.linkedin.com/in/dion-kobi-b1186b312/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href="https://github.com/Diyoncrz18"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
                      aria-label="GitHub"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="mailto:dkobi16@gmail.com"
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
                      aria-label="Email"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 text-center">
                {/* Name */}
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Dion Kobi
                </h3>

                {/* Position */}
                <p className="text-[#548742] dark:text-[#82b04f] font-semibold mb-3">
                  Full Stack Developer
                </p>
              </div>
            </div>
          </AnimatedSection>
          <AnimatedSection animation="fadeInUp" delay={0}>
            <div className="group relative bg-white dark:bg-zinc-800 rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-700 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2 transform hover:scale-105">
              {/* Photo Container */}
              <div className="relative h-80 overflow-hidden">
                {/* Estetik Background dengan gradient modern dan elegant */}
                <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-zinc-900">
                  {/* Animated gradient overlay untuk depth */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/20 via-transparent to-purple-900/20" />
                  <div className="absolute inset-0 bg-gradient-to-tl from-blue-900/10 via-transparent to-transparent" />

                  {/* Mesh gradient pattern untuk texture modern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `
                        radial-gradient(at 20% 30%, rgba(99, 102, 241, 0.3) 0px, transparent 50%),
                        radial-gradient(at 80% 70%, rgba(139, 92, 246, 0.3) 0px, transparent 50%),
                        radial-gradient(at 50% 50%, rgba(59, 130, 246, 0.2) 0px, transparent 50%)
                      `,
                    }}
                  />

                  {/* Subtle noise texture */}
                  <div
                    className="absolute inset-0 opacity-[0.03]"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 400 400' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
                    }}
                  />
                </div>

                {/* Elegant border glow dengan multiple layers */}
                <div className="absolute inset-0 border border-white/5 rounded-t-2xl pointer-events-none z-20" />
                <div className="absolute inset-[1px] border border-white/10 rounded-t-2xl pointer-events-none z-20" />

                {/* Photo dengan fallback */}
                <TeamPhoto
                  src="/imgprofile/dion.png"
                  alt="Dion Kobi"
                  name="Dion Kobi"
                />

                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6 z-10">
                  <div className="flex gap-4">
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
                      aria-label="LinkedIn"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                      </svg>
                    </a>
                    <a
                      href="#"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
                      aria-label="GitHub"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          fillRule="evenodd"
                          d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </a>
                    <a
                      href="mailto:dion@klabatdev.com"
                      className="w-10 h-10 flex items-center justify-center bg-white/20 backdrop-blur-sm rounded-full hover:bg-white/30 transition-all hover:scale-110"
                      aria-label="Email"
                    >
                      <svg
                        className="w-5 h-5 text-white"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                        />
                      </svg>
                    </a>
                  </div>
                </div>
              </div>

              {/* Info Section */}
              <div className="p-6 text-center">
                {/* Name */}
                <h3 className="text-2xl font-bold text-zinc-900 dark:text-white mb-2">
                  Dion Kobi
                </h3>

                {/* Position */}
                <p className="text-[#548742] dark:text-[#82b04f] font-semibold mb-3">
                  Full Stack Developer
                </p>
              </div>
            </div>
          </AnimatedSection>
        </div>

        {/* CTA Section */}
        <div className="text-center mt-16">
          <p className="text-lg text-zinc-600 dark:text-zinc-400 mb-6">
            Ingin bergabung dengan tim kami?
          </p>
          <a
            href="#contact"
            className="inline-block px-8 py-4 bg-gradient-to-r from-[#548742] to-[#82b04f] text-white rounded-full font-semibold hover:shadow-2xl hover:scale-105 transition-all duration-300"
          >
            Lihat Lowongan
          </a>
        </div>
      </div>
    </section>
  );
}
