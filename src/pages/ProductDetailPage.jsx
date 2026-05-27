import { ChevronLeft, Package, Star, Tag } from 'lucide-react';
import { useMemo } from 'react';
import { Link, Navigate, useParams } from 'react-router-dom';
import { Navigation, Pagination } from 'swiper/modules';
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';

export default function ProductDetailPage() {
  const { productId } = useParams();
  const { isAdmin } = useAuth();
  const { getProductById, loading } = useProducts();

  const product = useMemo(() => getProductById(productId, isAdmin), [getProductById, productId, isAdmin]);
  const productImages = useMemo(
    () => [...(product?.images ?? []), ...(product?.thumbnail ? [product.thumbnail] : [])],
    [product],
  );

  if (!loading && !product) {
    return <Navigate to="/products" replace />;
  }

  if (!product) {
    return <div className="rounded-[28px] border border-white/70 bg-white p-8 shadow-soft">Loading product detail...</div>;
  }

  return (
    <div className="space-y-6">
      <Link to="/products" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 transition hover:text-slate-950">
        <ChevronLeft size={16} /> Back to products
      </Link>

      <div className="grid gap-6 xl:grid-cols-[0.95fr_1.05fr]">
        <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white p-4 shadow-soft">
          <Swiper
            className="product-carousel"
            modules={[Navigation, Pagination]}
            navigation
            pagination={{ clickable: true }}
            spaceBetween={16}
            slidesPerView={1}
          >
            {productImages.length ? productImages.map((image) => (
              <SwiperSlide key={image}>
                <div className="aspect-[3/2] overflow-hidden rounded-[24px] bg-slate-100 p-4 md:p-5">
                  <img src={image} alt={product.title} className="h-full w-full rounded-[20px] object-contain" loading="lazy" />
                </div>
              </SwiperSlide>
            )) : (
              <SwiperSlide>
                <div className="aspect-[3/2] rounded-[24px] bg-slate-100 p-4 md:p-5" />
              </SwiperSlide>
            )}
          </Swiper>
        </section>

        <section className="rounded-[28px] border border-white/70 bg-white p-6 shadow-soft">
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-full bg-orange-50 px-3 py-1 text-sm font-semibold text-orange-600">{product.category}</span>
            <span className="rounded-full bg-slate-100 px-3 py-1 text-sm font-semibold text-slate-600">{product.brand}</span>
            <span className={`rounded-full px-3 py-1 text-sm font-semibold ${product.published ? 'bg-emerald-50 text-emerald-700' : 'bg-slate-100 text-slate-500'}`}>
              {product.published ? 'Published' : 'Hidden'}
            </span>
          </div>

          <h1 className="mt-5 max-w-[34rem] text-2xl font-semibold leading-[1.12] text-slate-950 md:text-3xl">
            {product.title}
          </h1>
          <p className="mt-3 max-w-[500px] text-base leading-7 text-slate-600 md:text-[1.05rem]">
            {product.description}
          </p>

          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-2 text-sm text-slate-500"><Tag size={16} /> Price</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">${product.price}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-2 text-sm text-slate-500"><Star size={16} /> Rating</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">{product.rating}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <div className="flex items-center gap-2 text-sm text-slate-500"><Package size={16} /> Stock</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">{product.stock}</div>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_10px_30px_rgba(15,23,42,0.08)]">
              <div className="text-sm text-slate-500">Minimum order</div>
              <div className="mt-2 text-2xl font-semibold text-slate-950">{product.minimumOrderQuantity}</div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}