import StatList from './StatList'

function HeroSection({ stats }) {
  return (
    <section className="hero-section" aria-labelledby="hero-title">
      <div className="hero-banner">
        <p className="eyebrow">Mega electronics days</p>
        <h1 id="hero-title">Big savings on everyday essentials and tech.</h1>
        <p>
          Explore top picks across appliances, wearables, and home upgrades with
          fast delivery and easy returns.
        </p>
        <div className="hero-actions">
          <button type="button" className="primary-button">
            Shop all offers
          </button>
          <button type="button" className="secondary-button">
            Prime deals
          </button>
        </div>
      </div>
      <StatList stats={stats} />
    </section>
  )
}

export default HeroSection
