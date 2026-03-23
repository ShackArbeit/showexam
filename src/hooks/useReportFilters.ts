import { useMemo, useState } from 'react'
import type { DatePreset, ReportCategory, ReportFilters } from '../types/reports'

function formatDate(date: Date) {
  return date.toISOString().slice(0, 10)
}

function createPresetRange(preset: Exclude<DatePreset, 'custom'>) {
  const end = new Date('2026-04-30T00:00:00')
  const start = new Date(end)

  if (preset === '7d') {
    start.setDate(end.getDate() - 6)
  } else if (preset === '30d') {
    start.setDate(end.getDate() - 29)
  } else {
    start.setDate(end.getDate() - 89)
  }

  return {
    dateFrom: formatDate(start),
    dateTo: formatDate(end),
  }
}

const initialRange = createPresetRange('30d')

export function useReportFilters() {
  const [filters, setFilters] = useState<ReportFilters>({
    ...initialRange,
    category: 'All',
    preset: '30d',
    page: 1,
    pageSize: 8,
  })

  function setPreset(preset: DatePreset) {
    if (preset === 'custom') {
      setFilters((current) => ({
        ...current,
        preset,
        page: 1,
      }))
      return
    }

    const nextRange = createPresetRange(preset)
    setFilters((current) => ({
      ...current,
      ...nextRange,
      preset,
      page: 1,
    }))
  }

  function setDateRange(name: 'dateFrom' | 'dateTo', value: string) {
    setFilters((current) => ({
      ...current,
      [name]: value,
      preset: 'custom',
      page: 1,
    }))
  }

  function setCategory(category: ReportCategory) {
    setFilters((current) => ({
      ...current,
      category,
      page: 1,
    }))
  }

  function setPage(page: number) {
    setFilters((current) => ({
      ...current,
      page,
    }))
  }

  const activeRangeLabel = useMemo(() => {
    return `${filters.dateFrom} → ${filters.dateTo}`
  }, [filters.dateFrom, filters.dateTo])

  return {
    filters,
    activeRangeLabel,
    setPreset,
    setDateRange,
    setCategory,
    setPage,
  }
}
