import React, { useEffect } from 'react';
import { motion } from 'motion/react';
import {
  Edit3,
  FileText,
  GraduationCap,
  Presentation,
  BookOpen,
  ListTodo
} from 'lucide-react';
import { FocusCardItem, FocusCardPurpose } from '../types';
import { FocusShiftIcon } from './FocusShiftIcon';
import { roboticSound } from '../utils/roboticSound';

interface FocusTransitionIntroProps {
  cards: FocusCardItem[];
  onComplete: () => void;
  soundEnabled?: boolean;
}

export const FocusTransitionIntro: React.FC<FocusTransitionIntroProps> = ({
  cards,
  onComplete,
  soundEnabled = true
}) => {
  // Transition animation duration: exactly 1.75 seconds (1750ms)
  useEffect(() => {
    if (soundEnabled) {
      roboticSound.playFocusTransitionSound();
    }
    const timer = setTimeout(() => {
      onComplete();
    }, 1750);
    return () => clearTimeout(timer);
  }, [onComplete, soundEnabled]);

  const displayCards = cards.slice(0, 7);
  const cardCount = displayCards.length;

  const getIcon = (purpose: FocusCardPurpose) => {
    switch (purpose) {
      case 'notes':
        return <Edit3 className="w-5 h-5 text-white" />;
      case 'docs':
        return <FileText className="w-5 h-5 text-white" />;
      case 'lectures':
        return <GraduationCap className="w-5 h-5 text-white" />;
      case 'slides':
        return <Presentation className="w-5 h-5 text-white" />;
      case 'scratchpad':
        return <Edit3 className="w-5 h-5 text-white" />;
      case 'milestones':
        return <ListTodo className="w-5 h-5 text-white" />;
      case 'pdf':
      case 'journal':
      default:
        return <BookOpen className="w-5 h-5 text-white" />;
    }
  };

  // Radial compass targets for docking: supports up to 7 slots
  const getCompassTarget = (index: number, total: number) => {
    const angleRad = ((index * (360 / total) - 90) * Math.PI) / 180;
    const radius = 100;
    const x = Math.round(Math.cos(angleRad) * radius);
    const y = Math.round(Math.sin(angleRad) * radius);
    return { x, y, label: `TAB 0${index + 1}` };
  };

  // Final stage dock positions (t = 1.4s -> 1.75s)
  const getFinalOffset = (index: number, total: number) => {
    if (index === 0) {
      return { x: 0, y: 110, scale: 1.35, opacity: 0 };
    }
    const sideIndex = index - 1;
    const sideTotal = Math.max(1, total - 1);
    const spacing = Math.min(56, 320 / sideTotal);
    const startX = -((sideTotal - 1) * spacing) / 2;
    const x = Math.round(startX + sideIndex * spacing);
    return { x, y: -80, scale: 0.82, opacity: 0 };
  };

  return (
    <motion.div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 overflow-hidden pointer-events-auto select-none font-sans"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background Subtle Prototype Grid */}
      <div className="absolute inset-0 bg-prototype-grid opacity-20 pointer-events-none" />

      {/* Ripple Waves expanding in 1.75s */}
      <motion.div
        className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-white/30 pointer-events-none"
        initial={{ scale: 0.2, opacity: 0 }}
        animate={{
          scale: [0.2, 1.25, 2.4],
          opacity: [0, 0.7, 0]
        }}
        transition={{
          duration: 1.75,
          times: [0, 0.45, 1],
          ease: 'easeOut'
        }}
      />

      {/* Outer Orbit Guide Track */}
      <motion.div
        className="absolute w-56 h-56 rounded-full border border-dashed border-white/25 pointer-events-none"
        initial={{ scale: 0.4, opacity: 0, rotate: 0 }}
        animate={{
          scale: [0.4, 1, 1, 1.35],
          opacity: [0, 0.7, 0.7, 0],
          rotate: [0, 180, 360, 520]
        }}
        transition={{
          duration: 1.75,
          times: [0, 0.32, 0.75, 1],
          ease: 'easeInOut'
        }}
      />

      {/* CENTER: Focus Shift Emblem */}
      <motion.div
        className="relative z-10 flex flex-col items-center justify-center pointer-events-none"
        initial={{ scale: 0.2, y: 120, opacity: 0 }}
        animate={{
          scale: [0.2, 1.25, 1, 1, 1.3],
          y: [120, 0, 0, 0, 0],
          opacity: [0, 1, 1, 1, 0]
        }}
        transition={{
          duration: 1.75,
          times: [0, 0.25, 0.6, 0.85, 1],
          ease: [0.16, 1, 0.3, 1]
        }}
      >
        <div className="relative p-4 rounded bg-neutral-900 border-2 border-white shadow-2xl flex items-center justify-center">
          <FocusShiftIcon size={44} active={true} />
        </div>
        <motion.div
          className="mt-2 text-xs font-mono font-bold tracking-widest text-white uppercase"
          initial={{ opacity: 0, y: 6 }}
          animate={{
            opacity: [0, 1, 1, 0],
            y: [6, 0, 0, -4]
          }}
          transition={{
            duration: 1.75,
            times: [0, 0.25, 0.85, 1]
          }}
        >
          [FOCUS SHIFT: {cardCount} TABS]
        </motion.div>
      </motion.div>

      {/* SURROUNDING: Up to 7 Tabs circling the focus icon */}
      {displayCards.map((c, index) => {
        const startAngle = (360 / cardCount) * index;
        const pCompass = getCompassTarget(index, cardCount);
        const pFinal = getFinalOffset(index, cardCount);

        const orbitR = 92;

        const x0 = Math.cos((startAngle * Math.PI) / 180) * 20;
        const y0 = Math.sin((startAngle * Math.PI) / 180) * 20;

        const a1 = startAngle + 180;
        const x1 = Math.cos((a1 * Math.PI) / 180) * orbitR;
        const y1 = Math.sin((a1 * Math.PI) / 180) * orbitR;

        const a2 = startAngle + 360;
        const x2 = Math.cos((a2 * Math.PI) / 180) * orbitR;
        const y2 = Math.sin((a2 * Math.PI) / 180) * orbitR;

        const x3 = pCompass.x;
        const y3 = pCompass.y;

        const x4 = pFinal.x;
        const y4 = pFinal.y;

        return (
          <motion.div
            key={c.id}
            className="absolute z-20 flex flex-col items-center justify-center pointer-events-none"
            initial={{
              x: x0,
              y: y0,
              scale: 0.2,
              opacity: 0
            }}
            animate={{
              x: [x0, x1, x2, x3, x4],
              y: [y0, y1, y2, y3, y4],
              scale: [0.2, 1, 1, 1.1, pFinal.scale],
              opacity: [0, 0.95, 1, 1, 0]
            }}
            transition={{
              duration: 1.75,
              times: [0, 0.32, 0.65, 0.85, 1],
              ease: [0.25, 1, 0.5, 1]
            }}
          >
            {/* Tab Icon Badge */}
            <div
              className="w-10 h-10 rounded flex items-center justify-center border-2 border-white bg-neutral-900 shadow-xl"
            >
              {getIcon(c.purpose)}
            </div>

            {/* Micro Tab Tag */}
            <motion.div
              className="mt-1 flex items-center gap-1 px-1.5 py-0.5 rounded bg-black border border-neutral-700 text-white"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{
                opacity: [0, 0, 0.4, 1, 0],
                scale: [0.8, 0.8, 0.9, 1, 0.9]
              }}
              transition={{
                duration: 1.75,
                times: [0, 0.35, 0.65, 0.85, 1]
              }}
            >
              <span className="text-[8px] font-mono font-bold uppercase tracking-wider">
                {c.title.split(' ')[0]}
              </span>
            </motion.div>
          </motion.div>
        );
      })}
    </motion.div>
  );
};
