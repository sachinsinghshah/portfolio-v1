"use client";

import { useEffect } from "react";

type Particle = { x: number; y: number; vx: number; vy: number; r: number; c: number[]; a: number };

export default function SiteInteractions() {
  useEffect(() => {
    const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const touch = matchMedia("(max-width: 860px)").matches || "ontouchstart" in window;
    const cleanups: Array<() => void> = [];

    /* Particles */
    const cv = document.getElementById("particles") as HTMLCanvasElement | null;
    const ctx = cv?.getContext("2d");
    if (cv && ctx && !reduce) {
      let W = 0, H = 0, parts: Particle[] = [], raf = 0;
      const DPR = Math.min(window.devicePixelRatio || 1, 2);
      const COL = [[59, 130, 246], [139, 92, 246], [6, 182, 212]];
      const resize = () => {
        W = cv.width = innerWidth * DPR;
        H = cv.height = innerHeight * DPR;
        cv.style.width = innerWidth + "px";
        cv.style.height = innerHeight + "px";
        const n = Math.min(90, Math.floor((innerWidth * innerHeight) / 18000));
        parts = Array.from({ length: n }, () => ({
          x: Math.random() * W,
          y: Math.random() * H,
          vx: (Math.random() - 0.5) * 0.22 * DPR,
          vy: (Math.random() - 0.5) * 0.22 * DPR,
          r: (Math.random() * 1.6 + 0.5) * DPR,
          c: COL[Math.floor(Math.random() * COL.length)],
          a: Math.random() * 0.5 + 0.25,
        }));
      };
      const mouse = { x: -9999, y: -9999 };
      const onMouse = (e: MouseEvent) => {
        mouse.x = e.clientX * DPR;
        mouse.y = e.clientY * DPR;
      };
      const LINK = 130 * DPR;
      const tick = () => {
        ctx.clearRect(0, 0, W, H);
        for (let i = 0; i < parts.length; i++) {
          const p = parts[i];
          p.x += p.vx;
          p.y += p.vy;
          if (p.x < 0 || p.x > W) p.vx *= -1;
          if (p.y < 0 || p.y > H) p.vy *= -1;
          for (let j = i + 1; j < parts.length; j++) {
            const q = parts[j], dx = p.x - q.x, dy = p.y - q.y, d = Math.hypot(dx, dy);
            if (d < LINK) {
              ctx.strokeStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${(1 - d / LINK) * 0.5})`;
              ctx.lineWidth = 0.6 * DPR;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(q.x, q.y);
              ctx.stroke();
            }
          }
          const md = Math.hypot(p.x - mouse.x, p.y - mouse.y);
          if (md < LINK * 1.6) {
            ctx.strokeStyle = `rgba(160,190,255,${(1 - md / (LINK * 1.6)) * 0.5})`;
            ctx.lineWidth = 0.7 * DPR;
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(mouse.x, mouse.y);
            ctx.stroke();
          }
          ctx.beginPath();
          ctx.arc(p.x, p.y, p.r, 0, 7);
          ctx.fillStyle = `rgba(${p.c[0]},${p.c[1]},${p.c[2]},${p.a})`;
          ctx.fill();
        }
        raf = requestAnimationFrame(tick);
      };
      resize();
      addEventListener("resize", resize);
      addEventListener("mousemove", onMouse);
      tick();
      cleanups.push(() => {
        cancelAnimationFrame(raf);
        removeEventListener("resize", resize);
        removeEventListener("mousemove", onMouse);
      });
    }

    /* Custom cursor */
    if (!touch) {
      const dot = document.querySelector<HTMLElement>(".cur-dot");
      const ring = document.querySelector<HTMLElement>(".cur-ring");
      if (dot && ring) {
        let mx = innerWidth / 2, my = innerHeight / 2, rx = mx, ry = my, raf = 0;
        const onMove = (e: MouseEvent) => {
          mx = e.clientX;
          my = e.clientY;
          dot.style.transform = `translate(${mx}px,${my}px) translate(-50%,-50%)`;
        };
        addEventListener("mousemove", onMove);
        const loop = () => {
          rx += (mx - rx) * 0.18;
          ry += (my - ry) * 0.18;
          ring.style.transform = `translate(${rx}px,${ry}px) translate(-50%,-50%)`;
          raf = requestAnimationFrame(loop);
        };
        loop();
        const hots = Array.from(document.querySelectorAll("[data-hot], a, button, input, textarea"));
        const enter = () => ring.classList.add("hot");
        const leave = () => ring.classList.remove("hot");
        hots.forEach((el) => {
          el.addEventListener("mouseenter", enter);
          el.addEventListener("mouseleave", leave);
        });
        cleanups.push(() => {
          cancelAnimationFrame(raf);
          removeEventListener("mousemove", onMove);
          hots.forEach((el) => {
            el.removeEventListener("mouseenter", enter);
            el.removeEventListener("mouseleave", leave);
          });
        });
      }
    }

    /* Magnetic buttons */
    if (!touch) {
      document.querySelectorAll<HTMLElement>("[data-mag]").forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          el.style.transform = `translate(${(e.clientX - r.left - r.width / 2) * 0.28}px,${(e.clientY - r.top - r.height / 2) * 0.4}px)`;
        };
        const out = () => {
          el.style.transform = "";
        };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", out);
        cleanups.push(() => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", out);
        });
      });
    }

    /* 3D tilt */
    if (!touch) {
      document.querySelectorAll<HTMLElement>("[data-tilt]").forEach((el) => {
        const move = (e: MouseEvent) => {
          const r = el.getBoundingClientRect();
          const px = (e.clientX - r.left) / r.width - 0.5, py = (e.clientY - r.top) / r.height - 0.5;
          el.style.transform = `perspective(900px) rotateY(${px * 12}deg) rotateX(${-py * 12}deg)`;
        };
        const out = () => {
          el.style.transform = "perspective(900px) rotateY(0) rotateX(0)";
        };
        el.addEventListener("mousemove", move);
        el.addEventListener("mouseleave", out);
        cleanups.push(() => {
          el.removeEventListener("mousemove", move);
          el.removeEventListener("mouseleave", out);
        });
      });
    }

    /* Reveal on scroll */
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) {
            en.target.classList.add("in");
            io.unobserve(en.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -8% 0px" }
    );
    document.querySelectorAll(".reveal").forEach((el) => io.observe(el));
    cleanups.push(() => io.disconnect());

    /* Count-up */
    const animCount = (el: HTMLElement) => {
      const target = +(el.dataset.count || "0"), suf = el.dataset.suffix || "", dur = 1500, t0 = performance.now();
      const step = (t: number) => {
        const p = Math.min(1, (t - t0) / dur), e = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(target * e) + suf;
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };
    const cio = new IntersectionObserver(
      (ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) {
            animCount(en.target as HTMLElement);
            cio.unobserve(en.target);
          }
        });
      },
      { threshold: 0.5 }
    );
    document.querySelectorAll<HTMLElement>("[data-count]").forEach((el) => cio.observe(el));
    cleanups.push(() => cio.disconnect());

    /* Typed code lines */
    const lines = document.querySelectorAll<HTMLElement>("#codeBlock .ln");
    const block = document.getElementById("codeBlock");
    if (lines.length && block) {
      const cb = new IntersectionObserver(
        (ents) => {
          ents.forEach((en) => {
            if (en.isIntersecting) {
              lines.forEach((l, i) => {
                l.style.animationDelay = i * 0.12 + "s";
              });
              cb.disconnect();
            }
          });
        },
        { threshold: 0.4 }
      );
      cb.observe(block);
      cleanups.push(() => cb.disconnect());
    }

    /* Hero parallax */
    if (!touch && !reduce) {
      const stage = document.querySelector<HTMLElement>(".stage");
      const floats = Array.from(document.querySelectorAll<HTMLElement>("[data-float]"));
      const av = document.querySelector<HTMLElement>(".avatar-main");
      if (stage) {
        const move = (e: MouseEvent) => {
          const r = stage.getBoundingClientRect();
          const x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
          floats.forEach((f, i) => {
            const d = ((i % 3) + 1) * 10;
            f.style.translate = `${x * d}px ${y * d}px`;
          });
          if (av) av.style.translate = `${x * -14}px ${y * -14}px`;
        };
        const out = () => {
          floats.forEach((f) => {
            f.style.translate = "";
          });
          if (av) av.style.translate = "";
        };
        stage.addEventListener("mousemove", move);
        stage.addEventListener("mouseleave", out);
        cleanups.push(() => {
          stage.removeEventListener("mousemove", move);
          stage.removeEventListener("mouseleave", out);
        });
      }
    }

    return () => cleanups.forEach((fn) => fn());
  }, []);

  return null;
}
