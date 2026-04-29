import { Card, Heading, Text, Separator, Flex } from '@radix-ui/themes';
import type { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import { formatPrice } from '../utils/formatPrice';

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

const OrderSummaryCard = ({ itemsPrice, shippingPrice, taxPrice, totalPrice, children }: OrderSummaryCardProps) => {
  const { t } = useTranslation();
  return (
    <Card>
      <Heading size="4" mb="3">{t('orderSummary.title')}</Heading>
      <SummaryRow label={t('orderSummary.items')}    value={formatPrice(itemsPrice)} />
      <SummaryRow label={t('orderSummary.shipping')} value={formatPrice(shippingPrice)} />
      <SummaryRow label={t('orderSummary.tax')}      value={formatPrice(taxPrice)} />
      <Separator size="4" my="2" />
      <SummaryRow label={t('orderSummary.total')}    value={formatPrice(totalPrice)} />
      {children && <div style={{ marginTop: 16 }}>{children}</div>}
    </Card>
  );
};

export default OrderSummaryCard;
