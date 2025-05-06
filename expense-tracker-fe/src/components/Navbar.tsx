import { Link, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import '../styles/navbar.scss'

const Navbar = () => {
  const [user, setUser] = useState<any>(null);
  const [isDark, setIsDark] = useState<boolean>(false)
  const navigate = useNavigate();

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) setUser(JSON.parse(stored));
  }, []);

  const toggleTheme = () => {
    setIsDark(theme => {
      const newTheme = !theme;
      document.body.classList.toggle('dark-theme', newTheme);
      localStorage.setItem('dark-theme', newTheme.toString())
      console.log("Ouch..");
      
      return newTheme;
    })
  }

  const handleLogout = () => {
    localStorage.removeItem('user');
    console.log(`Logout initiated!!`);
    
    setUser(null);
    navigate('/');
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        🔐 Expense Tracker
      </Link>

      <div className="nav-links">
        <div className='theme-toggle'
          onClick={toggleTheme}
        >
          {isDark ? '🌖' : '🌒'}
        </div>
        {user ? (
          <>
            <span>Hello, {user.username}</span>
            <button className='nav-button' onClick={handleLogout}>Logout</button>
          </>
        ) : (
          <>
            <Link to="/login">
              <button className='nav-button'>Login</button>
            </Link>
            <Link to="/register">
              <button className='nav-button'>Register</button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
