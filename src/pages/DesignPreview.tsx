import { useState } from "react";
import "./design-preview.css";

const previewTabs = [
  { id: "today", label: "Today" },
  { id: "learn", label: "Learn" },
  { id: "progress", label: "Progress" },
] as const;

type PreviewTab = (typeof previewTabs)[number]["id"];

const tabContent: Record<
  PreviewTab,
  { greeting: string; title: string; description: string }
> = {
  today: {
    greeting: "SATURDAY, OCTOBER 10",
    title: "A little progress, at your pace.",
    description: "Small, thoughtful choices are enough. Let’s take today one step at a time.",
  },
  learn: {
    greeting: "A QUICK LESSON",
    title: "Calories are simply energy.",
    description: "Your body uses energy for everything from breathing to taking a walk.",
  },
  progress: {
    greeting: "YOUR JOURNEY",
    title: "Progress isn’t a straight line.",
    description: "Look at the gentle trend over time—not the number from just one morning.",
  },
};

export default function DesignPreview() {
  const [activeTab, setActiveTab] = useState<PreviewTab>("today");
  const content = tabContent[activeTab];

  return (
    <main className="design-preview">
      <header className="preview-topbar">
        <a className="preview-wordmark" href="/calories-explained">
          <span className="preview-mark" aria-hidden="true">g</span>
          <span>goodground</span>
        </a>
        <a className="preview-exit" href="/calories-explained">
          Back to the app
        </a>
      </header>

      <section className="preview-intro">
        <p className="preview-kicker">
          <span className="preview-kicker-dot" />
          A visual direction for your app
        </p>
        <h1>
          A little more
          <br />
          <em>human.</em>
        </h1>
        <p className="preview-intro-copy">
          Warm, clear, and quietly motivating. A calmer place to learn about
          food, build habits, and notice your progress—without making every
          screen feel like a scoreboard.
        </p>
        <div className="preview-principles" aria-label="Design principles">
          <span>Easy to understand</span>
          <span>Room to breathe</span>
          <span>Progress, not pressure</span>
        </div>
      </section>

      <section className="preview-stage" aria-label="Interactive app design preview">
        <div className="preview-stage-heading">
          <div>
            <p className="preview-overline">THE APP, REIMAGINED</p>
            <h2>A welcoming everyday companion</h2>
          </div>
          <span className="preview-desktop-note">Tap the tabs to explore</span>
        </div>

        <div className="mock-app">
          <div className="mock-app-bar">
            <div className="mock-brand">
              <span className="mock-brand-mark" aria-hidden="true">g</span>
              <span>goodground</span>
            </div>
            <button aria-label="Open profile" className="mock-avatar" type="button">
              A
            </button>
          </div>

          <div className="mock-body">
            <div className="mock-welcome">
              <div className="mock-welcome-copy">
                <p className="mock-date">{content.greeting}</p>
                <h3 key={content.title}>{content.title}</h3>
                <p className="mock-description">{content.description}</p>
              </div>
              <div aria-hidden="true" className="mock-sunrise">
                <div className="mock-sun" />
                <div className="mock-hill mock-hill-back" />
                <div className="mock-hill mock-hill-front" />
                <span className="mock-spark mock-spark-one" />
                <span className="mock-spark mock-spark-two" />
              </div>
            </div>

            <div className="mock-content-grid">
              <article className="mock-card mock-calories-card">
                <div className="mock-card-topline">
                  <span className="mock-card-label">TODAY’S NOURISHMENT</span>
                  <span aria-hidden="true" className="mock-small-icon" />
                </div>
                <div className="mock-calories">
                  <strong>{activeTab === "today" ? "1,240" : activeTab === "learn" ? "2,000" : "1,510"}</strong>
                  <span>calories</span>
                </div>
                <div className="mock-progress-track">
                  <div
                    className="mock-progress-fill"
                    style={{
                      width: activeTab === "today" ? "68%" : activeTab === "learn" ? "82%" : "74%",
                    }}
                  />
                </div>
                <div className="mock-progress-caption">
                  <span>1,240 enjoyed</span>
                  <span>1,800 target</span>
                </div>
                <p className="mock-card-note">
                  {activeTab === "today"
                    ? "You’re finding your rhythm. Keep going gently."
                    : activeTab === "learn"
                      ? "A target is a guide, not a grade."
                      : "Your weekly average is moving steadily."}
                </p>
              </article>

              <article className="mock-card mock-next-card">
                <div className="mock-card-topline">
                  <span className="mock-card-label">
                    {activeTab === "today" ? "A GENTLE NEXT STEP" : activeTab === "learn" ? "TODAY’S LESSON" : "A NOTE FOR YOU"}
                  </span>
                  <span aria-hidden="true" className="mock-next-icon" />
                </div>
                <h4>
                  {activeTab === "today"
                    ? "Log one thing you ate"
                    : activeTab === "learn"
                      ? "Food scale basics"
                      : "You showed up today"}
                </h4>
                <p>
                  {activeTab === "today"
                    ? "No need to get everything perfect. Start wherever you are."
                    : activeTab === "learn"
                      ? "A quick, practical guide. You don’t have to weigh forever."
                      : "That matters more than any single number on the scale."}
                </p>
                <button className="mock-action" type="button">
                  {activeTab === "today" ? "Add a food" : activeTab === "learn" ? "Keep learning" : "See my progress"}
                  <span aria-hidden="true">→</span>
                </button>
              </article>
            </div>

            <nav aria-label="Preview tabs" className="mock-tabbar">
              {previewTabs.map((tab) => (
                <button
                  aria-current={activeTab === tab.id ? "page" : undefined}
                  className={activeTab === tab.id ? "mock-tab mock-tab-active" : "mock-tab"}
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  type="button"
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>
        <p className="preview-stage-caption">
          Concept preview · These are sample numbers and aren’t saved.
        </p>
      </section>

      <section className="preview-details" aria-label="Design details">
        <article className="preview-detail">
          <p className="preview-overline">01 · TYPE</p>
          <h2 className="detail-type-heading">A softer voice.</h2>
          <p>
            Fraunces for warm, distinctive headlines. DM Sans for friendly,
            crisp reading and easy-to-scan numbers.
          </p>
          <div className="font-specimen">
            <span className="font-specimen-serif">Your journey, your pace.</span>
            <span className="font-specimen-sans">Small steps add up.</span>
          </div>
        </article>

        <article className="preview-detail">
          <p className="preview-overline">02 · COLOUR</p>
          <h2>Quiet confidence.</h2>
          <p>
            A soft oat background, inky text, and one grounded green accent.
            Colour is saved for meaning—not decoration.
          </p>
          <div className="swatches" aria-label="Muted oat, ink, and moss color palette">
            <span className="swatch swatch-oat"><span>Oat</span></span>
            <span className="swatch swatch-ink"><span>Ink</span></span>
            <span className="swatch swatch-moss"><span>Moss</span></span>
            <span className="swatch swatch-sage"><span>Sage</span></span>
          </div>
        </article>

        <article className="preview-detail preview-detail-motion">
          <p className="preview-overline">03 · MOTION</p>
          <h2>Subtle, never noisy.</h2>
          <p>
            Sections settle in softly. Progress eases forward. The interface
            responds to taps with a little life, while respecting reduced-motion
            preferences.
          </p>
          <div className="motion-demo" aria-hidden="true">
            <span className="motion-orbit motion-orbit-one" />
            <span className="motion-orbit motion-orbit-two" />
            <span className="motion-center" />
            <span className="motion-label">a little progress</span>
          </div>
        </article>
      </section>

      <footer className="preview-footer">
        <p>This is a design proposal only.</p>
        <p>The existing pages are unchanged until you approve a direction.</p>
      </footer>
    </main>
  );
}
