import { Badge, Container, Nav, Navbar, NavDropdown } from 'react-bootstrap';
import { FaShoppingCart, FaUser, FaPlus } from 'react-icons/fa';
import { LinkContainer } from 'react-router-bootstrap';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { useLogoutMutation } from '../services/user';
import { removeCredentials } from '../slices/authSlice';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const { totalNumberItems } = useAppSelector(state => state.cart);
  const { userInfo } = useAppSelector(state => state.auth);
  const [logout] = useLogoutMutation();
  const dispatch = useAppDispatch();

  const logoutHandler = async () => {
    try {
      const { message } = await logout().unwrap();
      console.log(message);
      dispatch(removeCredentials());
      navigate('/login');
      toast.success(message);
    } catch (err: any) {
      toast.error(err?.data?.message || err?.error || 'Login failed');
    }
  };
  return (
    <header>
      <Navbar variant="dark" expand="md" collapseOnSelect>
        <Container>
          <LinkContainer to="/">
            <Navbar.Brand>Ecuasystems</Navbar.Brand>
          </LinkContainer>

          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto">
              <NavDropdown title="Electronics" id="electronics-dropdown">
                <LinkContainer to="/category/phones">
                  <NavDropdown.Item>Phones</NavDropdown.Item>
                </LinkContainer>
                <LinkContainer to="/category/tablets">
                  <NavDropdown.Item>Tablets</NavDropdown.Item>
                </LinkContainer>
                <NavDropdown.Divider />
                <LinkContainer to="/category/electronics">
                  <NavDropdown.Item>More Electronics</NavDropdown.Item>
                </LinkContainer>
              </NavDropdown>
              <LinkContainer to="/cart">
                <Nav.Link>
                  <FaShoppingCart /> Cart{' '}
                  {totalNumberItems > 0 && (
                    <Badge pill bg="success" style={{ marginLeft: '5px' }}>
                      {totalNumberItems}
                    </Badge>
                  )}
                </Nav.Link>
              </LinkContainer>
              {userInfo?.isAdmin && (
                <LinkContainer to="/admin/product/new">
                  <Nav.Link>
                    <FaPlus /> Add Product
                  </Nav.Link>
                </LinkContainer>
              )}
              {userInfo ? (
                <NavDropdown title={userInfo.name} id="username">
                  <LinkContainer to="/profile">
                    <NavDropdown.Item>Profile</NavDropdown.Item>
                  </LinkContainer>
                  <LinkContainer to="/my-orders">
                    <NavDropdown.Item>My Orders</NavDropdown.Item>
                  </LinkContainer>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={logoutHandler}>
                    Log Out
                  </NavDropdown.Item>
                </NavDropdown>
              ) : (
                <LinkContainer to="/login">
                  <Nav.Link>
                    <FaUser /> Sign In
                  </Nav.Link>
                </LinkContainer>
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
