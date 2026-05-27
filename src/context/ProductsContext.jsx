import axios from 'axios';
import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { readJSON, writeJSON } from '../utils/storage';

const ProductsContext = createContext(null);
const PAGE_SIZE = 8;

const getStoredVisibility = () => readJSON('alpha-product-visibility', {});

const normalizeProduct = (product, visibilityMap) => ({
  ...product,
  published: visibilityMap[product.id] ?? true,
});

export function ProductsProvider({ children }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        const productsResponse = await axios.get('https://dummyjson.com/products?limit=100');

        const visibilityMap = getStoredVisibility();

        const items = productsResponse.data.products.map((product) => normalizeProduct(product, visibilityMap));

        if (active) {
          setProducts(items);
          setError('');
        }
      } catch (fetchError) {
        if (active) {
          setError(fetchError?.message || 'Failed to load products');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    loadProducts();

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    const map = Object.fromEntries(products.map((product) => [product.id, product.published]));
    writeJSON('alpha-product-visibility', map);
  }, [products]);

  const togglePublished = useCallback((productId) => {
    setProducts((currentProducts) =>
      currentProducts.map((product) =>
        product.id === productId ? { ...product, published: !product.published } : product,
      ),
    );
  }, []);

  const visibleProducts = useMemo(() => products.filter((product) => product.published), [products]);

  const getProductById = useCallback(
    (productId, includeHidden = false) =>
      (includeHidden ? products : visibleProducts).find((product) => product.id === Number(productId)),
    [products, visibleProducts],
  );

  const value = useMemo(
    () => ({
      products,
      visibleProducts,
      loading,
      error,
      togglePublished,
      getProductById,
      pageSize: PAGE_SIZE,
    }),
    [products, visibleProducts, loading, error, togglePublished, getProductById],
  );

  return <ProductsContext.Provider value={value}>{children}</ProductsContext.Provider>;
}

export function useProducts() {
  const context = useContext(ProductsContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductsProvider');
  }
  return context;
}