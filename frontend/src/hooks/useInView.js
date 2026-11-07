import { useState, useEffect, useRef } from 'react';

/**
 * Lightweight, zero-dependency IntersectionObserver hook for viewport entrance animations.
 * Gracefully defaults to visible (true) if IntersectionObserver is unavailable or if reduced-motion is preferred.
 */
export const useInView = (options = {}) => {
  const { threshold = 0.1, rootMargin = '0px 0px -30px 0px', triggerOnce = true } = options;
  const [inView, setInView] = useState(false);
  const elementRef = useRef(null);

  useEffect(() => {
    // If reduced motion is requested or IntersectionObserver is unsupported, immediately display
    if (
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches
    ) {
      setInView(true);
      return;
    }

    const element = elementRef.current;
    if (!element) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setInView(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => {
      if (element) {
        observer.unobserve(element);
      }
    };
  }, [threshold, rootMargin, triggerOnce]);

  return [elementRef, inView];
};

export default useInView;
