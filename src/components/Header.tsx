import { useEffect, useState } from 'react';
import { BrandSignature } from './BrandSignature';
import { motion } from 'motion/react';
import { Clock, Globe, ArrowUpRight } from 'lucide-react';

export function Header() {
  const [timeStr, setTimeStr] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const formatter = new Intl.DateTimeFormat('en-GB', {
        timeZone: 'Asia/Kolkata',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: false
      });
      const formattedTime = formatter.format(now).replace(/:/g, ' ');
      setTimeStr(`${formattedTime}`);
    };
    
    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const copyEmail = () => {
    navigator.clipboard.writeText('Jain.disha2712@gmail.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-[100] px-6 lg:px-10 py-8 flex items-center justify-between pointer-events-none">


      <div className="pointer-events-auto">
        <BrandSignature />
      </div>
      
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
        className="pointer-events-auto ml-auto"
      >
        <div className="orbital-tokens">
          
          {/* STATUS TOKEN */}
          <div className="token-container" onClick={copyEmail}>
            <div className="token-drawer">{copied ? 'COPIED' : 'COPY EMAIL'}</div>
            <button className="token-btn">
              <div className="token-pulse"></div>
              <span>Available</span>
            </button>
          </div>

          {/* CLOCK TOKEN */}
          <div className="token-container hidden sm:flex">
            <div className="token-drawer">TIME / IST</div>
            <div className="token-btn">
              <Clock size={12} strokeWidth={2} className="text-white/40" />
              <span className="tabular-nums">{timeStr}</span>
            </div>
          </div>

          {/* GATEWAY TOKEN */}
          <a 
            href="https://linkedin.com/in/disha-jain-94016b333" 
            target="_blank" 
            rel="noopener noreferrer"
            className="token-container"
          >
            <div className="token-drawer">LINKEDIN</div>
            <div className="token-btn">
              <Globe size={12} strokeWidth={2} className="text-white/40" />
              <ArrowUpRight size={14} strokeWidth={1.5} className="text-white/60" />
            </div>
          </a>

        </div>
      </motion.div>
    </header>
  );
}

