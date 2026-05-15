import {
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from 'recharts'

const COLORS = {
  revenue: '#aa3bff',
  remaining: '#e5e4e7',
  exceeded: '#22c55e',
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(Number(value))
}

function buildChartData(revenue, target) {
  if (target <= 0) return []

  const exceeded = Math.max(revenue - target, 0)

  if (exceeded > 0) {
    return [
      { name: 'Target reached', value: target, fill: COLORS.revenue },
      { name: 'Exceeded', value: exceeded, fill: COLORS.exceeded },
    ]
  }

  const remaining = Math.max(target - revenue, 0)

  if (revenue <= 0) {
    return [
      { name: 'Remaining to goal', value: target, fill: COLORS.remaining },
    ]
  }

  return [
    { name: 'Revenue', value: revenue, fill: COLORS.revenue },
    { name: 'Remaining to goal', value: remaining, fill: COLORS.remaining },
  ]
}

function ProgressTooltip({ active, payload, revenue, target }) {
  if (!active || target == null || target <= 0) return null

  const percent = Math.round((revenue / target) * 100)
  const remaining = Math.max(target - revenue, 0)
  const exceeded = Math.max(revenue - target, 0)

  return (
    <div className="progress-tooltip">
      <p className="progress-tooltip__title">Revenue vs monthly target</p>
      <p>
        <strong>Revenue:</strong> {formatCurrency(revenue)}
      </p>
      <p>
        <strong>Target:</strong> {formatCurrency(target)}
      </p>
      <p>
        <strong>Progress:</strong> {percent}% of target
      </p>
      {exceeded > 0 ? (
        <p>
          <strong>Exceeded by:</strong> {formatCurrency(exceeded)}
        </p>
      ) : (
        <p>
          <strong>Remaining:</strong> {formatCurrency(remaining)}
        </p>
      )}
      {payload?.length > 0 && (
        <p className="progress-tooltip__segment">{payload[0].name}</p>
      )}
    </div>
  )
}

function ProgressTooltipWrapper(props) {
  const { revenue, target } = props
  return (
    <ProgressTooltip
      active={props.active}
      payload={props.payload}
      revenue={revenue}
      target={target}
    />
  )
}

export default function TargetProgressChart({ revenue, target, loading }) {
  const targetValue = target != null ? Number(target) : null

  if (loading) {
    return (
      <div className="target-progress target-progress--empty">
        <p>Loading target…</p>
      </div>
    )
  }

  if (targetValue == null || targetValue <= 0) {
    return (
      <div className="target-progress target-progress--empty">
        <p className="target-progress__percent">—</p>
        <p className="target-progress__hint">Set a monthly target below</p>
      </div>
    )
  }

  const chartData = buildChartData(revenue, targetValue)
  const percent = Math.min(Math.round((revenue / targetValue) * 100), 999)

  return (
    <div className="target-progress">
      <div className="target-progress__chart">
        <ResponsiveContainer width="100%" height={120}>
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              innerRadius={36}
              outerRadius={52}
              stroke="none"
              paddingAngle={chartData.length > 1 ? 2 : 0}
            >
              {chartData.map((entry) => (
                <Cell key={entry.name} fill={entry.fill} />
              ))}
            </Pie>
            <Tooltip
              content={
                <ProgressTooltipWrapper revenue={revenue} target={targetValue} />
              }
            />
          </PieChart>
        </ResponsiveContainer>
        <div className="target-progress__center" aria-hidden>
          <span className="target-progress__percent">{percent}%</span>
        </div>
      </div>
      <p className="target-progress__caption">
        {formatCurrency(revenue)} / {formatCurrency(targetValue)}
      </p>
    </div>
  )
}
