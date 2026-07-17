import { ArrowUpRight, Database, Cloud, Code, Trophy, Shield, Cpu, Wifi } from 'lucide-react';
import CardSwap, { Card } from './ui/CardSwap';

const projects = [
  {
    title: "LeakMap AI",
    type: "Global South AI Safety Hackathon",
    stack: ["AI Governance", "Prompt Analysis", "Privacy Engine", "Risk Mapping"],
    details: [
      "Developed LeakMap AI, an AI governance platform, at the Global South AI Safety Hackathon organized by Secure AI Futures Lab (SAFL) at IIT Delhi.",
      "Designed a real-time prompt risk analysis engine that identifies and redacts sensitive parameters before they hit public LLM endpoints.",
      "Engineered an interactive exposure mapping visualization that maps subprocessor networks and compliance data flow paths."
    ],
    imageUrl: "/projects/leakmap.png",
    icon: Shield
  },
  {
    title: "AgentForge Workbench",
    type: "IronLabs AI Hackathon",
    stack: ["AI Optimization", "Agentic Workflows", "Enterprise Benchmarking", "Next.js"],
    details: [
      "Built an Enterprise AI Workbench from scratch at the AIC Delhi x IronLabs AI Hackathon 2026, competing in the highly technical AI Optimization Track (AIOPL).",
      "Engineered a system to benchmark and reduce LLM hallucinations, ensuring reliability and structural compliance for automated corporate agents.",
      "Developed an agent optimization pipeline designed to run complex relational workflows under strict enterprise rules."
    ],
    imageUrl: "/projects/agentforge.png",
    icon: Cpu
  },
  {
    title: "ResQMesh",
    type: "Hack-The-Den Hackathon",
    stack: ["Mesh Networks", "P2P Protocols", "LoRa Simulation", "Decentralized Infrastructure"],
    details: [
      "Designed and built ResQMesh for Hack-The-Den 2026, selecting as a Top 40 project out of 200+ submissions in an offline hackathon sprint at Coding Blocks.",
      "Created a decentralized, offline-first emergency communication system that operates entirely without cellular towers or internet access.",
      "Leveraged peer-to-peer protocols including Wi-Fi Direct and Bluetooth Low Energy along with Heltec V3 LoRa hardware simulations to enable mesh communication during disasters."
    ],
    imageUrl: "/projects/resqmesh.png",
    icon: Wifi
  },
  {
    title: "Student Management System",
    type: "Full-Stack Architecture",
    stack: ["Node.js", "MySQL", "React", "HTML/CSS"],
    details: [
      "Developed a robust full-stack ecosystem to streamline academic records for over 500+ students, focusing on high-performance database queries and data integrity.",
      "Architected a scalable backend with Node.js and MySQL, implementing secure RESTful endpoints for complex administrative CRUD operations.",
      "Engineered a pixel-perfect, responsive dashboard using React, ensuring a seamless user experience across mobile and desktop environments."
    ],
    imageUrl: "/projects/student_mgmt.png",
    icon: Database
  },
  {
    title: "Open Weather App",
    type: "React API Integration",
    stack: ["React.js", "OpenWeather API", "Axios", "Framer Motion"],
    details: [
      "Built a high-fidelity weather visualization tool that delivers real-time meteorological data with sub-second latency via the OpenWeather API.",
      "Implemented advanced asynchronous data fetching patterns and state management to handle complex dynamic weather conditions.",
      "Designed an immersive, glassmorphic UI with reactive animations that respond to live environmental shifts."
    ],
    imageUrl: "/projects/weather_app.png",
    icon: Cloud
  },
  {
    title: "SkillCraft Modules",
    type: "Internship Development",
    stack: ["HTML5", "CSS3", "JavaScript", "MySQL Architecture"],
    details: [
      "Spearheaded the development of responsive module components for a large-scale learning platform during an intensive technical internship.",
      "Collaborated on building optimized database schemas in MySQL, focusing on efficient data retrieval and relational mapping.",
      "Adhered to industry-standard UI/UX principles, delivering high-performance web pages with modular and maintainable codebases."
    ],
    imageUrl: "/projects/skillcraft.png",
    icon: Code
  },
  {
    title: "Daksh SparkFest",
    type: "Hackathon Sprint",
    stack: ["Innovation", "Rapid Prototyping", "Team Collaboration"],
    details: [
      "Secured a top-tier position in the Daksh SparkFest hackathon, demonstrating rapid prototyping skills under tight 24-hour constraints.",
      "Contributed to the end-to-end design and logic of a tech-driven solution aimed at solving real-world institutional challenges.",
      "Worked closely with cross-functional teams to integrate complex concepts into a functional, presentable MVP."
    ],
    imageUrl: "/projects/hackathon.png",
    icon: Trophy
  }
];

export function ProjectsSection() {
  return (
    <section 
      id="work" 
      className="relative w-full min-h-screen bg-[#111013] z-10 py-24 md:py-32"
    >
      <div className="max-w-7xl mx-auto px-6 md:px-12">
        {/* Header Panel */}
        <div className="mb-20 md:mb-32 flex flex-col justify-center">
          <span className="font-mono text-[10px] uppercase tracking-[0.4em] text-[#FAF8F5]/40 mb-6 block">
            04 — Selected Work
          </span>
          <h2 className="font-serif italic text-6xl md:text-[7rem] font-light text-[#FAF8F5] tracking-tight leading-[1.1]">
            Hackathons &<br/> Applications
          </h2>
          <div className="w-16 h-[1px] bg-[#E84855] my-10"></div>
          <p className="font-sans font-light text-base md:text-lg text-[#FAF8F5]/60 max-w-sm leading-relaxed">
            A curated selection of technical milestones, intensive hackathons, and robust software engineering growth. Scroll to stack and swap cards.
          </p>
        </div>

        {/* Project Cards Stacking Container using CardSwap */}
        <div className="relative w-full flex justify-center items-center py-20 overflow-visible min-h-[600px] md:min-h-[700px]">
          <CardSwap
            width={850}
            height={480}
            cardDistance={40}
            verticalDistance={45}
            delay={4000}
            pauseOnHover={true}
            scrollTriggered={true}
          >
            {projects.map((item, index) => {
              const IconComponent = item.icon;
              const number = String(index + 1).padStart(2, '0');
              return (
                <Card key={index} className="shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 bg-[#18171B] rounded-[24px] overflow-hidden group">
                  <div className="relative w-full h-full flex flex-row items-center justify-between py-6 px-10">
                    {/* Giant Floating Ambient Number */}
                    <div className="absolute -left-5 -top-5 md:-left-8 md:-top-8 z-0 select-none opacity-5 group-hover:opacity-10 transition-opacity duration-1000 pointer-events-none">
                      <span className="font-serif italic text-[12rem] md:text-[14rem] text-[#FAF8F5] font-light leading-none tracking-tighter">
                        {number}
                      </span>
                    </div>

                    {/* Left Side: Content Block */}
                    <div className="relative z-10 w-[48%] border-l border-white/10 group-hover:border-[#E84855] pl-6 h-full flex flex-col justify-center transition-colors duration-700">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="text-[#FAF8F5]/40 group-hover:text-[#E84855] transition-colors duration-700">
                          <IconComponent size={20} strokeWidth={1.5} />
                        </div>
                        <span className="font-mono text-[9px] tracking-[0.2em] uppercase text-[#FAF8F5]/60 font-medium">
                          {item.type}
                        </span>
                      </div>
                      
                      <h3 className="font-serif italic font-light text-3xl md:text-4xl text-[#FAF8F5] tracking-tight leading-[1.1] mb-4 group-hover:text-[#E84855] transition-colors duration-700">
                        {item.title}
                      </h3>

                      <div className="mb-4">
                        <p className="font-sans font-light text-xs md:text-sm text-[#FAF8F5]/85 leading-relaxed mb-4">
                          {item.details[0]}
                        </p>
                        <div className="space-y-2 hidden md:block">
                          {item.details.slice(1).map((detail: string, idx: number) => (
                            <div key={idx} className="flex items-start gap-3">
                              <div className="w-1 h-1 rounded-full bg-white/20 mt-1.5 shrink-0" />
                              <p className="font-sans font-light text-[11px] text-[#FAF8F5]/60 leading-relaxed">
                                {detail}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-x-4 gap-y-2 mt-2">
                        {item.stack.map((tech: string, i: number) => (
                          <span key={i} className="font-mono text-[8px] text-[#FAF8F5]/40 font-bold tracking-[0.2em] uppercase">
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Right Side: Image */}
                    <div className="relative w-[48%] h-[85%] rounded-2xl overflow-hidden shadow-lg border border-white/5 bg-[#18171B]">
                      <img 
                        src={item.imageUrl} 
                        alt={item.title}
                        className="w-full h-full object-cover transform group-hover:scale-102 transition-transform duration-1000 ease-out"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                      
                      {/* Floating Arrow CTA */}
                      <div className="absolute -right-3 -bottom-3 w-12 h-12 rounded-full bg-[#18171B] border border-white/10 shadow-2xl flex items-center justify-center text-[#FAF8F5] group-hover:bg-[#E84855] group-hover:text-white transition-all duration-500 transform hover:scale-105 z-20">
                        <ArrowUpRight size={18} strokeWidth={1.5} />
                      </div>
                    </div>
                  </div>
                </Card>
              );
            })}
          </CardSwap>
        </div>
      </div>
    </section>
  );
}
