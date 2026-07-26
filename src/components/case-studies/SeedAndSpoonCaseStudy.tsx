"use client";

import { useEffect, useRef } from "react";
import styles from "./SeedAndSpoonCaseStudy.module.css";

export default function SeedAndSpoonCaseStudy() {
  const rootRef = useRef<HTMLDivElement>(null);
  const bignumRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    const riseEls = root.querySelectorAll(`.${styles.rise}`);
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add(styles.riseIn);
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14 }
    );
    riseEls.forEach((el) => io.observe(el));

    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const el = bignumRef.current;
    let raf = 0;
    let timeout: ReturnType<typeof setTimeout> | undefined;
    if (!reduce && el) {
      let start: number | null = null;
      const dur = 1500;
      const step = (t: number) => {
        if (start === null) start = t;
        const p = Math.min((t - start) / dur, 1);
        const eased = 1 - Math.pow(1 - p, 3);
        el.textContent = "$" + Math.round(eased * 250) + "K+";
        if (p < 1) raf = requestAnimationFrame(step);
      };
      timeout = setTimeout(() => {
        raf = requestAnimationFrame(step);
      }, 450);
    }

    return () => {
      io.disconnect();
      if (timeout) clearTimeout(timeout);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <div className={styles.page} ref={rootRef}>
      <div className={styles.wrap}>
        <div className={styles.top}>
          <div className={styles.brand}>Leviora Ventures</div>
          <div className={styles.eyebrow}>Case Study — Seed &amp; Spoon</div>
        </div>
      </div>

      <header className={styles.hero}>
        <div className={styles.wrap}>
          <div className={`${styles.eyebrow} ${styles.eyebrowSky} ${styles.rise}`}>
            For nonprofits &amp; mission-driven founders
          </div>
          <h1 className={styles.rise}>
            One founder. Zero software budget. A <em>quarter-million-dollar</em> stack.
          </h1>
          <p className={`${styles.heroSub} ${styles.rise}`}>
            How Leviora built a food-security nonprofit&rsquo;s entire engineering and program
            infrastructure in-house — and kept every raised dollar pointed at the mission.
          </p>

          <div className={`${styles.lever} ${styles.rise}`}>
            <div className={styles.side}>
              <div className={styles.lab}>The input</div>
              <ul>
                <li>
                  <span className={styles.num}>1</span>
                  <span>founder, self-taught full-stack</span>
                </li>
                <li>
                  <span className={styles.num}>2,160</span>
                  <span>hours of build &amp; program work</span>
                </li>
                <li>
                  <span className={styles.num}>$0</span>
                  <span>spent on SaaS subscriptions</span>
                </li>
              </ul>
            </div>
            <div className={styles.rule}></div>
            <div className={`${styles.side} ${styles.out}`}>
              <div className={styles.lab}>The output — estimated replacement value</div>
              <div className={styles.big} ref={bignumRef}>
                $250K+
              </div>
              <div className={styles.cap}>of engineering &amp; program infrastructure, delivered in-house.</div>
            </div>
          </div>

          <div className={`${styles.context} ${styles.rise}`}>
            <div>
              <div className={styles.ctLab}>Client</div>
              <div className={styles.ctVal}>Seed &amp; Spoon</div>
            </div>
            <div>
              <div className={styles.ctLab}>Sector</div>
              <div className={styles.ctVal}>Food security</div>
            </div>
            <div>
              <div className={styles.ctLab}>Engagement</div>
              <div className={styles.ctVal}>Platform + program</div>
            </div>
            <div>
              <div className={styles.ctLab}>Timeline</div>
              <div className={styles.ctVal}>Feb 2026 –</div>
            </div>
          </div>
        </div>
      </header>

      <section className={styles.band}>
        <div className={styles.wrap}>
          <div className={styles.two}>
            <div className={styles.rise}>
              <div className={styles.eyebrow}>01 — The challenge</div>
              <h2>A first-year budget, and no room to overspend.</h2>
              <p className={`${styles.lede} ${styles.ledeMuted}`}>
                Seed &amp; Spoon set out to fight food insecurity in Newark on a founding nonprofit
                budget. The arithmetic was unforgiving: every dollar spent renting software — CRM,
                donor tools, email, analytics — is a dollar taken away from meals. Off-the-shelf
                platforms would have consumed the mission before it could start.
              </p>
            </div>
            <div className={styles.rise}>
              <div className={styles.eyebrow}>02 — The approach</div>
              <h2>Build it. Own it. Keep the dollars pointed at the problem.</h2>
              <p className={`${styles.lede} ${styles.ledeMuted}`}>
                Leviora&rsquo;s answer was to{" "}
                <b style={{ color: "var(--navy)" }}>build, not buy</b>. Instead of renting
                infrastructure, we built it in-house and kept ownership — a full engineering and
                program stack engineered so recurring costs stay near zero.
              </p>
              <p className={styles.lede}>
                <span className={styles.accentLine}>Lean isn&rsquo;t the constraint here. It&rsquo;s the strategy.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className={`${styles.band} ${styles.bandBlue}`}>
        <div className={styles.wrap}>
          <div className={styles.rise}>
            <div className={styles.eyebrow}>03 — What we built</div>
            <h2>An entire operating stack, from database to donor receipt.</h2>
            <p className={`${styles.lede} ${styles.ledeMuted}`} style={{ maxWidth: "62ch" }}>
              Three bodies of work, delivered by one founder-operator — the software that runs the
              organization, the product it takes to the public, and the program and compliance
              backbone underneath it.
            </p>
          </div>
          <div className={styles.cards}>
            <div className={`${styles.card} ${styles.rise}`}>
              <div className={styles.grp}>Platform &amp; infrastructure</div>
              <div className={styles.items}>
                Next.js + Supabase web platform · 11-module CRM · live Stripe donor pipeline ·
                impact-reporting engine · communication &amp; outreach system · grant-prospect
                database · Featured Chef program · SEO &amp; analytics
              </div>
              <div className={styles.hrs}>
                <div className={styles.n}>1,270</div>
                <div className={styles.u}>Hours</div>
              </div>
            </div>
            <div className={`${styles.card} ${styles.rise}`}>
              <div className={styles.grp}>SpoonAssist</div>
              <div className={styles.items}>
                Grocery price-comparison platform for food-insecure families · meal planning ·
                pluggable price-provider architecture · community receipt-confirmation pipeline
              </div>
              <div className={styles.hrs}>
                <div className={styles.n}>480</div>
                <div className={styles.u}>Hours</div>
              </div>
            </div>
            <div className={`${styles.card} ${styles.rise}`}>
              <div className={styles.grp}>Program &amp; research</div>
              <div className={styles.items}>
                501(c)(3) formation &amp; compliance · HACCP food-safety plan &amp; SOPs · program
                design &amp; unit-cost model (~$3.56/meal) · legislative policy brief · published
                research white paper
              </div>
              <div className={styles.hrs}>
                <div className={styles.n}>410</div>
                <div className={styles.u}>Hours</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.band}>
        <div className={styles.wrap}>
          <div className={styles.rise}>
            <div className={styles.eyebrow}>04 — The result</div>
            <h2>Infrastructure that would have cost a quarter-million to outsource.</h2>
            <p
              className={`${styles.lede} ${styles.ledeMuted}`}
              style={{ marginBottom: "36px", maxWidth: "60ch" }}
            >
              Priced at professional market rates, the work delivered represents an estimated{" "}
              <b style={{ color: "var(--navy)" }}>$250K+ in replacement value</b> — built without
              pulling a single dollar from the mission budget, and fully owned by the organization.
            </p>
          </div>
          <div className={`${styles.stats} ${styles.rise}`}>
            <div className={styles.stat}>
              <div className={styles.n}>
                <em>$</em>250K+
              </div>
              <div className={styles.l}>Estimated replacement value</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.n}>2,160</div>
              <div className={styles.l}>Professional hours delivered</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.n}>
                <em>$</em>0
              </div>
              <div className={styles.l}>Recurring SaaS overhead</div>
            </div>
            <div className={styles.stat}>
              <div className={styles.n}>
                80<em>%</em>
              </div>
              <div className={styles.l}>Custom engineering</div>
            </div>
          </div>
          <p className={`${styles.method} ${styles.rise}`}>
            Valuation basis: an internal management estimate of professional-market replacement
            cost, decomposed component-by-component and priced at blended US rates. Sourcing
            scenarios bracket the range from ~$125K (offshore) to ~$450K (agency), with a mid-tier
            reference point near $293K. An estimate for planning and disclosure — not a formal
            appraisal.
          </p>
        </div>
      </section>

      <section className={`${styles.band} ${styles.bandBlue}`}>
        <div className={`${styles.wrap} ${styles.quote} ${styles.rise}`}>
          <p>
            &ldquo;When you&rsquo;ve lived the problem you&rsquo;re solving,{" "}
            <em>owning what you build</em> is the most honest way to build.&rdquo;
          </p>
          <div className={styles.attr}>Janelle Glanville · Founder, Leviora Ventures</div>
        </div>
      </section>

      <div className={styles.wrap}>
        <div className={`${styles.cta} ${styles.rise}`}>
          <div className={styles.eyebrow}>Work with Leviora</div>
          <h3>Build lean. Own your infrastructure.</h3>
          <p>
            Leviora Ventures helps mission-driven founders build the systems their work depends
            on — and keep their dollars where they belong.
          </p>
          <div className={styles.btns}>
            <a className={`${styles.btn} ${styles.btnPrimary}`} href="https://www.levioraventures.com/quote">
              Get a quote
            </a>
            <a className={`${styles.btn} ${styles.btnGhost}`} href="https://www.levioraventures.com">
              levioraventures.com →
            </a>
          </div>
        </div>
      </div>

      <div className={styles.wrap}>
        <footer>
          <span>Leviora Ventures · Newark, NJ</span>
          <span>Case study · Seed &amp; Spoon · 2026</span>
        </footer>
      </div>
    </div>
  );
}
