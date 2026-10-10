import { useEffect, useRef, useState, type ReactNode } from "react";

type SectionProps = {
  id: string;
  eyebrow: string;
  title: string;
  children: ReactNode;
  className?: string;
};

export default function Section({
  id,
  eyebrow,
  title,
  children,
  className = "",
}: SectionProps) {
  const sectionRef = useRef<HTMLElement>(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    if (!("IntersectionObserver" in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.12 },
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      id={id}
      aria-labelledby={`${id}-title`}
      className={`scroll-mt-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-[0_14px_50px_-35px_rgba(15,23,42,0.24)] transition duration-700 ease-out sm:p-9 lg:p-11 ${
        isVisible
          ? "translate-y-0 opacity-100"
          : "translate-y-4 opacity-0 motion-reduce:translate-y-0 motion-reduce:opacity-100"
      } ${className}`}
    >
      <div className="mb-7">
        <p className="text-sm font-bold uppercase tracking-[0.16em] text-emerald-700">
          {eyebrow}
        </p>
        <h2
          id={`${id}-title`}
          className="mt-2 text-2xl font-bold leading-tight tracking-tight text-slate-900 sm:text-3xl"
        >
          {title}
        </h2>
      </div>
      {children}
    </section>
  );
}
