import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import './App.css'

const API_BASE = import.meta.env.VITE_API_URL ?? 'http://127.0.0.1:8000'

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value))
}

function App() {
  const [clients, setClients] = useState([])
  const [clientId, setClientId] = useState('')
  const [sales, setSales] = useState([])
  const [goal, setGoal] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  const totalRevenue = useMemo(
    () => sales.reduce((sum, sale) => sum + Number(sale.amount), 0),
    [sales],
  )

  useEffect(() => {
    fetchClients()
  }, [])

  useEffect(() => {
    if (!clientId) return
    fetchSales(clientId)
  }, [clientId])

  const fetchClients = async () => {
    try {
      const response = await axios.get(`${API_BASE}/api/clients/`)
      setClients(response.data)
      if (response.data.length > 0) {
        setClientId(String(response.data[0].id))
      }
    } catch (err) {
      console.error(err)
      setError('Could not load clients. Is the API running?')
    }
  }

  const fetchSales = async (id) => {
    try {
      setLoading(true)
      setError(null)
      const response = await axios.get(`${API_BASE}/api/sales/`, {
        headers: {
          'Client-Id': String(id),
        },
      })
      setSales(response.data)
    } catch (err) {
      console.error(err)
      setError('Could not load sales. Is the API running?')
      setSales([])
    } finally {
      setLoading(false)
    }
  }

  const updateGoal = async () => {
    if (!goal || !clientId) return

    try {
      setSaving(true)
      await axios.post(`${API_BASE}/api/target/`, {
        client_id: Number(clientId),
        monthly_goal: goal,
      })
      alert('Target updated!')
    } catch (err) {
      console.error(err)
      alert('Failed to update target.')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="dashboard">
      <header className="dashboard__header">
        <div>
          <h1 className="dashboard__title">Mini Dashboard</h1>
          <p className="dashboard__subtitle">
            Track sales performance and monthly targets
          </p>
        </div>
        <div className="client-select">
          <label className="client-select__label" htmlFor="client-id">
            Client
          </label>
          <select
            id="client-id"
            className="client-select__input"
            value={clientId}
            onChange={(e) => {
              setClientId(e.target.value)
              setGoal('')
            }}
            disabled={clients.length === 0}
          >
            {clients.length === 0 ? (
              <option value="">No clients</option>
            ) : (
              clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} (ID {client.id})
                </option>
              ))
            )}
          </select>
        </div>
      </header>

      <section className="dashboard__stats" aria-label="Summary">
        <article className="stat-card">
          <p className="stat-card__label">Total revenue</p>
          <p className="stat-card__value">
            {loading ? '—' : formatCurrency(totalRevenue)}
          </p>
        </article>
        <article className="stat-card">
          <p className="stat-card__label">Sales records</p>
          <p className="stat-card__value">{loading ? '—' : sales.length}</p>
        </article>
      </section>

      {error && (
        <div className="dashboard__alert" role="alert">
          {error}
        </div>
      )}

      <section className="panel" aria-labelledby="sales-heading">
        <div className="panel__header">
          <h2 id="sales-heading" className="panel__title">
            Sales
          </h2>
          <span className="panel__meta">
            {loading ? 'Loading…' : `${sales.length} items`}
          </span>
        </div>

        <div className="table-wrap">
          {sales.length === 0 && !loading ? (
            <div className="empty-state">
              <p className="empty-state__title">No sales yet</p>
              <p>Records for the selected client will appear here.</p>
            </div>
          ) : (
            <table className="sales-table">
              <thead>
                <tr>
                  <th scope="col">Product</th>
                  <th scope="col">Amount</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan={2}>Loading sales…</td>
                  </tr>
                ) : (
                  sales.map((sale) => (
                    <tr key={sale.id}>
                      <td>{sale.product_name}</td>
                      <td className="sales-table__amount">
                        {formatCurrency(sale.amount)}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          )}
        </div>
      </section>

      <section className="panel" aria-labelledby="target-heading">
        <div className="panel__header">
          <h2 id="target-heading" className="panel__title">
            Monthly target
          </h2>
        </div>

        <form
          className="target-form"
          onSubmit={(e) => {
            e.preventDefault()
            updateGoal()
          }}
        >
          <div className="target-form__field">
            <label className="target-form__label" htmlFor="monthly-goal">
              Goal amount (USD)
            </label>
            <input
              id="monthly-goal"
              className="target-form__input"
              type="number"
              min="0"
              step="0.01"
              placeholder="e.g. 5000"
              value={goal}
              onChange={(e) => setGoal(e.target.value)}
            />
          </div>
          <button
            type="submit"
            className="btn-primary"
            disabled={saving || !goal}
          >
            {saving ? 'Saving…' : 'Save target'}
          </button>
        </form>
      </section>
    </div>
  )
}

export default App
