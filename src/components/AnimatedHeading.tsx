"use client";

import { useEffect, useRef, useState } from "react";

type AnimatedHeadingProps = {
  as?: "h1" | "h2" | "p";
  children: string;
  className?: string;
  lines?: readonly string[];
  reveal?: boolean;
};

export function AnimatedHeading({ as = "h2", children, className = "", lines = [children], reveal }: AnimatedHeadingProps) {
  const headingRef = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);
  const Tag = as;

  useEffect(() => {
    // A `reveal` prop drives the animation externally; only self-observe when it is absent.
    if (reveal !== undefined) return;
    const element = headingRef.current;
    if (!element) return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) {
        setRevealed(true);
        observer.disconnect();
      }
    }, { threshold: 0.12 });
    observer.observe(element);
    return () => observer.disconnect();
  }, [reveal]);

  return (
    <Tag ref={(element) => { headingRef.current = element; }} className={`amed-heading-reveal ${(reveal ?? revealed) ? "amed-heading-reveal--visible" : ""} ${className}`}>
      {lines.map((line, index) => (
        <span className="amed-heading-line" aria-hidden="true" key={`${line}-${index}`}>
          <span style={{ transitionDelay: `${100 + index * 90}ms` }}>{line}</span>
        </span>
      ))}
      <span className="sr-only">{children}</span>
    </Tag>
  );
}
