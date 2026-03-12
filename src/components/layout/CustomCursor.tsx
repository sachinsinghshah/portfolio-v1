"use client";

import { useEffect, useRef } from "react";

export default function CustomCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);
  const mouse = useRef({ x: 0, y: 0 });
  const ring = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number>(0);

  useEffect(() => {
    const mq = window.matchMedia("(pointer: fine)");
    if (!mq.matches) return;

    document.body.classList.add("cursor-none");

    const onMouseMove = (e: MouseEvent) => {
      mouse.current.x = e.clientX;
      mouse.current.y = e.clientY;

      if (dotRef.current) {
        dotRef.current.style.transform = `translate(${e.clientX - 4}px, ${e.clientY - 4}px)`;
      }
    };

    const onMouseOver = (e: MouseEvent) => {
      const target = e.target as Element;
      if (target.closest("a, button, [data-cursor='pointer']")) {
        if (ringRef.current) {
          ringRef.current.style.width = "48px";
          ringRef.current.style.height = "48px";
          ringRef.current.style.borderColor = "var(--accent)";
          ringRef.current.style.opacity = "0.8";
        }
      } else {
        if (ringRef.current) {
          ringRef.current.style.width = "32px";
          ringRef.current.style.height = "32px";
          ringRef.current.style.borderColor = "var(--text-secondary)";
          ringRef.current.style.opacity = "0.5";
        }
      }
    };

    const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

    const animate = () => {
      ring.current.x = lerp(ring.current.x, mouse.current.x, 0.12);
      ring.current.y = lerp(ring.current.y, mouse.current.y, 0.12);

      if (ringRef.current) {
        const w = parseFloat(ringRef.current.style.width || "32");
        const h = parseFloat(ringRef.current.style.height || "32");
        ringRef.current.style.transform = `translate(${ring.current.x - w / 2}px, ${ring.current.y - h / 2}px)`;
      }

      rafRef.current = requestAnimationFrame(animate);
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("mouseover", onMouseOver);
    rafRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      cancelAnimationFrame(rafRef.current);
      document.body.classList.remove("cursor-none");
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "8px",
          height: "8px",
          background: "var(--accent)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9998,
          transition: "opacity 0.2s",
        }}
      />
      <div
        ref={ringRef}
        style={{
          position: "fixed",
          top: 0,
          left: 0,
          width: "32px",
          height: "32px",
          border: "1.5px solid var(--text-secondary)",
          borderRadius: "50%",
          pointerEvents: "none",
          zIndex: 9997,
          opacity: 0.5,
          transition: "width 0.2s, height 0.2s, border-color 0.2s, opacity 0.2s",
        }}
      />
    </>
  );
}
