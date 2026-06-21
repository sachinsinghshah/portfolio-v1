"use client";

import { useState, type FormEvent } from "react";
import { siteConfig } from "@/data/siteConfig";
import { MailIcon, GithubIcon, LinkedinIcon, XIcon, PhoneIcon, PaperPlaneIcon } from "@/components/ui/icons";

export default function Contact() {
  const [note, setNote] = useState<{ text: string; error: boolean }>({ text: "", error: false });
  const [sending, setSending] = useState(false);

  const onSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    const data = new FormData(form);
    if (!data.get("name") || !data.get("email") || !data.get("message")) {
      setNote({ text: "⚠ Please fill in name, email and message.", error: true });
      return;
    }
    setNote({ text: "◆ Transmitting message...", error: false });
    setSending(true);
    setTimeout(() => {
      setNote({ text: "✓ Message sent! I'll get back to you soon.", error: false });
      setSending(false);
      form.reset();
    }, 1300);
  };

  return (
    <section className="sec-pad" id="contact">
      <div className="wrap">
        <div className="contact-grid">
          <div className="contact-info">
            <span className="kicker reveal">
              <span className="dot" />
              Get In Touch
            </span>
            <div className="globe-wrap reveal" data-d="1" style={{ marginTop: 30, justifyContent: "flex-start" }} aria-hidden>
              <div className="globe">
                <div className="g-globe" />
                <div className="g-sweep" />
                <span className="blip b1" />
                <span className="blip b2" />
                <span className="blip b3" />
                <div className="g-core" />
              </div>
              <div className="g-orbit oa" />
              <div className="g-orbit ob" />
              <div className="g-sat sa">
                <div className="rot">
                  <i />
                </div>
              </div>
              <div className="g-sat sb">
                <div className="rot">
                  <i />
                </div>
              </div>
            </div>
            <h3 className="reveal" data-d="1">
              Let&apos;s Build
              <br />
              Something Great.
            </h3>
            <p className="reveal" data-d="2">
              Have a project in mind, or just want to say hi? My inbox is always open — let&apos;s create something that
              feels alive.
            </p>
            <div className="contact-list reveal" data-d="2">
              <a className="citem glass" href={`mailto:${siteConfig.email}`} data-hot>
                <div className="ci">
                  <MailIcon />
                </div>
                <div className="ct">
                  <div className="k">Email</div>
                  <div className="v">{siteConfig.email}</div>
                </div>
              </a>
              <a className="citem glass" href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" data-hot>
                <div className="ci">
                  <GithubIcon />
                </div>
                <div className="ct">
                  <div className="k">GitHub</div>
                  <div className="v">github.com/sachinsinghshah</div>
                </div>
              </a>
              <div className="citem glass">
                <div className="ci">
                  <PhoneIcon />
                </div>
                <div className="ct">
                  <div className="k">Location</div>
                  <div className="v">India · Open to Relocate</div>
                </div>
              </div>
            </div>
          </div>

          <form className="form glass reveal" data-d="1" id="contactForm" noValidate onSubmit={onSubmit}>
            <div className="row">
              <div className="field">
                <label htmlFor="cf-name">Your Name</label>
                <input id="cf-name" type="text" name="name" placeholder="Jane Doe" required />
              </div>
              <div className="field">
                <label htmlFor="cf-email">Your Email</label>
                <input id="cf-email" type="email" name="email" placeholder="jane@company.com" required />
              </div>
            </div>
            <div className="field">
              <label htmlFor="cf-subject">Subject</label>
              <input id="cf-subject" type="text" name="subject" placeholder="Let's work together" />
            </div>
            <div className="field">
              <label htmlFor="cf-msg">Message</label>
              <textarea id="cf-msg" name="message" placeholder="Tell me about your project..." required />
            </div>
            <button type="submit" className="btn btn-primary" data-mag data-hot disabled={sending}>
              Send Message <PaperPlaneIcon />
            </button>
            <div className="form-note" id="formNote" style={{ color: note.error ? "#ff6b8a" : "var(--cyan)" }}>
              {note.text}
            </div>
          </form>
        </div>

        <div className="dock-glow" aria-hidden />
        <div className="dock">
          <a href={siteConfig.social.github} target="_blank" rel="noopener noreferrer" data-mag data-hot aria-label="GitHub">
            <GithubIcon />
          </a>
          <a href={siteConfig.social.linkedin} target="_blank" rel="noopener noreferrer" data-mag data-hot aria-label="LinkedIn">
            <LinkedinIcon />
          </a>
          <a href={siteConfig.social.twitter} target="_blank" rel="noopener noreferrer" data-mag data-hot aria-label="X">
            <XIcon />
          </a>
          <a href={`mailto:${siteConfig.email}`} data-mag data-hot aria-label="Email">
            <MailIcon />
          </a>
        </div>
      </div>
    </section>
  );
}
