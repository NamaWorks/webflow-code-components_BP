import { useEffect, useRef, useState } from 'react';
import { gsap } from 'gsap';

export interface ToggleImageItemProps {
  title: string;
  content: string;
  image: { src: string; alt?: string };
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
    <path d="M9 5.14351L9 12.8576" stroke="#2A354D" strokeWidth="1.03475" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M10.928 10.9291L8.99951 12.8576L7.07099 10.9291" stroke="#2A354D" strokeWidth="1.03475" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M0.642999 9.00041C0.643 4.38502 4.38452 0.643503 8.99991 0.643503C13.6153 0.643503 17.3568 4.38502 17.3568 9.00041C17.3568 13.6158 13.6153 17.3573 8.99991 17.3573C4.38451 17.3573 0.642999 13.6158 0.642999 9.00041Z" stroke="#2A354D" strokeWidth="1.03475" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

// IMAGE_H must match the fixed image height used in the <img> element
const IMAGE_H = 342;

export const ToggleImageItem = ({ title, content, image, className }: ToggleImageItemProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const isOpenRef = useRef(false);
  const isFirstRef = useRef(false);
  const imageRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);

  const groupKey = className?.trim().split(/\s+/)[0];

  const openItem = (animate: boolean) => {
    if (!imageRef.current || !bodyRef.current) return;
    const ease = 'power2.out';
    const fn = animate ? gsap.to : gsap.set;
    fn(imageRef.current, { height: IMAGE_H, opacity: 1, duration: 0.4, ease });
    fn(bodyRef.current, { height: 'auto', opacity: 1, marginTop: '2.75rem', duration: 0.4, ease });
    setIsOpen(true);
    isOpenRef.current = true;
  };

  const closeItem = () => {
    if (!imageRef.current || !bodyRef.current) return;
    gsap.to(imageRef.current, { height: 0, opacity: 0, duration: 0.3, ease: 'power2.in' });
    gsap.to(bodyRef.current, { height: 0, opacity: 0, marginTop: 0, duration: 0.3, ease: 'power2.out' });
    setIsOpen(false);
    isOpenRef.current = false;
  };

  useEffect(() => {
    const root = rootRef.current;
    if (!root || !groupKey) return;

    const allInGroup = document.querySelectorAll(`.${groupKey}`);
    isFirstRef.current = allInGroup[0] === root;

    if (isFirstRef.current) openItem(false);

    const handleSiblingOpen = (e: Event) => {
      const { source } = (e as CustomEvent<{ source: Element }>).detail;
      if (source !== root && isOpenRef.current) closeItem();
    };

    const handleFallback = () => {
      if (isFirstRef.current && !isOpenRef.current) openItem(true);
    };

    document.addEventListener(`wf-toggle-group:${groupKey}`, handleSiblingOpen);
    document.addEventListener(`wf-toggle-fallback:${groupKey}`, handleFallback);
    return () => {
      document.removeEventListener(`wf-toggle-group:${groupKey}`, handleSiblingOpen);
      document.removeEventListener(`wf-toggle-fallback:${groupKey}`, handleFallback);
    };
  }, [groupKey]);

  const toggle = () => {
    if (!isOpenRef.current) {
      openItem(true);
      if (groupKey) {
        document.dispatchEvent(
          new CustomEvent(`wf-toggle-group:${groupKey}`, { detail: { source: rootRef.current } }),
        );
      }
    } else if (!groupKey) {
      closeItem();
    } else if (!isFirstRef.current) {
      closeItem();
      document.dispatchEvent(new CustomEvent(`wf-toggle-fallback:${groupKey}`));
    }
  };

  return (
    // Root carries the className for group detection; image is absolute so all items share the same column position
    <div ref={rootRef} className={`${className ?? ''}`.trim()}>

      {/* Image — absolute at top-left, same position across every item */}
      <div ref={imageRef} className="absolute left-0 top-0 h-0 w-[350px] overflow-hidden opacity-0">
        {image?.src && (
          <img
            src={image.src}
            alt={image.alt ?? title}
            className="block h-[342px] w-full rounded-[3px] object-cover"
          />
        )}
      </div>

      {/* Toggle content — offset right to clear the image column (350px + 42px gap) */}
      <div className="pl-[392px]">
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

        {/* Body text — initial state via Tailwind classes; GSAP overrides with inline styles */}
        <div ref={bodyRef} className="mt-0 h-0 overflow-hidden opacity-0">
          <p
            className="text-2xl text-[#2A354D]"
            style={{ fontFamily: 'Helvetica Condensed', fontWeight: 300 }}
          >
            {content}
          </p>
        </div>
      </div>
    </div>
  );
};
