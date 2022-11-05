import Layout from '@/layout'

export default {
  path: '/settings', // 角色设置
  component: Layout,
  children: [
    {
      path: '',
      name: 'Settings',
      component: () => import('@/views/setting'),
      meta: { title: '角色设置', icon: 'setting' }
    }
  ]
}
