import { useState } from 'react';
import { Button, Card, Heading, Text, Badge } from '@radix-ui/themes';
import { ArrowLeft, ShoppingCart, ChevronLeft, ChevronRight } from 'lucide-react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import Rating from '../components/Rating';
import { useGetProductByIdQuery } from '../services/product';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useAppDispatch } from '../store/hook/hooks';
import { addToCart } from '../slices/cartSlices';

const ProductScreen = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { id: productId } = useParams<{ id: string }>();
  const [currentImg, setCurrentImg] = useState(0);

  const { data: product, error, isLoading } = useGetProductByIdQuery(productId || '', { skip: !productId });

  if (!productId) return <Message variant="danger">Invalid product ID</Message>;
  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Error fetching product</Message>;
  if (!product) return <Message variant="info">Product not found</Message>;

  const allImages = [product.image, ...(product.images?.filter(img => img && img !== product.image) ?? [])];

  const handleAddToCart = () => {
    dispatch(addToCart(product));
    navigate('/cart');
  };

  const prev = () => setCurrentImg(i => (i - 1 + allImages.length) % allImages.length);
  const next = () => setCurrentImg(i => (i + 1) % allImages.length);

  return (
    <>
      <Link to="/"><Button variant="outline" size="2" mb="4"><ArrowLeft size={14} /> Go Back</Button></Link>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 280px', gap: 24, alignItems: 'start' }}
        className="product-grid">

        {/* Images */}
        <div>
          <div style={{ position: 'relative', borderRadius: 12, overflow: 'hidden', background: 'var(--gray-2)' }}>
            <img
              src={allImages[currentImg]}
              alt={`${product.name} ${currentImg + 1}`}
              style={{ width: '100%', height: 380, objectFit: 'contain', padding: 16, display: 'block' }}
            />
            {allImages.length > 1 && (
              <>
                <button
                  onClick={prev}
                  style={{
                    position: 'absolute', top: '50%', left: 8, transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 1,
                  }}
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={next}
                  style={{
                    position: 'absolute', top: '50%', right: 8, transform: 'translateY(-50%)',
                    background: 'rgba(255,255,255,0.8)', border: 'none', borderRadius: '50%',
                    width: 32, height: 32, display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', zIndex: 1,
                  }}
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>
          {allImages.length > 1 && (
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {allImages.map((src, idx) => (
                <img
                  key={idx}
                  src={src}
                  alt={`thumb-${idx}`}
                  onClick={() => setCurrentImg(idx)}
                  style={{
                    width: 64, height: 64, objectFit: 'contain', borderRadius: 8,
                    background: 'var(--gray-2)', padding: 4, cursor: 'pointer',
                    border: idx === currentImg ? '2px solid var(--accent-9)' : '2px solid var(--gray-a6)',
                  }}
                />
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <Heading size="5" mb="2">{product.name}</Heading>
          <Rating rating={product.rating} numReviews={`${product.numReviews} reviews`} />
          <Text size="6" weight="bold" style={{ color: 'var(--accent-11)', display: 'block', margin: '12px 0' }}>
            ${product.price}
          </Text>
          <Text size="3" color="gray">{product.description}</Text>
        </div>

        {/* Add to cart */}
        <Card>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text weight="medium">Price:</Text>
              <Text weight="bold">${product.price}</Text>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <Text weight="medium">Status:</Text>
              {product.countInStock > 0
                ? <Badge color="green">In Stock</Badge>
                : <Badge color="red">Out of Stock</Badge>}
            </div>
            <Button
              size="3"
              style={{ width: '100%', marginTop: 4 }}
              disabled={product.countInStock === 0}
              onClick={handleAddToCart}
            >
              <ShoppingCart size={16} /> Add To Cart
            </Button>
          </div>
        </Card>
      </div>

      <style>{`
        @media (max-width: 768px) {
          .product-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </>
  );
};

export default ProductScreen;
