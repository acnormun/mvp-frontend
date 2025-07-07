<template>
  <q-page class="page-clima">
    <section class="clima-header bg-gradient-blue text-white q-py-xl">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="text-h3 text-weight-bold q-mb-md">
              <q-icon name="wb_sunny" class="q-mr-sm" />
              Informações Climáticas
            </h1>
            <p class="text-body1 opacity-90">
              Consulte as condições meteorológicas atuais e previsões para planejamento das operações florestais
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <BotaoCustom
              icon="refresh"
              label="Atualizar Dados"
              variant="success"
              @click="atualizarDados"
              :loading="loading"
              tooltip="Atualizar informações climáticas"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="search-section bg-white q-py-lg shadow-1">
      <div class="container">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-6">
            <q-input
              v-model="cidadeBusca"
              label="Buscar cidade"
              placeholder="Ex: São Paulo, Rio de Janeiro..."
              outlined
              dense
              @keyup.enter="buscarClima"
              :loading="loading"
            >
              <template v-slot:append>
                <BotaoCustom
                  icon="search"
                  color="primary"
                  flat
                  round
                  @click="buscarClima"
                  :disable="!cidadeBusca.trim()"
                  tooltip="Buscar clima da cidade"
                />
              </template>
            </q-input>
          </div>

          <div class="col-12 col-md-6">
            <q-select
              v-model="cidadeSelecionada"
              :options="cidadesFavoritas"
              label="Cidades Favoritas"
              outlined
              dense
              emit-value
              map-options
              @update:model-value="selecionarCidadeFavorita"
            >
              <template v-slot:prepend>
                <q-icon name="star" color="amber" />
              </template>
            </q-select>
          </div>
        </div>
      </div>
    </section>

    <LoadingIndicator
      :show="loading && !climaAtual"
      message="Carregando informações climáticas..."
      overlay
    />

    <section v-if="climaAtual && !loading" class="weather-content q-py-xl">
      <div class="container">
        <div class="row q-col-gutter-lg q-mb-xl">
          <div class="col-12">
            <h2 class="text-h4 text-weight-bold text-grey-8 q-mb-lg">
              Condições Atuais - {{ climaAtual.location.name }}, {{ climaAtual.location.country }}
            </h2>
          </div>

          <div class="col-12 col-md-4">
            <CardInfo
              :title="`${climaAtual.current.temp_c}°C`"
              :subtitle="climaAtual.current.condition.text"
              :icon="getWeatherIcon(climaAtual.current.condition.code)"
              icon-size="80px"
              icon-color="primary"
              :description="`Sensação térmica: ${climaAtual.current.feelslike_c}°C`"
              color="primary"
              class="weather-card-main"
            />
          </div>

          <div class="col-12 col-md-8">
            <div class="row q-col-gutter-md">
              <div class="col-6 col-sm-3">
                <CardInfo
                  title="Umidade"
                  :value="climaAtual.current.humidity"
                  value-suffix="%"
                  icon="water_drop"
                  icon-color="blue"
                  tooltip="Umidade relativa do ar"
                />
              </div>

              <div class="col-6 col-sm-3">
                <CardInfo
                  title="Vento"
                  :value="climaAtual.current.wind_kph"
                  value-suffix=" km/h"
                  icon="air"
                  icon-color="teal"
                  :tooltip="`Direção: ${climaAtual.current.wind_dir}`"
                />
              </div>

              <div class="col-6 col-sm-3">
                <CardInfo
                  title="Pressão"
                  :value="climaAtual.current.pressure_mb"
                  value-suffix=" hPa"
                  icon="speed"
                  icon-color="purple"
                  tooltip="Pressão atmosférica"
                />
              </div>

              <div class="col-6 col-sm-3">
                <CardInfo
                  title="Visibilidade"
                  :value="climaAtual.current.vis_km"
                  value-suffix=" km"
                  icon="visibility"
                  icon-color="orange"
                  tooltip="Visibilidade em quilômetros"
                />
              </div>
            </div>
          </div>
        </div>

        <div class="row q-col-gutter-lg q-mb-xl">
          <div class="col-12 col-md-6">
            <q-card class="shadow-2 full-height">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">
                  <q-icon name="info" class="q-mr-sm" />
                  Detalhes Meteorológicos
                </div>

                <q-list>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="thermostat" color="red" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Índice UV</q-item-label>
                      <q-item-label caption>{{ climaAtual.current.uv }} ({{ getUVDescription(climaAtual.current.uv) }})</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="cloud" color="grey" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Nebulosidade</q-item-label>
                      <q-item-label caption>{{ climaAtual.current.cloud }}%</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="update" color="blue" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Última atualização</q-item-label>
                      <q-item-label caption>{{ formatarDataHora(climaAtual.current.last_updated) }}</q-item-label>
                    </q-item-section>
                  </q-item>
                </q-list>
              </q-card-section>
            </q-card>
          </div>

          <div class="col-12 col-md-6">
            <q-card class="shadow-2 full-height">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">
                  <q-icon name="agriculture" class="q-mr-sm" />
                  Recomendações Florestais
                </div>

                <div class="recommendations">
                  <div
                    v-for="recomendacao in recomendacoes"
                    :key="recomendacao.tipo"
                    class="recommendation-item q-mb-md"
                  >
                    <q-chip
                      :color="recomendacao.cor"
                      text-color="white"
                      :icon="recomendacao.icone"
                      class="q-mb-xs"
                    >
                      {{ recomendacao.tipo }}
                    </q-chip>
                    <div class="text-body2 text-grey-7">
                      {{ recomendacao.descricao }}
                    </div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row">
          <div class="col-12">
            <q-card class="shadow-2">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">
                  <q-icon name="history" class="q-mr-sm" />
                  Histórico de Consultas
                </div>

                <q-table
                  :rows="historicoConsultas"
                  :columns="colunas"
                  row-key="id"
                  :pagination="{ rowsPerPage: 5 }"
                  flat
                  bordered
                >
                  <template v-slot:body-cell-acao="props">
                    <q-td :props="props">
                      <BotaoCustom
                        icon="search"
                        label="Consultar"
                        size="sm"
                        @click="consultarHistorico(props.row)"
                        tooltip="Consultar clima desta cidade novamente"
                      />
                    </q-td>
                  </template>

                  <template v-slot:no-data>
                    <div class="text-center q-py-lg">
                      <q-icon name="cloud_off" size="48px" color="grey-4" />
                      <div class="text-h6 text-grey-6 q-mt-md">
                        Nenhuma consulta realizada
                      </div>
                      <div class="text-body2 text-grey-5">
                        Faça sua primeira consulta climática
                      </div>
                    </div>
                  </template>
                </q-table>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <section v-if="erro && !loading" class="error-section q-py-xl">
      <div class="container">
        <div class="text-center">
          <q-icon name="cloud_off" size="120px" color="grey-4" />
          <h3 class="text-h4 text-grey-6 q-mt-lg q-mb-md">
            Não foi possível carregar os dados climáticos
          </h3>
          <p class="text-body1 text-grey-5 q-mb-lg">
            {{ erro }}
          </p>
          <BotaoCustom
            label="Tentar Novamente"
            icon="refresh"
            variant="primary"
            @click="buscarClima"
          />
        </div>
      </div>
    </section>

    <section v-if="!climaAtual && !loading && !erro" class="empty-section q-py-xl">
      <div class="container">
        <div class="text-center">
          <q-icon name="search" size="120px" color="grey-4" />
          <h3 class="text-h4 text-grey-6 q-mt-lg q-mb-md">
            Busque por uma cidade
          </h3>
          <p class="text-body1 text-grey-5 q-mb-lg">
            Digite o nome de uma cidade para ver as informações climáticas
          </p>
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import CardInfo from '../components/CardInfo.vue'
import BotaoCustom from '../components/BotaoCustom.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const climaAtual = ref(null)
const loading = ref(false)
const erro = ref('')
const cidadeBusca = ref('')
const cidadeSelecionada = ref('')
const historicoConsultas = ref([])

const API_KEY = '4507646ded1846dbb66234346250607'
const API_BASE_URL = 'https://api.weatherapi.com/v1'

const cidadesFavoritas = [
  { label: 'São Paulo, SP', value: 'São Paulo' },
  { label: 'Rio de Janeiro, RJ', value: 'Rio de Janeiro' },
  { label: 'Brasília, DF', value: 'Brasília' },
  { label: 'Curitiba, PR', value: 'Curitiba' },
  { label: 'Porto Alegre, RS', value: 'Porto Alegre' },
  { label: 'Manaus, AM', value: 'Manaus' }
]

const colunas = [
  { name: 'cidade', label: 'Cidade', field: 'cidade', align: 'left' },
  { name: 'temperatura', label: 'Temperatura', field: 'temperatura', align: 'center' },
  { name: 'condicao', label: 'Condição', field: 'condicao', align: 'center' },
  { name: 'data', label: 'Data/Hora', field: 'data', align: 'center' },
  { name: 'acao', label: 'Ação', align: 'center' }
]

const recomendacoes = computed(() => {
  if (!climaAtual.value) return []

  const temp = climaAtual.value.current.temp_c
  const umidade = climaAtual.value.current.humidity
  const vento = climaAtual.value.current.wind_kph
  const uv = climaAtual.value.current.uv

  const recomendacoesList = []

  if (temp < 10) {
    recomendacoesList.push({
      tipo: 'Temperatura Baixa',
      descricao: 'Cuidado com geadas. Evite atividades de plantio.',
      cor: 'blue',
      icone: 'ac_unit'
    })
  } else if (temp > 35) {
    recomendacoesList.push({
      tipo: 'Temperatura Alta',
      descricao: 'Evite trabalhos pesados nas horas mais quentes. Mantenha hidratação.',
      cor: 'red',
      icone: 'wb_sunny'
    })
  } else {
    recomendacoesList.push({
      tipo: 'Temperatura Ideal',
      descricao: 'Condições favoráveis para atividades florestais.',
      cor: 'green',
      icone: 'thermostat'
    })
  }

  if (umidade < 30) {
    recomendacoesList.push({
      tipo: 'Baixa Umidade',
      descricao: 'Risco de incêndio elevado. Reforce medidas preventivas.',
      cor: 'orange',
      icone: 'local_fire_department'
    })
  } else if (umidade > 80) {
    recomendacoesList.push({
      tipo: 'Alta Umidade',
      descricao: 'Condições favoráveis para crescimento de fungos.',
      cor: 'indigo',
      icone: 'water_drop'
    })
  }

  if (vento > 30) {
    recomendacoesList.push({
      tipo: 'Vento Forte',
      descricao: 'Evite operações com equipamentos altos. Risco de queda de árvores.',
      cor: 'brown',
      icone: 'air'
    })
  }

  if (uv > 7) {
    recomendacoesList.push({
      tipo: 'UV Elevado',
      descricao: 'Use proteção solar. Evite exposição prolongada ao sol.',
      cor: 'amber',
      icone: 'wb_sunny'
    })
  }

  return recomendacoesList
})

const buscarClima = async (cidade = null) => {
  const cidadeParaBuscar = cidade || cidadeBusca.value.trim()

  if (!cidadeParaBuscar) {
    $q.notify({
      type: 'negative',
      message: 'Digite o nome de uma cidade'
    })
    return
  }

  loading.value = true
  erro.value = ''

  try {
    const cidadeRota = route.params.cidade
    const cidadeFinal = cidadeRota || cidadeParaBuscar

    const response = await fetch(
      `${API_BASE_URL}/current.json?key=${API_KEY}&q=${encodeURIComponent(cidadeFinal)}&lang=pt`
    )

    if (!response.ok) {
      throw new Error(`Cidade não encontrada: ${cidadeFinal}`)
    }

    const data = await response.json()
    climaAtual.value = data

    const novaConsulta = {
      id: Date.now(),
      cidade: `${data.location.name}, ${data.location.country}`,
      temperatura: `${data.current.temp_c}°C`,
      condicao: data.current.condition.text,
      data: formatarDataHora(new Date().toISOString()),
      dadosCompletos: data
    }

    const historico = JSON.parse(localStorage.getItem('climaHistorico') || '[]')

    const jaExiste = historico.find(item =>
      item.cidade.toLowerCase() === novaConsulta.cidade.toLowerCase()
    )

    if (!jaExiste) {
      historico.unshift(novaConsulta)
      if (historico.length > 10) {
        historico.splice(10)
      }
      localStorage.setItem('climaHistorico', JSON.stringify(historico))
      historicoConsultas.value = historico
    }

    if (!cidadeRota) {
      router.replace({
        name: 'clima',
        params: { cidade: cidadeFinal }
      })
    }

    $q.notify({
      type: 'positive',
      message: `Dados climáticos carregados para ${data.location.name}`
    })

  } catch (error) {
    console.error('Erro ao buscar clima:', error)
    erro.value = error.message
    $q.notify({
      type: 'negative',
      message: 'Erro ao carregar dados climáticos'
    })
  } finally {
    loading.value = false
  }
}

const selecionarCidadeFavorita = (cidade) => {
  if (cidade) {
    cidadeBusca.value = cidade
    buscarClima(cidade)
  }
}

const consultarHistorico = (item) => {
  climaAtual.value = item.dadosCompletos
  cidadeBusca.value = item.cidade.split(',')[0]
  router.replace({
    name: 'clima',
    params: { cidade: cidadeBusca.value }
  })
}

const atualizarDados = () => {
  if (climaAtual.value) {
    const cidade = climaAtual.value.location.name
    buscarClima(cidade)
  } else if (cidadeBusca.value) {
    buscarClima()
  } else {
    $q.notify({
      type: 'info',
      message: 'Selecione uma cidade primeiro'
    })
  }
}

const getWeatherIcon = (code) => {
  const iconMap = {
    1000: 'wb_sunny',
    1003: 'partly_cloudy_day',
    1006: 'cloud',
    1009: 'cloud',
    1030: 'foggy',
    1063: 'grain',
    1066: 'ac_unit',
    1069: 'grain',
    1072: 'grain',
    1087: 'thunderstorm',
    1114: 'ac_unit',
    1117: 'ac_unit',
    1135: 'foggy',
    1147: 'foggy',
    1150: 'grain',
    1153: 'grain',
    1168: 'grain',
    1171: 'grain',
    1180: 'grain',
    1183: 'grain',
    1186: 'rain',
    1189: 'rain',
    1192: 'rain',
    1195: 'rain',
    1198: 'grain',
    1201: 'rain',
    1204: 'grain',
    1207: 'grain',
    1210: 'ac_unit',
    1213: 'ac_unit',
    1216: 'ac_unit',
    1219: 'ac_unit',
    1222: 'ac_unit',
    1225: 'ac_unit',
    1237: 'ac_unit',
    1240: 'rain',
    1243: 'rain',
    1246: 'rain',
    1249: 'grain',
    1252: 'grain',
    1255: 'ac_unit',
    1258: 'ac_unit',
    1261: 'ac_unit',
    1264: 'ac_unit',
    1273: 'thunderstorm',
    1276: 'thunderstorm',
    1279: 'thunderstorm',
    1282: 'thunderstorm'
  }

  return iconMap[code] || 'wb_sunny'
}

const getUVDescription = (uv) => {
  if (uv <= 2) return 'Baixo'
  if (uv <= 5) return 'Moderado'
  if (uv <= 7) return 'Alto'
  if (uv <= 10) return 'Muito Alto'
  return 'Extremo'
}

const formatarDataHora = (dateString) => {
  return new Date(dateString).toLocaleString('pt-BR')
}

onMounted(() => {
  historicoConsultas.value = JSON.parse(localStorage.getItem('climaHistorico') || '[]')

  const cidadeRota = route.params.cidade
  if (cidadeRota) {
    cidadeBusca.value = cidadeRota
    buscarClima(cidadeRota)
  }
})
</script>

<style scoped>
.page-clima {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f7fa 0%, #c3cfe2 100%);
}

.clima-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  position: relative;
}

.bg-gradient-blue {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.weather-card-main {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.weather-card-main .text-h6,
.weather-card-main .text-subtitle2,
.weather-card-main .text-body2 {
  color: white !important;
}

.recommendation-item {
  padding: 0.5rem 0;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
}

.recommendation-item:last-child {
  border-bottom: none;
}

.opacity-90 {
  opacity: 0.9;
}

.full-height {
  height: 100%;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.weather-content > .container > .row > .col-12,
.weather-content > .container > .row > div[class*="col-"] {
  animation: slideInUp 0.6s ease-out forwards;
}

@media (max-width: 768px) {
  .clima-header {
    padding: 2rem 0;
  }

  .text-h3 {
    font-size: 1.8rem !important;
  }

  .weather-content {
    padding: 2rem 0;
  }
}
</style>
