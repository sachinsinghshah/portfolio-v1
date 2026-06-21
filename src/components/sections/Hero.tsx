import Image from "next/image";
import { TechIcon, ArrowRightIcon, PaperPlaneIcon } from "@/components/ui/icons";

export default function Hero() {
  return (
    <section className="hero sec-pad" id="home">
      <div className="wrap hero-grid">
        <div className="stage reveal">
          <div className="stage-glow" aria-hidden />
          <div className="ring r1" aria-hidden>
            <span className="node" />
          </div>
          <div className="ring r2" aria-hidden>
            <span className="node" />
          </div>
          <div className="ring r3" aria-hidden />
          <div className="platform" aria-hidden />
          <Image className="avatar-main" src="/v2/avatar-portrait.png" alt="Sachin Singh Shah" width={685} height={1016} priority />
          <div className="chip c1" data-float>
            <i>
              <TechIcon name="react" />
            </i>
            React
          </div>
          <div className="chip c2" data-float>
            <i>
              <TechIcon name="nextjs" />
            </i>
            Next.js
          </div>
          <div className="chip c3" data-float>
            <i style={{ background: "#3178C6" }}>
              <b style={{ font: "700 11px var(--font-d)", color: "#fff" }}>TS</b>
            </i>
            TypeScript
          </div>
          <div className="chip c4" data-float>
            <i>
              <TechIcon name="nodejs" />
            </i>
            Node.js
          </div>
          <div className="chip c5" data-float>
            <i>
              <TechIcon name="postgresql" />
            </i>
            PostgreSQL
          </div>
          <div className="chip c6" data-float>
            <i>
              <TechIcon name="prisma" />
            </i>
            Prisma
          </div>
        </div>

        <div className="hero-copy">
          <span className="kicker reveal">
            <span className="dot" />
            Full Stack Developer
          </span>
          <h1 className="reveal" data-d="1">
            Building Digital
            <br />
            Experiences That
            <br />
            <span className="alive">Feel Alive.</span>
          </h1>
          <p className="lead reveal" data-d="2">
            I craft modern, scalable and interactive web experiences with React, Next.js &amp; Node — engineered for
            speed, built to feel alive.
          </p>
          <div className="hero-actions reveal" data-d="3">
            <a href="#projects" className="btn btn-primary" data-mag data-hot>
              View My Work <ArrowRightIcon />
            </a>
            <a href="#contact" className="btn btn-ghost" data-mag data-hot>
              Let&apos;s Connect <PaperPlaneIcon />
            </a>
          </div>
          <div className="scroll-cue reveal" data-d="4">
            <span className="mouse">
              <span />
            </span>
            Scroll to explore
          </div>
        </div>
      </div>
    </section>
  );
}
