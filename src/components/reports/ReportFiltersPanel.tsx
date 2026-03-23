import type { DatePreset, ReportCategory } from '../../types/reports'

const presets: { label: string; value: Exclude<DatePreset, 'custom'> }[] = [
  { label: 'Last 7 Days', value: '7d' },
  { label: 'Last 30 Days', value: '30d' },
  { label: 'Last 90 Days', value: '90d' },
]

type ReportFiltersPanelProps = {
  dateFrom: string
  dateTo: string
  category: ReportCategory
  preset: DatePreset
  categories: ReportCategory[]
  onPresetChange: (preset: DatePreset) => void
  onDateChange: (name: 'dateFrom' | 'dateTo', value: string) => void
  onCategoryChange: (category: ReportCategory) => void
}

export function ReportFiltersPanel({
  dateFrom,
  dateTo,
  category,
  preset,
  categories,
  onPresetChange,
  onDateChange,
  onCategoryChange,
}: ReportFiltersPanelProps) {
  return (
    <div className="grid gap-4 xl:grid-cols-[minmax(0,1fr)_220px]">
      <div className="rounded-[24px] border border-mist-200 bg-[linear-gradient(180deg,_rgba(244,247,251,0.85),_rgba(255,255,255,0.88))] p-4">
        <div className="flex flex-wrap gap-2">
          {presets.map((item) => {
            const active = preset === item.value

            return (
              <button
                key={item.value}
                type="button"
                onClick={() => onPresetChange(item.value)}
                className={
                  active
                    ? 'rounded-full bg-ink-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-white'
                    : 'rounded-full border border-mist-200 bg-white px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-700 transition hover:border-mist-300'
                }
              >
                {item.label}
              </button>
            )
          })}
        </div>

        <div className="mt-4 grid gap-4 md:grid-cols-2">
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-700/70">
              開始日期
            </span>
            <input
              type="date"
              value={dateFrom}
              onChange={(event) => onDateChange('dateFrom', event.target.value)}
              className="w-full rounded-[18px] border border-mist-200 bg-white px-4 py-3 text-sm text-ink-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
          </label>
          <label className="space-y-2">
            <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-700/70">
              結束日期
            </span>
            <input
              type="date"
              value={dateTo}
              onChange={(event) => onDateChange('dateTo', event.target.value)}
              className="w-full rounded-[18px] border border-mist-200 bg-white px-4 py-3 text-sm text-ink-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10"
            />
          </label>
        </div>
      </div>

      <label className="space-y-2">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-ink-700/70">
          分類
        </span>
        <select
          value={category}
          onChange={(event) => onCategoryChange(event.target.value as ReportCategory)}
          className="h-full min-h-[118px] w-full rounded-[24px] border border-mist-200 bg-white px-4 py-4 text-sm text-ink-950 outline-none transition focus:border-teal-500 focus:ring-4 focus:ring-teal-500/10 xl:min-h-0"
        >
          {categories.map((item) => (
            <option key={item} value={item}>
              {item}
            </option>
          ))}
        </select>
      </label>
    </div>
  )
}
