'use client';

import { Search } from 'lucide-react';
import type { AnimationPlaybackControls } from 'motion';
import { animate, motion, useMotionValue, useTransform } from 'motion/react';
import {
  type ChangeEvent,
  type KeyboardEvent,
  useEffect,
  useRef,
  useState
} from 'react';

import {
  Command,
  CommandGroup,
  CommandItem,
  CommandList
} from '@/components/ui/command';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import {
  Popover,
  PopoverAnchor,
  PopoverContent
} from '@/components/ui/popover';
import { cn } from '@/lib/style';

type HaloSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onAddToCart?: (config: {
    title: string;
    specs: string;
    price: string;
    details: string;
  }) => void;
};

export const HaloSearch = ({
  value,
  onChange,
  onAddToCart
}: HaloSearchProps) => {
  const baseAngle = useMotionValue(0);
  const animationRef = useRef<AnimationPlaybackControls | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isFocused, setIsFocused] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const isClosingDialogRef = useRef(false);

  const options = [
    {
      title: 'A100 x8 — 640 GB HBM',
      specs: '96 vCPU • 1.6 TB RAM • 3.2 TB NVMe',
      price: '$8.40/hr',
      details:
        'Best for multi-node training runs with large models and long training windows. High VRAM and interconnect bandwidth.'
    },
    {
      title: 'H100 x4 — 320 GB HBM3',
      specs: '64 vCPU • 512 GB RAM • 2 TB NVMe',
      price: '$6.15/hr',
      details:
        'Great for mixed inference + fine-tuning workloads where you need strong BF16/FP8 performance but moderate scale.'
    },
    {
      title: 'L40S x8 — 192 GB GDDR6',
      specs: '48 vCPU • 256 GB RAM • 1.5 TB NVMe',
      price: '$4.20/hr',
      details:
        'Balanced choice for latency-sensitive inference and smaller trainings. Good value for general-purpose GPU workloads.'
    },
    {
      title: 'RTX 4090 x4 — 96 GB GDDR6X',
      specs: '32 vCPU • 128 GB RAM • 1 TB NVMe',
      price: '$2.80/hr',
      details:
        'Ideal for explorers and smaller teams running experiments, prototyping models, and doing heavy local development.'
    },
    {
      title: 'A100 x16 — 1.3 TB HBM',
      specs: '192 vCPU • 2 TB RAM • 6.4 TB NVMe',
      price: '$15.90/hr',
      details:
        'For the largest training jobs where you need as much VRAM and bandwidth as possible on a single high-density node.'
    },
    {
      title: 'MI300X x8 — 1.5 TB HBM3',
      specs: '128 vCPU • 1 TB RAM • 4 TB NVMe',
      price: '$11.20/hr',
      details:
        'AMD-based alternative for massive inference fleets and training jobs that are tuned for ROCm-compatible stacks.'
    }
  ] as const;

  // Button halo uses a 90deg offset so it matches the original static look
  const iconAngle = useTransform(baseAngle, v => v + 90);
  // Shared opacity pulse for the large halo around the input (subtle, synced to rotation)
  const haloOpacity = useTransform(baseAngle, v => {
    const theta = (v * Math.PI) / 180;
    const t = (1 - Math.cos(theta)) / 2; // 0 -> 1 -> 0 over a full rotation
    return 0.45 + 0.2 * t; // 0.45–0.65 subtle brightness change
  });

  const stopAnimation = () => {
    if (animationRef.current) {
      animationRef.current.stop();
      animationRef.current = null;
    }
  };

  const startIdle = () => {
    stopAnimation();
    animationRef.current = animate(baseAngle, baseAngle.get() + 360, {
      duration: 10,
      ease: 'linear',
      repeat: Infinity
    });
  };

  const spinOnce = () => {
    stopAnimation();
    animationRef.current = animate(baseAngle, baseAngle.get() + 360, {
      duration: 1.5,
      ease: 'easeInOut',
      repeat: 0,
      onComplete: () => {
        animationRef.current = null;
        if (isFocused) {
          startIdle();
        }
      }
    });
  };

  const handleHoverStart = () => {
    if (!isFocused) {
      spinOnce();
    }
  };

  const handleFocus = () => {
    setIsFocused(true);
    startIdle();
    if (value.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleBlur = () => {
    setIsFocused(false);
    stopAnimation();
    const current = baseAngle.get();
    const target = Math.round(current / 360) * 360;
    if (target !== current) {
      animate(baseAngle, target, { duration: 1.8, ease: 'easeOut' });
    }
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    const nextValue = event.target.value;
    onChange(nextValue);
    setIsOpen(nextValue.trim().length > 0);
  };

  const handleInputClick = () => {
    if (!isOpen && value.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const maxIndex = options.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      // If the input is focused, has text, and the dropdown is closed,
      // ArrowDown should open it.
      if (!isOpen && value.trim().length > 0) {
        setIsOpen(true);
        setActiveIndex(prev => prev ?? 0);
        return;
      }

      setActiveIndex(prev => {
        const next = prev === null ? 0 : prev + 1 > maxIndex ? 0 : prev + 1;
        return next;
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      setActiveIndex(prev => {
        const next =
          prev === null ? maxIndex : prev - 1 < 0 ? maxIndex : prev - 1;
        return next;
      });
    } else if (event.key === 'Enter') {
      if (isOpen && activeIndex !== null) {
        event.preventDefault();
        // Open a details dialog for the currently selected option.
        setDialogIndex(activeIndex);
      }
    }
  };

  useEffect(() => {
    if (activeIndex === null || !listRef.current) return;
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-option-index="${activeIndex}"]`
    );
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }, [activeIndex]);

  const handleOpenChange = (nextOpen: boolean) => {
    // Let Radix drive the toggle, but clamp opening to cases where we have text.
    // If the details dialog is open, ignore close requests so we can return to
    // the same dropdown state when the dialog closes.
    if (nextOpen) {
      if (value.trim().length > 0) {
        setIsOpen(true);
      }
      return;
    }

    // If we're currently closing the dialog, ignore the popover close request
    if (isClosingDialogRef.current) {
      return;
    }

    // Only allow closing the popover if the dialog is not open
    if (dialogIndex === null) {
      setIsOpen(false);
    }
  };

  const handleDialogClose = () => {
    // Set flag to prevent popover from closing
    isClosingDialogRef.current = true;

    setDialogIndex(null);
    // Restore the dropdown if there is still text in the input.
    if (value.trim().length > 0) {
      setIsOpen(true);
    }

    // Return focus to the input - use requestAnimationFrame for smoother behavior
    requestAnimationFrame(() => {
      if (inputRef.current) {
        inputRef.current.focus();
        const len = inputRef.current.value.length;
        try {
          inputRef.current.setSelectionRange(len, len);
        } catch {
          // Some input types don't support setSelectionRange; safe to ignore.
        }
      }
      // Reset the flag after a short delay
      setTimeout(() => {
        isClosingDialogRef.current = false;
      }, 100);
    });
  };

  const currentDialogOption =
    dialogIndex !== null ? options[dialogIndex] : null;

  return (
    <motion.div
      id="halo-search"
      className="relative flex items-center justify-center"
      aria-label="Search GPUCloud"
      onMouseEnter={handleHoverStart}
    >
      {/* Aurora glow */}
      <motion.div
        className="pointer-events-none absolute -top-8 h-32 w-[340px] overflow-hidden rounded-[28px] blur-2xl"
        style={{ opacity: haloOpacity }}
      >
        <div
          className="rounded-[32px]"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '600px',
            height: '600px',
            transform: 'translate(-50%, -50%) rotate(60deg)',
            filter: 'brightness(1.4)',
            backgroundImage:
              'conic-gradient(var(--color-bg-page), color-mix(in srgb, var(--color-neon-electric) 70%, transparent) 5%, var(--color-bg-page) 38%, var(--color-bg-page) 50%, color-mix(in srgb, var(--color-neon-magenta-soft) 65%, transparent) 60%, var(--color-bg-page) 87%)'
          }}
        />
      </motion.div>

      {/* Outer rings */}
      <motion.div
        className="pointer-events-none absolute h-[70px] w-[320px] overflow-hidden rounded-2xl"
        style={{ opacity: haloOpacity }}
      >
        <div
          className="rounded-2xl blur-[3px]"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '600px',
            height: '600px',
            transform: 'translate(-50%, -50%) rotate(82deg)',
            backgroundImage:
              'conic-gradient(transparent, color-mix(in srgb, var(--color-neon-electric) 65%, transparent), transparent 12%, transparent 50%, color-mix(in srgb, var(--color-neon-magenta) 55%, transparent) 60%, transparent 70%)'
          }}
        />
        <div
          className="rounded-2xl opacity-70 blur-[3px]"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '600px',
            height: '600px',
            transform: 'translate(-50%, -50%) rotate(82deg)',
            backgroundImage:
              'conic-gradient(transparent, color-mix(in srgb, var(--color-neon-cyan-soft) 50%, transparent), transparent 14%, transparent 50%, color-mix(in srgb, var(--color-neon-magenta-soft) 40%, transparent) 64%, transparent 74%)'
          }}
        />
      </motion.div>

      {/* Main border + inner glow */}
      <motion.div
        className="pointer-events-none absolute h-[64px] w-[304px] overflow-hidden rounded-xl"
        style={{ opacity: haloOpacity }}
      >
        <div
          className="rounded-xl blur-[2px]"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '600px',
            height: '600px',
            transform: 'translate(-50%, -50%) rotate(70deg)',
            backgroundImage:
              'conic-gradient(var(--color-bg-page), color-mix(in srgb, var(--color-neon-electric) 55%, transparent) 5%, var(--color-bg-page) 14%, var(--color-bg-page) 50%, color-mix(in srgb, var(--color-neon-magenta-soft) 60%, transparent) 60%, var(--color-bg-page) 64%)'
          }}
        />
        <div
          className="rounded-[10px] blur-[2px]"
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: '600px',
            height: '600px',
            transform: 'translate(-50%, -50%) rotate(83deg)',
            backgroundImage:
              'conic-gradient(transparent, color-mix(in srgb, var(--color-neon-cyan) 40%, transparent), transparent 8%, transparent 50%, color-mix(in srgb, var(--color-neon-magenta-soft) 40%, transparent) 58%, transparent 68%)'
          }}
        />
      </motion.div>

      {/* Search field + dropdown */}
      <Popover open={isOpen} onOpenChange={handleOpenChange}>
        <PopoverAnchor asChild>
          <div className="relative">
            <div className="ring-border/40 relative flex h-14 w-[320px] items-center gap-2 rounded-xl bg-[color-mix(in_srgb,var(--color-bg-page)_92%,transparent)]/95 px-4 pr-3 text-sm ring-1 backdrop-blur-sm">
              <input
                ref={inputRef}
                type="text"
                name="search"
                placeholder="Search GPU configs..."
                className="placeholder:text-fg-muted/70 text-fg-main h-full w-[260px] max-w-full bg-transparent pr-2 text-sm outline-none"
                autoComplete="off"
                autoCorrect="off"
                autoCapitalize="none"
                spellCheck={false}
                value={value}
                onChange={handleInputChange}
                onKeyDown={handleInputKeyDown}
                onClick={handleInputClick}
                onFocus={handleFocus}
                onBlur={handleBlur}
              />

              {/* Accent blur */}
              <div className="pointer-events-none absolute top-1 left-3 h-5 w-8 bg-[color-mix(in_srgb,var(--color-neon-magenta-soft)_65%,transparent)] opacity-80 blur-xl" />

              {/* Button */}
              <button
                type="button"
                className="group border-border/60 from-bg-surface to-bg-page text-fg-soft hover:border-ui-active-soft hover:text-fg-main relative flex size-10 flex-none items-center justify-center overflow-hidden rounded-lg border bg-linear-to-b shadow-[0_0_18px_rgba(0,0,0,0.6)] transition"
                aria-label="Search"
              >
                <div className="pointer-events-none absolute inset-0">
                  <motion.div
                    className="opacity-70"
                    style={{
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      width: '600px',
                      height: '600px',
                      x: '-50%',
                      y: '-50%',
                      rotate: iconAngle,
                      backgroundImage:
                        'conic-gradient(transparent, color-mix(in srgb, var(--color-neon-electric) 40%, transparent), transparent 45%, transparent 55%, color-mix(in srgb, var(--color-neon-magenta-soft) 45%, transparent), transparent 90%)'
                    }}
                  />
                </div>
                <Search className="relative z-1 h-4 w-4" />
              </button>
            </div>
          </div>
        </PopoverAnchor>

        <PopoverContent
          side="bottom"
          align="center"
          avoidCollisions={false}
          onOpenAutoFocus={event => event.preventDefault()}
          className="from-bg-surface/75 via-bg-page/92 to-bg-surface/80 border-border/60 text-fg-soft w-[900px] max-w-[96vw] overflow-hidden rounded-2xl border bg-linear-to-b p-0 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg"
        >
          <div className="border-b-border/40 bg-[color-mix(in_srgb,var(--color-bg-surface)_80%,transparent)] px-5 py-3 text-center text-xs font-medium tracking-[0.18em] text-[color-mix(in_srgb,var(--color-fg-soft)_70%,transparent)] uppercase">
            Matching GPU configs
          </div>
          <Command className="border-none bg-transparent text-inherit">
            <CommandList
              ref={listRef}
              className="divide-border/25 max-h-[288px] divide-y overflow-y-auto py-1"
            >
              <CommandGroup heading="">
                {options.map((option, index) => (
                  <CommandItem
                    key={option.title}
                    data-option-index={index}
                    className={cn(
                      'flex items-center justify-between px-5 py-3 transition hover:bg-[color-mix(in_srgb,var(--color-bg-surface)_90%,transparent)]/80 data-[selected=true]:bg-transparent data-[selected=true]:text-inherit',
                      activeIndex === index &&
                        'text-fg-main border-ui-active-soft border-l-2 bg-[color-mix(in_srgb,var(--color-bg-surface)_96%,transparent)] shadow-[0_0_0_1px_color-mix(in_srgb,var(--color-border)_60%,transparent)]'
                    )}
                    onSelect={() => setActiveIndex(index)}
                  >
                    <div className="flex w-full flex-col gap-1">
                      <div className="flex items-center justify-between gap-3">
                        <div>
                          <div className="text-fg-main text-sm font-medium">
                            {option.title}
                          </div>
                          <div className="text-fg-soft text-xs">
                            {option.specs}
                          </div>
                        </div>
                        <div className="text-ui-active-soft text-xs font-semibold">
                          {option.price}
                        </div>
                      </div>
                      {activeIndex === index && (
                        <div className="text-fg-soft/90 border-border/25 border-t pt-2 text-xs leading-relaxed">
                          {option.details}
                        </div>
                      )}
                    </div>
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>

      <Dialog
        open={dialogIndex !== null}
        modal={true}
        onOpenChange={open => {
          if (!open) {
            handleDialogClose();
          }
        }}
      >
        <DialogContent
          className="bg-bg-surface border-border/70 text-fg-main sm:max-w-xl md:max-w-2xl"
          onEscapeKeyDown={e => {
            e.preventDefault();
            handleDialogClose();
          }}
          onOpenAutoFocus={e => {
            // Prevent default focus on close button, we'll focus "Add to Cart" instead
            e.preventDefault();
            // Focus will be set manually on the "Add to Cart" button via autoFocus prop
          }}
        >
          {currentDialogOption && (
            <>
              <DialogHeader className="space-y-1">
                <DialogTitle className="text-lg font-semibold">
                  {currentDialogOption.title}
                </DialogTitle>
                <DialogDescription className="text-fg-soft text-sm">
                  {currentDialogOption.specs}
                </DialogDescription>
              </DialogHeader>

              <div className="text-fg-soft mt-4 space-y-4 text-sm">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-fg-muted/80 tracking-[0.18em] uppercase">
                    Hourly rate
                  </span>
                  <span className="text-ui-active-soft text-sm font-semibold">
                    {currentDialogOption.price}
                  </span>
                </div>
                <p className="leading-relaxed">{currentDialogOption.details}</p>
              </div>

              <DialogFooter className="mt-6 gap-2">
                <button
                  type="button"
                  onClick={handleDialogClose}
                  className="border-border/70 text-fg-main hover:border-ui-active-soft hover:text-fg-main/90 bg-bg-surface inline-flex items-center justify-center rounded-md border px-3 py-1.5 text-xs font-medium transition"
                >
                  Close
                </button>
                {onAddToCart && (
                  <button
                    type="button"
                    autoFocus
                    onClick={() => {
                      onAddToCart(currentDialogOption);
                      handleDialogClose();
                    }}
                    className="bg-ui-active-soft hover:bg-ui-active inline-flex items-center justify-center rounded-md border border-transparent px-4 py-1.5 text-xs font-medium text-white transition"
                  >
                    Add to Cart
                  </button>
                )}
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </motion.div>
  );
};
