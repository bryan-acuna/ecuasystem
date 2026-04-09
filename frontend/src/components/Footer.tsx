import { Col, Container, Row } from 'react-bootstrap';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className="py-4">
      <Container>
        <Row>
          <Col className="text-center">
            <p>Ecuasystems &copy;{currentYear}</p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer;
