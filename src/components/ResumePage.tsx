import React, { useState, useEffect } from 'react';
import { cn } from "../lib/utils";
import { motion, useScroll, useTransform, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Download, Globe, Github, Linkedin, ArrowUpRight, Eye, FileText, Quote } from 'lucide-react';
import { AnimatedCornerButton } from "./ui/animated-corner-btn";
import { Footer } from './Footer';
import { CVViewer } from './CVViewer';
import { CloudDivider } from './ui/CloudDivider';
import { ArchitecturalGrid } from "./ui/ArchitecturalGrid";
import { HandDrawnDoodle } from "./ui/HandDrawnDoodle";

const ResumeSection = ({ title, children, number, showQuote }: { title: string; children: React.ReactNode; number: string; showQuote?: boolean }) => (
  <motion.div 
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] as const }}
    className="mb-24 last:mb-0 relative"
  >
    {showQuote && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.2 }}
        className="absolute -top-16 -left-12 pointer-events-none select-none"
      >
        <span className="font-serif italic text-[15rem] leading-none text-[#E58B88]">“</span>
      </motion.div>
    )}
    
    <div className="flex items-baseline gap-4 mb-8 border-b border-black/10 pb-4">
      <span className="font-mono text-[10px] text-black/40">{number}</span>
      <h2 className="font-heading-bold text-4xl uppercase tracking-tight text-black">{title}</h2>
    </div>
    <div className="relative z-10">
      {children}
    </div>

    {showQuote && (
      <motion.div 
        initial={{ opacity: 0, scale: 0.8 }}
        whileInView={{ opacity: 0.1, scale: 1 }}
        transition={{ duration: 1.2, delay: 0.2 }}
        className="absolute -bottom-24 -right-8 pointer-events-none select-none"
      >
        <span className="font-serif italic text-[15rem] leading-none text-[#E58B88]">”</span>
      </motion.div>
    )}
  </motion.div>
);

const ResumeItem = ({ title, subtitle, date, description }: { title: string; subtitle: string; date: string; description?: string }) => (
  <div className="mb-10 group">
    <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
      <h3 className="text-xl font-bold text-black group-hover:text-[#E58B88] transition-colors duration-300">{title}</h3>
      <span className="font-mono text-[10px] text-black/40 uppercase tracking-widest">{date}</span>
    </div>
    <p className="font-serif italic text-black/60 text-lg mb-3">{subtitle}</p>
    {description && <p className="text-black/70 font-light leading-relaxed max-w-2xl">{description}</p>}
  </div>
);

interface ResumePageProps {
  onBack: (e: React.MouseEvent) => void;
}

export function ResumePage({ onBack }: ResumePageProps) {
    const [isCVViewerOpen, setIsCVViewerOpen] = useState(false);
    const [cvCoords, setCvCoords] = useState({ x: 0, y: 0 });

    useEffect(() => {
      window.scrollTo(0, 0);
    }, []);

    const { scrollY } = useScroll();
    const photoScale = useTransform(scrollY, [0, 500], [1, 1.05]);
    const photoY = useTransform(scrollY, [0, 500], [0, 30]);
    const textOpacity = useTransform(scrollY, [0, 300], [1, 0]);
    const headerBlur = useTransform(scrollY, [0, 100], ["blur(0px)", "blur(10px)"]);

    const skills = [
      "React.js", "Node.js", "TypeScript", "MySQL", 
      "HTML/CSS", "Three.js", "GSAP", "TailwindCSS",
      "Next.js", "Python", "Java", "C++",
      "Artificial Intelligence (AI)", "Prompt Engineering",
      "Amazon Web Services (AWS)", "Data Structures (DSA)"
    ];

    const journeyMilestones = [
      {
        year: "2026",
        title: "AI Integration & Cloud Architecture",
        company: "Microsoft AI Skills Fest & AWS Practitioner",
        desc: "Deepened expertise in Generative AI systems, Azure AI services, and AWS cloud models. Architected secure, resilient cloud infrastructure and integrated LLM workflows.",
        skills: ["Azure AI", "AWS Cloud", "Prompt Engineering", "System Design"]
      },
      {
        year: "2026",
        title: "Hackathons & Open Source",
        company: "Elite Coders & TRIQ by OutThinkX",
        desc: "Qualified for the Open Source Hackathon and achieved high ranking in the TRIQ contest. Solved real-time algorithmic challenges and built open-source tools under tight constraints.",
        skills: ["Algorithms", "Next.js", "GSAP", "Problem Solving"]
      },
      {
        year: "2026",
        title: "Full-Stack Web Engineering",
        company: "CodSoft Web Internship",
        desc: "Built high-performance full-stack web modules, transitioning codebase items to TypeScript and structuring complex interactive interfaces.",
        skills: ["TypeScript", "React.js", "Node.js", "TailwindCSS"]
      },
      {
        year: "2025",
        title: "Innovation & Design Thinking",
        company: "AICTE / Institution's Innovation Council",
        desc: "Explored technical entrepreneurship and collaborative prototyping. Worked on rapid ideation and validation frameworks.",
        skills: ["Design Thinking", "Entrepreneurship", "Prototyping"]
      },
      {
        year: "2024",
        title: "Entering Web Systems",
        company: "SkillCraft Technology Web Internship",
        desc: "First professional internship experience. Engineered front-end architectures and optimized data-fetching query sets with SQL databases.",
        skills: ["React.js", "MySQL", "JavaScript", "HTML/CSS"]
      },
      {
        year: "2024 — Present",
        title: "B.Tech Computer Science & IT",
        company: "G.L. Bajaj Institute of Technology & Management",
        desc: "Acquiring deep knowledge in system designs, networking layers, database systems, and data structures.",
        skills: ["C++", "Data Structures", "Java", "Computer Networks"]
      }
    ];

    return (
      <div className="bg-transparent min-h-screen text-black selection:bg-[#E58B88] selection:text-white relative">
        
        {/* Global Interactive Blueprint Grid */}
        <ArchitecturalGrid className="fixed inset-0 z-[-50]" />
        
        {/* Grain Texture Overlay (Optimized) */}
        <div className="fixed inset-0 pointer-events-none opacity-[0.05] z-[200]" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/stardust.png")' }} />

        {/* ─── Navigation ─── */}
        <motion.div 
            style={{ filter: headerBlur }}
            className="fixed top-8 left-8 z-[110]"
        >
          <AnimatedCornerButton
            onClick={(e) => onBack(e)}
            drawerTop="GO"
            drawerBottom="BACK"
            variant="light"
          >
            Return Home
          </AnimatedCornerButton>
        </motion.div>

        {/* Foreground Content Wrapper */}
        <div className="relative z-20 w-full bg-transparent shadow-[0_30px_80px_rgba(0,0,0,0.15)]">
          {/* ─── Hero Section ─── */}
          <section className="relative h-[110vh] w-full flex flex-col items-center justify-center overflow-hidden px-8">
            {/* Background Typography */}
            <motion.h1 
              initial={{ opacity: 0, y: 100, rotate: -2 }}
              animate={{ opacity: 1, y: 0, rotate: 0 }}
              transition={{ duration: 1.2, ease: [0.23, 1, 0.32, 1] }}
              className="absolute top-12 left-1/2 -translate-x-1/2 text-[22vw] font-heading-bold uppercase leading-none text-black/[0.02] whitespace-nowrap pointer-events-none select-none tracking-tighter"
            >
              DISHA JAIN
            </motion.h1>

            <div className="relative z-10 w-full max-w-7xl flex flex-col items-center">
                {/* Top Metadata */}
                <motion.div 
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 1, delay: 1 }}
                    className="flex justify-between w-full max-w-lg mb-12 font-mono text-[9px] uppercase tracking-[0.4em] text-black/30 px-4"
                >
                    <div className="flex items-center gap-3">
                        <div className="w-1.5 h-1.5 rounded-full bg-[#E58B88] animate-pulse" />
                        <span>Software Engineer</span>
                    </div>
                    <span>EST. 2025</span>
                </motion.div>

                {/* Masterpiece Photo Layout */}
                <div className="relative flex items-center justify-center w-full">
                    
                    {/* Left Typography */}
                    <motion.div 
                        initial={{ x: -100, opacity: 0, skewY: 5 }}
                        animate={{ x: 0, opacity: 1, skewY: 0 }}
                        transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden lg:block absolute left-[5%] xl:left-[10%] z-20"
                    >
                        <h2 className="font-heading-bold text-[8rem] xl:text-[10rem] uppercase leading-none tracking-tighter text-black mix-blend-difference">A FULL</h2>
                    </motion.div>

                    {/* Centered Photo with Organic Masking */}
                    <div className="relative group">
                        {/* Decorative Frames */}
                        <motion.div 
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.5, delay: 0.2 }}
                            className="absolute -inset-4 border border-black/5 rounded-full z-0"
                        />
                        <motion.div 
                            initial={{ opacity: 0, scale: 1.1 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 1.8, delay: 0.4 }}
                            className="absolute -inset-8 border border-black/[0.03] rounded-full z-0"
                        />

                        {/* The Image Container */}
                        <motion.div 
                            style={{ scale: photoScale, y: photoY }}
                            className="relative w-72 h-[450px] lg:w-96 lg:h-[550px] rounded-[10rem] overflow-hidden shadow-[0_40px_80px_rgba(0,0,0,0.15)] border-[12px] border-white z-10"
                        >
                            <motion.img 
                                src="/disha-colorful.jpg" 
                                alt="Disha Jain" 
                                initial={{ scale: 1.2, filter: "sepia(0.5) contrast(1.2) brightness(0.8)" }}
                                animate={{ scale: 1, filter: "sepia(0.1) contrast(1.05) brightness(1.02)" }}
                                transition={{ duration: 2, ease: [0.16, 1, 0.3, 1] }}
                                className="w-full h-full object-cover object-center transition-transform duration-[2s] group-hover:scale-105"
                            />
                            
                            {/* Organic Masks & Fades */}
                            <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-[#F5F2ED]/40 pointer-events-none" />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-40" />
                            
                            {/* Inner Shine */}
                            <div className="absolute inset-0 bg-gradient-to-tr from-white/10 to-transparent pointer-events-none" />
                        </motion.div>

                        {/* Floating Signature/Details */}
                        <motion.div 
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: 1.4, duration: 1 }}
                            className="absolute -right-12 bottom-20 z-30 hidden md:block"
                        >
                            <p className="font-serif italic text-2xl text-[#E58B88] tracking-tight">Disha Jain</p>
                            <div className="h-px w-20 bg-[#E58B88] mt-2 opacity-40" />
                        </motion.div>
                    </div>

                    {/* Right Typography */}
                    <motion.div 
                        initial={{ x: 100, opacity: 0, skewY: -5 }}
                        animate={{ x: 0, opacity: 1, skewY: 0 }}
                        transition={{ duration: 1.4, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
                        className="hidden lg:block absolute right-[5%] xl:right-[10%] z-20 text-right"
                    >
                        <h2 className="font-heading-bold text-[8rem] xl:text-[10rem] uppercase leading-none tracking-tighter text-black">STACK</h2>
                    </motion.div>
                </div>

                {/* Bottom Heading / Mobile Text */}
                <motion.div 
                    initial={{ y: 50, opacity: 0 }}
                    animate={{ y: 0, opacity: 1 }}
                    transition={{ duration: 1.2, delay: 0.6 }}
                    className="flex flex-col items-center mt-12 md:mt-20"
                >
                   <h2 className="font-heading-bold text-6xl md:text-[8rem] xl:text-[10rem] uppercase leading-none tracking-tighter">ENGINEER</h2>
                   <motion.p 
                     initial={{ opacity: 0 }}
                     animate={{ opacity: 0.5 }}
                     transition={{ delay: 1.2 }}
                     className="mt-4 font-serif italic text-lg md:text-xl text-black/60"
                   >
                     Architecting Digital Excellence
                   </motion.p>
                </motion.div>
            </div>

            {/* Scroll Indicator */}
            <motion.div 
                style={{ opacity: textOpacity }}
                className="absolute bottom-12 flex flex-col items-center gap-4"
            >
                <div className="w-8 h-12 border border-black/10 rounded-full flex justify-center pt-2">
                    <motion.div 
                        animate={{ y: [0, 12, 0] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-1 h-1 bg-black/40 rounded-full"
                    />
                </div>
                <span className="font-mono text-[8px] uppercase tracking-[0.4em] text-black/30">Explore Resume</span>
            </motion.div>

            {/* Static "View Full CV" Button (Only in top Hero section) */}
            <div className="absolute bottom-10 right-10 z-30">
                <button 
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      setCvCoords({ x: rect.left + rect.width / 2, y: rect.top + rect.height / 2 });
                      setIsCVViewerOpen(true);
                    }}
                    data-cursor="VIEW"
                    className="group relative"
                >
                    {/* Button Glow Effect */}
                    <div className="absolute inset-0 bg-white blur-2xl opacity-0 group-hover:opacity-30 transition-opacity duration-700 rounded-full" />
                    
                    <div className="relative flex items-center gap-6 pl-8 pr-3 py-3 bg-black text-white rounded-full overflow-hidden border border-white/20 shadow-[0_30px_60px_rgba(0,0,0,0.4)] transition-all duration-700 group-hover:scale-[1.05] group-hover:border-white group-hover:shadow-[0_40px_80px_rgba(255,255,255,0.2)]">
                        
                        {/* Elegant White Background Reveal */}
                        <div className="absolute inset-0 bg-white translate-y-[100%] group-hover:translate-y-0 transition-transform duration-500 ease-[cubic-bezier(0.16,1,0.3,1)] pointer-events-none" />

                        {/* Content Overlay */}
                        <span className="relative z-10 font-mono text-[11px] uppercase tracking-[0.4em] font-bold text-white group-hover:text-black transition-colors duration-500 delay-100">
                            View Full CV
                        </span>
                        
                        <div className="relative z-10 w-12 h-12 rounded-full bg-white/10 group-hover:bg-black flex items-center justify-center transition-all duration-500 group-hover:rotate-45">
                            <ArrowUpRight size={20} className="text-white" />
                        </div>

                        {/* Inner Shine Effect */}
                        <div className="absolute top-0 left-[-100%] w-1/2 h-full bg-gradient-to-r from-transparent via-white/40 to-transparent skew-x-[30deg] group-hover:left-[150%] transition-all duration-[1.5s] ease-in-out z-20 pointer-events-none" />
                    </div>
                </button>
            </div>
        </section>

        {/* ─── Resume Content ─── */}
        <section className="relative z-20 w-full max-w-4xl mx-auto px-8 pb-48">
            {/* Introduction */}
            <ResumeSection title="Philosophy" number="01" showQuote>
                <p className="text-3xl md:text-5xl font-serif italic font-light leading-[1.2] text-black relative z-10">
                    I believe in building <span className="text-[#E58B88]">digital experiences</span> that aren't just functional, but architectural. My focus lies at the intersection of <span className="font-sans not-italic font-bold tracking-tight">high-performance engineering</span> and elegant visual storytelling.
                </p>
            </ResumeSection>

            {/* Education */}
            <ResumeSection title="Education" number="02">
                <ResumeItem 
                  title="B.Tech Computer Science & IT"
                  subtitle="G.L. Bajaj Institute of Technology and Management"
                  date="2024 — 2028"
                  description="Pursuing undergraduate studies with excellence, maintaining a strong focus on algorithm design, system architecture, and human-computer interaction."
                />
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12 opacity-60">
                    <div className="p-6 border border-black/5 rounded-xl bg-white/40">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#E58B88]">2024</span>
                        <h4 className="font-bold text-sm mt-1">Intermediate (80%)</h4>
                        <p className="text-[10px] mt-1 italic">Babu Bodhraj Convent School — CBSE</p>
                    </div>
                    <div className="p-6 border border-black/5 rounded-xl bg-white/40">
                        <span className="font-mono text-[9px] uppercase tracking-widest text-[#E58B88]">2022</span>
                        <h4 className="font-bold text-sm mt-1">High School (87%)</h4>
                        <p className="text-[10px] mt-1 italic">Babu Bodhraj Convent School — CBSE</p>
                    </div>
                </div>
            </ResumeSection>

            {/* Expertise */}
            <ResumeSection title="Expertise" number="03">
                <div className="grid grid-cols-2 md:grid-cols-3 gap-x-12 gap-y-6">
                  {skills.map((skill, i) => (
                    <motion.div 
                        key={skill}
                        initial={{ opacity: 0, x: -10 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.05 }}
                        viewport={{ once: true }}
                        className="flex items-center gap-3 group cursor-default"
                    >
                      <div className="w-1.5 h-[1px] bg-[#E58B88] group-hover:w-4 transition-all" />
                      <span className="font-mono text-[11px] uppercase tracking-wider text-black/50 group-hover:text-black transition-colors">{skill}</span>
                    </motion.div>
                  ))}
                </div>
            </ResumeSection>

            {/* Experience & Projects Preview */}
            <ResumeSection title="Snapshot" number="04">
                <ResumeItem 
                    title="Web Development Intern"
                    subtitle="SkillCraft Technology"
                    date="1 Month"
                    description="Engineered responsive frontend modules and optimized database interactions using React and Node.js."
                />
            </ResumeSection>

            {/* Journey Timeline */}
            <ResumeSection title="Journey" number="05">
                <div className="relative pl-6 md:pl-8 border-l border-dashed border-black/20 space-y-16 py-4">
                    {journeyMilestones.map((milestone, idx) => (
                        <motion.div 
                            key={idx}
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.6, delay: idx * 0.1 }}
                            className="relative group"
                        >
                            {/* Milestone Marker Dot */}
                            <div className="absolute -left-[31px] md:-left-[39px] top-1.5 w-4 h-4 rounded-full bg-white border-2 border-black/20 flex items-center justify-center group-hover:border-[#E58B88] group-hover:scale-125 transition-all duration-300">
                                <div className="w-1.5 h-1.5 rounded-full bg-[#E58B88] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                            </div>
                            
                            <div className="flex flex-col md:flex-row md:items-baseline justify-between gap-2 mb-2">
                                <div className="flex flex-col">
                                    <h3 className="text-xl font-bold text-black group-hover:text-[#E58B88] transition-colors duration-300">
                                        {milestone.title}
                                    </h3>
                                    <span className="font-serif italic text-black/50 text-base">{milestone.company}</span>
                                </div>
                                <span className="font-mono text-[9px] text-[#E58B88] font-bold uppercase tracking-widest bg-[#E58B88]/10 px-3 py-1 rounded-full shrink-0">
                                    {milestone.year}
                                </span>
                            </div>
                            
                            <p className="text-black/70 font-light leading-relaxed max-w-2xl mt-3 text-sm">
                                {milestone.desc}
                            </p>
                            
                            {/* Skills tags unlocked */}
                            <div className="flex flex-wrap gap-2 mt-4">
                                {milestone.skills.map((skill) => (
                                    <span 
                                        key={skill} 
                                        className="font-mono text-[9px] uppercase tracking-wider bg-black/5 text-black/60 px-2.5 py-1 rounded-md border border-black/[0.03] hover:bg-[#E58B88]/10 hover:text-[#E58B88] hover:border-[#E58B88]/20 transition-all duration-300"
                                    >
                                        {skill}
                                    </span>
                                ))}
                            </div>
                        </motion.div>
                    ))}
                </div>
            </ResumeSection>

            {/* Connect - Stacking Cards Reveal */}
            <ResumeSection title="Connect" number="06">
                <div className="flex flex-col gap-12 pb-32">
                    {/* Card 1: Email (Sticky Stacking) */}
                    <motion.div 
                        initial={{ opacity: 0, y: 50 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true, margin: "-100px" }}
                        className="sticky top-40"
                    >
                        <a 
                            href="mailto:Jain.disha2712@gmail.com" 
                            className="group p-10 bg-[#FAF8F5]/30 hover:bg-[#FAF8F5]/90 backdrop-blur-sm border-2 border-black/10 rounded-[2.5rem] hover:shadow-[0_20px_50px_rgba(229,139,136,0.1)] hover:border-[#E58B88]/60 hover:-translate-y-1 transition-all duration-700 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-sm"
                        >
                            {/* Tech grid hover shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#FEF6DD]/20 via-transparent to-[#E58B88]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                                 style={{
                                   backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                                   backgroundSize: '16px 16px'
                                 }} 
                            />

                            {/* Drafting border */}
                            <div className="absolute inset-3 border border-dashed border-[#1c2135]/5 rounded-[2.2rem] pointer-events-none" />

                            {/* CAD labels */}
                            <span className="absolute top-6 right-8 font-mono text-[8px] uppercase tracking-widest text-[#1c2135]/30 select-none pointer-events-none">SYS_REF: [06-EMAIL]</span>
                            <span className="absolute bottom-6 left-8 font-mono text-[8px] uppercase tracking-widest text-[#1c2135]/30 select-none pointer-events-none">COORD: [X:42, Y:128]</span>

                            <div className="absolute top-0 right-0 p-8 opacity-[0.015] group-hover:opacity-[0.04] transition-opacity">
                                <Mail size={120} />
                            </div>
                            
                            <div className="flex flex-col gap-4 relative z-10">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-[#1c2135]/5 group-hover:bg-[#E58B88]/10 flex items-center justify-center relative transition-colors duration-500">
                                        <Mail className="text-[#1c2135] group-hover:text-[#E58B88] relative z-10 transition-colors duration-500" size={20} />
                                        <div className="absolute inset-[-4px] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 pointer-events-none">
                                            <HandDrawnDoodle type="circle" color="#E58B88" />
                                        </div>
                                    </div>
                                    <span className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40">Direct Contact</span>
                                </div>
                                <div className="relative">
                                    <h3 className="text-2xl md:text-4xl font-bold tracking-tight text-[#1c2135]">Jain.disha2712@gmail.com</h3>
                                    <div className="absolute -bottom-4 left-0 w-full h-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none">
                                        <HandDrawnDoodle type="underline" color="#E58B88" />
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-center gap-4 relative z-10 pr-4">
                                <span className="font-mono text-[9px] uppercase tracking-[0.4em] opacity-0 group-hover:opacity-40 transition-opacity">Send Message</span>
                                <div className="w-16 h-16 rounded-full bg-black text-white flex items-center justify-center transition-all duration-700 group-hover:rotate-45 relative">
                                    <ArrowUpRight size={24} />
                                </div>
                            </div>
                        </a>
                    </motion.div>

                    {/* Card 2 & 3: Socials (Stacked together) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sticky top-52">
                        <motion.a 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            href="https://linkedin.com/in/disha-jain-94016b333" target="_blank" rel="noopener noreferrer" 
                            className="group p-8 bg-[#FAF8F5]/30 hover:bg-[#FAF8F5]/90 backdrop-blur-sm border-2 border-black/10 rounded-[2rem] hover:shadow-[0_20px_50px_rgba(229,139,136,0.1)] hover:border-[#E58B88]/60 hover:-translate-y-1.5 transition-all duration-700 flex flex-col gap-8 shadow-sm relative overflow-hidden"
                        >
                            {/* Tech grid hover shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E58B88]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                                 style={{
                                   backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                                   backgroundSize: '16px 16px'
                                 }} 
                            />

                            {/* Drafting border */}
                            <div className="absolute inset-3 border border-dashed border-[#1c2135]/5 rounded-[1.7rem] pointer-events-none" />

                            {/* CAD labels */}
                            <span className="absolute top-5 right-6 font-mono text-[8px] uppercase tracking-widest text-[#1c2135]/30 select-none pointer-events-none">SYS_REF: [06-LNKD]</span>

                            <div className="flex items-center justify-between relative z-10">
                                <div className="w-12 h-12 rounded-full bg-[#1c2135]/5 group-hover:bg-[#E58B88]/10 flex items-center justify-center relative transition-colors duration-500">
                                    <Linkedin size={24} className="text-[#1c2135] group-hover:text-[#E58B88] relative z-10 transition-colors duration-500" />
                                    <div className="absolute inset-[-4px] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 pointer-events-none">
                                        <HandDrawnDoodle type="circle" color="#E58B88" />
                                    </div>
                                </div>
                                <ArrowUpRight size={20} className="text-black/20 group-hover:text-[#E58B88] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                            </div>
                            <div className="relative z-10">
                                <span className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40">LinkedIn</span>
                                <h4 className="text-xl font-bold mt-1 text-[#1c2135]">Professional Profile</h4>
                            </div>
                        </motion.a>

                        <motion.a 
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            href="https://github.com/dishajain27-ai" target="_blank" rel="noopener noreferrer" 
                            className="group p-8 bg-[#FAF8F5]/30 hover:bg-[#FAF8F5]/90 backdrop-blur-sm border-2 border-black/10 rounded-[2rem] hover:shadow-[0_20px_50px_rgba(229,139,136,0.1)] hover:border-[#E58B88]/60 hover:-translate-y-1.5 transition-all duration-700 flex flex-col gap-8 shadow-sm relative overflow-hidden"
                        >
                            {/* Tech grid hover shimmer */}
                            <div className="absolute inset-0 bg-gradient-to-br from-[#E58B88]/5 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                            <div className="absolute inset-0 z-0 opacity-0 group-hover:opacity-[0.03] transition-opacity duration-500 pointer-events-none"
                                 style={{
                                   backgroundImage: 'radial-gradient(#000 1px, transparent 1px)',
                                   backgroundSize: '16px 16px'
                                 }} 
                            />

                            {/* Drafting border */}
                            <div className="absolute inset-3 border border-dashed border-[#1c2135]/5 rounded-[1.7rem] pointer-events-none" />

                            {/* CAD labels */}
                            <span className="absolute top-5 right-6 font-mono text-[8px] uppercase tracking-widest text-[#1c2135]/30 select-none pointer-events-none">SYS_REF: [06-GTHB]</span>

                            <div className="flex items-center justify-between relative z-10">
                                <div className="w-12 h-12 rounded-full bg-[#1c2135]/5 group-hover:bg-[#E58B88]/10 flex items-center justify-center relative transition-colors duration-500">
                                    <Github size={24} className="text-[#1c2135] group-hover:text-[#E58B88] relative z-10 transition-colors duration-500" />
                                    <div className="absolute inset-[-4px] opacity-0 group-hover:opacity-100 transition-all duration-500 scale-90 group-hover:scale-100 pointer-events-none">
                                        <HandDrawnDoodle type="circle" color="#E58B88" />
                                    </div>
                                </div>
                                <ArrowUpRight size={20} className="text-black/20 group-hover:text-[#E58B88] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300" />
                            </div>
                            <div className="relative z-10">
                                <span className="font-mono text-[9px] uppercase tracking-[0.3em] opacity-40">GitHub</span>
                                <h4 className="text-xl font-bold mt-1 text-[#1c2135]">Code Repository</h4>
                            </div>
                        </motion.a>
                    </div>
                </div>
            </ResumeSection>
            
        </section>

        <CloudDivider bgColor="#F5F2ED" />
        </div>

        {/* Premium Integrated Footer */}
        <Footer />

        {/* Floating Background Elements (Optimized) */}
        <div className="fixed top-1/4 -left-40 w-[500px] h-[500px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(229,139,136,0.06) 0%, transparent 70%)', transform: 'translateZ(0)' }} />
        <div className="fixed bottom-1/4 -right-40 w-[600px] h-[600px] rounded-full pointer-events-none" style={{ background: 'radial-gradient(circle, rgba(178,190,226,0.06) 0%, transparent 70%)', transform: 'translateZ(0)' }} />

        {/* Masterpiece CV Viewer Overlay */}
        <CVViewer 
          isActive={isCVViewerOpen} 
          coords={cvCoords} 
          onClose={() => setIsCVViewerOpen(false)} 
        />
      </div>
    );
}

ResumePage.displayName = "ResumePage";
