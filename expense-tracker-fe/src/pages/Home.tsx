import { useEffect, useState } from 'react';
import '../styles/home.scss'
import ExpenseList from '../components/ExpenseList';
import ExpenseChart from '../components/ExpenseChart';

const Home = () => {
  const [user, setUser] = useState<any>(null);
  

  useEffect(() => {
    const stored = localStorage.getItem('user');
    if (stored) {
      setUser(JSON.parse(stored));
    }
  }, []);

  return (
    <div className="auth-container">
      {!user && <><h2>Welcome to the ultimate Expense Tracker.</h2><p>Please login to use all functionalities!</p></>
      }
      {user && <ExpenseList />}
      {user && <ExpenseChart />}
    </div>
  );
};

export default Home;
