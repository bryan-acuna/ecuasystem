import { useEffect, useState } from 'react';
import { Button, Card, Heading, Select, Text, TextArea, TextField } from '@radix-ui/themes';
import { ArrowLeft, Plus, Trash2 } from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetProductByIdQuery, useUpdateProductMutation } from '../services/product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const CATEGORIES = ['Electronics', 'Phones', 'Tablets', 'Computers', 'Accessories', 'Other'];

const AdminProductEditScreen = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const [name, setName]                 = useState('');
  const [price, setPrice]               = useState('');
  const [image, setImage]               = useState('');
  const [images, setImages]             = useState<string[]>([]);
  const [brand, setBrand]               = useState('');
  const [category, setCategory]         = useState(CATEGORIES[0]);
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription]   = useState('');

  const { data: product, isLoading, error } = useGetProductByIdQuery(id!);
  const [updateProduct, { isLoading: isUpdating }] = useUpdateProductMutation();

  useEffect(() => {
    if (product) {
      setName(product.name);
      setPrice(String(product.price));
      setImage(product.image);
      setImages(product.images ?? []);
      setBrand(product.brand);
      setCategory(product.category);
      setCountInStock(String(product.countInStock));
      setDescription(product.description);
    }
  }, [product]);

  const addImage    = ()               => setImages(prev => [...prev, '']);
  const removeImage = (i: number)      => setImages(prev => prev.filter((_, idx) => idx !== i));
  const updateImage = (i: number, v: string) => setImages(prev => prev.map((img, idx) => idx === i ? v : img));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await updateProduct({
        id: id!,
        name, price: Number(price), image, images: images.filter(Boolean),
        brand, category, countInStock: Number(countInStock), description,
      }).unwrap();
      toast.success('Product updated successfully');
      navigate('/admin/products');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to update product');
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Failed to load product</Message>;

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ width: '100%', maxWidth: 640 }}>
        <Card style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
            <Button variant="outline" size="2" onClick={() => navigate('/admin/products')}>
              <ArrowLeft size={14} /> Back
            </Button>
            <Heading size="6">Edit Product</Heading>
          </div>
          <form onSubmit={handleSubmit}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <label>
                <Text as="div" size="2" weight="medium" mb="1">Product Name</Text>
                <TextField.Root value={name} onChange={e => setName(e.target.value)} required />
              </label>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                <label>
                  <Text as="div" size="2" weight="medium" mb="1">Price ($)</Text>
                  <TextField.Root type="number" min="0" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required />
                </label>
                <label>
                  <Text as="div" size="2" weight="medium" mb="1">Count In Stock</Text>
                  <TextField.Root type="number" min="0" value={countInStock} onChange={e => setCountInStock(e.target.value)} required />
                </label>
              </div>

              <label>
                <Text as="div" size="2" weight="medium" mb="1">Brand</Text>
                <TextField.Root value={brand} onChange={e => setBrand(e.target.value)} required />
              </label>

              <div>
                <Text as="div" size="2" weight="medium" mb="1">Category</Text>
                <Select.Root value={category} onValueChange={setCategory}>
                  <Select.Trigger style={{ width: '100%' }} />
                  <Select.Content>
                    {CATEGORIES.map(c => <Select.Item key={c} value={c}>{c}</Select.Item>)}
                  </Select.Content>
                </Select.Root>
              </div>

              <label>
                <Text as="div" size="2" weight="medium" mb="1">Primary Image URL</Text>
                <TextField.Root value={image} onChange={e => setImage(e.target.value)} required />
              </label>

              {/* Image preview */}
              {image && (
                <img
                  src={image}
                  alt="Preview"
                  style={{ width: 100, height: 100, objectFit: 'contain', borderRadius: 6, background: 'var(--gray-2)' }}
                />
              )}

              {/* Additional images */}
              <div>
                <Text as="div" size="2" weight="medium" mb="2">Additional Images (carousel)</Text>
                {images.map((img, i) => (
                  <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    <TextField.Root
                      placeholder="https://example.com/image.jpg"
                      value={img}
                      onChange={e => updateImage(i, e.target.value)}
                      style={{ flex: 1 }}
                    />
                    <Button type="button" color="red" variant="soft" size="2" onClick={() => removeImage(i)}>
                      <Trash2 size={14} />
                    </Button>
                  </div>
                ))}
                <Button type="button" variant="outline" size="2" onClick={addImage}>
                  <Plus size={14} /> Add Image
                </Button>
              </div>

              <label>
                <Text as="div" size="2" weight="medium" mb="1">Description</Text>
                <TextArea rows={3} value={description} onChange={e => setDescription(e.target.value)} required />
              </label>

              <div style={{ display: 'flex', gap: 8 }}>
                <Button type="submit" size="3" loading={isUpdating}>Save Changes</Button>
                <Button type="button" variant="outline" size="3" onClick={() => navigate('/admin/products')}>Cancel</Button>
              </div>
            </div>
          </form>
        </Card>
      </div>
    </div>
  );
};

export default AdminProductEditScreen;
