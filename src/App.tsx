import { useState } from "react";
import { Hero } from "./components/Hero";
import { HomeIntro } from "./components/HomeIntro";
import { IntroSection } from "./components/IntroSection";
import { ProjectsSection } from "./components/ProjectsSection";
import { AchievementsSection } from "./components/AchievementsSection";
import { SmoothScroll } from "./components/SmoothScroll";
import { motion, AnimatePresence } from "motion/react";
import { ResumePage } from "./components/ResumePage";
import { AboutPage } from "./components/AboutPage";
import { CinematicTransition } from "./components/ui/cinematic-transition";
import { Navbar } from "./components/Navbar";
import { DiscoveryTracker } from "./components/DiscoveryTracker";
import { Footer } from "./components/Footer";
import { MarqueeDivider } from "./components/MarqueeDivider";
import { ArchitecturalGrid } from "./components/ui/ArchitecturalGrid";
import { BackgroundDoodles } from "./components/ui/BackgroundDoodles";
import { CustomCursor } from "./components/CustomCursor";
import { CulinaryJourney } from "./components/CulinaryJourney";
import { WeatherSystem } from "./components/WeatherSystem";
import { CloudDivider } from "./components/ui/CloudDivider";
import { ZoomRevealSection } from "./components/ZoomRevealSection";


export default function App() {
  const [isLoading, setIsLoading] = useState(false);
  const [isResumeOpen, setIsResumeOpen] = useState(false);
  const [isAboutOpen, setIsAboutOpen] = useState(false);
  const [clickCoords, setClickCoords] = useState({ x: window.innerWidth / 2, y: window.innerHeight / 2 });

  const handleOpenResume = (e: React.MouseEvent) => {
    setClickCoords({ x: e.clientX, y: e.clientY });
    setIsResumeOpen(true);
  };

  const handleCloseResume = (e: React.MouseEvent) => {
    setClickCoords({ x: e.clientX, y: e.clientY });
    setIsResumeOpen(false);
    window.scrollTo(0, 0);
  };

  const handleOpenAbout = (e: React.MouseEvent) => {
    setClickCoords({ x: e.clientX, y: e.clientY });
    setIsAboutOpen(true);
  };

  const handleCloseAbout = (e: React.MouseEvent) => {
    setClickCoords({ x: e.clientX, y: e.clientY });
    setIsAboutOpen(false);
    window.scrollTo(0, 0);
  };

  return (
    <SmoothScroll>
      <div className="min-h-screen flex flex-col bg-transparent font-sans relative">

        {/* Cinematic Preloader (Disabled) */}

        {/* Global Weather System (Renders across the entire website) */}
        <WeatherSystem />

        {/* Global Architectural Grid Background */}
        <ArchitecturalGrid className="fixed inset-0 z-0" />


        {/* Custom cursor and interactive trail */}
        {!isLoading && <CustomCursor />}

        <AnimatePresence>
          {!isResumeOpen && !isAboutOpen && !isLoading && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5, ease: "circOut" }}
              className="fixed top-0 left-0 w-full z-[100]"
            >
              <Navbar onOpenResume={handleOpenResume} onOpenAbout={handleOpenAbout} />
            </motion.div>
          )}
        </AnimatePresence>

        <CinematicTransition
          isActive={isResumeOpen}
          coords={clickCoords}
          backComponent={<ResumePage onBack={handleCloseResume} />}
        >
          <CinematicTransition
            isActive={isAboutOpen}
            coords={clickCoords}
            backComponent={<AboutPage onBack={handleCloseAbout} />}
          >
            <main key={isResumeOpen ? 'resume' : isAboutOpen ? 'about' : 'home'} className="flex-grow flex flex-col w-full relative">
              
              {/* Foreground Content Wrapper */}
              <div className="relative z-20 w-full shadow-[0_30px_80px_rgba(0,0,0,0.3)] bg-[#F5F4F0]">
                <ArchitecturalGrid />
                {/* Global Hand-Drawn Doodles Background */}
                <BackgroundDoodles />
                <div className="relative z-10">
                  <Hero onOpenResume={handleOpenResume} />
                  <HomeIntro onOpenAbout={handleOpenAbout} />
                  <IntroSection onOpenAbout={handleOpenAbout} />
                  <AchievementsSection />
                  <MarqueeDivider />
                  <ZoomRevealSection />
                  <ProjectsSection />
                  <CulinaryJourney />

                </div>
                <CloudDivider bgColor="#F5F4F0" />
              </div>

              {/* Normal Flow Footer */}
              <Footer onOpenResume={handleOpenResume} />

            </main>
          </CinematicTransition>
        </CinematicTransition>

        <AnimatePresence>
          {!isResumeOpen && !isAboutOpen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.5 }}
            >
              <DiscoveryTracker />
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </SmoothScroll>
  );
}
