import { useRef, useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'motion/react';
import { X, ArrowUpRight, ArrowLeft } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';


gsap.registerPlugin(ScrollTrigger);

const achievements = [
  {
    year: "2026",
    category: "Artificial Intelligence",
    title: "Microsoft AI Skills Fest",
    issuer: "Microsoft",
    desc: "Completed the Microsoft AI Skills Fest, gaining hands-on proficiency in Generative AI, Azure AI services, Microsoft Copilot, and autonomous agent systems.",
    imageUrl: "/certificates/microsoft-ai.png"
  },
  {
    year: "2026",
    category: "Hackathon / Competition",
    title: "TRIQ - Think Twice",
    issuer: "OutThinkX",
    desc: "Awarded Certificate of Achievement in the TRIQ - Think Twice contest by OutThinkX, demonstrating quick thinking, reasoning, and exceptional knowledge under pressure.",
    imageUrl: "/certificates/outthinkx-triq.png"
  },
  {
    year: "2026",
    category: "Cloud Architecture",
    title: "AWS Cloud Practitioner Essentials",
    issuer: "Amazon Web Services (AWS)",
    desc: "Successfully completed training on AWS cloud models, security, networking, pricing, and infrastructure design for core web systems.",
    imageUrl: "/certificates/aws-practitioner.png"
  },
  {
    year: "2026",
    category: "Professional Growth",
    title: "TCS iON Career Edge - Young Professional",
    issuer: "Tata Consultancy Services (TCS)",
    desc: "Completed training on communication, soft skills, presentation skills, resume writing, group discussions, and fundamental IT and AI skills.",
    imageUrl: "/certificates/tcs-ion.png"
  },
  {
    year: "2026",
    category: "Communication",
    title: "Master Business English",
    issuer: "Udemy / Course Completion",
    desc: "Completed training on 160 essential business phrases for professional discussions, presentation delivery, executive meetings, and corporate interactions.",
    imageUrl: "/certificates/udemy-english.png"
  },
  {
    year: "2026",
    category: "Hackathon",
    title: "Elite Coders Open Source Hackathon",
    issuer: "Elite Coders",
    desc: "Successfully qualified the Pre-Assessment Round of the Open Source Hackathon 2026, demonstrating strong logical design, technical creativity, and dedication.",
    imageUrl: "/certificates/elite-coders.png"
  },
  {
    year: "2026",
    category: "Data Analytics",
    title: "GenAI Powered Data Analytics",
    issuer: "TATA Group / Forage",
    desc: "Completed a simulation model tackling real-world business challenges, leveraging GenAI alongside advanced data analysis, risk profiling, and storytelling.",
    imageUrl: "/certificates/tata-forage.png"
  },
  {
    year: "2026",
    category: "Professional Growth",
    title: "Professional Networking",
    issuer: "HP LIFE / HP Foundation",
    desc: "Completed the HP LIFE course for building meaningful professional relationships, personal branding, and leveraging digital tools to expand professional reach.",
    imageUrl: "/certificates/hp-life.png"
  },
  {
    year: "2026",
    category: "Open Source",
    title: "Innovexis Participant",
    issuer: "Innovexis",
    desc: "Awarded for active participation and dedication throughout the program, focusing on open-source ecosystems, web engineering, and collaborative development.",
    imageUrl: "/certificates/innovexis.png"
  },
  {
    year: "2026",
    category: "Artificial Intelligence",
    title: "Yuva AI for All",
    issuer: "IndiaAI & nasscom",
    desc: "Completed the Yuva AI for All program, deep-diving into AI/ML foundations, CRAFT prompt engineering, and responsible AI FAST frameworks.",
    imageUrl: "/certificates/yuva-ai.png"
  },
  {
    year: "2026",
    category: "Web Development",
    title: "CodSoft Web Dev Intern",
    issuer: "CodSoft",
    desc: "Selected for a one-month intensive Web Development internship focusing on building responsive modules, backend systems, and web projects.",
    imageUrl: "/certificates/codsoft.png"
  },
  {
    year: "2026",
    category: "Cloud Architecture",
    title: "AWS Academy Cloud Foundations",
    issuer: "Amazon Web Services (AWS)",
    desc: "Successfully completed the Academy Cloud Foundations course, gaining proficiency in AWS core services, support, and CloudFormation.",
    imageUrl: "/certificates/aws.png.png"
  },
  {
    year: "2025",
    category: "Innovation",
    title: "AICTE Participant",
    issuer: "IIC Organised",
    desc: "Active participation in high-level technical programs, driving forward-thinking technical paradigms and innovation.",
    imageUrl: "/certificates/aicte.png"
  },
  {
    year: "2024",
    category: "Professional Certificate",
    title: "Web Development Intern",
    issuer: "SkillCraft Internship",
    desc: "A hands-on, intensive month focusing on modern frontend architecture, robust UI practices, and relational database creation with MySQL.",
    imageUrl: "/certificates/skillcraft.png"
  },
  {
    year: "2023",
    category: "Hackathon",
    title: "Daksh SparkFest",
    issuer: "Collaborative Contributor",
    desc: "Contributed to rapid problem-solving and ideation within a collaborative technical team, delivering innovative solutions under pressure.",
    imageUrl: "/certificates/daksh.png"
  }
];

// Typewriter component using GSAP ScrollTrigger
function TypewriterText({ text, className }: { text: string; className?: string }) {
  const el = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!el.current) return;

    // Split into characters
    const chars = text.split('').map((char) => {
      const span = document.createElement('span');
      span.textContent = char;
      span.style.opacity = '0';
      return span;
    });

    el.current.innerHTML = '';
    chars.forEach(c => el.current!.appendChild(c));

    const ctx = gsap.context(() => {
      gsap.to(chars, {
        opacity: 1,
        stagger: 0.003,
        duration: 0.2,
        ease: 'none',
        scrollTrigger: {
          trigger: el.current,
          start: 'top 90%',
          toggleActions: 'play none none none',
        }
      });
    });

    return () => ctx.revert();
  }, [text]);

  return <span ref={el} className={className} style={{ whiteSpace: 'pre-wrap' }} />;
}

export function AchievementsSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [activeCert, setActiveCert] = useState<number | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <>
      <section
        id="achievements"
        ref={containerRef}
        className="relative w-full py-24 md:py-32 px-4 md:px-12 flex flex-col items-center justify-center bg-transparent overflow-hidden"
      >
        <div className="w-full max-w-[1200px] mx-auto z-10">

          {/* Minimalist Header */}
          <div className="flex flex-col md:flex-row items-start md:items-end justify-between mb-24 md:mb-32">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#1c2135]/40 mb-6 block">
                03 — Recognition
              </span>
              <h2 className="font-serif italic text-5xl md:text-7xl font-light text-[#1c2135] tracking-tight">
                Honors & <br/> Certificates
              </h2>
            </div>
            <p className="font-sans font-light text-sm text-[#1c2135]/60 max-w-[280px] mt-8 md:mt-0">
              A curated selection of technical milestones, hackathons, and professional growth.
            </p>
          </div>

          {/* Achievement List */}
          <div className="w-full flex flex-col border-t border-[#1c2135]/10">
            {achievements.map((item, index) => (
              <AchievementRow
                key={index}
                item={item}
                index={index}
                onClick={() => setActiveCert(index)}
              />
            ))}
          </div>

        </div>
      </section>

      {/* Certificate Modal (Portal) */}
      {mounted && createPortal(
        <AnimatePresence>
          {activeCert !== null && (
            <motion.div
              className="fixed inset-0 z-[9999] bg-black/80 backdrop-blur-md flex flex-col items-center justify-center p-4 md:p-8"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1, transition: { duration: 0.3 } }}
              exit={{ opacity: 0, transition: { duration: 0.2 } }}
            >
              <div className="absolute inset-0 cursor-pointer" onClick={() => setActiveCert(null)} />

              {achievements[activeCert] && (
                <motion.div
                  initial={{ y: 20, scale: 0.95, opacity: 0 }}
                  animate={{ y: 0, scale: 1, opacity: 1, transition: { duration: 0.4, ease: "easeOut" } }}
                  exit={{ y: 20, scale: 0.95, opacity: 0 }}
                  className="relative w-full max-w-[1000px] max-h-[90vh] bg-[#0e0e0e] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 flex flex-col z-10"
                >
                  {/* Header bar */}
                  <div className="flex items-center justify-between px-4 py-3 md:px-6 md:py-4 border-b border-white/10 bg-[#121212]">
                    <div className="flex items-center gap-4">
                      <button
                        onClick={() => setActiveCert(null)}
                        className="group flex items-center gap-2 px-3 py-1.5 md:px-4 md:py-2 rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white transition-all"
                      >
                        <ArrowLeft size={16} strokeWidth={2} className="group-hover:-translate-x-1 transition-transform" />
                        <span className="font-sans text-[10px] md:text-[11px] font-bold tracking-[0.1em] uppercase hidden sm:block">Back</span>
                      </button>
                      <div className="flex flex-col">
                        <span className="text-white font-serif italic text-base md:text-lg">{achievements[activeCert].title}</span>
                        <span className="font-mono text-[9px] md:text-[10px] uppercase tracking-widest text-white/40">{achievements[activeCert].issuer}</span>
                      </div>
                    </div>
                    <span className="font-mono text-[10px] md:text-[11px] uppercase tracking-widest text-white/30 border border-white/10 px-3 py-1 rounded-full hidden sm:block">
                      {achievements[activeCert].year}
                    </span>
                  </div>
                  {/* Image */}
                  <div className="relative flex-1 w-full h-full min-h-0 bg-black/50 p-4 md:p-8 flex items-center justify-center overflow-hidden">
                    <img
                      src={achievements[activeCert].imageUrl}
                      alt="Certificate"
                      className="w-full h-full object-contain rounded-md"
                    />
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>,
        document.body
      )}
    </>
  );
}

function AchievementRow({ 
  item, 
  index, 
  onClick
}: { 
  item: typeof achievements[0]; 
  index: number; 
  onClick: () => void;
}) {
  const rowRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Soft spring config for responsive yet organic image tracking
  const springConfig = { damping: 25, stiffness: 220, mass: 0.55 };
  const x = useSpring(mouseX, springConfig);
  const y = useSpring(mouseY, springConfig);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!rowRef.current) return;
    const rect = rowRef.current.getBoundingClientRect();
    // Position relative to the row's top-left, offset slightly
    mouseX.set(e.clientX - rect.left + 25);
    mouseY.set(e.clientY - rect.top + 20);
  };

  return (
    <motion.div
      ref={rowRef}
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1], delay: index * 0.1 }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseMove={handleMouseMove}
      style={{ zIndex: isHovered ? 50 : 1 }}
      className="group w-full py-10 md:py-14 border-b border-[#1c2135]/10 flex flex-col md:flex-row md:items-start gap-6 md:gap-12 relative" // Removed overflow-hidden to allow absolute preview card to overlay adjacent rows
    >
      {/* Hover shimmer */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-[#E84855]/[0.02] to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* Left — Year + Title */}
      <div className="flex flex-col gap-2 flex-shrink-0 md:w-[42%]">
        <span className="font-mono text-[11px] tracking-widest text-[#1c2135]/30">
          {item.year}
        </span>
        <span className="font-serif italic text-3xl md:text-5xl text-[#1c2135] group-hover:translate-x-1 transition-transform duration-700 ease-out leading-tight">
          {item.title}
        </span>
        <span className="font-mono text-[9px] uppercase tracking-[0.25em] text-[#1c2135]/40 mt-1">
          {item.category} — {item.issuer}
        </span>
      </div>

      {/* Right — Description then Button below */}
      <div className="flex flex-col gap-5 flex-1 min-w-0 pl-0 md:pl-8 md:border-l border-[#1c2135]/10">

        {/* Description — GSAP Typewriter */}
        <TypewriterText
          text={item.desc}
          className="font-mono text-[12px] md:text-[13px] leading-[1.9] text-[#1c2135]/60 block"
        />

        {/* CTA — aesthetic tag button, cleanly below description */}
        <button
          onClick={onClick}
          className="group/btn self-start flex items-center gap-2 px-4 py-2 border border-[#1c2135]/15 rounded-full bg-white/80 backdrop-blur-sm hover:bg-[#E84855] hover:border-[#E84855] transition-all duration-400 ease-out shadow-sm hover:shadow-[0_4px_20px_-4px_rgba(232,72,85,0.4)]"
        >
          <span className="text-[#E84855] group-hover/btn:text-white text-[9px] transition-colors duration-300">✦</span>
          <span className="font-serif italic text-[13px] text-[#1c2135] group-hover/btn:text-white transition-colors duration-300 leading-none">
            view certificate
          </span>
          <ArrowUpRight
            size={11}
            className="text-[#1c2135]/40 group-hover/btn:text-white group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5 transition-all duration-300"
          />
        </button>

      </div>

      {/* Floating Cursor-Following Image Preview (Absolute relative to row) */}
      <AnimatePresence>
        {isHovered && (
          <motion.div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              x,
              y,
              pointerEvents: 'none',
              zIndex: 999,
            }}
            initial={{ opacity: 0, scale: 0.8, rotate: -3 }}
            animate={{ opacity: 1, scale: 1, rotate: 2 }}
            exit={{ opacity: 0, scale: 0.8, rotate: -3 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            className="w-[280px] h-[190px] rounded-xl overflow-hidden shadow-[0_20px_50px_rgba(28,33,53,0.3)] border-4 border-[#FEF6DD] bg-[#1C2135] select-none pointer-events-none hidden md:block"
          >
            <img 
              src={item.imageUrl} 
              alt="Certificate Preview" 
              className="w-full h-full object-cover filter brightness-[1.02] contrast-[1.02]"
            />
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
