import { useEffect, useRef } from 'react';
import { ArrowUpRight } from 'lucide-react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { AnimatedCornerButton } from "./ui/animated-corner-btn";

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    id: '01',
    title: 'Student Management',
    category: 'Node.js, MySQL, REST API',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?q=80&w=2400&auto=format&fit=crop',
    url: 'https://github.com/disha-jain-94016b333'
  },
  {
    id: '02',
    title: 'Open Weather App',
    category: 'React.js, OpenWeather API',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1601134467661-3d775b999c8b?q=80&w=2400&auto=format&fit=crop',
    url: 'https://github.com/disha-jain-94016b333'
  },
  {
    id: '03',
    title: 'SkillCraft Intern',
    category: 'Web Development',
    year: '2024',
    image: 'https://images.unsplash.com/photo-1550439062-609e1531270e?q=80&w=2560&auto=format&fit=crop',
    url: 'https://github.com/disha-jain-94016b333'
  }
];

export function WorkSection() {
  const containerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // 1. Text reveal for the section header
      gsap.from('.work-title span', {
        y: '100%',
        opacity: 0,
        duration: 1.2,
        ease: 'power4.out',
        stagger: 0.1,
        scrollTrigger: {
          trigger: '.work-header',
          start: 'top 85%',
        }
      });

      gsap.from('.work-subtitle', {
        y: 20,
        opacity: 0,
        duration: 1,
        delay: 0.2,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: '.work-header',
          start: 'top 85%',
        }
      });

      // 2. Smooth Parallax for Images
      const imgContainers = gsap.utils.toArray('.img-parallax-container');
      imgContainers.forEach((container: any) => {
        const img = container.querySelector('.parallax-img');
        
        // The image scales to 120% in CSS. We translateY it from -10% to 10%
        // to give that silky smooth window effect.
        gsap.to(img, {
          yPercent: 20,
          ease: 'none',
          scrollTrigger: {
            trigger: container,
            start: 'top bottom', // when top of container hits bottom of viewport
            end: 'bottom top',   // when bottom of container hits top of viewport
            scrub: 1.2,          // 1.2s lag for that buttery "Apple" smoothness
          }
        });
      });

      // 3. Project Text reveals
      const projectRows = gsap.utils.toArray('.project-row');
      projectRows.forEach((row: any) => {
        const textElements = row.querySelectorAll('.project-text-reveal');
        gsap.from(textElements, {
          y: 40,
          opacity: 0,
          duration: 1,
          stagger: 0.1,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: row,
            start: 'top 80%',
          }
        });
      });

    }, containerRef);

    return () => ctx.revert();
  }, []);

  return (
    <section id="work" ref={containerRef} className="relative w-full bg-background text-foreground px-4 md:px-12 py-32 z-20">
      
      {/* Header */}
      <div className="work-header max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-start md:items-end mb-24 md:mb-32">
        <h2 className="text-5xl md:text-7xl lg:text-8xl font-serif italic tracking-tight overflow-hidden">
           <span className="inline-block work-title"><span className="inline-block text-[#FF69B4]">Selected</span></span><br/>
           <span className="inline-block work-title"><span className="inline-block">Works.</span></span>
        </h2>
        <p className="work-subtitle max-w-[300px] text-foreground/50 font-sans text-sm font-light mt-8 md:mt-0 pb-3 leading-relaxed">
           A curated selection of technical projects and academic experiences engineered during my B.Tech studies.
        </p>
      </div>

      {/* Projects */}
      <div className="max-w-7xl mx-auto flex flex-col gap-32 md:gap-48">
        {projects.map((project, index) => (
          <div 
            key={project.id} 
            className={`project-row group flex flex-col ${index % 2 !== 0 ? 'md:flex-row-reverse' : 'md:flex-row'} gap-8 md:gap-16 items-center`}
          >
            
            {/* Parallax Image Container */}
            <div className="img-parallax-container relative w-full md:w-3/5 h-[50vh] md:h-[75vh] overflow-hidden rounded-2xl bg-white/5 border border-white/5">
               {/* Overlay that fades slightly on hover */}
               <div className="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors duration-700 z-10 pointer-events-none"></div>
               
               <img 
                 src={project.image} 
                 alt={project.title}
                 style={{ willChange: 'transform' }}
                 className="parallax-img absolute top-[-15%] left-0 w-full h-[130%] object-cover contrast-125 saturate-50 group-hover:saturate-100 transition-all duration-1000 ease-[cubic-bezier(0.16,1,0.3,1)] scale-[1.05] group-hover:scale-100"
                 crossOrigin="anonymous"
               />
               
               {/* Hover follow circle (CSS only approximation for simplicity, centered for now) */}
               <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-white/10 backdrop-blur-md rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-500 scale-50 group-hover:scale-100 z-20 pointer-events-none border border-white/20">
                  <span className="text-white text-xs font-mono uppercase tracking-widest">View</span>
               </div>
            </div>

            {/* Project Details */}
            <div className="w-full md:w-2/5 flex flex-col justify-center">
              <div className="flex items-center gap-4 mb-8 project-text-reveal">
                 <span className="font-mono text-xs text-[#FF69B4] border border-[#FF69B4]/30 bg-[#FF69B4]/10 px-3 py-1 rounded-full uppercase tracking-widest">{project.id}</span>
                 <span className="font-mono text-xs text-foreground/40 uppercase tracking-widest">{project.year}</span>
              </div>
              
              <h3 className="text-4xl md:text-5xl lg:text-6xl font-light tracking-tight mb-4 group-hover:text-[#8bc34a] transition-colors duration-500 project-text-reveal">
                {project.title}
              </h3>
              
              <p className="text-foreground/60 text-sm md:text-base font-light tracking-wide mb-8 project-text-reveal">
                {project.category}
              </p>
              
              <div className="w-full h-[1px] bg-white/10 mb-8 project-text-reveal"></div>
              
              <div className="project-text-reveal">
                <AnimatedCornerButton
                  drawerTop="VIEW"
                  drawerBottom="SOURCE"
                  variant="light"
                  onClick={() => window.open(project.url, '_blank')}
                >
                  Explore Project
                </AnimatedCornerButton>
              </div>
            </div>

          </div>
        ))}
      </div>

    </section>
  );
}
