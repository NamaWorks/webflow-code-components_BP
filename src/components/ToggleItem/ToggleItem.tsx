import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export interface ToggleItemProps {
  title: string;
  content: string;
  className?: string;
}

const ArrowIcon = ({ open }: { open: boolean }) => (
  <svg
    width="18"
    height="18"
    viewBox="0 0 18 18"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    className={`shrink-0 transition-transform duration-300 ${open ? 'rotate-180' : ''}`}
  >
    <path
      d="M9 5.14351L9 12.8576"
      stroke="#2A354D"
      strokeWidth="1.03475"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M10.928 10.9291L8.99951 12.8576L7.07099 10.9291"
      stroke="#2A354D"
      strokeWidth="1.03475"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
    <path
      d="M0.642999 9.00041C0.643 4.38502 4.38452 0.643503 8.99991 0.643503C13.6153 0.643503 17.3568 4.38502 17.3568 9.00041C17.3568 13.6158 13.6153 17.3573 8.99991 17.3573C4.38451 17.3573 0.642999 13.6158 0.642999 9.00041Z"
      stroke="#2A354D"
      strokeWidth="1.03475"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export const ToggleItem = ({ title, content, className }: ToggleItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  // Refs mirror state/position so event listeners always read current values
  const isOpenRef = useRef(false);
  const isFirstRef = useRef(false);
  const bodyRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  // Use the first CSS class token as the group identifier
  const groupKey = className?.trim().split(/\s+/)[0];

  useEffect(() => {
    const root = rootRef.current;
    const body = bodyRef.current;
    if (!root || !body || !groupKey) return;

    const allInGroup = document.querySelectorAll(`.${groupKey}`);
    isFirstRef.current = allInGroup[0] === root;

    // Auto-open the first item in the group on mount
    if (isFirstRef.current) {
      gsap.set(body, { height: 'auto', opacity: 1, marginTop: '2.75rem' });
      setIsOpen(true);
      isOpenRef.current = true;
    }

    // Close when a sibling in the same group opens
    const handleSiblingOpen = (e: Event) => {
      const { source } = (e as CustomEvent<{ source: Element }>).detail;
      if (source !== root && isOpenRef.current) {
        gsap.to(body, { height: 0, opacity: 0, marginTop: 0, duration: 0.3, ease: 'power2.in' });
        setIsOpen(false);
        isOpenRef.current = false;
      }
    };

    // Re-open when the group has no open item (fallback to first)
    const handleFallback = () => {
      if (isFirstRef.current && !isOpenRef.current) {
        gsap.to(body, { height: 'auto', opacity: 1, marginTop: '2.75rem', duration: 0.4, ease: 'power2.out' });
        setIsOpen(true);
        isOpenRef.current = true;
      }
    };

    document.addEventListener(`wf-toggle-group:${groupKey}`, handleSiblingOpen);
    document.addEventListener(`wf-toggle-fallback:${groupKey}`, handleFallback);
    return () => {
      document.removeEventListener(`wf-toggle-group:${groupKey}`, handleSiblingOpen);
      document.removeEventListener(`wf-toggle-fallback:${groupKey}`, handleFallback);
    };
  }, [groupKey]);

  const toggle = () => {
    const body = bodyRef.current;
    const root = rootRef.current;
    if (!body) return;

    if (!isOpenRef.current) {
      // Open this item, tell siblings to close
      gsap.to(body, { height: 'auto', opacity: 1, marginTop: '2.75rem', duration: 0.4, ease: 'power2.out' });
      setIsOpen(true);
      isOpenRef.current = true;
      if (groupKey) {
        document.dispatchEvent(
          new CustomEvent(`wf-toggle-group:${groupKey}`, { detail: { source: root } }),
        );
      }
    } else if (!groupKey) {
      // Standalone — allow toggling closed
      gsap.to(body, { height: 0, opacity: 0, marginTop: 0, duration: 0.3, ease: 'power2.in' });
      setIsOpen(false);
      isOpenRef.current = false;
    } else if (!isFirstRef.current) {
      // Non-first grouped item — close and let first item re-open as fallback
      gsap.to(body, { height: 0, opacity: 0, marginTop: 0, duration: 0.3, ease: 'power2.in' });
      setIsOpen(false);
      isOpenRef.current = false;
      document.dispatchEvent(new CustomEvent(`wf-toggle-fallback:${groupKey}`));
    }
    // First grouped item clicked while open — do nothing (it's the fallback, always stays open)
  };

  return (
    <div ref={rootRef} className={className}>
      <button
        type="button"
        className="flex w-full cursor-pointer items-center justify-between bg-transparent pb-4 text-left focus-visible:outline-none"
        style={{ border: 'none', borderBottom: '1px solid #93A2C7' }}
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span
          className="text-xl uppercase text-[#2A354D]"
          style={{ fontFamily: 'Helvetica Condensed', fontWeight: 500 }}
        >
          {title}
        </span>
        <ArrowIcon open={isOpen} />
      </button>

      {/* body — initial state via Tailwind classes; GSAP overrides with inline styles (higher specificity) */}
      <div
        ref={bodyRef}
        className="mt-0 h-0 overflow-hidden opacity-0"
      >
        <p
          className="text-2xl text-[#2A354D]"
          style={{ fontFamily: 'Helvetica Condensed', fontWeight: 300 }}
        >
          {content}
        </p>
      </div>
    </div>
  );
};
