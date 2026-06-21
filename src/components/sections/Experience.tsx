import { ExpIcon } from "@/components/ui/icons";
import { experienceItems } from "@/data/experience";

export default function Experience() {
  return (
    <section className="sec-pad" id="experience">
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker reveal">
            <span className="dot" />
            My Journey
          </span>
          <h2 className="reveal" data-d="1">
            The Path So <span className="grad-text">Far</span>
          </h2>
          <p className="reveal" data-d="2">
            Every milestone, a new level unlocked on the way to building better software.
          </p>
        </div>

        <div className="path-wrap">
          <div className="path-line" aria-hidden />
          {experienceItems.map((it, i) => (
            <div className="milestone reveal" data-d={i === 0 ? undefined : String(i)} key={it.level}>
              <div className="ms-node">
                <ExpIcon name={it.icon} />
              </div>
              <span className="ms-level">{it.level}</span>
              <div className="glass">
                <div className="ms-date">{it.date}</div>
                <div className="ms-row">
                  <h4>{it.role}</h4>
                  <span className="org">{it.org}</span>
                </div>
                <p>{it.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
