import { useState, useMemo } from 'react';
import { Heading, Select, Text, Callout, Card, Separator } from '@radix-ui/themes';
import { Info, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
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

const FilterControls = ({
  sort, setSort, minPrice, setMinPrice, maxPrice, setMaxPrice,
}: {
  sort: SortOption;
  setSort: (v: SortOption) => void;
  minPrice: string;
  setMinPrice: (v: string) => void;
  maxPrice: string;
  setMaxPrice: (v: string) => void;
}) => (
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
);

const HomeScreen = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const [sort, setSort]           = useState<SortOption>('default');
  const [minPrice, setMinPrice]   = useState('');
  const [maxPrice, setMaxPrice]   = useState('');
  const [mobileOpen, setMobileOpen] = useState(false);

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

      {/* ── Mobile filter dropdown ── */}
      <div className="mobile-filter-bar">
        <button
          onClick={() => setMobileOpen(o => !o)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            width: '100%',
            padding: '10px 14px',
            borderRadius: 'var(--radius-3)',
            border: '1px solid var(--gray-a7)',
            background: 'var(--color-surface)',
            color: 'var(--gray-12)',
            cursor: 'pointer',
            fontSize: 14,
            fontWeight: 500,
          }}
        >
          <SlidersHorizontal size={16} />
          <span style={{ flex: 1, textAlign: 'left' }}>Filters</span>
          {mobileOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
        </button>

        {mobileOpen && (
          <Card style={{ padding: '16px', marginTop: 8 }}>
            <FilterControls
              sort={sort} setSort={setSort}
              minPrice={minPrice} setMinPrice={setMinPrice}
              maxPrice={maxPrice} setMaxPrice={setMaxPrice}
            />
          </Card>
        )}
      </div>

      {/* ── Desktop layout ── */}
      <div className="desktop-layout" style={{ display: 'flex', gap: 24, alignItems: 'flex-start' }}>

        {/* Sidebar */}
        <Card className="desktop-sidebar" style={{ width: 180, flexShrink: 0, padding: '12px' }}>
          <Text size="2" weight="bold" mb="3" style={{ display: 'block' }}>Filters</Text>
          <FilterControls
            sort={sort} setSort={setSort}
            minPrice={minPrice} setMinPrice={setMinPrice}
            maxPrice={maxPrice} setMaxPrice={setMaxPrice}
          />
        </Card>

        {/* Product grid */}
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

      <style>{`
        .mobile-filter-bar  { display: none; }
        .desktop-layout     { display: flex; }
        .desktop-sidebar    { display: block; }

        @media (max-width: 640px) {
          .mobile-filter-bar { display: block; margin-bottom: 16px; }
          .desktop-layout    { display: block; }
          .desktop-sidebar   { display: none; }
        }
      `}</style>
    </>
  );
};

export default HomeScreen;
