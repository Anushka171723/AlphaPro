import { useMemo } from 'react';
import { Bar, BarChart, CartesianGrid, Cell, Legend, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';
import StatCard from '../components/StatCard';
import { useProducts } from '../context/ProductsContext';

const COLORS = ['#f97316', '#0f172a', '#22c55e', '#38bdf8', '#8b5cf6', '#ef4444'];

function ChartTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;

  return (
    <div className="rounded-2xl border border-slate-200 bg-white px-4 py-3 shadow-lg">
      <p className="text-sm font-semibold text-slate-950">{label}</p>
      <p className="text-sm text-slate-600">{payload[0].name}: {payload[0].value}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { products } = useProducts();

  const summary = useMemo(() => {
    const totalProducts = products.length;
    const averageRating = totalProducts ? products.reduce((sum, product) => sum + product.rating, 0) / totalProducts : 0;
    const totalInventoryValue = products.reduce((sum, product) => sum + product.price * product.stock, 0);
    const categories = Object.values(
      products.reduce((accumulator, product) => {
        accumulator[product.category] = accumulator[product.category] || { name: product.category, value: 0 };
        accumulator[product.category].value += 1;
        return accumulator;
      }, {}),
    );

    const topProducts = [...products]
      .sort((a, b) => b.rating - a.rating)
      .slice(0, 6)
      .map((product) => ({ name: product.title.split(' ').slice(0, 2).join(' '), rating: Number(product.rating.toFixed(1)) }));

    return { totalProducts, averageRating, totalInventoryValue, categories, topProducts };
  }, [products]);

  return (
    <div className="space-y-8">
      <section className="grid gap-5 lg:grid-cols-4">
        <StatCard label="Total Products" value={summary.totalProducts} subtext="Complete catalog" />
        <StatCard label="Average Rating" value={summary.averageRating.toFixed(1)} subtext="Across all items" accent />
        <StatCard label="Inventory Value" value={`$${(summary.totalInventoryValue / 1000).toFixed(1)}k`} subtext="Price x stock" />
        <StatCard label="Category Count" value={summary.categories.length} subtext="Distribution slices" />
      </section>

      <section className="grid gap-8 xl:grid-cols-[0.95fr_1.05fr]">
        <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-950">Category Distribution</h3>
          <div className="mt-6 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie data={summary.categories} dataKey="value" nameKey="name" innerRadius={70} outerRadius={120} paddingAngle={3}>
                  {summary.categories.map((entry, index) => (
                    <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip content={<ChartTooltip />} />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 grid gap-3 grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
            {summary.categories.map((entry, index) => (
              <div
                key={entry.name}
                className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-700"
              >
                <span className="h-3 w-3 flex-shrink-0 rounded-full" style={{ backgroundColor: COLORS[index % COLORS.length] }} />
                <span className="break-words text-sm text-slate-700">{entry.name}</span>
                <span className="ml-auto font-semibold text-slate-950">{entry.value}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="rounded-[28px] border border-white/70 bg-white p-6 shadow-soft">
          <h3 className="text-xl font-semibold text-slate-950">Top Rated Products</h3>
          <div className="mt-6 h-[360px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={summary.topProducts} layout="vertical" margin={{ left: 28, right: 16 }}>
                <CartesianGrid strokeDasharray="4 4" stroke="#e2e8f0" />
                <XAxis type="number" domain={[0, 5]} />
                <YAxis dataKey="name" type="category" width={150} tick={{ fontSize: 12 }} />
                <Tooltip content={<ChartTooltip />} />
                <Legend />
                <Bar dataKey="rating" fill="#f97316" radius={[0, 14, 14, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>
    </div>
  );
}