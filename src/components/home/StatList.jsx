function StatList({ stats }) {
  return (
    <section className="stat-list" aria-label="Store highlights">
      <h2>Today in quick picks</h2>
      <ul>
        {stats.map((stat) => (
          <li key={stat.label}>
            <p>{stat.label}</p>
            <strong>{stat.value}</strong>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default StatList
