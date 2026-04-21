import { useMemo } from 'react';
import { Heading, Text, Callout } from '@radix-ui/themes';
import { Info } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { useGetProductsQuery } from '../services/product';
import type { Product } from '../types/Product';
import ProductComponent from '../components/Product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const SearchScreen = () => {
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
  if (error) return <Message variant="danger">Failed to load products</Message>;

  return (
    <>
      <Heading size="6" mb="1">Results for <em>"{query}"</em></Heading>
      <Text size="2" color="gray" style={{ display: 'block', marginBottom: 16 }}>
        {results.length} product{results.length !== 1 ? 's' : ''} found
      </Text>

      {results.length === 0 ? (
        <Callout.Root color="blue">
          <Callout.Icon><Info size={16} /></Callout.Icon>
          <Callout.Text>No products found for "{query}". Try a different search term.</Callout.Text>
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
