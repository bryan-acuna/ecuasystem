import { Alert, Col, Row } from 'react-bootstrap';
import { useParams } from 'react-router-dom';
import type { Product } from '../types/Product';
import { useGetProductsByCategoryQuery } from '../services/product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import ProductComponent from '../components/Product';

const CATEGORY_LABELS: Record<string, string> = {
  phones: 'Phones',
  tablets: 'Tablets',
  electronics: 'More Electronics',
};

const CategoryScreen = () => {
  const { category } = useParams<{ category: string }>();
  const { data: products, error, isLoading } = useGetProductsByCategoryQuery(category ?? '');

  const title = CATEGORY_LABELS[category ?? ''] ?? category;

  if (isLoading) return <Loader />;

  if (error) {
    return (
      <Message variant="danger">
        {'status' in error
          ? `Error: ${error.status}`
          : 'An error occurred while fetching products'}
      </Message>
    );
  }

  if (!products || products.length === 0) {
    return (
      <>
        <h1>{title}</h1>
        <Alert variant="info">No products available in this category.</Alert>
      </>
    );
  }

  return (
    <>
      <h1>{title}</h1>
      <Row>
        {products.map((product: Product) => (
          <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
            <ProductComponent {...product} />
          </Col>
        ))}
      </Row>
    </>
  );
};

export default CategoryScreen;
