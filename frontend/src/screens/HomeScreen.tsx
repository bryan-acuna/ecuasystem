import ProductComponent from '../components/Product';
import { Alert, Col, Form, Row } from 'react-bootstrap';
import type { Product } from '../types/Product';
import { useGetProductsQuery } from '../services/product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useState, useMemo } from 'react';

type SortOption = 'default' | 'price-asc' | 'price-desc';

const HomeScreen = () => {
  const { data: products, error, isLoading } = useGetProductsQuery();
  const [sort, setSort] = useState<SortOption>('default');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  const filtered = useMemo(() => {
    if (!products) return [];
    let result = [...products];

    const min = minPrice !== '' ? parseFloat(minPrice) : null;
    const max = maxPrice !== '' ? parseFloat(maxPrice) : null;

    if (min !== null) result = result.filter(p => p.price >= min);
    if (max !== null) result = result.filter(p => p.price <= max);

    if (sort === 'price-asc') result.sort((a, b) => a.price - b.price);
    if (sort === 'price-desc') result.sort((a, b) => b.price - a.price);

    return result;
  }, [products, sort, minPrice, maxPrice]);

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

  return (
    <>
      <h1>Latest Products</h1>

      <Row className="align-items-end mb-4 g-2">
        <Col xs={12} sm={4} md={3}>
          <Form.Label className="fw-semibold mb-1">Sort by Price</Form.Label>
          <Form.Select value={sort} onChange={e => setSort(e.target.value as SortOption)}>
            <option value="default">Default</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </Form.Select>
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Label className="fw-semibold mb-1">Min Price ($)</Form.Label>
          <Form.Control
            type="number"
            min={0}
            placeholder="0"
            value={minPrice}
            onChange={e => setMinPrice(e.target.value)}
          />
        </Col>
        <Col xs={6} sm={4} md={2}>
          <Form.Label className="fw-semibold mb-1">Max Price ($)</Form.Label>
          <Form.Control
            type="number"
            min={0}
            placeholder="Any"
            value={maxPrice}
            onChange={e => setMaxPrice(e.target.value)}
          />
        </Col>
      </Row>

      {filtered.length === 0 ? (
        <Alert variant="info">No products match the selected price range.</Alert>
      ) : (
        <Row>
          {filtered.map((product: Product) => (
            <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
              <ProductComponent {...product} />
            </Col>
          ))}
        </Row>
      )}
    </>
  );
};

export default HomeScreen;
