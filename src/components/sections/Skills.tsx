import Image from "next/image";
import type { CSSProperties } from "react";
import { TechIcon } from "@/components/ui/icons";
import { skillPlanets, skillFallback } from "@/data/skills";

export default function Skills() {
  return (
    <section className="sec-pad" id="skills">
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker reveal">
            <span className="dot" />
            My Skills
          </span>
          <h2 className="reveal" data-d="1">
            Technologies I <span className="grad-text">Work With</span>
          </h2>
          <p className="reveal" data-d="2">
            A galaxy of tools I orbit daily to build modern, scalable and interactive applications.
          </p>
        </div>

        <div className="galaxy reveal" data-d="1">
          <div className="orbit o1" aria-hidden>
            <span className="node" />
          </div>
          <div className="orbit o2" aria-hidden>
            <span className="node" />
          </div>
          <div className="orbit o3" aria-hidden />
          <div className="galaxy-core">
            <Image src="/v2/avatar-core.png" alt="Sachin" fill sizes="260px" style={{ objectFit: "cover", objectPosition: "50% 30%" }} />
            <span className="core-label">SACHIN · CORE</span>
          </div>

          {[1, 2, 3].map((ring) => (
            <div className={`ringset rs${ring}`} key={ring} aria-hidden>
              {skillPlanets
                .filter((p) => p.ring === ring)
                .map((p) => (
                  <div
                    className="planet"
                    key={p.name}
                    style={{ "--r": `${p.radius}px`, "--a": p.angle, "--dly": p.delay } as CSSProperties}
                  >
                    <div className="spinner">
                      <div className="body">
                        <div
                          className="ic"
                          style={
                            p.icon === "typescript"
                              ? { background: "radial-gradient(circle at 34% 28%,#5b9bf0,#1f5bbf 70%)" }
                              : undefined
                          }
                        >
                          {p.icon === "typescript" ? (
                            <b style={{ font: "700 18px var(--font-d)", color: "#fff", position: "relative", zIndex: 1 }}>
                              TS
                            </b>
                          ) : (
                            <TechIcon name={p.icon} />
                          )}
                        </div>
                        <span className="nm">{p.name}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div className="skill-fallback">
          {skillFallback.map((s) => (
            <div className="ic glass" key={s}>
              {s}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
