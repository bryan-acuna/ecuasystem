import { useMemo } from 'react';
import { Heading, Text, Callout } from '@radix-ui/themes';
import { Info } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../services/product';
import type { Product } from '../types/Product';
import ProductComponent from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useTranslation } from 'react-i18next';

const SearchScreen = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const { data: products, isLoading, error } = useGetProductsQuery();

  const results = useMemo(() => {
    if (!products || !query) return [];
    const lower = query.toLowerCase();
    return products.filter(
      p =>
        p.name.toLowerCase().includes(lower)        ||
        p.brand.toLowerCase().includes(lower)       ||
        p.category.toLowerCase().includes(lower)    ||
        p.description.toLowerCase().includes(lower)
    );
  }, [products, query]);

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{t('search.errorLoading')}</Message>;

  return (
    <>
      <Heading size="6" mb="1">{t('search.resultsFor')} <em>"{query}"</em></Heading>
      <Text size="2" color="gray" style={{ display: 'block', marginBottom: 16 }}>
        {t('search.productsFound', { count: results.length })}
      </Text>

      {results.length === 0 ? (
        <Callout.Root color="blue">
          <Callout.Icon><Info size={16} /></Callout.Icon>
          <Callout.Text>{t('search.noResults', { query })}</Callout.Text>
        </Callout.Root>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {results.map((product: Product) => (
            <ProductComponent key={product.id} {...product} />
          ))}
        </div>
      )}
    </>
  );
};

export default SearchScreen;
