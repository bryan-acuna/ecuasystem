import type { ReactNode } from 'react';

const FormContainer = ({ children }: { children: ReactNode }) => (
  <div style={{ display: 'flex', justifyContent: 'center' }}>
    <div style={{ width: '100%', maxWidth: 480 }}>
      {children}
    </div>
  </div>
);

export default FormContainer;
