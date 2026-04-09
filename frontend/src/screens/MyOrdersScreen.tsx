import { Badge, Button, Table } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../services/orders';
import Loader from '../components/Loader';
import Message from '../components/Message';

const MyOrdersScreen = () => {
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return <Loader />;

  if (error)
    return <Message variant="danger">Failed to load orders</Message>;

  if (!orders || orders.length === 0)
    return (
      <>
        <h1>My Orders</h1>
        <Message variant="info">You have no orders yet.</Message>
      </>
    );

  return (
    <>
      <h1>My Orders</h1>
      <Table striped hover responsive className="table-sm mt-3">
        <thead>
          <tr>
            <th>ID</th>
            <th>Date</th>
            <th>Total</th>
            <th>Paid</th>
            <th>Delivered</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {orders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>{new Date(order.createdAt).toLocaleDateString()}</td>
              <td>${order.totalPrice.toFixed(2)}</td>
              <td>
                {order.isPaid ? (
                  <Badge bg="success">
                    {new Date(order.paidAt!).toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge bg="danger">Not Paid</Badge>
                )}
              </td>
              <td>
                {order.isDelivered ? (
                  <Badge bg="success">
                    {new Date(order.deliveredAt!).toLocaleDateString()}
                  </Badge>
                ) : (
                  <Badge bg="danger">Not Delivered</Badge>
                )}
              </td>
              <td>
                <Button
                  variant="outline-primary"
                  size="sm"
                  onClick={() => navigate(`/order/${order.id}`)}
                >
                  Details
                </Button>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
    </>
  );
};

export default MyOrdersScreen;
