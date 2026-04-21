import { Card, Heading, Text, Separator, Flex } from '@radix-ui/themes';
import type { ReactNode } from 'react';

interface OrderSummaryCardProps {
  itemsPrice: number;
  shippingPrice: number;
  taxPrice: number;
  totalPrice: number;
  children?: ReactNode;
}

const SummaryRow = ({ label, value }: { label: string; value: string }) => (
  <Flex justify="between" py="1">
    <Text>{label}</Text>
    <Text weight="bold">{value}</Text>
  </Flex>
);

const OrderSummaryCard = ({ itemsPrice, shippingPrice, taxPrice, totalPrice, children }: OrderSummaryCardProps) => (
  <Card>
    <Heading size="4" mb="3">Order Summary</Heading>
    <SummaryRow label="Items:"    value={`$${itemsPrice}`} />
    <SummaryRow label="Shipping:" value={`$${shippingPrice}`} />
    <SummaryRow label="Tax:"      value={`$${taxPrice}`} />
    <Separator size="4" my="2" />
    <SummaryRow label="Total:"    value={`$${totalPrice}`} />
    {children && <div style={{ marginTop: 16 }}>{children}</div>}
  </Card>
);

export default OrderSummaryCard;
