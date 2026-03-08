export default function LandingPage({ onStart }) {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Character Showcase</h1>
        <div className="landing-buttons">
          <button className="start-btn" onClick={onStart}>Start</button>
          <div className="story-btn-wrapper">
            <button className="story-btn" disabled>Story</button>
            <span className="coming-soon-badge">Coming Soon</span>
          </div>
        </div>
      </div>
      <footer className="landing-footer">
        Illustrated by Badu Boakye | Engineered by Brianna Duvivier
      </footer>
    </div>
  )
}
