import React, { Children, cloneElement, forwardRef, isValidElement, useEffect, useMemo, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import './CardSwap.css';

gsap.registerPlugin(ScrollTrigger);

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  customClass?: string;
}

export const Card = forwardRef<HTMLDivElement, CardProps>(({ customClass, ...rest }, ref) => (
  <div ref={ref} {...rest} className={`card ${customClass ?? ''} ${rest.className ?? ''}`.trim()} />
));
Card.displayName = 'Card';

interface Slot {
  x: number;
  y: number;
  z: number;
  zIndex: number;
}

const makeSlot = (i: number, distX: number, distY: number, total: number): Slot => ({
  x: i * distX,
  y: -i * distY,
  z: -i * distX * 1.5,
  zIndex: total - i
});

const placeNow = (el: HTMLElement | null, slot: Slot, skew: number) => {
  if (!el) return;
  gsap.set(el, {
    x: slot.x,
    y: slot.y,
    z: slot.z,
    xPercent: -50,
    yPercent: -50,
    skewY: skew,
    transformOrigin: 'center center',
    zIndex: slot.zIndex,
    force3D: true
  });
};

interface CardSwapProps {
  width?: number | string;
  height?: number | string;
  cardDistance?: number;
  verticalDistance?: number;
  delay?: number;
  pauseOnHover?: boolean;
  onCardClick?: (idx: number) => void;
  skewAmount?: number;
  easing?: 'linear' | 'elastic';
  children: React.ReactNode;
  scrollTriggered?: boolean;
}

const CardSwap: React.FC<CardSwapProps> = ({
  width = 500,
  height = 400,
  cardDistance = 60,
  verticalDistance = 70,
  delay = 5000,
  pauseOnHover = false,
  onCardClick,
  skewAmount = 6,
  easing = 'elastic',
  children,
  scrollTriggered = false
}) => {
  const config =
    easing === 'elastic'
      ? {
          ease: 'elastic.out(0.6,0.9)',
          durDrop: 2,
          durMove: 2,
          durReturn: 2,
          promoteOverlap: 0.9,
          returnDelay: 0.05
        }
      : {
          ease: 'power1.inOut',
          durDrop: 0.8,
          durMove: 0.8,
          durReturn: 0.8,
          promoteOverlap: 0.45,
          returnDelay: 0.2
        };

  const childArr = useMemo(() => Children.toArray(children), [children]);
  const refs = useMemo(
    () => childArr.map(() => React.createRef<HTMLDivElement>()),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [childArr.length]
  );

  const order = useRef(Array.from({ length: childArr.length }, (_, i) => i));

  const tlRef = useRef<gsap.core.Timeline | null>(null);
  const intervalRef = useRef<number | undefined>(undefined);
  const container = useRef<HTMLDivElement>(null);

  // Scroll Triggered Stacking Effect
  useEffect(() => {
    if (!scrollTriggered) return;

    const total = refs.length;
    // Set initial positions of all cards in 3D space
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    // Create the master timelines for sequential swaps
    const tl = gsap.timeline();

    for (let s = 0; s < total - 1; s++) {
      const timeStart = s;
      const timeMid = s + 0.5;

      const cardFront = s;
      const elFront = refs[cardFront].current;
      const backSlot = makeSlot(total - 1, cardDistance, verticalDistance, total);

      // 1. Front card slides out to the right
      tl.to(elFront, {
        x: '+=450',
        duration: 0.5,
        ease: 'power1.inOut'
      }, timeStart);

      // Swap zIndex at mid-point when it is fully dropped
      tl.set(elFront, { zIndex: backSlot.zIndex }, timeMid);

      // Return to back slot
      tl.to(elFront, {
        x: backSlot.x,
        y: backSlot.y,
        z: backSlot.z,
        duration: 0.5,
        ease: 'power1.inOut'
      }, timeMid);

      // 2. All other cards move forward one slot
      for (let c = 0; c < total; c++) {
        if (c === cardFront) continue;

        const nextSlotIndex = (c - (s + 1) + total) % total;
        if (nextSlotIndex === total - 1) continue; // already handled above

        const el = refs[c].current;
        const nextSlot = makeSlot(nextSlotIndex, cardDistance, verticalDistance, total);

        tl.set(el, { zIndex: nextSlot.zIndex }, timeStart);
        tl.to(el, {
          x: nextSlot.x,
          y: nextSlot.y,
          z: nextSlot.z,
          duration: 1.0,
          ease: 'power1.inOut'
        }, timeStart);
      }
    }

    // At the end of the card swaps, fade out the entire section's foreground content (cards and text)
    // to reveal a clean dark space before the next section begins.
    const finalFadeStart = (total - 1) * 0.5;
    tl.to([container.current, '#work-header'], {
      opacity: 0,
      duration: 0.5,
      ease: 'power1.inOut'
    }, finalFadeStart);

    const triggerElement = document.getElementById('work') || container.current;
    if (triggerElement) {
      const trigger = ScrollTrigger.create({
        trigger: triggerElement,
        start: triggerElement.id === 'work' ? "top top" : "top 28%",
        end: `+=${(total + 1.2) * 450}`, // scroll length proportional to card counts + spacing buffer
        pin: triggerElement.id === 'work' ? (window.innerWidth > 1024) : true,
        scrub: 1, // buttery smooth scrub with GSAP lag easing
        animation: tl,
        invalidateOnRefresh: true,
      });

      ScrollTrigger.sort();
      ScrollTrigger.refresh();

      return () => {
        trigger.kill();
      };
    }
  }, [scrollTriggered, cardDistance, verticalDistance, skewAmount, refs]);

  // Standard Auto-Swapping Effect
  useEffect(() => {
    if (scrollTriggered) return;

    const total = refs.length;
    refs.forEach((r, i) => placeNow(r.current, makeSlot(i, cardDistance, verticalDistance, total), skewAmount));

    const swap = () => {
      if (order.current.length < 2) return;

      const [front, ...rest] = order.current;
      const elFront = refs[front].current;
      const tl = gsap.timeline();
      tlRef.current = tl;

      tl.to(elFront, {
        x: '+=450',
        duration: config.durDrop,
        ease: config.ease
      });

      tl.addLabel('promote', `-=${config.durDrop * config.promoteOverlap}`);
      rest.forEach((idx, i) => {
        const el = refs[idx].current;
        const slot = makeSlot(i, cardDistance, verticalDistance, refs.length);
        tl.set(el, { zIndex: slot.zIndex }, 'promote');
        tl.to(
          el,
          {
            x: slot.x,
            y: slot.y,
            z: slot.z,
            duration: config.durMove,
            ease: config.ease
          },
          `promote+=${i * 0.15}`
        );
      });

      const backSlot = makeSlot(refs.length - 1, cardDistance, verticalDistance, refs.length);
      tl.addLabel('return', `promote+=${config.durMove * config.returnDelay}`);
      tl.call(
        () => {
          gsap.set(elFront, { zIndex: backSlot.zIndex });
        },
        [],
        'return'
      );
      tl.to(
        elFront,
        {
          x: backSlot.x,
          y: backSlot.y,
          z: backSlot.z,
          duration: config.durReturn,
          ease: config.ease
        },
        'return'
      );

      tl.call(() => {
        order.current = [...rest, front];
      });
    };

    intervalRef.current = window.setInterval(swap, delay);

    if (pauseOnHover) {
      const node = container.current;
      if (node) {
        const pause = () => {
          tlRef.current?.pause();
          clearInterval(intervalRef.current);
        };
        const resume = () => {
          tlRef.current?.play();
          intervalRef.current = window.setInterval(swap, delay);
        };
        node.addEventListener('mouseenter', pause);
        node.addEventListener('mouseleave', resume);
        return () => {
          node.removeEventListener('mouseenter', pause);
          node.removeEventListener('mouseleave', resume);
          clearInterval(intervalRef.current);
        };
      }
    }
    return () => clearInterval(intervalRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [scrollTriggered, cardDistance, verticalDistance, delay, pauseOnHover, skewAmount, easing]);

  const rendered = childArr.map((child, i) => {
    if (isValidElement(child)) {
      const element = child as React.ReactElement<any>;
      return cloneElement(element, {
        key: i,
        ref: refs[i],
        style: { width, height, ...(element.props.style ?? {}) },
        onClick: (e: any) => {
          element.props.onClick?.(e);
          onCardClick?.(i);
        }
      });
    }
    return child;
  });

  return (
    <div ref={container} className="card-swap-container" style={{ width, height }}>
      {rendered}
    </div>
  );
};

export default CardSwap;
