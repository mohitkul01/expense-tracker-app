import { useEffect, useState } from 'react';
import '../styles/expense-form.scss';
import { extractTextFromImage } from '../services/ocr.service'; 
// import { extractAmount } from '../utils/extractAmount'; 
import expenseService from '../services/expense.service'; 
import { Expense } from '../interfaces/Expense'; 
import { fetchAllCategories } from '../services/category.service';

const AddExpenseForm = ({ onExpenseAdded }: { onExpenseAdded: () => void }) => {
  const [formData, setFormData] = useState<Expense>({
    title: '',
    amount: 0,
    date: '',
    categoryId: '',
  });

  const [categories, setCategories] = useState<any[]>([]);
  const [loadingOCR, setLoadingOCR] = useState(false); 

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetchAllCategories();
        setCategories(res);
      } catch (error) {
        console.error('Error fetching categories:', error);
      }
    };

    const user = JSON.parse(localStorage.getItem("user") || "{}")
    if (user.id) {
      setFormData((prev) => ({
        ...prev,
        userId: user.id
      }))
    }
    fetchCategories();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
  
    setLoadingOCR(true);
    try {
      const parsed = await extractTextFromImage(file);
      console.log('🧾 OCR Parsed:', parsed);
  
      setFormData(prev => ({
        ...prev,
        title: parsed.title,
        amount: parsed.amount || 0
      }));
    } catch (err) {
      console.error('OCR failed', err);
    } finally {
      setLoadingOCR(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    console.log(`Add Expense`);
    const { title, amount, date, categoryId } = formData;
    if (!title || !amount || !date || !categoryId) {
      console.warn("🛑 Missing field:", { title, amount, date, categoryId });
      return;
    }

    const isoDate = new Date(date).toISOString();

    try {
      await expenseService.addExpense({
        title,
        amount: parseFloat(amount.toString()), 
        date: isoDate,
        categoryId: categoryId
      });
      setFormData({
        title: '',
        amount: 0,
        date: '',
        categoryId: '',
      });
      onExpenseAdded();
      
    } catch (error) {
      console.error('Failed to add expense:', error);
    }
  };

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <input
        type="text"
        name="title"
        placeholder="Expense title"
        value={formData.title}
        onChange={handleChange}
      />
      <input
        type="number"
        name="amount"
        placeholder="Amount"
        value={formData.amount}
        onChange={handleChange}
      />
      <input
        type="datetime-local"
        name="date"
        value={formData.date}
        onChange={handleChange}
      />
      <select name="categoryId" value={formData.categoryId} onChange={handleChange}>
        <option value="">Select Category</option>
        {categories.map((cat) => (
          <option key={cat.id} value={cat.id}>{cat.name}</option>
        ))}
      </select>

      <label style={{ marginTop: '10px' }}>
        Upload Receipt (optional):
        <input type="file" accept="image/*" onChange={handleImageUpload} />
      </label>
      {loadingOCR && <p style={{ color: '#4e54c8' }}>Extracting text from image...</p>}

      <button type="submit">Add Expense</button>
    </form>
  );
};

export default AddExpenseForm;
