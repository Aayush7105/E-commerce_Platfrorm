function StatList({ stats }) {
  return (
    <section aria-label="Store highlights">
      <ul className="m-0 grid list-none gap-6 p-0 text-left md:grid-cols-3 md:text-center">
        {stats.map((stat) => (
          <li key={stat.label}>
            <strong className="block text-[clamp(1.5rem,2.2vw,2.1rem)] leading-none font-semibold text-white">
              {stat.value}
            </strong>
            <p className="mt-1.5 text-[clamp(0.82rem,0.95vw,1rem)] text-zinc-300">{stat.label}</p>
          </li>
        ))}
      </ul>
    </section>
  )
}

export default StatList
