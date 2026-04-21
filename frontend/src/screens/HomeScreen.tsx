import { useState, useMemo } from 'react';
import { Heading, Select, Text, Callout, Card, Separator } from '@radix-ui/themes';
import { Info } from 'lucide-react';
import type { Product } from '../types/Product';
import { useGetProductsQuery } from '../services/product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductComponent from '../components/Product';

type SortOption = 'default' | 'price-asc' | 'price-desc';

const inputStyle: React.CSSProperties = {
  width: '100%',
  height: 32,
  borderRadius: 'var(--radius-2)',
  border: '1px solid var(--gray-a7)',
  padding: '0 8px',
  background: 'var(--color-surface)',
  color: 'var(--gray-12)',
};

const HomeScreen = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const [sort, setSort]         = useState<SortOption>('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = [...products];
    if (minPrice) result = result.filter(p => p.price >= Number(minPrice));
    if (maxPrice) result = result.filter(p => p.price <= Number(maxPrice));
    if (sort === 'price-asc')  result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);
    return result;
  }, [products, sort, minPrice, maxPrice]);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">An error occurred while fetching products</Message>;

  return (
    <>
      <Heading size="6" mb="4">Latest Products</Heading>

      <div style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* ── Sidebar filters ── */}
        <Card style={{ width: 180, flexShrink: 0, padding: '12px' }}>
          <Text size="2" weight="bold" mb="3" style={{ display: 'block' }}>Filters</Text>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            <div>
              <Text as="div" size="2" weight="medium" mb="1">Sort by Price</Text>
              <Select.Root value={sort} onValueChange={val => setSort(val as SortOption)}>
                <Select.Trigger style={{ width: '100%' }} />
                <Select.Content>
                  <Select.Item value="default">Default</Select.Item>
                  <Select.Item value="price-asc">Low to High</Select.Item>
                  <Select.Item value="price-desc">High to Low</Select.Item>
                </Select.Content>
              </Select.Root>
            </div>

            <Separator size="4" />

            <div>
              <Text as="div" size="2" weight="medium" mb="1">Min Price ($)</Text>
              <input
                type="number"
                min={0}
                placeholder="0"
                value={minPrice}
                onChange={e => setMinPrice(e.target.value)}
                style={inputStyle}
              />
            </div>

            <div>
              <Text as="div" size="2" weight="medium" mb="1">Max Price ($)</Text>
              <input
                type="number"
                min={0}
                placeholder="Any"
                value={maxPrice}
                onChange={e => setMaxPrice(e.target.value)}
                style={inputStyle}
              />
            </div>
          </div>
        </Card>

        {/* ── Product grid ── */}
        <div style={{ flex: 1, minWidth: 0 }}>
          {filtered.length === 0 ? (
            <Callout.Root color="blue">
              <Callout.Icon><Info size={16} /></Callout.Icon>
              <Callout.Text>No products match the selected price range.</Callout.Text>
            </Callout.Root>
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
              gap: 16,
            }}>
              {filtered.map((product: Product) => (
                <ProductComponent key={product.id} {...product} />
              ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default HomeScreen;
