import { Eye, EyeOff, Filter, LayoutGrid, Search, SlidersHorizontal, Table2, GripVertical } from 'lucide-react';
import { DndContext, closestCenter, PointerSensor, useSensor, useSensors } from '@dnd-kit/core';
import { arrayMove, SortableContext, verticalListSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { useProducts } from '../context/ProductsContext';
import { readJSON, writeJSON } from '../utils/storage';
import useDebounce from '../hooks/useDebounce';

const sortOptions = [
  { label: 'Default', value: '' },
  { label: 'Price: Low to High', value: 'price' },
  { label: 'Price: High to Low', value: 'price-desc' },
  { label: 'Rating', value: 'rating-desc' },
  { label: 'Name', value: 'name-asc' },
];

const columnDefinitions = [
  { id: 'image', label: 'Image', adminOnly: false },
  { id: 'name', label: 'Name', adminOnly: false },
  { id: 'category', label: 'Category', adminOnly: false },
  { id: 'price', label: 'Price', adminOnly: false },
  { id: 'stock', label: 'Stock', adminOnly: false },
  { id: 'rating', label: 'Rating', adminOnly: false },
  { id: 'published', label: 'Published', adminOnly: true },
  { id: 'actions', label: 'Actions', adminOnly: true },
];

function getCategoryParams(searchParams) {
  return searchParams.get('category')?.split(',').filter(Boolean) ?? [];
}

function normalizeSortValue(sortValue) {
  if (sortValue === 'price-asc') return 'price';
  return sortValue;
}

function serializeSearchParams(searchParams, updates, keepPage = false) {
  const nextValues = {
    search: searchParams.get('search') ?? searchParams.get('q') ?? '',
    category: searchParams.get('category') ?? '',
    sort: normalizeSortValue(searchParams.get('sort') ?? ''),
    page: searchParams.get('page') ?? '',
  };

  Object.entries(updates).forEach(([key, value]) => {
    if (value === null || value === undefined || value === '' || (Array.isArray(value) && value.length === 0)) {
      nextValues[key] = '';
      return;
    }

    nextValues[key] = Array.isArray(value) ? value.join(',') : String(value);
  });

  if (!keepPage) {
    nextValues.page = '';
  }

  const nextParams = new URLSearchParams();

  if (nextValues.search) nextParams.set('search', nextValues.search);
  if (nextValues.category) nextParams.set('category', nextValues.category);
  if (nextValues.sort) nextParams.set('sort', nextValues.sort);
  if (keepPage && nextValues.page) nextParams.set('page', nextValues.page);

  return nextParams;
}

function getDefaultColumns(isAdmin) {
  return columnDefinitions.filter((column) => !column.adminOnly || isAdmin).map((column) => ({ id: column.id, visible: true }));
}

function normalizeColumnPrefs(storedPrefs, isAdmin) {
  const baseColumns = getDefaultColumns(isAdmin);
  const prefMap = new Map((storedPrefs ?? []).map((pref) => [pref.id, Boolean(pref.visible)]));

  return baseColumns.map((column) => ({
    id: column.id,
    visible: prefMap.has(column.id) ? prefMap.get(column.id) : column.visible,
  }));
}

function SortableColumn({ column, currentColumn, updateColumn }) {
  const { attributes, listeners, setNodeRef, transform, transition } = useSortable({ id: column.id });
  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div ref={setNodeRef} style={style} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <label className="flex items-center gap-3 text-sm font-semibold text-slate-900">
          <input
            type="checkbox"
            checked={currentColumn.visible}
            onChange={(event) => updateColumn(column.id, event.target.checked)}
            className="h-4 w-4 rounded border-slate-300 text-slate-950 focus:ring-slate-950"
          />
          {column.label}
        </label>

        <button
          type="button"
          {...attributes}
          {...listeners}
          className="-mr-1 inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white p-2 text-slate-600 hover:bg-slate-50"
          aria-label={`Move ${column.label}`}
        >
          <GripVertical size={16} />
        </button>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const { isAdmin } = useAuth();
  const { products, visibleProducts, loading, error, togglePublished, pageSize } = useProducts();
  const [searchParams, setSearchParams] = useSearchParams();
  const [viewMode, setViewMode] = useState('grid');
  const [columnsOpen, setColumnsOpen] = useState(false);
  const [columnPrefs, setColumnPrefs] = useState(() =>
    normalizeColumnPrefs(readJSON(`alpha-product-columns-${isAdmin ? 'admin' : 'user'}`, null), isAdmin),
  );
  const searchDraft = searchParams.get('search') ?? searchParams.get('q') ?? '';
  const debouncedSearch = useDebounce(searchDraft, 350);

  const sourceProducts = isAdmin ? products : visibleProducts;
  const selectedCategories = getCategoryParams(searchParams);
  const sortValue = normalizeSortValue(searchParams.get('sort') ?? '');
  const page = Number(searchParams.get('page') ?? 1);
  const availableColumns = useMemo(() => columnDefinitions.filter((column) => !column.adminOnly || isAdmin), [isAdmin]);

  // Order columns according to saved prefs (so reordering persists) and filter by visibility
  const visibleColumns = useMemo(() => {
    return columnPrefs
      .map((pref) => availableColumns.find((col) => col.id === pref.id))
      .filter(Boolean)
      .filter((col) => columnPrefs.find((p) => p.id === col.id)?.visible);
  }, [availableColumns, columnPrefs]);

  useEffect(() => {
    setColumnPrefs((currentPrefs) => normalizeColumnPrefs(currentPrefs, isAdmin));
    setColumnsOpen(false);
  }, [isAdmin]);

  useEffect(() => {
    writeJSON(`alpha-product-columns-${isAdmin ? 'admin' : 'user'}`, columnPrefs);
  }, [columnPrefs, isAdmin]);

  const allCategories = useMemo(
    () => Array.from(new Set(sourceProducts.map((product) => product.category))).sort(),
    [sourceProducts],
  );

  const updateSearchParams = useCallback(
    (updates) => {
      const nextParams = serializeSearchParams(searchParams, updates);
      setSearchParams(nextParams, { replace: true });
    },
    [searchParams, setSearchParams],
  );

  const toggleCategory = (category) => {
    const nextCategories = selectedCategories.includes(category)
      ? selectedCategories.filter((item) => item !== category)
      : [...selectedCategories, category];
    updateSearchParams({ category: nextCategories });
  };

  const filteredProducts = useMemo(() => {
    const normalizedSearch = debouncedSearch.trim().toLowerCase();
    let nextProducts = [...sourceProducts];

    if (normalizedSearch) {
      nextProducts = nextProducts.filter((product) => {
        const searchableText = [product.title, product.brand, product.category, product.description]
          .join(' ')
          .toLowerCase();
        return searchableText.includes(normalizedSearch);
      });
    }

    if (selectedCategories.length) {
      nextProducts = nextProducts.filter((product) => selectedCategories.includes(product.category));
    }

    if (sortValue === 'price') nextProducts.sort((a, b) => a.price - b.price);
    if (sortValue === 'price-desc') nextProducts.sort((a, b) => b.price - a.price);
    if (sortValue === 'rating') nextProducts.sort((a, b) => b.rating - a.rating);
    if (sortValue === 'name') nextProducts.sort((a, b) => a.title.localeCompare(b.title));

    return nextProducts;
  }, [sourceProducts, debouncedSearch, selectedCategories, sortValue]);

  const totalPages = Math.max(Math.ceil(filteredProducts.length / pageSize), 1);
  const safePage = Math.min(page, totalPages);
  const paginatedProducts = filteredProducts.slice((safePage - 1) * pageSize, safePage * pageSize);

  const visibleCount = sourceProducts.length;
  const averagePrice = useMemo(
    () => (visibleCount ? sourceProducts.reduce((sum, product) => sum + product.price, 0) / visibleCount : 0),
    [sourceProducts, visibleCount],
  );

  const inventoryValue = useMemo(
    () => sourceProducts.reduce((sum, product) => sum + product.price * product.stock, 0),
    [sourceProducts],
  );

  const handlePageChange = (nextPage) => {
    const nextParams = serializeSearchParams(searchParams, { page: nextPage > 1 ? String(nextPage) : null }, true);
    setSearchParams(nextParams, { replace: true });
  };

  const handleSortChange = (event) => updateSearchParams({ sort: event.target.value });

  const updateColumn = (columnId, nextValue) => {
    setColumnPrefs((currentPrefs) => currentPrefs.map((column) => (column.id === columnId ? { ...column, visible: nextValue } : column)));
  };

  const moveColumn = (columnId, direction) => {
    setColumnPrefs((current) => {
      const idx = current.findIndex((c) => c.id === columnId);
      if (idx === -1) return current;
      const newIndex = direction === 'up' ? Math.max(0, idx - 1) : Math.min(current.length - 1, idx + 1);
      if (newIndex === idx) return current;
      const next = current.slice();
      const [item] = next.splice(idx, 1);
      next.splice(newIndex, 0, item);
      return next;
    });
  };

  // DnD sensors
  const sensors = useSensors(useSensor(PointerSensor, { activationConstraint: { distance: 5 } }));

  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;
    setColumnPrefs((current) => {
      const ids = current.map((c) => c.id);
      const oldIndex = ids.indexOf(active.id);
      const newIndex = ids.indexOf(over.id);
      if (oldIndex === -1 || newIndex === -1) return current;
      const nextOrder = arrayMove(current, oldIndex, newIndex);
      return nextOrder;
    });
  };

  const resetColumns = () => {
    setColumnPrefs(getDefaultColumns(isAdmin));
  };

  return (
    <div className="space-y-6">
      <section className="grid gap-4 lg:grid-cols-3">
        <StatCard label="Products" value={visibleCount} subtext={isAdmin ? 'Full catalog' : 'Published only'} />
        <StatCard label="Average Price" value={`$${averagePrice.toFixed(0)}`} subtext="Current filtered source" />
        <StatCard label="Inventory Value" value={`$${(inventoryValue / 1000).toFixed(1)}k`} subtext="Price x stock" accent />
      </section>

      <section className="rounded-[28px] border border-white/70 bg-white p-5 shadow-soft">
        <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-slate-500">Product management</p>
            <h3 className="mt-1 text-2xl font-semibold text-slate-950">Search, filter, sort, and paginate the catalog</h3>
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => setViewMode('grid')}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                viewMode === 'grid' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              <LayoutGrid size={16} /> Grid
            </button>
            <button
              type="button"
              onClick={() => setViewMode('table')}
              className={`inline-flex items-center gap-2 rounded-2xl px-4 py-3 text-sm font-semibold transition ${
                viewMode === 'table' ? 'bg-slate-950 text-white' : 'border border-slate-200 bg-white text-slate-600'
              }`}
            >
              <Table2 size={16} /> Table
            </button>
          </div>
        </div>

        <div className="mt-6 grid gap-4 xl:grid-cols-[1.3fr_1fr_0.7fr]">
          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={18} className="text-slate-500" />
            <input
              value={searchDraft}
              onChange={(event) => {
                updateSearchParams({ search: event.target.value });
              }}
              placeholder="Search products, brand, or category"
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400"
            />
          </label>

          <label className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm">
            <Filter size={18} className="text-slate-500" />
            <select value={sortValue} onChange={handleSortChange} className="w-full bg-transparent outline-none">
              {sortOptions.map((option) => (
                <option key={option.value || 'default'} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            onClick={() => {
              setSearchParams(new URLSearchParams(), { replace: true });
            }}
            className="rounded-2xl bg-slate-950 px-4 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Reset filters
          </button>
        </div>

        <div className="mt-5 flex flex-wrap gap-2">
          {allCategories.map((category) => {
            const active = selectedCategories.includes(category);
            return (
              <button
                type="button"
                key={category}
                onClick={() => toggleCategory(category)}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition ${
                  active ? 'border-slate-950 bg-slate-950 text-white' : 'border-slate-200 bg-white text-slate-600'
                }`}
              >
                {category}
              </button>
            );
          })}
        </div>

        {viewMode === 'table' ? (
          <div className="mt-5 rounded-3xl border border-slate-200 bg-slate-50 p-4">
            <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <p className="text-sm font-semibold text-slate-950">Table columns</p>
                <p className="text-sm text-slate-500">Show, hide, and reorder the visible columns.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setColumnsOpen((current) => !current)}
                  className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100"
                >
                  <SlidersHorizontal size={16} /> {columnsOpen ? 'Hide' : 'Customize'}
                </button>
                <button
                  type="button"
                  onClick={resetColumns}
                  className="rounded-2xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
                >
                  Reset columns
                </button>
              </div>
            </div>

            {columnsOpen ? (
              <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
                <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                  <SortableContext items={columnPrefs.map((c) => c.id)} strategy={verticalListSortingStrategy}>
                    {columnPrefs.map((pref) => {
                      const column = availableColumns.find((c) => c.id === pref.id);
                      if (!column) return null;
                      const currentColumn = pref;
                      return <SortableColumn key={pref.id} column={column} currentColumn={currentColumn} updateColumn={updateColumn} />;
                    })}
                  </SortableContext>
                </DndContext>
              </div>
            ) : null}
          </div>
        ) : null}
      </section>

      {loading ? (
        <div className="rounded-[28px] border border-white/70 bg-white p-8 text-slate-500 shadow-soft">Loading products...</div>
      ) : error ? (
        <div className="rounded-[28px] border border-rose-200 bg-rose-50 p-8 text-rose-700 shadow-soft">{error}</div>
      ) : (
        <>
          {viewMode === 'grid' ? (
            <section className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paginatedProducts.map((product) => (
                <ProductCard key={product.id} product={product} isAdmin={isAdmin} onTogglePublished={togglePublished} />
              ))}
            </section>
          ) : (
            <section className="overflow-hidden rounded-[28px] border border-white/70 bg-white shadow-soft">
              <div className="overflow-x-auto">
                <table className="min-w-[980px] w-full border-separate border-spacing-0 text-left">
                  <thead>
                    <tr className="bg-slate-50 text-sm text-slate-500">
                      {visibleColumns.map((column) => (
                        <th key={column.id} className="border-b border-slate-200 px-4 py-4 font-medium">
                          {column.label}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {paginatedProducts.map((product) => (
                      <tr key={product.id} className="align-top hover:bg-slate-50/70">
                        {visibleColumns.map((column) => {
                          if (column.id === 'image') {
                            return (
                              <td key={column.id} className="border-b border-slate-100 px-4 py-4">
                                <img
                                  src={product.thumbnail}
                                  alt={product.title}
                                  className="h-16 w-16 rounded-2xl border border-slate-200 object-cover"
                                  loading="lazy"
                                />
                              </td>
                            );
                          }

                          if (column.id === 'name') {
                            return (
                              <td key={column.id} className="border-b border-slate-100 px-4 py-4">
                                <div className="max-w-[260px]">
                                  <p className="font-semibold text-slate-950">{product.title}</p>
                                  <p className="text-sm text-slate-500">{product.brand}</p>
                                </div>
                              </td>
                            );
                          }

                          if (column.id === 'category') {
                            return (
                              <td key={column.id} className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                                {product.category}
                              </td>
                            );
                          }

                          if (column.id === 'price') {
                            return (
                              <td key={column.id} className="border-b border-slate-100 px-4 py-4 text-sm font-semibold text-slate-950">
                                ${product.price}
                              </td>
                            );
                          }

                          if (column.id === 'stock') {
                            return (
                              <td key={column.id} className="border-b border-slate-100 px-4 py-4 text-sm text-slate-600">
                                {product.stock > 10 ? 'In stock' : 'Low stock'} ({product.stock})
                              </td>
                            );
                          }

                          if (column.id === 'rating') {
                            return (
                              <td key={column.id} className="border-b border-slate-100 px-4 py-4 text-sm font-semibold text-amber-600">
                                {product.rating}
                              </td>
                            );
                          }

                          if (column.id === 'published') {
                            return (
                              <td key={column.id} className="border-b border-slate-100 px-4 py-4">
                                <span
                                  className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${
                                    product.published ? 'bg-emerald-100 text-emerald-800' : 'bg-slate-100 text-slate-500'
                                  }`}
                                >
                                  {product.published ? <Eye size={14} /> : <EyeOff size={14} />}
                                  {product.published ? 'Published' : 'Hidden'}
                                </span>
                              </td>
                            );
                          }

                          return (
                            <td key={column.id} className="border-b border-slate-100 px-4 py-4">
                              {isAdmin ? (
                                <button
                                  type="button"
                                  onClick={() => togglePublished(product.id)}
                                  className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-2 text-xs font-medium text-slate-700 transition hover:bg-slate-200 hover:text-slate-950"
                                >
                                  <EyeOff size={14} /> {product.published ? 'Hide' : 'Show'}
                                </button>
                              ) : (
                                <span className="text-sm text-slate-400">—</span>
                              )}
                            </td>
                          );
                        })}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>
          )}

          <section className="flex flex-col items-center justify-between gap-4 rounded-[28px] border border-white/70 bg-white px-5 py-4 shadow-soft md:flex-row">
            <p className="text-sm text-slate-500">
              Showing {paginatedProducts.length} of {filteredProducts.length} products
            </p>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={() => handlePageChange(Math.max(1, safePage - 1))}
                disabled={safePage === 1}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <span className="rounded-xl bg-slate-950 px-4 py-2 text-sm font-semibold text-white">
                {safePage} / {totalPages}
              </span>
              <button
                type="button"
                onClick={() => handlePageChange(Math.min(totalPages, safePage + 1))}
                disabled={safePage === totalPages}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>
          </section>
        </>
      )}
    </div>
  );
}