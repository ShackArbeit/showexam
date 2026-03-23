import type { NavigationItem } from '../types/navigation'

export const navigationItems: NavigationItem[] = [
  {
    label: '題目一：登入表單',
    description: '驗證流程、狀態反饋與 401 攔截',
    to: '/login',
  },
  {
    label: '題目二：數據統計報表',
    description: '圖表、表格、篩選器與分頁骨架',
    to: '/reports',
  },
]
