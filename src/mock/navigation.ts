import type { NavigationItem } from '../types/navigation'

export const navigationItems: NavigationItem[] = [
  {
    label: 'Question One： Login Form',
    description: '驗證流程、狀態反饋與 401 攔截',
    to: '/login',
  },
  {
    label: 'Question Two：Data Analytics Report',
    description: '圖表、表格、篩選器與分頁骨架',
    to: '/reports',
  },
]
