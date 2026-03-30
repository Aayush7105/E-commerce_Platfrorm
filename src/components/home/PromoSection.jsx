import DealCard from './DealCard'

function PromoSection({ deals }) {
  return (
    <section className="promo-section" aria-labelledby="deals-title">
      <div className="section-heading">
        <h2 id="deals-title">Today&apos;s deals</h2>
        <a href="#">See all deals</a>
      </div>
      <div className="deal-grid">
        {deals.map((deal) => (
          <DealCard key={deal.id} deal={deal} />
        ))}
      </div>
      <div className="signin-panel">
        <p>See personalized recommendations</p>
        <button type="button" className="primary-button">
          Sign in
        </button>
      </div>
    </section>
  )
}

export default PromoSection
