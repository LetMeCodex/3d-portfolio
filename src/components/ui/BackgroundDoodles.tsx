import React from 'react';
import { HandDrawnDoodle } from './HandDrawnDoodle';

export const BackgroundDoodles = () => {
  return (
    <div className="absolute inset-0 pointer-events-none z-0 overflow-hidden opacity-[0.12] w-full h-full">
      {/* 
        Aesthetic scattered doodles spanning the full length of the site.
        Using soft, cute pastel colors to make it feel premium and hand-crafted.
      */}
      
      {/* Top Section */}
      <HandDrawnDoodle type="sparkle" className="absolute top-[2%] left-[10%] w-[120px] h-[120px] rotate-[-15deg]" color="#FFB7B2" />
      <HandDrawnDoodle type="crown" className="absolute top-[5%] right-[15%] w-[100px] h-[80px] rotate-[10deg]" color="#FFDAC1" />
      <HandDrawnDoodle type="burst" className="absolute top-[8%] left-[25%] w-[80px] h-[80px]" color="#C7CEEA" />

      {/* Middle-Top Section */}
      <HandDrawnDoodle type="swirl" className="absolute top-[18%] right-[-5%] w-[400px] h-[400px] rotate-[20deg]" color="#B5EAD7" />
      <HandDrawnDoodle type="loop" className="absolute top-[25%] left-[8%] w-[200px] h-[150px] rotate-[-20deg]" color="#FF9AA2" />
      <HandDrawnDoodle type="heart" className="absolute top-[28%] right-[25%] w-[100px] h-[100px] rotate-[15deg]" color="#FFB7B2" />
      
      {/* Middle Section */}
      <HandDrawnDoodle type="zig-zag" className="absolute top-[40%] left-[15%] w-[250px] h-[100px] rotate-[10deg]" color="#E2F0CB" />
      <HandDrawnDoodle type="spring" className="absolute top-[45%] right-[10%] w-[180px] h-[180px] rotate-[-30deg]" color="#C7CEEA" />
      <HandDrawnDoodle type="sparkle" className="absolute top-[50%] left-[5%] w-[150px] h-[150px] rotate-[45deg]" color="#FFDAC1" />
      
      {/* Middle-Bottom Section */}
      <HandDrawnDoodle type="circle" className="absolute top-[60%] right-[15%] w-[300px] h-[300px] rotate-[45deg]" color="#B5EAD7" />
      <HandDrawnDoodle type="scribble" className="absolute top-[65%] left-[20%] w-[250px] h-[100px] rotate-[-15deg]" color="#FF9AA2" />
      <HandDrawnDoodle type="heart" className="absolute top-[70%] right-[30%] w-[120px] h-[120px] rotate-[-25deg]" color="#FFB7B2" />
      
      {/* Bottom Section */}
      <HandDrawnDoodle type="loop" className="absolute top-[80%] left-[10%] w-[220px] h-[150px] rotate-[15deg]" color="#C7CEEA" />
      <HandDrawnDoodle type="crown" className="absolute top-[85%] right-[20%] w-[110px] h-[90px] rotate-[-10deg]" color="#FFDAC1" />
      <HandDrawnDoodle type="burst" className="absolute top-[90%] left-[30%] w-[100px] h-[100px]" color="#E2F0CB" />
      <HandDrawnDoodle type="squiggle" className="absolute top-[95%] right-[-5%] w-[500px] h-[200px] rotate-[-5deg]" color="#B5EAD7" />

    </div>
  );
};
