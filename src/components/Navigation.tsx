import { Home, User, Briefcase, MessageCircle, FileText } from 'lucide-react';
import { AnimatedCornerButton } from './ui/animated-corner-btn';

export function Navigation() {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50">
      <div className="flex items-center gap-3 px-5 py-3 rounded-[1.5rem] bg-[#0e0e0e]/60 backdrop-blur-2xl border border-white/[0.08] shadow-[0_20px_60px_rgba(0,0,0,0.4),inset_0_1px_0_rgba(255,255,255,0.06)]">
        
        {/* Home */}
        <AnimatedCornerButton
          variant="dark"
          className="acb-mini"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
        >
          <Home size={16} strokeWidth={1.5} />
        </AnimatedCornerButton>

        {/* Intro */}
        <AnimatedCornerButton
          variant="dark"
          className="acb-mini"
          drawerBottom="INTRO"
          onClick={() => scrollToSection('intro')}
        >
          <User size={16} strokeWidth={1.5} />
        </AnimatedCornerButton>

        {/* Work */}
        <AnimatedCornerButton
          variant="dark"
          className="acb-mini"
          drawerBottom="WORK"
          onClick={() => scrollToSection('work')}
        >
          <Briefcase size={16} strokeWidth={1.5} />
        </AnimatedCornerButton>

        {/* About */}
        <AnimatedCornerButton
          variant="dark"
          className="acb-mini"
          drawerBottom="ABOUT"
          onClick={() => scrollToSection('about')}
        >
          <MessageCircle size={16} strokeWidth={1.5} />
        </AnimatedCornerButton>

        {/* Resume */}
        <AnimatedCornerButton
          variant="dark"
          className="acb-mini"
          drawerBottom="RESUME"
          onClick={() => scrollToSection('resume')}
        >
          <FileText size={16} strokeWidth={1.5} />
        </AnimatedCornerButton>

      </div>
    </div>
  );
}
