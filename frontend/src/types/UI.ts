import type { ReactNode } from 'react';

export type AlertVariant =
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'info'
  | 'light'
  | 'dark';

export interface MessageProps {
  variant?: AlertVariant;
  children: ReactNode;
}
