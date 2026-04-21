import { Text } from '@radix-ui/themes';
import { useNavigate } from 'react-router-dom';

interface CheckoutStepsProps {
  step1?: boolean;
  step2?: boolean;
  step3?: boolean;
  step4?: boolean;
}

const steps = [
  { title: 'Sign In',     path: '/login' },
  { title: 'Shipping',    path: '/shipping' },
  { title: 'Payment',     path: '/payment' },
  { title: 'Place Order', path: '/place-order' },
];

const CheckoutSteps = ({ step1, step2, step3, step4 }: CheckoutStepsProps) => {
  const navigate = useNavigate();
  const flags = [step1, step2, step3, step4];
  const current = step4 ? 3 : step3 ? 2 : step2 ? 1 : 0;

  return (
    <div style={{ display: 'flex', alignItems: 'center', marginBottom: 24, overflowX: 'auto' }}>
      {steps.map((step, i) => (
        <div key={i} style={{ display: 'flex', alignItems: 'center', flexShrink: 0 }}>
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              opacity: flags[i] ? 1 : 0.4,
              cursor: flags[i] ? 'pointer' : 'default',
            }}
            onClick={() => flags[i] && navigate(step.path)}
          >
            <div style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: i <= current && flags[i] ? 'var(--accent-9)' : 'var(--gray-a5)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: 12,
              fontWeight: 600,
              flexShrink: 0,
            }}>
              {i + 1}
            </div>
            <Text
              size="2"
              weight={i === current ? 'bold' : 'regular'}
              style={{ whiteSpace: 'nowrap' }}
            >
              {step.title}
            </Text>
          </div>
          {i < steps.length - 1 && (
            <div style={{ width: 32, height: 1, background: 'var(--gray-a5)', margin: '0 8px', flexShrink: 0 }} />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
