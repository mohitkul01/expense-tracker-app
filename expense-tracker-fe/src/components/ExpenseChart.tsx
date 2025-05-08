import { useEffect, useState } from 'react'
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
  Legend,
} from 'recharts'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { Expense } from '../interfaces/Expense'
import { fetchAllExpenses } from '../services/expense.service'
import '../styles/expense-chart.scss'

dayjs.extend(weekOfYear)

const COLORS = ['#5b42f3', '#1fc3aa', '#ff7676', '#ffa41b', '#7d5fff', '#00b894']

type Timeframe = 'day' | 'week' | 'month'

interface LineChartData {
  label: string
  value: number
}

interface PieChartData {
  name: string
  value: number
}

const ExpenseChart = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [timeframe, setTimeframe] = useState<Timeframe>('month')

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllExpenses()
      setExpenses(data)
    }
    load()
  }, [])

  const getLineChartData = (): LineChartData[] => {
    const grouped: Record<string, number> = {}

    expenses.forEach((expense) => {
      const date = dayjs(expense.date)
      let key = ''

      switch (timeframe) {
        case 'day':
          key = date.format('MMM D')
          break
        case 'week':
          key = `Week ${date.week()}`
          break
        case 'month':
          key = date.format('MMM YYYY')
          break
      }

      const amount = Number(expense.amount)
      if (!isNaN(amount)) {
        grouped[key] = (grouped[key] || 0) + amount
      }
    })

    return Object.entries(grouped).map(([label, value]) => ({
      label,
      value: parseFloat(value.toFixed(2)),
    }))
  }

  const getPieChartData = (): PieChartData[] => {
    const grouped: Record<string, number> = {}

    expenses.forEach((expense) => {
      const category = expense.category?.name || 'Uncategorized'
      const amount = Number(expense.amount)
      if (!isNaN(amount)) {
        grouped[category] = (grouped[category] || 0) + amount
      }
    })

    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2)),
    }))
  }

  return (
    <div className="expense-chart">
      <div className="chart-header">
        <h2>Expense Overview</h2>
        <select value={timeframe} onChange={(e) => setTimeframe(e.target.value as Timeframe)}>
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      <div className="chart-grid">
        <div className="line-chart">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={getLineChartData()}>
              <defs>
                <linearGradient id="colorArea" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#5b42f3" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#5b42f3" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#5b42f3" fill="url(#colorArea)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="pie-chart">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={getPieChartData()}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                label
              >
                {getPieChartData().map((_, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}

export default ExpenseChart
