<template>
  <q-page class="page-home">
    <section class="hero-section bg-gradient-primary text-white">
      <div class="container">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <div class="hero-content">
              <h1 class="text-h2 text-weight-bold q-mb-md">
                Sistema de Gestão
                <span class="text-accent">Teakweb</span>
              </h1>
              <p class="text-h6 q-mb-xl opacity-90">
                Gerencie seus agrupamentos de madeira e monitore informações climáticas
                em tempo real para otimizar suas operações.
              </p>
            </div>
          </div>

          <div class="col-12 col-md-6">
            <div class="hero-image">
              <q-img
                src="https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=600&h=400&fit=crop"
                style="border-radius: 12px; box-shadow: 0 20px 40px rgba(0,0,0,0.2)"
                ratio="4/3"
              />
            </div>
          </div>
        </div>
      </div>
    </section>

    <section class="stats-section q-py-xl">
      <div class="container">
        <div class="row q-col-gutter-lg q-mb-xl">
          <div class="col-12 text-center q-mb-lg">
            <h2 class="text-h3 text-weight-bold text-grey-8">
              Resumo do Sistema
            </h2>
            <p class="text-body1 text-grey-6">
              Acompanhe os principais indicadores do seu negócio
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Total de Agrupamentos"
              :value="stats.totalAgrupamentos"
              icon="inventory"
              icon-color="primary"
              :loading="loadingStats"
              clickable
              @click="navigateTo('agrupamentos')"
              tooltip="Clique para ver todos os agrupamentos"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Total de Toras"
              :value="stats.totalToras"
              icon="forest"
              icon-color="green"
              :loading="loadingStats"
              value-suffix=" toras"
              tooltip="Quantidade total de toras registradas"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Peso Total"
              :value="stats.pesoTotal"
              icon="scale"
              icon-color="orange"
              :loading="loadingStats"
              value-suffix=" kg"
              tooltip="Peso total dos agrupamentos"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Média por Agrupamento"
              :value="stats.mediaPeso"
              icon="analytics"
              icon-color="purple"
              :loading="loadingStats"
              value-suffix=" kg"
              tooltip="Peso médio por agrupamento"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="actions-section bg-grey-1 q-py-xl">
      <div class="container">
        <div class="row q-col-gutter-lg">
          <div class="col-12 text-center q-mb-lg">
            <h2 class="text-h3 text-weight-bold text-grey-8">
              Ações Rápidas
            </h2>
            <p class="text-body1 text-grey-6">
              Acesse as principais funcionalidades do sistema
            </p>
          </div>
        </div>

        <div class="row q-col-gutter-lg">
          <div class="col-12 col-md-4">
            <CardInfo
              title="Novo Agrupamento"
              description="Cadastre um novo agrupamento de madeira no sistema"
              icon="add_box"
              icon-color="primary"
              clickable
              show-actions
              action-label="Cadastrar"
              @click="abrirModalNovoAgrupamento"
              tooltip="Criar novo agrupamento"
            />
          </div>

          <div class="col-12 col-md-4">
            <CardInfo
              title="Consultar Clima"
              description="Verifique as condições climáticas para planejamento"
              icon="cloud"
              icon-color="blue"
              clickable
              show-actions
              action-label="Consultar"
              @click="navigateTo('clima')"
              tooltip="Ver informações do clima"
            />
          </div>

          <div class="col-12 col-md-4">
            <CardInfo
              title="Relatórios"
              description="Gere relatórios detalhados dos seus agrupamentos"
              icon="assessment"
              icon-color="teal"
              clickable
              show-actions
              action-label="Ver Relatórios"
              @click="showComingSoon"
              tooltip="Funcionalidade em desenvolvimento"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="activity-section q-py-xl">
      <div class="container">
        <div class="row">
          <div class="col-12">
            <h2 class="text-h4 text-weight-bold text-grey-8 q-mb-lg">
              Atividade Recente
            </h2>

            <q-card class="shadow-2">
              <q-card-section v-if="recentActivity.length === 0" class="text-center q-py-xl">
                <q-icon name="inbox" size="64px" color="grey-4" />
                <div class="text-h6 text-grey-6 q-mt-md">
                  Nenhuma atividade recente
                </div>
                <div class="text-body2 text-grey-5">
                  Cadastre seu primeiro agrupamento para começar
                </div>
              </q-card-section>

              <q-list v-else separator>
                <q-item
                  v-for="(activity, index) in recentActivity"
                  :key="index"
                  clickable
                  v-ripple
                >
                  <q-item-section avatar>
                    <q-avatar :color="activity.color" text-color="white">
                      <q-icon :name="activity.icon" />
                    </q-avatar>
                  </q-item-section>

                  <q-item-section>
                    <q-item-label>{{ activity.title }}</q-item-label>
                    <q-item-label caption>{{ activity.description }}</q-item-label>
                  </q-item-section>

                  <q-item-section side>
                    <q-item-label caption>{{ activity.time }}</q-item-label>
                  </q-item-section>
                </q-item>
              </q-list>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <q-dialog v-model="modalNovoAgrupamento">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Novo Agrupamento</div>
        </q-card-section>

        <q-card-section>
          <FormularioGenerico
            :fields="agrupamentoFields"
            submit-label="Salvar Agrupamento"
            :loading="savingAgrupamento"
            show-cancel-button
            @submit="salvarAgrupamento"
            @cancel="modalNovoAgrupamento = false"
            ref="formAgrupamento"
          />
        </q-card-section>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import CardInfo from '../components/CardInfo.vue'
import FormularioGenerico from '../components/FormularioGenerico.vue'
import { buscarAgrupamentos, cadastrarAgrupamento } from '../api/agrupamento.js'

const router = useRouter()
const $q = useQuasar()

const stats = ref({
  totalAgrupamentos: 0,
  totalToras: 0,
  pesoTotal: 0,
  mediaPeso: 0
})

const loadingStats = ref(false)
const modalNovoAgrupamento = ref(false)
const savingAgrupamento = ref(false)
const recentActivity = ref([])
const formAgrupamento = ref(null)

const agrupamentoFields = [
  {
    name: 'id',
    label: 'ID do Agrupamento',
    type: 'number',
    required: true,
    min: 1,
    icon: 'tag',
    tooltip: 'Identificador único do agrupamento'
  },
  {
    name: 'quantidade_de_toras',
    label: 'Quantidade de Toras',
    type: 'number',
    required: true,
    min: 1,
    icon: 'forest',
    tooltip: 'Número de toras no agrupamento'
  },
  {
    name: 'peso',
    label: 'Peso (kg)',
    type: 'number',
    required: true,
    min: 0.1,
    step: 0.1,
    icon: 'scale',
    tooltip: 'Peso total do agrupamento em quilogramas'
  }
]

const navigateTo = (route, params = {}) => {
  router.push({ name: route, params })
}

const carregarEstatisticas = async () => {
  loadingStats.value = true
  try {
    const agrupamentos = await buscarAgrupamentos()

    if (agrupamentos && agrupamentos.length > 0) {
      stats.value = {
        totalAgrupamentos: agrupamentos.length,
        totalToras: agrupamentos.reduce((sum, item) => sum + item.quantidade_de_toras, 0),
        pesoTotal: parseFloat(agrupamentos.reduce((sum, item) => sum + item.peso, 0).toFixed(1)),
        mediaPeso: parseFloat((agrupamentos.reduce((sum, item) => sum + item.peso, 0) / agrupamentos.length).toFixed(1))
      }

      recentActivity.value = agrupamentos.slice(-3).map((item, index) => ({
        title: `Agrupamento #${item.id}`,
        description: `${item.quantidade_de_toras} toras, ${item.peso}kg`,
        time: `${index + 1} hora${index > 0 ? 's' : ''} atrás`,
        icon: 'inventory',
        color: 'primary'
      })).reverse()
    }
  } catch (error) {
    console.error('Erro ao carregar estatísticas:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar estatísticas'
    })
  } finally {
    loadingStats.value = false
  }
}

const abrirModalNovoAgrupamento = () => {
  modalNovoAgrupamento.value = true
}

const salvarAgrupamento = async (dados) => {
  savingAgrupamento.value = true
  try {
    const result = await cadastrarAgrupamento(dados)

    if (result.error) {
      formAgrupamento.value?.showMessage(result.error, 'error')
    } else {
      const savedAgrupamentos = JSON.parse(localStorage.getItem('agrupamentos') || '[]')
      savedAgrupamentos.push({
        ...dados,
        createdAt: new Date().toISOString()
      })
      localStorage.setItem('agrupamentos', JSON.stringify(savedAgrupamentos))

      $q.notify({
        type: 'positive',
        message: 'Agrupamento salvo com sucesso!'
      })

      modalNovoAgrupamento.value = false
      carregarEstatisticas()
    }
  } catch (error) {
    console.error('Erro ao salvar agrupamento:', error)
    formAgrupamento.value?.showMessage('Erro ao salvar agrupamento', 'error')
  } finally {
    savingAgrupamento.value = false
  }
}

const showComingSoon = () => {
  $q.notify({
    type: 'info',
    message: 'Funcionalidade em desenvolvimento 🚧',
    timeout: 3000
  })
}

onMounted(() => {
  carregarEstatisticas()
})
</script>

<style scoped>
.page-home {
  min-height: 100vh;
}

.hero-section {
  padding: 4rem 0;
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
  overflow: hidden;
}

.hero-section::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><defs><pattern id="grain" width="100" height="100" patternUnits="userSpaceOnUse"><circle cx="25" cy="25" r="1" fill="white" opacity="0.1"/><circle cx="75" cy="75" r="1" fill="white" opacity="0.1"/><circle cx="50" cy="10" r="0.5" fill="white" opacity="0.05"/></pattern></defs><rect width="100" height="100" fill="url(%23grain)"/></svg>');
  opacity: 0.3;
}

.hero-content {
  position: relative;
  z-index: 2;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.stats-section,
.actions-section,
.activity-section {
  padding: 4rem 0;
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.text-accent {
  color: #ffd700;
}

.opacity-90 {
  opacity: 0.9;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.hero-content > * {
  animation: fadeInUp 0.6s ease-out forwards;
}

.hero-content > *:nth-child(2) {
  animation-delay: 0.2s;
}

.hero-content > *:nth-child(3) {
  animation-delay: 0.4s;
}

@media (max-width: 768px) {
  .hero-section {
    padding: 2rem 0;
  }

  .stats-section,
  .actions-section,
  .activity-section {
    padding: 2rem 0;
  }

  .text-h2 {
    font-size: 2rem !important;
  }
}
</style>
