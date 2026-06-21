import Image from "next/image";
import { projects, projectShowcase } from "@/data/projects";
import { ExternalLinkIcon, CodeIcon } from "@/components/ui/icons";

export default function Projects() {
  const bySlug = Object.fromEntries(projects.map((p) => [p.slug, p]));
  const featured = bySlug[projectShowcase.featuredSlug];
  const fMeta = projectShowcase.meta[projectShowcase.featuredSlug];

  return (
    <section className="sec-pad" id="projects">
      <div className="wrap">
        <div className="sec-head">
          <span className="kicker reveal">
            <span className="dot" />
            My Work
          </span>
          <h2 className="reveal" data-d="1">
            Featured <span className="grad-text">Projects</span>
          </h2>
          <p className="reveal" data-d="2">
            A collection of products that showcase my passion for building exceptional, real-world software.
          </p>
        </div>

        <div className="proj-featured glass reveal" style={{ padding: 40 }}>
          <div className="feat-info">
            <div className="pnum">01</div>
            <h3>{fMeta.display}</h3>
            <p>{fMeta.blurb}</p>
            <div className="tags">
              {fMeta.tags?.map((t) => (
                <span className="tag" key={t}>
                  {t}
                </span>
              ))}
            </div>
            <div className="feat-actions">
              <a href={featured.liveUrl} target="_blank" rel="noopener noreferrer" className="btn btn-primary" data-mag data-hot>
                Live Demo <ExternalLinkIcon />
              </a>
              {featured.githubUrl && (
                <a href={featured.githubUrl} target="_blank" rel="noopener noreferrer" className="btn btn-ghost" data-mag data-hot>
                  Code <CodeIcon />
                </a>
              )}
            </div>
          </div>
          <div className="laptop reveal" data-d="2">
            <div className="laptop-screen" data-tilt>
              <div className="bar">
                <i />
                <i />
                <i />
              </div>
              <div className="shot">
                <Image
                  src={`/screenshots/${featured.slug}.png`}
                  alt={featured.title}
                  fill
                  sizes="(max-width:980px) 90vw, 640px"
                  style={{ objectFit: "cover", objectPosition: "top" }}
                />
              </div>
            </div>
            <div className="laptop-base" />
            <div className="laptop-glow" aria-hidden />
          </div>
        </div>

        <div className="proj-grid" style={{ marginTop: 24 }}>
          {projectShowcase.cardSlugs.map((slug, i) => {
            const p = bySlug[slug];
            const m = projectShowcase.meta[slug];
            return (
              <a
                href={p.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="pcard glass reveal"
                data-d={i === 0 ? undefined : String(i)}
                data-tilt
                data-hot
                key={slug}
              >
                <span className="badge">{m.category}</span>
                <div className="shot">
                  <Image
                    src={`/screenshots/${slug}.png`}
                    alt={m.display}
                    fill
                    sizes="(max-width:980px) 90vw, 400px"
                    style={{ objectFit: "cover", objectPosition: "top" }}
                  />
                </div>
                <div className="meta">
                  <h4>{m.display}</h4>
                  <span>{m.subtitle}</span>
                </div>
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}
