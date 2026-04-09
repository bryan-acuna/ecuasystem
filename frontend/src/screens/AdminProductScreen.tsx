import React, { useState } from 'react';
import { Button, Card, Col, Form, Row } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useCreateProductMutation } from '../services/product';

const CATEGORIES = ['Electronics', 'Phones', 'Tablets', 'Accessories', 'Other'];

const AdminProductScreen = () => {
  const navigate = useNavigate();
  const [createProduct, { isLoading }] = useCreateProductMutation();

  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState('');
  const [brand, setBrand] = useState('');
  const [category, setCategory] = useState(CATEGORIES[0]);
  const [countInStock, setCountInStock] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      await createProduct({
        name,
        price: parseFloat(price),
        image,
        brand,
        category,
        countInStock: parseInt(countInStock),
        description,
      }).unwrap();
      toast.success('Product created successfully');
      navigate('/');
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || 'Failed to create product');
    }
  };

  return (
    <Row className="justify-content-center">
      <Col md={8} lg={6}>
        <Card className="p-4">
          <h1 className="mb-4">Add New Product</h1>
          <Form onSubmit={handleSubmit}>
            <Form.Group className="mb-3" controlId="name">
              <Form.Label>Product Name</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter product name"
                value={name}
                onChange={e => setName(e.target.value)}
                required
              />
            </Form.Group>

            <Row>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="price">
                  <Form.Label>Price ($)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={price}
                    onChange={e => setPrice(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
              <Col sm={6}>
                <Form.Group className="mb-3" controlId="countInStock">
                  <Form.Label>Count In Stock</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    placeholder="0"
                    value={countInStock}
                    onChange={e => setCountInStock(e.target.value)}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3" controlId="brand">
              <Form.Label>Brand</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter brand"
                value={brand}
                onChange={e => setBrand(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="category">
              <Form.Label>Category</Form.Label>
              <Form.Select
                value={category}
                onChange={e => setCategory(e.target.value)}
              >
                {CATEGORIES.map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3" controlId="image">
              <Form.Label>Image URL</Form.Label>
              <Form.Control
                type="text"
                placeholder="Enter image URL"
                value={image}
                onChange={e => setImage(e.target.value)}
                required
              />
            </Form.Group>

            <Form.Group className="mb-4" controlId="description">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Enter product description"
                value={description}
                onChange={e => setDescription(e.target.value)}
                required
              />
            </Form.Group>

            <div className="d-flex gap-2">
              <Button type="submit" variant="primary" disabled={isLoading}>
                {isLoading ? 'Creating...' : 'Create Product'}
              </Button>
              <Button
                type="button"
                variant="outline-secondary"
                onClick={() => navigate('/')}
              >
                Cancel
              </Button>
            </div>
          </Form>
        </Card>
      </Col>
    </Row>
  );
};

export default AdminProductScreen;
