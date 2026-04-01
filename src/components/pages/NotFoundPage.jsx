import { Link } from 'react-router-dom'
import PageLayout from './PageLayout'

function NotFoundPage() {
  return (
    <PageLayout title="Page Not Found" subtitle="The page you requested does not exist or may have been moved.">
      <section className="rounded-2xl border border-white/10 bg-zinc-950/70 p-8 text-center">
        <p className="m-0 text-[1rem] text-zinc-300">Try heading back to the home page or browse all collections.</p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Link
            to="/"
            className="rounded-xl bg-white px-5 py-2.5 text-[0.95rem] font-semibold text-black no-underline transition hover:bg-zinc-200"
          >
            Go Home
          </Link>
          <Link
            to="/collections"
            className="rounded-xl border border-white/25 px-5 py-2.5 text-[0.95rem] font-semibold text-white no-underline transition hover:border-white/45"
          >
            View Collections
          </Link>
        </div>
      </section>
    </PageLayout>
  )
}

export default NotFoundPage
