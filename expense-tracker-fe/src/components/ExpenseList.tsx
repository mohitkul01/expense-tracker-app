import { useEffect, useState } from "react";
import '../styles/expense-list.scss'
import AddExpenseForm from "./AddExpenseForm";
import dayjs from "dayjs";
import relativeTime from "dayjs/plugin/relativeTime";
import { Expense } from "../interfaces/Expense";
import { fetchExpenses } from "../services/expense.service";

dayjs.extend(relativeTime)

const ITEMS_PER_PAGE = 5

const ExpenseList = () => {
    const [expenses, setExpenses] = useState<Expense[]>([])
    const [showForm, setShowForm] = useState(false)
    const [page, setPage] = useState(1)
    const [totalItems, setTotalItems] = useState(0)

    useEffect(() => {
        loadExpenses()
    }, [page])

    const loadExpenses = async () => {
        // const expense: Expense[] = await fetchAllExpenses()
        const { data, totalCount } = await fetchExpenses(page, ITEMS_PER_PAGE)
        setExpenses(data)
        setTotalItems(totalCount)
    }

    const totalPages = Math.ceil(totalItems / ITEMS_PER_PAGE)
    console.log(totalPages);
    

    const handleToggleForm = () => {
        setShowForm((prev) => !prev)
    }

    const handleExpenseAdded = () => {
        setShowForm(false)
        loadExpenses();
    }

    const totalSpending = expenses.reduce((sum, expense) => sum + Number(expense.amount), 0)

    return (
        <div className="expense-list">
            <h3>All Expenses</h3>
            <div className="expense-list__topbar">
                <button className="expense-list__topbar__btn" onClick={handleToggleForm}>🤑 Add Expense</button>
                <div className="total-spending">Total Spendings: <strong>
                    ₹{totalSpending.toFixed(2)}
                </strong>
                </div>
            </div>

            {expenses.length === 0 ? (
                <p>No expenses yet...</p>
            ) : (
                <>
                    <table>
                        <thead>
                            <tr>
                                <th>Title</th>
                                <th>Amount (₹)</th>
                                <th>Date</th>
                                <th>Category</th>
                            </tr>
                        </thead>
                        <tbody>
                            {expenses.map((expense) => (
                                <tr key={expense.id}>
                                    <td>{expense.title}</td>
                                    <td>{expense.amount}</td>
                                    <td>{dayjs(expense.date).fromNow()}</td>
                                    <td>{expense.category?.name || '-'}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="pagination">
                        <button
                            onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
                            disabled={page === 1}>
                            ⏮️
                        </button>
                        <span>
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={page === totalPages}
                        >
                            ⏭️
                        </button>
                    </div>
                </>
            )
            }

            {
                showForm && (
                    <div className="modal-backdrop" onClick={handleToggleForm}>
                        <div className="modal-content" onClick={(e) => e.stopPropagation()}>
                            <button className="close-btn" onClick={handleToggleForm}>✖</button>
                            <AddExpenseForm onExpenseAdded={handleExpenseAdded} />
                        </div>
                    </div>
                )
            }
        </div >


    )
}

export default ExpenseList