import { Callout } from '@radix-ui/themes';
import { Info, CheckCircle, AlertTriangle, XCircle } from 'lucide-react';
import type { MessageProps } from '../types/UI';

const config = {
  success: { color: 'green' as const, Icon: CheckCircle },
  info:    { color: 'blue'  as const, Icon: Info },
  warning: { color: 'yellow' as const, Icon: AlertTriangle },
  danger:  { color: 'red'  as const, Icon: XCircle },
};

const Message = ({ variant = 'info', children }: MessageProps) => {
  const { color, Icon } = config[variant as keyof typeof config] ?? config.info;
  return (
    <Callout.Root color={color} mb="4">
      <Callout.Icon><Icon size={16} /></Callout.Icon>
      <Callout.Text>{children}</Callout.Text>
    </Callout.Root>
  );
};

export default Message;
