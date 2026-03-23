import { ReportChart } from '../components/reports/ReportChart'
import { ReportFiltersPanel } from '../components/reports/ReportFiltersPanel'
import { ReportsPagination } from '../components/reports/ReportsPagination'
import { ReportsTable } from '../components/reports/ReportsTable'
import { EmptyState } from '../components/ui/EmptyState'
import { LoadingSpinner } from '../components/ui/LoadingSpinner'
import { Notice } from '../components/ui/Notice'
import { PageHeader } from '../components/ui/PageHeader'
import { Panel } from '../components/ui/Panel'
import { useReportFilters } from '../hooks/useReportFilters'
import { useReportsData } from '../hooks/useReportsData'
import { reportCategories } from '../mock/reports'

function formatCurrency(value: number) {
  return new Intl.NumberFormat('zh-TW', {
    style: 'currency',
    currency: 'TWD',
    maximumFractionDigits: 0,
  }).format(value)
}

export function ReportsPage() {
  const {
    filters,
    activeRangeLabel,
    setPreset,
    setDateRange,
    setCategory,
    setPage,
  } = useReportFilters()
  const { data, isLoading, error, reload } = useReportsData(filters)

  const summary = data?.summary
  const table = data?.table
  const chartData = data?.chartData ?? []
  const hasData = Boolean(table && table.total > 0)

  return (
    <>
      <PageHeader
        eyebrow="Prompt 4"
        title="題目二：數據統計報表"
        description="統一報表頁的視覺層次、篩選區塊、圖表卡片與表格細節，讓資料查詢更像正式上線的電商後台。"
        actions={
          <div className="glass-outline rounded-full px-4 py-2 text-xs font-semibold uppercase tracking-[0.18em] text-ink-700">
            Commerce Analytics
          </div>
        }
      />

      <div className="grid gap-6">
        <Panel
          eyebrow="Filters"
          title="報表篩選器"
          description={`條件變更後會自動重新抓取資料。當前區間：${activeRangeLabel}`}
        >
          <ReportFiltersPanel
            dateFrom={filters.dateFrom}
            dateTo={filters.dateTo}
            category={filters.category}
            preset={filters.preset}
            categories={data?.categories ?? reportCategories}
            onPresetChange={setPreset}
            onDateChange={setDateRange}
            onCategoryChange={setCategory}
          />
        </Panel>

        {error ? (
          <Panel eyebrow="Error" title="資料讀取失敗">
            <EmptyState
              title="目前無法載入報表資料"
              description={error}
              action={
                <button
                  type="button"
                  onClick={reload}
                  className="rounded-full bg-ink-950 px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] text-white"
                >
                  重新載入
                </button>
              }
            />
          </Panel>
        ) : null}

        <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div className="grid gap-6">
            <Panel
              eyebrow="Snapshot"
              title="營運摘要"
              description="摘要、圖表與表格共用同一批篩選資料，避免畫面區塊彼此不同步。"
            >
              {isLoading && !data ? (
                <LoadingSpinner label="讀取報表摘要中..." />
              ) : (
                <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                  <div className="interactive-card rounded-[24px] border border-mist-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,247,251,0.88))] p-5">
                    <p className="text-sm text-ink-700">Total Revenue</p>
                    <p className="mt-3 font-display text-3xl font-semibold text-ink-950">
                      {formatCurrency(summary?.totalRevenue ?? 0)}
                    </p>
                  </div>
                  <div className="interactive-card rounded-[24px] border border-mist-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,247,251,0.88))] p-5">
                    <p className="text-sm text-ink-700">Orders</p>
                    <p className="mt-3 font-display text-3xl font-semibold text-ink-950">
                      {summary?.totalOrders ?? 0}
                    </p>
                  </div>
                  <div className="interactive-card rounded-[24px] border border-mist-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,247,251,0.88))] p-5">
                    <p className="text-sm text-ink-700">AOV</p>
                    <p className="mt-3 font-display text-3xl font-semibold text-ink-950">
                      {formatCurrency(summary?.averageOrderValue ?? 0)}
                    </p>
                  </div>
                  <div className="interactive-card rounded-[24px] border border-mist-200 bg-[linear-gradient(180deg,_rgba(255,255,255,0.96),_rgba(244,247,251,0.88))] p-5">
                    <p className="text-sm text-ink-700">Paid Rate</p>
                    <p className="mt-3 font-display text-3xl font-semibold text-ink-950">
                      {summary?.paidRate ?? 0}%
                    </p>
                  </div>
                </div>
              )}
            </Panel>

            <Panel
              eyebrow="Trend"
              title="營收與訂單趨勢"
              description="目前使用 Chart.js。它在這個規模下足夠輕量，React 整合簡單，也方便之後直接替換成真實 API。"
            >
              {isLoading && !data ? (
                <LoadingSpinner label="讀取圖表資料中..." />
              ) : chartData.length > 0 ? (
                <ReportChart data={chartData} />
              ) : (
                <EmptyState
                  title="目前沒有可顯示的圖表資料"
                  description="請調整日期或分類條件，系統會重新計算趨勢圖。"
                />
              )}
            </Panel>

            <Panel
              eyebrow="Orders"
              title="訂單明細表"
              description="目前採前端分頁，但回傳結構已保留 total、page、pageSize 與 totalPages，未來可平滑改成後端分頁。"
            >
              {isLoading && !data ? (
                <LoadingSpinner label="載入表格資料中..." />
              ) : hasData && table ? (
                <div className="space-y-4">
                  <ReportsTable rows={table.items} />
                  <ReportsPagination
                    page={table.page}
                    totalPages={table.totalPages}
                    total={table.total}
                    pageSize={table.pageSize}
                    onPageChange={setPage}
                  />
                </div>
              ) : (
                <EmptyState
                  title="查無符合條件的訂單"
                  description="目前篩選條件沒有符合的資料，因此顯示 empty state，而不是留下一塊空白表格。"
                />
              )}
            </Panel>
          </div>

          <div className="grid gap-6">
            <Panel
              eyebrow="Status"
              title="查詢狀態"
              description="把 loading、error、empty 都做成明確視覺回饋，避免操作時失去上下文。"
            >
              {isLoading ? (
                <LoadingSpinner label="正在同步報表資料..." />
              ) : (
                <div className="space-y-4">
                  <Notice variant="info">
                    目前條件：{filters.category} | {activeRangeLabel}
                  </Notice>
                  <div className="rounded-[22px] border border-mist-200 bg-mist-50/70 p-4 text-sm leading-6 text-ink-700">
                    <p className="font-semibold text-ink-950">Performance Note</p>
                    <p className="mt-2">
                      現在先在 service 層做篩選與分頁，之後可以直接改為 API query
                      params，也能延伸成伺服器端分頁或虛擬捲動。
                    </p>
                  </div>
                </div>
              )}
            </Panel>

            <Panel
              eyebrow="Scenarios"
              title="測試情境"
              description="透過改變篩選器即可快速驗證不同狀態。"
            >
              <div className="space-y-4 text-sm leading-6 text-ink-700">
                <div className="rounded-[22px] border border-mist-200 bg-mist-50/70 p-4">
                  <p className="font-semibold text-ink-950">Empty State</p>
                  <p className="mt-2">
                    把日期設成 <code>2025-01-01</code> 到 <code>2025-01-31</code>。
                  </p>
                </div>
                <div className="rounded-[22px] border border-mist-200 bg-mist-50/70 p-4">
                  <p className="font-semibold text-ink-950">Error State</p>
                  <p className="mt-2">
                    將分類切到 <code>Sports</code>，並把開始日期設成{' '}
                    <code>2026-02-01</code>，可模擬 API 失敗。
                  </p>
                </div>
              </div>
            </Panel>
          </div>
        </div>
      </div>
    </>
  )
}
