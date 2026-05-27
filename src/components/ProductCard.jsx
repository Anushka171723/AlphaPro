import { BadgeCheck, EyeOff, Star, Tag } from 'lucide-react';
import React from 'react';
import { Link } from 'react-router-dom';

function ProductCard({ product, isAdmin, onTogglePublished }) {
  return (
    <article className="group cursor-pointer overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-soft transition-all duration-300 hover:-translate-y-1 hover:shadow-xl">
      <Link to={`/products/${product.id}`} className="block">
        <div className="relative aspect-[4/3] overflow-hidden bg-slate-100 p-3">
          <img
            src={product.thumbnail}
            alt={product.title}
            className="h-full w-full rounded-2xl object-cover transition duration-500 group-hover:scale-105"
            loading="lazy"
          />
          <div className="absolute left-4 top-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900 backdrop-blur">
            {product.category}
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div>
          <div className="flex items-start justify-between gap-3">
            <div className="min-h-[4.5rem]">
              <h3 className="line-clamp-2 min-h-[3.5rem] text-lg font-semibold leading-7 text-slate-950">{product.title}</h3>
              <p className="mt-1 text-sm text-slate-500">{product.brand}</p>
            </div>
            <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-3 py-1 text-sm font-semibold text-amber-600">
              <Star size={14} fill="currentColor" /> {product.rating}
            </span>
          </div>

          <div className="mt-4 flex items-center justify-between text-sm text-slate-500">
            <span className="inline-flex items-center gap-2">
              <Tag size={15} /> ${product.price}
            </span>
            <span className={product.stock > 10 ? 'text-emerald-600' : 'text-rose-600'}>
              {product.stock > 10 ? 'In stock' : 'Low stock'} ({product.stock})
            </span>
          </div>
        </div>

        <div className="flex items-center justify-between gap-3">
          <div
            className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
              product.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
            }`}
          >
            <BadgeCheck size={14} /> {product.published ? 'Published' : 'Hidden'}
          </div>

          {isAdmin ? (
            <button
              type="button"
              onClick={() => onTogglePublished(product.id)}
              className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition-all duration-300 hover:bg-slate-200 hover:text-slate-950"
            >
              <EyeOff size={14} /> {product.published ? 'Hide' : 'Show'}
            </button>
          ) : null}
        </div>
      </div>
    </article>
  );
}

export default React.memo(ProductCard);