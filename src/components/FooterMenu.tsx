import { useState, useEffect } from 'react';
import { FaHome, FaSearch, FaShoppingCart, FaUser } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import MobileSearch from './MobileSearch';
import styles from './FooterMenu.module.css';

const FooterMenu = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const navigate = useNavigate();
  const { setIsCartOpen } = useCart();

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);

    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Hide on desktop - only show on mobile
  if (!isMobile) {
    return null;
  }

  const handleCartClick = () => {
    setIsCartOpen(true);
  };

  return (
    <>
      {isSearchOpen && <MobileSearch onClose={() => setIsSearchOpen(false)} />}
      <footer className={styles.footerContainer}>
        <nav className={styles.nav}>
          <button 
            onClick={() => navigate('/')} 
            className={styles.navItem}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <FaHome className={styles.icon} />
            <span>Home</span>
          </button>
          <button 
            onClick={() => setIsSearchOpen(true)} 
            className={styles.navItem}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <FaSearch className={styles.icon} />
            <span>Search</span>
          </button>
          <button 
            onClick={handleCartClick} 
            className={styles.navItem}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <FaShoppingCart className={styles.icon} />
            <span>Cart</span>
          </button>
          <button 
            onClick={() => navigate('/profile')} 
            className={styles.navItem}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0 }}
          >
            <FaUser className={styles.icon} />
            <span>Profile</span>
          </button>
        </nav>
      </footer>
    </>
  );
};

export default FooterMenu;
