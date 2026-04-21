import { Flex, Spinner } from '@radix-ui/themes';

const Loader = () => (
  <Flex justify="center" align="center" style={{ padding: '3rem 0' }}>
    <Spinner size="3" />
  </Flex>
);

export default Loader;
