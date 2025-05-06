import { useEffect, useState } from 'react'
import {
  AreaChart,
  Area,
  PieChart,
  Pie,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  XAxis,
  YAxis,
  Cell,
  Legend
} from 'recharts'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { Expense } from '../interfaces/Expense'
import { ChartData } from '../interfaces/ChartData'
import '../styles/expense-chart.scss'
import { fetchAllExpenses } from '../services/expense.service'

dayjs.extend(weekOfYear)

const COLORS = ['#5b42f3', '#1fc3aa', '#ff7676', '#ffa41b', '#7d5fff', '#00b894']

const ExpenseChart = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('month')

  useEffect(() => {
    const loadExpenses = async () => {
      const data = await fetchAllExpenses()
      setExpenses(data)
    }
    loadExpenses()
  }, [])

  const groupExpenses = (): ChartData[] => {
    const groups: Record<string, number> = {}

    expenses.forEach((expense) => {
      const date = dayjs(expense.date)
      let key: string

      if (timeframe === 'day') {
        key = date.format('MMM D')
      } else if (timeframe === 'week') {
        key = `Week ${date.week()}`
      } else {
        key = date.format('MMM YYYY')
      }

      if (!groups[key]) groups[key] = 0
      groups[key] += expense.amount
    })

    return Object.entries(groups).map(([label, value]) => ({
      label,
      value: parseFloat(value.toFixed(2)),
    }))
  }

  const getPieData = () => {
    const grouped: Record<string, number> = {}
    expenses.forEach((exp) => {
      const cat = exp.category?.name || 'Unknown'
      if (!grouped[cat]) grouped[cat] = 0
      grouped[cat] += exp.amount
    })
    return Object.entries(grouped).map(([name, value]) => ({
      name,
      value: parseFloat(value.toFixed(2))
    }))
  }

  const chartData = groupExpenses()
  const pieData = getPieData()

  return (
    <div className="expense-chart">
      <div className="chart-header">
        <h3>Spending Overview</h3>
        <select
          value={timeframe}
          onChange={(e) => setTimeframe(e.target.value as 'day' | 'week' | 'month')}
        >
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      <div className="chart-grid">
        <div className="line-chart">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="10%" stopColor="#5b42f3" stopOpacity={0.7} />
                  <stop offset="90%" stopColor="#5b42f3" stopOpacity={0.1} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area
                type="monotone"
                dataKey="value"
                stroke="#5b42f3"
                fill="url(#colorSpend)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="pie-chart">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={pieData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
                label
              >
                {pieData.map((entry, index) => (
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
