import { useEffect, useState } from 'react';
import axios from 'axios';

const API_URL = `${
  import.meta.env.VITE_API_URL || 'http://localhost:5000'
}/api/expenses`;

const today = () => {
  const date = new Date();
  date.setMinutes(date.getMinutes() - date.getTimezoneOffset());
  return date.toISOString().slice(0, 10);
};

const emptyForm = () => ({
  title: '',
  amount: '',
  category: 'Food',
  date: today(),
});

const categories = [
  'Food', 'Travel', 'Shopping', 'Education',
  'Bills', 'Health', 'Entertainment', 'Other',
];

const formatMoney = (amount) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 2,
  }).format(amount);

function App() {
  const [expenses, setExpenses] = useState([]);
  const [form, setForm] = useState(emptyForm);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  async function loadExpenses() {
    try {
      const { data } = await axios.get(API_URL);
      setExpenses(data);
      setError('');
    } catch {
      setError('Cannot reach the backend. Check the server and MongoDB.');
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadExpenses();
  }, []);

  function handleChange(event) {
    const { name, value } = event.target;
    setForm((current) => ({ ...current, [name]: value }));
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setError('');

    if (
      !form.title.trim() ||
      !Number.isFinite(Number(form.amount)) ||
      Number(form.amount) <= 0 ||
      !form.date
    ) {
      setError('Enter a title, positive amount, and valid date.');
      return;
    }

    try {
      setSaving(true);

      const { data } = await axios.post(API_URL, {
        ...form,
        title: form.title.trim(),
        amount: Number(form.amount),
      });

      setExpenses((current) => [data, ...current]);
      setForm(emptyForm());
    } catch (err) {
      setError(err.response?.data?.message || 'Could not save expense.');
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete(id) {
    try {
      setError('');
      await axios.delete(`${API_URL}/${id}`);
      setExpenses((current) =>
        current.filter((expense) => expense._id !== id)
      );
    } catch {
      setError('Could not delete expense. Please try again.');
    }
  }

  const total = expenses.reduce(
    (sum, expense) => sum + expense.amount,
    0
  );

  return (
    <main className="app">
      <header className="header">
        <div className="logo">₹</div>
        <div>
          <h1>Expense Tracker</h1>
          <p className="muted">Understand your spending, one day at a time.</p>
        </div>
      </header>

      <section className="summary">
        <div>
          <p>Total expenses</p>
          <h2>{formatMoney(total)}</h2>
          <span>{expenses.length} transactions recorded</span>
        </div>
        <div className="summary-icon">↗</div>
      </section>

      {error && <div className="error">{error}</div>}

      <section className="columns">
        <div className="panel">
          <h2>Add an expense</h2>
          <p className="muted">Enter the details of your transaction.</p>

          <form onSubmit={handleSubmit}>
            <label htmlFor="title">Expense title</label>
            <input
              id="title"
              name="title"
              placeholder="e.g. Lunch with friends"
              maxLength={100}
              value={form.title}
              onChange={handleChange}
              required
            />

            <label htmlFor="amount">Amount (₹)</label>
            <input
              id="amount"
              name="amount"
              type="number"
              min="0.01"
              step="0.01"
              placeholder="e.g. 250"
              value={form.amount}
              onChange={handleChange}
              required
            />

            <label htmlFor="category">Category</label>
            <select
              id="category"
              name="category"
              value={form.category}
              onChange={handleChange}
            >
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>

            <label htmlFor="date">Date</label>
            <input
              id="date"
              name="date"
              type="date"
              value={form.date}
              onChange={handleChange}
              required
            />

            <button disabled={saving}>
              {saving ? 'Saving...' : '+ Add expense'}
            </button>
          </form>
        </div>

        <div className="panel">
          <div className="list-heading">
            <div>
              <h2>Recent expenses</h2>
              <p className="muted">Your saved transactions.</p>
            </div>
            <span className="count">{expenses.length}</span>
          </div>

          {loading ? (
            <p className="empty">Loading expenses...</p>
          ) : expenses.length === 0 ? (
            <div className="empty">
              <div className="empty-icon">₹</div>
              <h3>No expenses yet</h3>
              <p>Your transactions will appear here.</p>
            </div>
          ) : (
            <ul className="expense-list">
              {expenses.map((expense) => (
                <li key={expense._id} className="expense">
                  <div className="expense-icon">
                    {expense.category === 'Food' ? '🍽️' :
                     expense.category === 'Travel' ? '🚌' :
                     expense.category === 'Shopping' ? '🛍️' :
                     expense.category === 'Education' ? '📚' :
                     expense.category === 'Health' ? '💊' : '🧾'}
                  </div>

                  <div className="expense-info">
                    <strong>{expense.title}</strong>
                    <span>
                      {expense.category} ·{' '}
                      {new Date(expense.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                        timeZone: 'UTC',
                      })}
                    </span>
                  </div>

                  <div className="expense-end">
                    <strong>{formatMoney(expense.amount)}</strong>
                    <button
                      type="button"
                      className="delete"
                      onClick={() => handleDelete(expense._id)}
                      aria-label={`Delete ${expense.title}`}
                    >
                      Delete
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </section>

      <footer>Made with React, Express, Node.js and MongoDB.</footer>
    </main>
  );
}

export default App;
