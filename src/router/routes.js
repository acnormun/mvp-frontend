const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        name: 'home',
        component: () => import('pages/HomePage.vue')
      },
      {
        path: '/agrupamentos',
        name: 'agrupamentos',
        component: () => import('src/pages/AgrupamentosPage.vue')
      },
      {
        path: '/clima/:cidade?',
        name: 'clima',
        component: () => import('pages/ClimaPage.vue')
      },
      {
        path: '/agrupamento/:id',
        name: 'agrupamento-detalhes',
        component: () => import('pages/AgrupamentoDetalhes.vue')
      }
    ]
  },

  // Página 404 - Always leave this as last one
  {
    path: '/:catchAll(.*)*',
    name: 'erro404',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
