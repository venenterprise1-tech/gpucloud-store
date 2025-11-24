'use client';

import { Search } from 'lucide-react';
import type { ChangeEvent, KeyboardEvent } from 'react';
import { useEffect, useId, useRef, useState } from 'react';

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

type SimpleSearchProps = {
  value: string;
  onChange: (value: string) => void;
  onAddToCart?: (config: {
    title: string;
    specs: string;
    price: string;
    details: string;
  }) => void;
};

export const SimpleSearch = ({
  value,
  onChange,
  onAddToCart
}: SimpleSearchProps) => {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [dialogIndex, setDialogIndex] = useState<number | null>(null);
  const listRef = useRef<HTMLDivElement | null>(null);
  const isClosingDialogRef = useRef(false);
  const shouldScrollRef = useRef(false);
  const searchId = useId();

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

  const currentDialogOption =
    dialogIndex !== null ? options[dialogIndex] : null;

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

  const handleFocus = () => {
    if (value.trim().length > 0) {
      setIsOpen(true);
    }
  };

  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    const maxIndex = options.length - 1;

    if (event.key === 'ArrowDown') {
      event.preventDefault();

      if (!isOpen && value.trim().length > 0) {
        setIsOpen(true);
        setActiveIndex(prev => prev ?? 0);
        shouldScrollRef.current = true;
        return;
      }

      shouldScrollRef.current = true;
      setActiveIndex(prev => {
        const next = prev === null ? 0 : prev + 1 > maxIndex ? 0 : prev + 1;
        return next;
      });
    } else if (event.key === 'ArrowUp') {
      event.preventDefault();
      shouldScrollRef.current = true;
      setActiveIndex(prev => {
        const next =
          prev === null ? maxIndex : prev - 1 < 0 ? maxIndex : prev - 1;
        return next;
      });
    } else if (event.key === 'Enter') {
      if (isOpen && activeIndex !== null) {
        event.preventDefault();
        setDialogIndex(activeIndex);
      }
    }
  };

  useEffect(() => {
    if (activeIndex === null || !listRef.current || !shouldScrollRef.current)
      return;
    const el = listRef.current.querySelector<HTMLElement>(
      `[data-option-index="${activeIndex}"]`
    );
    if (el) {
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
    shouldScrollRef.current = false;
  }, [activeIndex]);

  const handleOpenChange = (nextOpen: boolean) => {
    if (nextOpen) {
      if (value.trim().length > 0) {
        setIsOpen(true);
      }
      return;
    }

    if (isClosingDialogRef.current) {
      return;
    }

    if (dialogIndex === null) {
      setIsOpen(false);
    }
  };

  const handleDialogClose = () => {
    isClosingDialogRef.current = true;

    setDialogIndex(null);
    if (value.trim().length > 0) {
      setIsOpen(true);
    }

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
      setTimeout(() => {
        isClosingDialogRef.current = false;
      }, 100);
    });
  };

  return (
    <>
      <div className="relative">
        <Popover open={isOpen} onOpenChange={handleOpenChange}>
          <PopoverAnchor asChild>
            <div className="relative">
              <div className="border-border/50 bg-bg-surface/80 focus-within:border-ui-active-soft focus-within:ring-ui-active-soft/20 relative flex h-12 items-center gap-2 rounded-lg border px-3 backdrop-blur-sm transition focus-within:ring-1">
                <Search className="text-fg-muted h-4 w-4 flex-none" />
                <input
                  ref={inputRef}
                  id={searchId}
                  type="text"
                  name="search"
                  placeholder="Search GPU configs..."
                  className="placeholder:text-fg-muted/70 text-fg-main h-full w-full bg-transparent text-sm outline-none"
                  autoComplete="off"
                  autoCorrect="off"
                  autoCapitalize="none"
                  spellCheck={false}
                  value={value}
                  onChange={handleInputChange}
                  onKeyDown={handleInputKeyDown}
                  onClick={handleInputClick}
                  onFocus={handleFocus}
                />
              </div>
            </div>
          </PopoverAnchor>

          <PopoverContent
            side="bottom"
            align="start"
            sideOffset={8}
            avoidCollisions={false}
            onOpenAutoFocus={event => event.preventDefault()}
            className="from-bg-surface/75 via-bg-page/92 to-bg-surface/80 border-border/60 text-fg-soft w-[900px] max-w-[96vw] overflow-hidden rounded-2xl border bg-linear-to-b p-0 shadow-[0_18px_60px_rgba(0,0,0,0.45)] backdrop-blur-lg"
            style={
              {
                left: 'calc(50vw - 450px)',
                transform: 'none'
              } as React.CSSProperties
            }
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
                      onMouseEnter={() => {
                        shouldScrollRef.current = false;
                        setActiveIndex(index);
                      }}
                      onSelect={() => {
                        setActiveIndex(index);
                        setDialogIndex(index);
                      }}
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
      </div>

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
            e.preventDefault();
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
    </>
  );
};
