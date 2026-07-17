import { useEffect, useState, ReactNode } from 'react';

interface CinematicTransitionProps {
  isActive: boolean;
  children: ReactNode;
  backComponent: ReactNode;
  coords?: { x: number; y: number };
}

export function CinematicTransition({ isActive, children, backComponent }: CinematicTransitionProps) {
  const [displayActive, setDisplayActive] = useState(isActive);

  useEffect(() => {
    setDisplayActive(isActive);
  }, [isActive]);

  return (
    <div className="relative w-full min-h-screen">
      <div className="relative w-full min-h-screen z-0">
        {displayActive ? backComponent : children}
      </div>
    </div>
  );
}

CinematicTransition.displayName = "CinematicTransition";
