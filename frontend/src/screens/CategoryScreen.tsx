import { Heading, Callout } from '@radix-ui/themes';
import { Info } from 'lucide-react';
import { useParams } from 'react-router-dom';
import type { Product } from '../types/Product';
import { useGetProductsByCategoryQuery } from '../services/product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductComponent from '../components/Product';

const CATEGORY_LABELS: Record<string, string> = {
  phones:      'Phones',
  tablets:     'Tablets',
  electronics: 'More Electronics',
  computers:   'Computers',
};

const CategoryScreen = () => {
  const { category } = useParams<{ category: string }>();
  const { data: products, error, isLoading } = useGetProductsByCategoryQuery(category ?? '');
  const title = CATEGORY_LABELS[category ?? ''] ?? category;

  if (isLoading) return <Loader />;
  if (error) return (
    <Message variant="danger">
      {'status' in error ? `Error: ${error.status}` : 'An error occurred while fetching products'}
    </Message>
  );

  return (
    <>
      <Heading size="6" mb="4">{title}</Heading>
      {!products || products.length === 0 ? (
        <Callout.Root color="blue">
          <Callout.Icon><Info size={16} /></Callout.Icon>
          <Callout.Text>No products available in this category.</Callout.Text>
        </Callout.Root>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
          gap: 16,
        }}>
          {products.map((product: Product) => (
            <ProductComponent key={product.id} {...product} />
          ))}
        </div>
      )}
    </>
  );
};

export default CategoryScreen;
