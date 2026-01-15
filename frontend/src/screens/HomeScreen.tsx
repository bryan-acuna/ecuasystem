import ProductComponent from '../components/Product';
import { Alert, Col, Row, Spinner } from 'react-bootstrap';
import type { Product } from '../types/Product';
import { useGetProductsQuery } from '../services/product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const HomeScreen = () => {
  //   const [products, setProducts] = useState<Product[]>([]);
  const { data: products, error, isLoading } = useGetProductsQuery();

  if (isLoading) {
    return <Loader />;
  }
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
        <h1>Latest Products</h1>
        <Alert variant="info">No products available at the moment.</Alert>
      </>
    );
  }

  return (
    <>
      <h1>Latest Products</h1>
      <Row>
        {products.map((product: Product) => {
          return (
            <Col key={product.id} sm={12} md={6} lg={4} xl={3}>
              <ProductComponent {...product} />
            </Col>
          );
        })}
      </Row>
    </>
  );
};

export default HomeScreen;
