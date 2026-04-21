import { Button, Heading, Badge, Table } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../services/orders';
import Loader from '../components/Loader';
import Message from '../components/Message';

const MyOrdersScreen = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">Failed to load orders</Message>;
  if (!orders || orders.length === 0) {
    return (
      <>
        <Heading size="6" mb="3">My Orders</Heading>
        <Message variant="info">You have no orders yet.</Message>
      </>
    );
  }

  return (
    <>
      <Heading size="6" mb="4">My Orders</Heading>
      <div style={{ overflowX: 'auto' }}>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>ID</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Date</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Total</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Paid</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>Delivered</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell></Table.ColumnHeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>
            {orders.map(order => (
              <Table.Row key={order.id}>
                <Table.Cell style={{ maxWidth: 120, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {order.id}
                </Table.Cell>
                <Table.Cell>{new Date(order.createdAt).toLocaleDateString()}</Table.Cell>
                <Table.Cell>${order.totalPrice.toFixed(2)}</Table.Cell>
                <Table.Cell>
                  {order.isPaid
                    ? <Badge color="green">{new Date(order.paidAt!).toLocaleDateString()}</Badge>
                    : <Badge color="red">Not Paid</Badge>}
                </Table.Cell>
                <Table.Cell>
                  {order.isDelivered
                    ? <Badge color="green">{new Date(order.deliveredAt!).toLocaleDateString()}</Badge>
                    : <Badge color="red">Not Delivered</Badge>}
                </Table.Cell>
                <Table.Cell>
                  <Button size="1" variant="outline" onClick={() => navigate(`/order/${order.id}`)}>
                    Details
                  </Button>
                </Table.Cell>
              </Table.Row>
            ))}
          </Table.Body>
        </Table.Root>
      </div>
    </>
  );
};

export default MyOrdersScreen;
