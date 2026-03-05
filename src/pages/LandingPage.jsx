export default function LandingPage({ onStart }) {
  return (
    <div className="landing-page">
      <div className="landing-content">
        <h1 className="landing-title">Website Title</h1>
        <button className="start-btn" onClick={onStart}>Start</button>
      </div>
      <footer className="landing-footer">
        Illustrated by Badu Boakye | Engineered by Brianna Duvivier
      </footer>
    </div>
  )
}
