function DealCard({ deal }) {
  return (
    <article className="deal-card" style={{ backgroundColor: deal.tone }}>
      <h3>{deal.title}</h3>
      <p>{deal.subtitle}</p>
      <a href="#">Shop now</a>
    </article>
  )
}

export default DealCard
