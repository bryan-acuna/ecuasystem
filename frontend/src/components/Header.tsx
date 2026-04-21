import { useState } from 'react';
import { Button, IconButton, TextField, DropdownMenu } from '@radix-ui/themes';
import {
  ShoppingCart, User, Plus, Search, Sun, Moon,
  Menu, ChevronDown, X, Smartphone, Laptop,
  Zap, Monitor, LogIn, LogOut, ListOrdered,
} from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useTheme } from '../context/ThemeContext';
import { useAppDispatch, useAppSelector } from '../store/hook/hooks';
import { removeCredentials } from '../slices/authSlice';
import { useLogoutMutation } from '../services/user';

const CATEGORIES = [
  { label: 'Phones',      path: '/category/phones',      Icon: Smartphone },
  { label: 'Tablets',     path: '/category/tablets',     Icon: Laptop },
  { label: 'Electronics', path: '/category/electronics', Icon: Zap },
  { label: 'Computers',   path: '/category/computers',   Icon: Monitor },
];

const NAV_BG     = '#0f172a';
const SUBNAV_BG  = '#1a2235';
const LINK_COLOR = '#94a3b8';

const Header = () => {
  const navigate = useNavigate();
  const { totalNumberItems } = useAppSelector(state => state.cart);
  const { userInfo }         = useAppSelector(state => state.auth);
  const [logout]             = useLogoutMutation();
  const dispatch             = useAppDispatch();
  const { theme, toggleTheme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [drawerOpen, setDrawerOpen]   = useState(false);
  const isDark = theme === 'dark';

  const logoutHandler = async () => {
    setDrawerOpen(false);
    try {
      const { message } = await logout().unwrap();
      dispatch(removeCredentials());
      navigate('/login');
      toast.success(message);
    } catch (err: any) {
      toast.error(err?.data?.message || 'Logout failed');
    }
  };

  const handleSearch = (val?: string) => {
    const trimmed = (val ?? searchQuery).trim();
    navigate(trimmed ? `/search?q=${encodeURIComponent(trimmed)}` : '/');
    setDrawerOpen(false);
  };

  return (
    <>
      {/* ════════════════════════════════════
          Sticky wrapper — both bars together
      ════════════════════════════════════ */}
      <div style={{ position: 'sticky', top: 0, zIndex: 100 }}>

        {/* ── Main Navbar ── */}
        <div style={{
          background: NAV_BG,
          padding: '0 16px',
          height: 56,
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          borderBottom: '1px solid rgba(255,255,255,0.06)',
        }}>

          {/* Brand + theme toggle */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 4, flexShrink: 0 }}>
            <Link to="/" style={{ color: '#fff', fontSize: 18, fontWeight: 700, letterSpacing: '-0.3px' }}>
              Ecuasystems
            </Link>
            <IconButton
              variant="ghost" size="2"
              onClick={toggleTheme}
              style={{ color: LINK_COLOR, marginLeft: 4 }}
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={16} /> : <Moon size={16} />}
            </IconButton>
          </div>

          {/* Center search — desktop only */}
          <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
            <div className="desktop-search" style={{ width: '100%', maxWidth: 440 }}>
              <TextField.Root
                placeholder="Search products..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSearch()}
                style={{ width: '100%' }}
              >
                <TextField.Slot side="right">
                  <IconButton size="1" variant="ghost" onClick={() => handleSearch()} aria-label="Search">
                    <Search size={14} />
                  </IconButton>
                </TextField.Slot>
              </TextField.Root>
            </div>
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 2, flexShrink: 0, marginLeft: 16 }}>

            {/* Cart with badge */}
            <div style={{ position: 'relative', display: 'inline-flex' }}>
              <Button
                variant="ghost" size="2"
                onClick={() => navigate('/cart')}
                style={{ color: LINK_COLOR }}
              >
                <ShoppingCart size={18} />
                <span className="desktop-only" style={{ marginLeft: 4 }}>Cart</span>
              </Button>
              {totalNumberItems > 0 && (
                <span style={{
                  position: 'absolute',
                  top: 2, right: 2,
                  background: '#10b981',
                  color: '#fff',
                  borderRadius: '9999px',
                  minWidth: 16,
                  height: 16,
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  padding: '0 3px',
                  pointerEvents: 'none',
                }}>
                  {totalNumberItems}
                </span>
              )}
            </div>

            {/* Single user/admin dropdown — desktop only */}
            <div className="desktop-only">
              {userInfo ? (
                <DropdownMenu.Root>
                  <DropdownMenu.Trigger>
                    <Button variant="ghost" size="2" style={{ color: LINK_COLOR }}>
                      <User size={15} /> {userInfo.name} <ChevronDown size={12} />
                    </Button>
                  </DropdownMenu.Trigger>
                  <DropdownMenu.Content>
                    <DropdownMenu.Item onClick={() => navigate('/profile')}>Profile</DropdownMenu.Item>
                    <DropdownMenu.Item onClick={() => navigate('/my-orders')}>My Orders</DropdownMenu.Item>
                    {userInfo.isAdmin && (
                      <>
                        <DropdownMenu.Separator />
                        <DropdownMenu.Label>Admin</DropdownMenu.Label>
                        <DropdownMenu.Item onClick={() => navigate('/admin/products')}>
                          <Monitor size={14} /> Manage Products
                        </DropdownMenu.Item>
                        <DropdownMenu.Item onClick={() => navigate('/admin/product/new')}>
                          <Plus size={14} /> Add Product
                        </DropdownMenu.Item>
                      </>
                    )}
                    <DropdownMenu.Separator />
                    <DropdownMenu.Item color="red" onClick={logoutHandler}>
                      <LogOut size={14} /> Log Out
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Root>
              ) : (
                <Button variant="ghost" size="2" onClick={() => navigate('/login')} style={{ color: LINK_COLOR }}>
                  <User size={16} /> Sign In
                </Button>
              )}
            </div>

            {/* Hamburger — mobile only */}
            <IconButton
              variant="ghost" size="2"
              className="mobile-only"
              onClick={() => setDrawerOpen(true)}
              style={{ color: LINK_COLOR }}
              aria-label="Open menu"
            >
              <Menu size={20} />
            </IconButton>
          </div>
        </div>

        {/* ── Sub-nav: Categories (desktop only) ── */}
        <div
          className="desktop-only"
          style={{
            background: SUBNAV_BG,
            borderBottom: '1px solid rgba(255,255,255,0.06)',
            padding: '0 16px',
            overflow: 'hidden',
            alignItems: 'center',
            position: 'relative',
          }}
        >
          {/* Menu dropdown — stays left */}
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Button
                variant="ghost" size="2"
                style={{ color: '#e2e8f0', fontWeight: 600, fontSize: 13, height: 40, borderRadius: 0 }}
              >
                <Menu size={14} /> Menu <ChevronDown size={10} />
              </Button>
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              {CATEGORIES.map(({ label, path, Icon }) => (
                <DropdownMenu.Item key={path} onClick={() => navigate(path)}>
                  <Icon size={14} /> {label}
                </DropdownMenu.Item>
              ))}
            </DropdownMenu.Content>
          </DropdownMenu.Root>

          {/* Category links — centered */}
          <div style={{
            position: 'absolute',
            left: '50%',
            transform: 'translateX(-50%)',
            display: 'flex',
            alignItems: 'center',
          }}>
            {CATEGORIES.map(({ label, path }) => (
              <Link
                key={path}
                to={path}
                style={{
                  color: LINK_COLOR,
                  fontSize: 13,
                  fontWeight: 500,
                  padding: '0 14px',
                  height: 40,
                  display: 'inline-flex',
                  alignItems: 'center',
                  whiteSpace: 'nowrap',
                  transition: 'color 0.2s',
                }}
                onMouseEnter={e => (e.currentTarget.style.color = '#fff')}
                onMouseLeave={e => (e.currentTarget.style.color = LINK_COLOR)}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>
      </div>

      {/* ════════════════════════════════════
          Mobile Drawer
      ════════════════════════════════════ */}
      {drawerOpen && (
        <>
          {/* Overlay */}
          <div
            onClick={() => setDrawerOpen(false)}
            style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.55)', zIndex: 200 }}
          />

          {/* Drawer panel */}
          <div style={{
            position: 'fixed',
            top: 0, left: 0, bottom: 0,
            width: 'min(280px, 85vw)',
            background: 'var(--color-panel-solid)',
            zIndex: 201,
            overflowY: 'auto',
            display: 'flex',
            flexDirection: 'column',
          }}>

            {/* Drawer header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '0 16px', height: 56,
              borderBottom: '1px solid var(--gray-a6)',
              flexShrink: 0,
            }}>
              <Link to="/" onClick={() => setDrawerOpen(false)} style={{ fontWeight: 700, fontSize: 18, color: 'var(--gray-12)' }}>
                Ecuasystems
              </Link>
              <IconButton variant="ghost" size="2" onClick={() => setDrawerOpen(false)} aria-label="Close">
                <X size={18} />
              </IconButton>
            </div>

            {/* Mobile search */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid var(--gray-a6)' }}>
              <TextField.Root
                placeholder="Search products..."
                onKeyDown={e => {
                  if (e.key === 'Enter') handleSearch((e.target as HTMLInputElement).value);
                }}
              >
                <TextField.Slot side="right">
                  <Search size={14} style={{ color: 'var(--gray-10)' }} />
                </TextField.Slot>
              </TextField.Root>
            </div>

            {/* Section label */}
            <SectionLabel>Categories</SectionLabel>
            {CATEGORIES.map(({ label, path, Icon }) => (
              <DrawerLink key={path} to={path} onClose={() => setDrawerOpen(false)}>
                <Icon size={16} style={{ color: 'var(--gray-9)', flexShrink: 0 }} /> {label}
              </DrawerLink>
            ))}

            <SectionLabel>Account</SectionLabel>
            {userInfo ? (
              <>
                {userInfo.isAdmin && (
                  <>
                    <DrawerLink to="/admin/products" onClose={() => setDrawerOpen(false)}>
                      <Monitor size={16} style={{ color: 'var(--gray-9)' }} /> Manage Products
                    </DrawerLink>
                    <DrawerLink to="/admin/product/new" onClose={() => setDrawerOpen(false)}>
                      <Plus size={16} style={{ color: 'var(--gray-9)' }} /> Add Product
                    </DrawerLink>
                  </>
                )}
                <DrawerLink to="/profile" onClose={() => setDrawerOpen(false)}>
                  <User size={16} style={{ color: 'var(--gray-9)' }} /> Profile
                </DrawerLink>
                <DrawerLink to="/my-orders" onClose={() => setDrawerOpen(false)}>
                  <ListOrdered size={16} style={{ color: 'var(--gray-9)' }} /> My Orders
                </DrawerLink>
                <button
                  onClick={logoutHandler}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    padding: '12px 24px', width: '100%',
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--red-11)', fontSize: 15, textAlign: 'left',
                    borderBottom: '1px solid var(--gray-a4)',
                  }}
                >
                  <LogOut size={16} /> Log Out
                </button>
              </>
            ) : (
              <DrawerLink to="/login" onClose={() => setDrawerOpen(false)}>
                <LogIn size={16} style={{ color: 'var(--gray-9)' }} /> Sign In
              </DrawerLink>
            )}
          </div>
        </>
      )}
    </>
  );
};

/* ── Small helpers to reduce repetition ── */

const SectionLabel = ({ children }: { children: React.ReactNode }) => (
  <div style={{
    padding: '12px 16px 4px',
    fontSize: 11, fontWeight: 700, letterSpacing: 1,
    textTransform: 'uppercase', color: 'var(--gray-9)',
  }}>
    {children}
  </div>
);

const DrawerLink = ({
  to, children, onClose,
}: { to: string; children: React.ReactNode; onClose: () => void }) => (
  <Link
    to={to}
    onClick={onClose}
    style={{
      display: 'flex', alignItems: 'center', gap: 10,
      padding: '12px 24px', color: 'var(--gray-12)', fontSize: 15,
      borderBottom: '1px solid var(--gray-a4)',
    }}
  >
    {children}
  </Link>
);

export default Header;
