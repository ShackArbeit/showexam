import { mockOrders, reportCategories } from '../mock/reports'
import type {
  ChartDataPoint,
  OrderRecord,
  ReportFilters,
  ReportSummary,
  ReportsResponse,
} from '../types/reports'

function wait(duration: number) {
  return new Promise((resolve) => {
    window.setTimeout(resolve, duration)
  })
}

function isWithinDateRange(orderDate: string, dateFrom: string, dateTo: string) {
  return orderDate >= dateFrom && orderDate <= dateTo
}

function buildSummary(items: OrderRecord[]): ReportSummary {
  const totalRevenue = items.reduce((sum, item) => sum + item.amount, 0)
  const totalOrders = items.length
  const paidOrders = items.filter((item) => item.status === 'Paid').length

  return {
    totalRevenue,
    totalOrders,
    averageOrderValue: totalOrders ? Math.round(totalRevenue / totalOrders) : 0,
    paidRate: totalOrders ? Math.round((paidOrders / totalOrders) * 1000) / 10 : 0,
  }
}

function buildChartData(items: OrderRecord[]): ChartDataPoint[] {
  const grouped = new Map<string, { revenue: number; orders: number }>()

  items.forEach((item) => {
    const current = grouped.get(item.orderDate) ?? { revenue: 0, orders: 0 }
    current.revenue += item.amount
    current.orders += 1
    grouped.set(item.orderDate, current)
  })

  return [...grouped.entries()]
    .sort(([left], [right]) => left.localeCompare(right))
    .slice(-8)
    .map(([label, value]) => ({
      label: label.slice(5),
      revenue: value.revenue,
      orders: value.orders,
    }))
}

export async function fetchReports(
  filters: ReportFilters,
): Promise<ReportsResponse> {
  await wait(700)

  if (filters.category === 'Sports' && filters.dateFrom === '2026-02-01') {
    throw new Error('資料服務暫時忙碌，請調整條件或稍後再試。')
  }

  const filtered = mockOrders.filter((item) => {
    const matchesCategory =
      filters.category === 'All' || item.category === filters.category
    const matchesDate = isWithinDateRange(
      item.orderDate,
      filters.dateFrom,
      filters.dateTo,
    )

    return matchesCategory && matchesDate
  })

  const total = filtered.length
  const totalPages = Math.max(1, Math.ceil(total / filters.pageSize))
  const page = Math.min(filters.page, totalPages)
  const start = (page - 1) * filters.pageSize
  const items = filtered.slice(start, start + filters.pageSize)

  return {
    filters: {
      dateFrom: filters.dateFrom,
      dateTo: filters.dateTo,
      category: filters.category,
    },
    summary: buildSummary(filtered),
    chartData: buildChartData(filtered),
    categories: reportCategories,
    table: {
      items,
      total,
      page,
      pageSize: filters.pageSize,
      totalPages,
    },
  }
}
