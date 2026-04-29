import { useState, useMemo } from 'react';
import { Heading, Select, Text, Callout, Card, Separator } from '@radix-ui/themes';
import { Info, SlidersHorizontal, ChevronDown, ChevronUp } from 'lucide-react';
import type { Product } from '../types/Product';
import { useGetProductsQuery } from '../services/product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductComponent from '../components/Product';
import SearchBar from '../components/SearchBar';
import { useTranslation } from 'react-i18next';

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
}) => {
  const { t } = useTranslation();
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      <div>
        <Text as="div" size="2" weight="medium" mb="1">{t('home.sortByPrice')}</Text>
        <Select.Root value={sort} onValueChange={val => setSort(val as SortOption)}>
          <Select.Trigger style={{ width: '100%' }} />
          <Select.Content>
            <Select.Item value="default">{t('home.sortDefault')}</Select.Item>
            <Select.Item value="price-asc">{t('home.sortLowHigh')}</Select.Item>
            <Select.Item value="price-desc">{t('home.sortHighLow')}</Select.Item>
          </Select.Content>
        </Select.Root>
      </div>

      <Separator size="4" />

      <div>
        <Text as="div" size="2" weight="medium" mb="1">{t('home.minPrice')}</Text>
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
        <Text as="div" size="2" weight="medium" mb="1">{t('home.maxPrice')}</Text>
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
};

const HomeScreen = () => {
  const { t } = useTranslation();
  const { data: products, error, isLoading } = useGetProductsQuery();
  const [sort, setSort]             = useState<SortOption>('default');
  const [minPrice, setMinPrice]     = useState('');
  const [maxPrice, setMaxPrice]     = useState('');
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
  if (error) return <Message variant="danger">{t('common.errorOccurred')}</Message>;

  return (
    <>
      <Heading size="6" mb="4">{t('home.latestProducts')}</Heading>

      {/* ── Mobile search + filter row ── */}
      <div className="mobile-filter-bar" style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
          <div style={{ flex: 1 }}>
            <SearchBar />
          </div>
          <button
            onClick={() => setMobileOpen(o => !o)}
            aria-label="Toggle filters"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 4,
              padding: '0 12px',
              height: 32,
              borderRadius: 'var(--radius-2)',
              border: '1px solid var(--gray-a7)',
              background: mobileOpen ? 'var(--accent-3)' : 'var(--color-surface)',
              color: 'var(--gray-12)',
              cursor: 'pointer',
              fontSize: 13,
              fontWeight: 500,
              whiteSpace: 'nowrap',
              flexShrink: 0,
            }}
          >
            <SlidersHorizontal size={14} />
            <span>{t('home.filters')}</span>
            {mobileOpen ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
          </button>
        </div>

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
          <Text size="2" weight="bold" mb="3" style={{ display: 'block' }}>{t('home.filters')}</Text>
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
              <Callout.Text>{t('home.noProducts')}</Callout.Text>
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
