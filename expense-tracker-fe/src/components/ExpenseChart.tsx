import { useEffect, useState } from 'react'
import { AreaChart, Area, PieChart, Pie, Tooltip, ResponsiveContainer, XAxis, YAxis, Cell, CartesianGrid, Legend } from 'recharts'
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { Expense } from '../interfaces/Expense'
import { fetchAllExpenses } from '../services/expense.service'
import '../styles/expense-chart.scss'

dayjs.extend(weekOfYear)

const COLORS = ['#5b42f3', '#1fc3aa', '#ff7676', '#ffa41b', '#7d5fff', '#00b894']

type Timeframe = 'day' | 'week' | 'month'

const ExpenseChart = () => {
  const [expenses, setExpenses] = useState<Expense[]>([])
  const [timeframe, setTimeframe] = useState<Timeframe>('month')

  useEffect(() => {
    const load = async () => {
      const data = await fetchAllExpenses()
      setExpenses(data.map((e: { amount: any; date: string | number | Date }) => ({ ...e, amount: Number(e.amount), date: new Date(e.date) })))
    }
    load()
  }, [])

  const groupByTime = (): { label: string, value: number }[] => {
    const map: Record<string, number> = {}
    expenses.forEach(exp => {
      const date = dayjs(exp.date)
      let label: string
      if (timeframe === 'day') label = date.format('MMM D')
      else if (timeframe === 'week') label = `W${date.week()}`
      else label = date.format('MMM YYYY')

      map[label] = (map[label] || 0) + exp.amount
    })
    return Object.entries(map).map(([label, value]) => ({ label, value: +value.toFixed(2) }))
  }

  const groupByCategory = (): { name: string, value: number }[] => {
    const map: Record<string, number> = {}
    expenses.forEach(exp => {
      const cat = exp.category?.name || 'Unknown'
      map[cat] = (map[cat] || 0) + exp.amount
    })
    return Object.entries(map).map(([name, value]) => ({ name, value: +value.toFixed(2) }))
  }

  const timeData = groupByTime()
  const pieData = groupByCategory()

  return (
    <div className="expense-chart">
      <div className="chart-header">
        <h3>Spending Overview</h3>
        <select value={timeframe} onChange={e => setTimeframe(e.target.value as Timeframe)}>
          <option value="day">Daily</option>
          <option value="week">Weekly</option>
          <option value="month">Monthly</option>
        </select>
      </div>

      <div className="chart-grid">
        <div className="line-chart">
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={timeData}>
              <defs>
                <linearGradient id="colorSpend" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5b42f3" stopOpacity={0.8} />
                  <stop offset="100%" stopColor="#5b42f3" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" />
              <YAxis />
              <CartesianGrid strokeDasharray="3 3" />
              <Tooltip />
              <Area type="monotone" dataKey="value" stroke="#5b42f3" fill="url(#colorSpend)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        <div className="pie-chart">
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie data={pieData} dataKey="value" nameKey="name" outerRadius={100} label>
                {pieData.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
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
