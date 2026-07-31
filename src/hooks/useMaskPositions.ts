import { useState, useEffect, useCallback, type RefObject } from 'react';

export interface MaskPosition {
  x: number;
  y: number;
  sw: number;
  sh: number;
}

export function useMaskPositions(
  sectionRef: RefObject<HTMLElement | null>,
  cardRefs: RefObject<(HTMLElement | null)[]>,
  cardCount: number
) {
  const [positions, setPositions] = useState<MaskPosition[]>([]);

  const measure = useCallback(() => {
    const section = sectionRef.current;
    const cards = cardRefs.current;
    if (!section) return;

    const sectionRect = section.getBoundingClientRect();
    const sectionScrollTop = window.scrollY + sectionRect.top;
    const sectionScrollLeft = window.scrollX + sectionRect.left;

    const newPositions: MaskPosition[] = [];
    for (let i = 0; i < cardCount; i++) {
      const card = cards?.[i];
      if (!card) {
        newPositions.push({ x: 0, y: 0, sw: sectionRect.width, sh: sectionRect.height });
        continue;
      }
      const cardRect = card.getBoundingClientRect();
      newPositions.push({
        x: window.scrollX + cardRect.left - sectionScrollLeft,
        y: window.scrollY + cardRect.top - sectionScrollTop,
        sw: sectionRect.width,
        sh: sectionRect.height,
      });
    }
    setPositions(newPositions);
  }, [sectionRef, cardRefs, cardCount]);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    measure();

    const observer = new ResizeObserver(() => measure());
    observer.observe(section);
    window.addEventListener('scroll', measure, { passive: true });
    window.addEventListener('resize', measure);

    return () => {
      observer.disconnect();
      window.removeEventListener('scroll', measure);
      window.removeEventListener('resize', measure);
    };
  }, [sectionRef, measure]);

  return positions;
}
