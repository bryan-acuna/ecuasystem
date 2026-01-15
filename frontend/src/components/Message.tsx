import { Alert } from 'react-bootstrap';
import type { MessageProps } from '../types/UI';

const Message = ({ variant = 'info', children }: MessageProps) => {
  return <Alert variant={variant}>{children}</Alert>;
};

export default Message;
