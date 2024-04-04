import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'home',
            component: () => import('@/pages/HomePage.vue'),
        },
        {
            path: '/settings',
            name: 'settings',
            component: () => import('@/pages/SettingsPages.vue'),
        },
        {
            path: '/auth',
            name: 'auth',
            component: () => import('@/pages/AuthPages.vue'),
        },
    ]
})

export default router 