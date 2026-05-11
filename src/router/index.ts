import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: () => import('@/layouts/DefaultLayout.vue'),
      children: [
        {
          path: '',
          name: 'home',
          component: () => import('@/pages/LandingPage.vue'),
          meta: { title: 'SOLUTIMP ENERGY' },
        },
        {
          path: 'onboarding',
          name: 'onboarding',
          component: () => import('@/pages/OnboardingPage.vue'),
          meta: { title: 'Evaluación' },
        },
      ],
    },
  ],
})

router.afterEach((to) => {
  const title = to.meta.title as string | undefined
  document.title = title ? `${title} · SOLUTIMP ENERGY` : 'SOLUTIMP ENERGY'
})

export default router
