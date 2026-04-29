import { Button, Heading, Badge, Table } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';
import { useGetMyOrdersQuery } from '../services/orders';
import Loader from '../components/Loader';
import Message from '../components/Message';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/formatPrice';

const MyOrdersScreen = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { data: orders, isLoading, error } = useGetMyOrdersQuery();

  if (isLoading) return <Loader />;
  if (error) return <Message variant="danger">{t('myOrders.errorLoading')}</Message>;
  if (!orders || orders.length === 0) {
    return (
      <>
        <Heading size="6" mb="3">{t('myOrders.title')}</Heading>
        <Message variant="info">{t('myOrders.noOrders')}</Message>
      </>
    );
  }

  return (
    <>
      <Heading size="6" mb="4">{t('myOrders.title')}</Heading>
      <div style={{ overflowX: 'auto' }}>
        <Table.Root variant="surface">
          <Table.Header>
            <Table.Row>
              <Table.ColumnHeaderCell>{t('myOrders.id')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('myOrders.date')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('myOrders.total')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('myOrders.paid')}</Table.ColumnHeaderCell>
              <Table.ColumnHeaderCell>{t('myOrders.delivered')}</Table.ColumnHeaderCell>
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
                <Table.Cell>{formatPrice(order.totalPrice)}</Table.Cell>
                <Table.Cell>
                  {order.isPaid
                    ? <Badge color="green">{new Date(order.paidAt!).toLocaleDateString()}</Badge>
                    : <Badge color="red">{t('myOrders.notPaid')}</Badge>}
                </Table.Cell>
                <Table.Cell>
                  {order.isDelivered
                    ? <Badge color="green">{new Date(order.deliveredAt!).toLocaleDateString()}</Badge>
                    : <Badge color="red">{t('myOrders.notDelivered')}</Badge>}
                </Table.Cell>
                <Table.Cell>
                  <Button size="1" variant="outline" onClick={() => navigate(`/order/${order.id}`)}>
                    {t('myOrders.details')}
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
