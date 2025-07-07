<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated class="bg-primary text-white">
      <q-toolbar>
        <q-toolbar-title class="cursor-pointer" @click="$router.push('/')">
          <q-icon name="forest" class="q-mr-sm" />
          Teakweb
        </q-toolbar-title>
        <div class="gt-sm">
          <q-btn
            v-for="link in navLinks"
            :key="link.name"
            flat
            :label="link.title"
            :icon="link.icon"
            @click="navigateTo(link.name)"
            :class="{ 'bg-white-1': isCurrentRoute(link.name) }"
            class="q-ml-sm"
          />
        </div>
        <q-space />
        <div class="row items-center q-gutter-sm">
          <q-chip
            icon="inventory"
            :label="`${totalAgrupamentos} agrupamentos`"
            color="white"
            text-color="primary"
            size="sm"
          />
          <q-btn
            flat
            round
            dense
            icon="notifications"
            @click="mostrarNotificacoes"
          >
            <q-badge v-if="notificacoes > 0" color="red" floating>
              {{ notificacoes }}
            </q-badge>
            <q-tooltip>Notificações</q-tooltip>
          </q-btn>
        </div>
      </q-toolbar>
    </q-header>
    <q-page-container>
      <router-view />
    </q-page-container>
    <q-page-sticky position="bottom-right" :offset="[18, 18]" class="lt-md">
      <q-fab
        icon="add"
        direction="up"
        color="primary"
        push
        @click="novoAgrupamento"
      >
        <q-fab-action
          color="green"
          @click="novoAgrupamento"
          icon="add_box"
          label="Novo Agrupamento"
        />
        <q-fab-action
          color="orange"
          @click="consultarClima"
          icon="wb_sunny"
          label="Consultar Clima"
        />
      </q-fab>
    </q-page-sticky>
    <q-dialog v-model="notificacoesDialog">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Notificações</div>
        </q-card-section>
        <q-card-section class="q-pt-none">
          <q-list v-if="listaNotificacoes.length > 0">
            <q-item
              v-for="(notif, index) in listaNotificacoes"
              :key="index"
              dense
            >
              <q-item-section avatar>
                <q-icon :name="notif.icon" :color="notif.color" />
              </q-item-section>
              <q-item-section>
                <q-item-label>{{ notif.titulo }}</q-item-label>
                <q-item-label caption>{{ notif.mensagem }}</q-item-label>
              </q-item-section>
              <q-item-section side>
                <q-btn
                  flat
                  round
                  icon="close"
                  size="sm"
                  @click="removerNotificacao(index)"
                />
              </q-item-section>
            </q-item>
          </q-list>
          <div v-else class="text-center text-grey-6 q-py-lg">
            <q-icon name="notifications_none" size="48px" />
            <div class="q-mt-md">Nenhuma notificação</div>
          </div>
        </q-card-section>
        <q-card-actions align="right">
          <q-btn flat label="Fechar" color="primary" v-close-popup />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-layout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useQuasar } from 'quasar'

const router = useRouter()
const route = useRoute()
const $q = useQuasar()

const leftDrawerOpen = ref(false)
const totalAgrupamentos = ref(0)
const notificacoes = ref(0)
const notificacoesDialog = ref(false)
const listaNotificacoes = ref([])
const ultimaAtualizacao = ref('')

const navLinks = [
  {
    name: 'home',
    title: 'Início',
    caption: 'Página inicial e resumos',
    icon: 'home',
    route: '/'
  },
  {
    name: 'agrupamentos',
    title: 'Agrupamentos',
    caption: 'Gerenciar agrupamentos de madeira',
    icon: 'inventory',
    route: '/agrupamentos',
    badge: computed(() => totalAgrupamentos.value || null),
    badgeColor: 'primary'
  },
  {
    name: 'clima',
    title: 'Clima',
    caption: 'Informações meteorológicas',
    icon: 'wb_sunny',
    route: '/clima'
  }
]

const isCurrentRoute = (routeName) => {
  return route.name === routeName
}

const toggleLeftDrawer = () => {
  leftDrawerOpen.value = !leftDrawerOpen.value
}

const navigateTo = (routeName) => {
  if (route.name !== routeName) {
    router.push({ name: routeName })
  }
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
}

const novoAgrupamento = () => {
  router.push({ name: 'agrupamentos', query: { novo: 'true' } })
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
}

const consultarClima = () => {
  router.push({ name: 'clima' })
  if ($q.screen.lt.md) {
    leftDrawerOpen.value = false
  }
}

const mostrarNotificacoes = () => {
  notificacoesDialog.value = true
}

const removerNotificacao = (index) => {
  listaNotificacoes.value.splice(index, 1)
  notificacoes.value = listaNotificacoes.value.length
  localStorage.setItem('notificacoes', JSON.stringify(listaNotificacoes.value))
}

const adicionarNotificacao = (notificacao) => {
  listaNotificacoes.value.unshift(notificacao)
  notificacoes.value = listaNotificacoes.value.length
  if (listaNotificacoes.value.length > 10) {
    listaNotificacoes.value = listaNotificacoes.value.slice(0, 10)
  }
  localStorage.setItem('notificacoes', JSON.stringify(listaNotificacoes.value))
}

const carregarDados = () => {
  try {
    const agrupamentosLocal = JSON.parse(localStorage.getItem('agrupamentos') || '[]')
    totalAgrupamentos.value = agrupamentosLocal.length
  } catch (error) {
    console.error('Erro ao carregar agrupamentos:', error)
  }
  try {
    const notificacoesLocal = JSON.parse(localStorage.getItem('notificacoes') || '[]')
    listaNotificacoes.value = notificacoesLocal
    notificacoes.value = notificacoesLocal.length
  } catch (error) {
    console.error('Erro ao carregar notificações:', error)
  }
  ultimaAtualizacao.value = new Date().toLocaleTimeString('pt-BR')
}

const verificarNotificacoesSistema = () => {
  if (totalAgrupamentos.value === 0) {
    const notifExiste = listaNotificacoes.value.find(n => n.tipo === 'sem_agrupamentos')
    if (!notifExiste) {
      adicionarNotificacao({
        tipo: 'sem_agrupamentos',
        titulo: 'Bem-vindo!',
        mensagem: 'Cadastre seu primeiro agrupamento para começar.',
        icon: 'inventory',
        color: 'blue',
        timestamp: new Date().toISOString()
      })
    }
  }
  const primeiraVisita = !localStorage.getItem('ja_visitou')
  if (primeiraVisita) {
    localStorage.setItem('ja_visitou', 'true')
    adicionarNotificacao({
      tipo: 'primeira_visita',
      titulo: 'Sistema Teakweb',
      mensagem: 'Explore todas as funcionalidades disponíveis!',
      icon: 'celebration',
      color: 'green',
      timestamp: new Date().toISOString()
    })
  }
}

onMounted(() => {
  carregarDados()
  verificarNotificacoesSistema()
  setInterval(carregarDados, 30000)
})

defineExpose({
  adicionarNotificacao,
  carregarDados
})
</script>

<style scoped>
.q-toolbar-title {
  font-weight: bold;
  font-size: 1.2rem;
}

.bg-white-1 {
  background-color: rgba(255, 255, 255, 0.1);
}

.q-item {
  transition: all 0.3s ease;
}

.q-item:hover {
  background-color: rgba(0, 0, 0, 0.05);
}

@media (max-width: 1023px) {
  .q-toolbar-title {
    font-size: 1rem;
  }
}

.q-fab-action {
  transition: all 0.3s ease;
}

.q-fab-action:hover {
  transform: scale(1.1);
}
</style>
