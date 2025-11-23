/* eslint-disable @typescript-eslint/ban-ts-comment */
// @ts-nocheck

'use client';

import { motion, useMotionTemplate, useMotionValue } from 'motion/react';
import React, { useMemo, useState } from 'react';
import type { MouseEvent as ReactMouseEvent } from 'react';

import { CanvasRevealEffect } from '@/components/ui/canvas-reveal-effect';
import { cn } from '@/lib/style';

type SpotlightMode = 'cursor' | 'fixed';

type SpotlightPosition = {
  x: string;
  y: string;
};

export const SpotlightArea = ({
  children,
  radius = 350,
  color = '#262626',
  className,
  spotlightMode = 'cursor',
  spotlightPosition = { x: '50%', y: '50%' },
  revealOnHover = true,
  ...props
}: {
  radius?: number;
  color?: string;
  children: React.ReactNode;
  spotlightMode?: SpotlightMode;
  spotlightPosition?: SpotlightPosition;
  revealOnHover?: boolean;
} & React.HTMLAttributes<HTMLDivElement>) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);
  const isCursorMode = spotlightMode === 'cursor';

  function handleMouseMove({
    currentTarget,
    clientX,
    clientY
  }: ReactMouseEvent<HTMLDivElement>) {
    if (!isCursorMode) return;
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  }

  const [isHovering, setIsHovering] = useState(false);
  const handleMouseEnter = () => {
    if (revealOnHover) setIsHovering(true);
  };
  const handleMouseLeave = () => {
    if (revealOnHover) setIsHovering(false);
  };

  const cursorMask = useMotionTemplate`
            radial-gradient(
              ${radius}px circle at ${mouseX}px ${mouseY}px,
              white,
              transparent 80%
            )
          `;

  const fixedMask = useMemo(
    () =>
      `radial-gradient(${radius}px circle at ${spotlightPosition.x} ${spotlightPosition.y}, white, transparent 80%)`,
    [radius, spotlightPosition.x, spotlightPosition.y]
  );

  const maskImage = isCursorMode ? cursorMask : fixedMask;
  const revealActive = revealOnHover ? isHovering : true;

  return (
    <div
      className={cn('group/spotlight relative isolate', className)}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...props}
    >
      <motion.div
        className={cn(
          'pointer-events-none absolute inset-0 z-0 rounded-[inherit] transition duration-300',
          revealOnHover
            ? 'opacity-0 group-hover/spotlight:opacity-100'
            : 'opacity-100'
        )}
        style={{
          backgroundColor: color,
          maskImage,
          WebkitMaskImage: maskImage
        }}
      >
        {revealActive && (
          <CanvasRevealEffect
            animationSpeed={5}
            containerClassName="bg-transparent absolute inset-0 pointer-events-none"
            colors={[
              [59, 130, 246],
              [139, 92, 246]
            ]}
            dotSize={3}
          />
        )}
      </motion.div>
      <div className="relative z-10">{children}</div>
    </div>
  );
};
