import ProductCard from '../home/ProductCard'
import { newArrivals } from '../home/homeData'
import PageLayout from './PageLayout'

function NewArrivalsPage() {
  return (
    <PageLayout
      title="New Arrivals"
      subtitle="Freshly selected premium products that just landed in the LUXE catalog."
    >
      <section>
        <div className="grid grid-cols-1 gap-8 md:grid-cols-2 xl:grid-cols-4">
          {newArrivals.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </PageLayout>
  )
}

export default NewArrivalsPage
