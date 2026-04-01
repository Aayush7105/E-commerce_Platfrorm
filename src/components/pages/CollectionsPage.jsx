import CategoryCard from '../home/CategoryCard'
import { featuredCollections } from '../home/homeData'
import PageLayout from './PageLayout'

function CollectionsPage() {
  const categoryBadges = [...new Set(featuredCollections.map((item) => item.category))]

  return (
    <PageLayout
      title="Collections"
      subtitle="Explore curated styles across clothing, accessories, footwear, bags, and watches."
    >
      <section>
        <div className="flex flex-wrap gap-3">
          {categoryBadges.map((category) => (
            <span
              key={category}
              className="rounded-full border border-white/15 bg-zinc-900/80 px-4 py-2 text-[0.86rem] text-zinc-200"
            >
              {category}
            </span>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 gap-x-7 gap-y-16 md:grid-cols-2 xl:grid-cols-4">
          {featuredCollections.map((item) => (
            <CategoryCard key={item.id} product={item} />
          ))}
        </div>
      </section>
    </PageLayout>
  )
}

export default CollectionsPage
