import { Button, Heading, Badge, Table } from '@radix-ui/themes';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useGetProductsQuery, useDeleteProductMutation } from '../services/product';
import Loader from '../components/Loader';
import Message from '../components/Message';

const AdminProductListScreen = () => {
  const navigate = useNavigate();
  const { data: products, isLoading, error } = useGetProductsQuery();
  const [deleteProduct, { isLoading: isDeleting }] = useDeleteProductMutation();

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Delete "${name}"? This cannot be undone.`)) return;
    try {
      await deleteProduct(id).unwrap();
      toast.success('Product deleted');
    } catch (err: any) {
      toast.error(err?.data?.message || 'Failed to delete product');
    }
  };

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Failed to load products</Message>;

  return (
    <>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <Heading size="6">Products</Heading>
        <Button size="2" onClick={() => navigate('/admin/product/new')}>
          <Plus size={14} /> Add Product
        </Button>
      </div>

      <div style={{ overflowX: 'auto' }}>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>Image</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Name</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Price</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Category</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Brand</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Stock</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Actions</Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {products?.map(product => (
              <Table.Row key={product.id}>
                <Table.Cell>
                  <img
                    src={product.image}
                    alt={product.name}
                    style={{ width: 50, height: 50, objectFit: 'contain', borderRadius: 6, background: 'var(--gray-2)' }}
                  />
                </Table.Cell>
                <Table.Cell><strong>{product.name}</strong></Table.Cell>
                <Table.Cell>${product.price.toFixed(2)}</Table.Cell>
                <Table.Cell>{product.category}</Table.Cell>
                <Table.Cell>{product.brand}</Table.Cell>
                <Table.Cell>
                  {product.countInStock === 0
                    ? <Badge color="red">Out of Stock</Badge>
                    : <Badge color="green">{product.countInStock}</Badge>}
                </Table.Cell>
                <Table.Cell>
                  <div style={{ display: 'flex', gap: 8 }}>
                    <Button size="1" variant="outline" onClick={() => navigate(`/admin/product/${product.id}/edit`)}>
                      <Pencil size={12} />
                    </Button>
                    <Button
                      size="1"
                      color="red"
                      variant="soft"
                      disabled={isDeleting}
                      onClick={() => handleDelete(product.id, product.name)}
                    >
                      <Trash2 size={12} />
                    </Button>
                  </div>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </>
  );
};

export default AdminProductListScreen;
