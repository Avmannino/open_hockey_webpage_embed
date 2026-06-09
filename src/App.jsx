import "./App.css";
import { ScheduleTable } from "./components/ScheduleTable";
import { HeroCarousel } from "./components/HeroCarousel";

const features = [
  {
    kicker: "18+",
    title: "Co-ed Hockey",
    text: "Open to adult players 18 and up.",
  },
  {
    kicker: "ALL",
    title: "All Skill Levels",
    text: "All skill levels are welcome in a fun environment.",
  },
  {
    kicker: "PLAY",
    title: "Meet New People",
    text: "Meet new players by simply showing up and playing hockey.",
  },
  {
    kicker: "GEAR",
    title: "Full Equipment",
    text: "Full hockey equipment is required for all skaters.",
  },
];

function App() {
  const baseUrl = import.meta.env.BASE_URL;

  const heroImages = [
    `${baseUrl}images/open-hockey-1.jpg`,
    `${baseUrl}images/open-hockey-2.jpg`,
    `${baseUrl}images/open-hockey-3.jpg`,
  ];

  return (
    <main className="page">
      <section className="hero">
        <div className="hero-inner">
          <div className="hero-text">
            <img
              className="logo"
              src={`${baseUrl}images/wings-logo-white.png`}
              alt="Wings Arena logo"
            />

            <h1>Open Hockey</h1>

            <p className="intro">
              Open Hockey sessions are casual, co-ed scrimmages open to a
              variety of ages and skill levels. Sessions may be listed as 16+,
              Adult 18+, or All Ages, so please review the schedule below and
              choose the time and age group that best fits you. Full equipment
              is required for all players.
            </p>
          </div>

          <HeroCarousel images={heroImages} />
        </div>
      </section>

      <section className="feature-section">
        <div className="feature-grid">
          {features.map((feature) => (
            <article className="feature-card" key={feature.title}>
              <div className="feature-kicker">{feature.kicker}</div>
              <h2>{feature.title}</h2>
              <p>{feature.text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="pricing-section" id="details">
        <div className="section-heading">
          <h2>Session Information</h2>
          <p>
            Open hockey is a casual, pickup-style session for adult players who
            want extra ice time in a fun and welcoming setting.
          </p>
        </div>

        <div className="info-grid">
          <article className="info-card">
            <span>Skaters</span>
            <strong>$25</strong>
            <p>Per session</p>
          </article>

          <article className="info-card">
            <span>Goalies</span>
            <strong>Free</strong>
            <p>Goalies play for free</p>
          </article>

          <article className="info-card">
            <span>Required</span>
            <strong>Full Equipment</strong>
            <p>All skaters must wear full hockey equipment.</p>
          </article>
        </div>

        <div className="schedule-table-wrapper">
          <h2 className="schedule-heading">Upcoming Sessions</h2>
          <hr className="schedule-divider" />
          <ScheduleTable />
        </div>
      </section>

      <section className="details-section">
        <div className="details-card">
          <div>
            <h2>Before You Skate</h2>
            <p>
              Open Hockey sessions are age-specific — please check the schedule
              and choose a session that best fits you. Sessions are open to all
              skill levels and are designed to give players a simple way to get
              on the ice, skate, compete, and meet other hockey players.
            </p>
          </div>

          <ul>
            <li>Co-ed hockey</li>
            <li>Age-specific sessions — check the schedule</li>
            <li>All skill levels welcome</li>
            <li>Full equipment required</li>
            <li>$25 per skater</li>
            <li>Goalies play free</li>
          </ul>
        </div>
      </section>

      <section className="note-section" id="note">
        <div className="note-card">
          <h2>Please Note</h2>

          <p>
            All sessions have a limited number of openings and these are filled
            based on the order of sign-up. Once the limit is reached, no
            additional skaters will be allowed in the session.
          </p>


        </div>
      </section>
    </main>
  );
}

export default App;