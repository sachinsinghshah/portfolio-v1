import { CheckIcon, DownloadIcon, FeatureIcon } from "@/components/ui/icons";
import { siteConfig } from "@/data/siteConfig";

const checks = [
  "Clean & scalable architecture",
  "40% faster load times via SSR & CDN",
  "Design-systems & reusable components",
  "CI/CD, Docker & cloud deployment",
];

const stats = [
  { count: 3, suffix: "+", label: "Years Experience" },
  { count: 25, suffix: "+", label: "Projects Completed" },
  { count: 15, suffix: "+", label: "Technologies" },
  { count: 100, suffix: "%", label: "Client Satisfaction" },
];

const features = [
  { icon: "pixel", label: "Pixel Perfect Design" },
  { icon: "perf", label: "Performance Optimized" },
  { icon: "mobile", label: "Mobile Responsive" },
  { icon: "anim", label: "Interactive Animations" },
  { icon: "arch", label: "Clean Code Architecture" },
  { icon: "best", label: "Best Practices" },
];

export default function About() {
  return (
    <section className="sec-pad" id="about">
      <div className="wrap">
        <div className="about-grid">
          <div className="about-copy">
            <span className="kicker reveal">
              <span className="dot" />
              About Me
            </span>
            <h3 className="reveal" data-d="1" style={{ marginTop: 22 }}>
              Turning ideas into
              <br />
              living software.
            </h3>
            <p className="reveal" data-d="1">
              I&apos;m Sachin — a Software Engineer at 8om Internet building React/Next.js applications with SSR &amp;
              SSG. I love turning ideas into beautiful, interactive and performant web products that people actually
              enjoy using.
            </p>
            <div className="checks reveal" data-d="2">
              {checks.map((c) => (
                <div className="check" key={c}>
                  <i>
                    <CheckIcon />
                  </i>
                  {c}
                </div>
              ))}
            </div>
            <a
              href={siteConfig.resumeUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="btn btn-ghost reveal"
              data-d="3"
              data-mag
              data-hot
            >
              Download Resume <DownloadIcon />
            </a>
          </div>

          <div className="workstation reveal" data-d="2">
            <div className="ws-laptop">
              <div className="bar">
                <i />
                <i />
                <i />
              </div>
              <div className="code" id="codeBlock">
                <span className="ln">
                  <span className="c-com">{"// shipping experiences that feel alive"}</span>
                </span>
                <span className="ln">
                  <span className="c-key">const</span> <span className="c-var">dev</span> ={" "}
                  <span className="c-fn">createDeveloper</span>
                  {"({"}
                </span>
                <span className="ln">
                  {"  "}
                  <span className="c-var">name</span>: <span className="c-str">{'"Sachin Singh Shah"'}</span>,
                </span>
                <span className="ln">
                  {"  "}
                  <span className="c-var">stack</span>: [<span className="c-str">{'"Next.js"'}</span>,{" "}
                  <span className="c-str">{'"Node"'}</span>, <span className="c-str">{'"TS"'}</span>],
                </span>
                <span className="ln">
                  {"  "}
                  <span className="c-var">passion</span>: <span className="c-str">{'"building the web"'}</span>,
                </span>
                <span className="ln">{"});"}</span>
                <span className="ln" />
                <span className="ln">
                  <span className="c-fn">dev</span>.<span className="c-fn">ship</span>(
                  <span className="c-str">{'"something great"'}</span>);
                </span>
              </div>
            </div>
            <div className="ws-window w1 glass">
              <div className="v" data-count="40" data-suffix="%">
                0%
              </div>
              <div className="l">faster loads</div>
            </div>
            <div className="ws-window w2 glass">
              <div className="v" data-count="30" data-suffix="+">
                0+
              </div>
              <div className="l">UI components</div>
            </div>
          </div>
        </div>

        <div className="stats">
          {stats.map((s, i) => (
            <div className="stat glass reveal" data-d={i === 0 ? undefined : String(i)} key={s.label}>
              <div className="num grad-text" data-count={s.count} data-suffix={s.suffix}>
                {`0${s.suffix}`}
              </div>
              <div className="lbl">{s.label}</div>
            </div>
          ))}
        </div>

        <div className="features">
          {features.map((f, i) => (
            <div className="feature glass reveal" data-d={i === 0 ? undefined : String(i)} key={f.label}>
              <div className="fi">
                <FeatureIcon name={f.icon} />
              </div>
              <span>{f.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
