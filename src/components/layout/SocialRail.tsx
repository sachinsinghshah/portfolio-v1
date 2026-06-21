import { siteConfig } from "@/data/siteConfig";
import { GithubIcon, LinkedinIcon, XIcon, MailIcon } from "@/components/ui/icons";

export default function SocialRail() {
  return (
    <div className="social-rail" aria-label="Social links">
      <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" data-hot aria-label="GitHub">
        <GithubIcon />
      </a>
      <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" data-hot aria-label="LinkedIn">
        <LinkedinIcon />
      </a>
      <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" data-hot aria-label="X">
        <XIcon />
      </a>
      <a href={`mailto:${siteConfig.email}`} data-hot aria-label="Email">
        <MailIcon />
      </a>
    </div>
  );
}
