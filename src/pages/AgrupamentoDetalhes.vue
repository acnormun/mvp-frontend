<template>
  <q-page class="page-detalhes">
    <section class="detalhes-header bg-gradient-primary text-white q-py-lg">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <div class="row items-center">
              <div class="col-auto">
                <BotaoCustom
                  icon="arrow_back"
                  flat
                  round
                  size="lg"
                  @click="voltarPagina"
                  tooltip="Voltar"
                />
              </div>
              <div class="col">
                <h1 class="text-h3 text-weight-bold q-mb-xs">
                  Agrupamento #{{ agrupamentoId }}
                </h1>
                <p class="text-body1 opacity-90" v-if="agrupamento">
                  {{ agrupamento.quantidade_de_toras }} toras • {{ agrupamento.peso }} kg
                </p>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-4 text-right">
            <BotaoCustom
              v-if="agrupamento"
              icon="edit"
              label="Editar"
              variant="success"
              @click="editarAgrupamento"
              tooltip="Editar agrupamento"
            />
          </div>
        </div>
      </div>
    </section>

    <LoadingIndicator
      :show="loading"
      message="Carregando detalhes do agrupamento..."
    />

    <section v-if="agrupamento && !loading" class="detalhes-content q-py-xl">
      <div class="container">
        <div class="row q-col-gutter-lg q-mb-xl">
          <div class="col-12">
            <h2 class="text-h4 text-weight-bold text-grey-8 q-mb-lg">
              Informações Detalhadas
            </h2>
          </div>

          <div class="col-12 col-md-4">
            <CardInfo
              title="Quantidade de Toras"
              :value="agrupamento.quantidade_de_toras"
              icon="forest"
              icon-color="green"
              value-suffix=" unidades"
              :description="getDescricaoQuantidade()"
            />
          </div>

          <div class="col-12 col-md-4">
            <CardInfo
              title="Peso Total"
              :value="agrupamento.peso"
              icon="scale"
              icon-color="orange"
              value-suffix=" kg"
              :description="getDescricaoPeso()"
            />
          </div>

          <div class="col-12 col-md-4">
            <CardInfo
              title="Peso por Tora"
              :value="pesoPorTora"
              icon="analytics"
              icon-color="purple"
              value-suffix=" kg/tora"
              description="Peso médio por tora"
            />
          </div>
        </div>

        <div class="row q-col-gutter-lg q-mb-xl">
          <div class="col-12 col-md-6">
            <q-card class="shadow-2 full-height">
              <q-card-section>
                <div class="text-h6 text-weight-bold q-mb-md">
                  <q-icon name="info" class="q-mr-sm" />
                  Informações Técnicas
                </div>

                <q-list>
                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="tag" color="primary" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>ID do Agrupamento</q-item-label>
                      <q-item-label caption>{{ agrupamento.id }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="forest" color="green" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Quantidade de Toras</q-item-label>
                      <q-item-label caption>{{ agrupamento.quantidade_de_toras }} unidades</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="scale" color="orange" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Peso Total</q-item-label>
                      <q-item-label caption>{{ agrupamento.peso }} kg</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item>
                    <q-item-section avatar>
                      <q-icon name="analytics" color="purple" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Peso Médio por Tora</q-item-label>
                      <q-item-label caption>{{ pesoPorTora }} kg/tora</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="agrupamento.createdAt">
                    <q-item-section avatar>
                      <q-icon name="event" color="blue" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Data de Criação</q-item-label>
                      <q-item-label caption>{{ formatarData(agrupamento.createdAt) }}</q-item-label>
                    </q-item-section>
                  </q-item>

                  <q-item v-if="agrupamento.updatedAt">
                    <q-item-section avatar>
                      <q-icon name="update" color="teal" />
                    </q-item-section>
                    <q-item-section>
                      <q-item-label>Última Atualização</q-item-label>
                      <q-item-label caption>{{ formatarData(agrupamento.updatedAt) }}</q-item-label>
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
                  <q-icon name="description" class="q-mr-sm" />
                  Observações
                </div>

                <div v-if="agrupamento.observacoes" class="text-body1">
                  {{ agrupamento.observacoes }}
                </div>

                <div v-else class="text-body2 text-grey-5 text-center q-py-lg">
                  <q-icon name="edit_note" size="48px" color="grey-4" />
                  <div class="q-mt-md">
                    Nenhuma observação registrada
                  </div>
                  <BotaoCustom
                    label="Adicionar Observação"
                    icon="add"
                    size="sm"
                    @click="editarAgrupamento"
                    class="q-mt-md"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>

        <div class="row q-col-gutter-md">
          <div class="col-12">
            <h3 class="text-h5 text-weight-bold text-grey-8 q-mb-md">
              Ações Disponíveis
            </h3>
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Calcular Frete"
              description="Calcule o frete para transporte deste agrupamento"
              icon="local_shipping"
              icon-color="orange"
              clickable
              show-actions
              action-label="Calcular"
              @click="abrirModalFrete"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Editar Dados"
              description="Modifique as informações deste agrupamento"
              icon="edit"
              icon-color="blue"
              clickable
              show-actions
              action-label="Editar"
              @click="editarAgrupamento"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Gerar Relatório"
              description="Crie um relatório detalhado do agrupamento"
              icon="description"
              icon-color="teal"
              clickable
              show-actions
              action-label="Gerar"
              @click="gerarRelatorio"
            />
          </div>

          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Excluir"
              description="Remove permanentemente este agrupamento"
              icon="delete"
              icon-color="red"
              clickable
              show-actions
              action-label="Excluir"
              action-color="negative"
              @click="confirmarExclusao"
            />
          </div>
        </div>
      </div>
    </section>

    <section v-if="erro && !loading" class="error-section q-py-xl">
      <div class="container">
        <div class="text-center">
          <q-icon name="error" size="120px" color="red-4" />
          <h3 class="text-h4 text-grey-6 q-mt-lg q-mb-md">
            Agrupamento não encontrado
          </h3>
          <p class="text-body1 text-grey-5 q-mb-lg">
            O agrupamento #{{ agrupamentoId }} não foi encontrado ou pode ter sido removido.
          </p>
          <BotaoCustom
            label="Voltar aos Agrupamentos"
            icon="arrow_back"
            variant="primary"
            @click="voltarAgrupamentos"
          />
        </div>
      </div>
    </section>

    <q-dialog v-model="modalFreteVisivel">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Calcular Frete</div>
          <div class="text-body2 text-grey-6">
            Agrupamento #{{ agrupamento?.id }}
          </div>
        </q-card-section>

        <q-card-section>
          <q-input
            v-model="cepDestino"
            label="CEP de Destino"
            mask="#####-###"
            outlined
            :rules="[val => !!val || 'CEP é obrigatório']"
          />
        </q-card-section>

        <q-card-actions align="right">
          <BotaoCustom
            label="Cancelar"
            flat
            @click="modalFreteVisivel = false"
          />
          <BotaoCustom
            label="Calcular"
            variant="primary"
            :loading="calculandoFrete"
            @click="calcularFrete"
            :disable="!cepDestino"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import CardInfo from '../components/CardInfo.vue'
import BotaoCustom from '../components/BotaoCustom.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import {
  buscarAgrupamentos,
  deletarAgrupamento,
  calcularFrete as apiCalcularFrete
} from '../api/agrupamento.js'

const route = useRoute()
const router = useRouter()
const $q = useQuasar()

const agrupamento = ref(null)
const loading = ref(false)
const erro = ref(false)
const modalFreteVisivel = ref(false)
const calculandoFrete = ref(false)
const cepDestino = ref('')

const agrupamentoId = computed(() => route.params.id)

const pesoPorTora = computed(() => {
  if (!agrupamento.value) return 0
  return (agrupamento.value.peso / agrupamento.value.quantidade_de_toras).toFixed(2)
})

const carregarAgrupamento = async () => {
  loading.value = true
  erro.value = false

  try {
    const agrupamentos = await buscarAgrupamentos()
    let encontrado = agrupamentos?.find(item => item.id == agrupamentoId.value)

    if (!encontrado) {
      const agrupamentosLocal = JSON.parse(localStorage.getItem('agrupamentos') || '[]')
      encontrado = agrupamentosLocal.find(item => item.id == agrupamentoId.value)
    }

    if (encontrado) {
      agrupamento.value = encontrado
    } else {
      erro.value = true
    }

  } catch (error) {
    console.error('Erro ao carregar agrupamento:', error)

    const agrupamentosLocal = JSON.parse(localStorage.getItem('agrupamentos') || '[]')
    const encontrado = agrupamentosLocal.find(item => item.id == agrupamentoId.value)

    if (encontrado) {
      agrupamento.value = encontrado
    } else {
      erro.value = true
    }
  } finally {
    loading.value = false
  }
}

const voltarPagina = () => {
  router.go(-1)
}

const voltarAgrupamentos = () => {
  router.push({ name: 'agrupamentos' })
}

const editarAgrupamento = () => {
  router.push({
    name: 'agrupamentos',
    query: { editar: agrupamento.value.id }
  })
}

const abrirModalFrete = () => {
  cepDestino.value = ''
  modalFreteVisivel.value = true
}

const calcularFrete = async () => {
  if (!cepDestino.value || !agrupamento.value) return

  calculandoFrete.value = true
  try {
    const resultado = await apiCalcularFrete({
      ...agrupamento.value,
      cep_destino: cepDestino.value
    })

    if (resultado.error) {
      $q.notify({
        type: 'negative',
        message: resultado.error
      })
    } else {
      $q.notify({
        type: 'info',
        message: `Distância: ${resultado.data.distancia_km} km | Frete: R$ ${resultado.data.valor_frete?.toFixed(2) || '0,00'}`,
        timeout: 5000
      })
      modalFreteVisivel.value = false
    }
  } catch (error) {
    console.error('Erro ao calcular frete:', error)
    $q.notify({
      type: 'negative',
      message: 'Erro ao calcular frete'
    })
  } finally {
    calculandoFrete.value = false
  }
}

const confirmarExclusao = () => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja realmente excluir o agrupamento #${agrupamento.value.id}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const result = await deletarAgrupamento(agrupamento.value.id)

      if (!result.error) {
        const agrupamentosLocal = JSON.parse(localStorage.getItem('agrupamentos') || '[]')
        const novoArray = agrupamentosLocal.filter(item => item.id !== agrupamento.value.id)
        localStorage.setItem('agrupamentos', JSON.stringify(novoArray))

        $q.notify({
          type: 'positive',
          message: 'Agrupamento excluído com sucesso!'
        })

        router.push({ name: 'agrupamentos' })
      } else {
        $q.notify({
          type: 'negative',
          message: result.error
        })
      }
    } catch (error) {
      console.error('Erro ao excluir agrupamento:', error)
      $q.notify({
        type: 'negative',
        message: 'Erro ao excluir agrupamento'
      })
    }
  })
}

const gerarRelatorio = () => {
  if (!agrupamento.value) return

  const conteudo = `
RELATÓRIO DO AGRUPAMENTO #${agrupamento.value.id}
===============================================

Informações Básicas:
- ID: ${agrupamento.value.id}
- Quantidade de Toras: ${agrupamento.value.quantidade_de_toras} unidades
- Peso Total: ${agrupamento.value.peso} kg
- Peso por Tora: ${pesoPorTora.value} kg/tora

${agrupamento.value.observacoes ? `Observações:\n${agrupamento.value.observacoes}\n` : ''}

${agrupamento.value.createdAt ? `Data de Criação: ${formatarData(agrupamento.value.createdAt)}\n` : ''}
${agrupamento.value.updatedAt ? `Última Atualização: ${formatarData(agrupamento.value.updatedAt)}\n` : ''}

Relatório gerado em: ${new Date().toLocaleString('pt-BR')}
  `.trim()

  const blob = new Blob([conteudo], { type: 'text/plain;charset=utf-8' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `agrupamento_${agrupamento.value.id}_relatorio.txt`
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)

  $q.notify({
    type: 'positive',
    message: 'Relatório gerado com sucesso!'
  })
}

const getDescricaoQuantidade = () => {
  if (!agrupamento.value) return ''
  const qtd = agrupamento.value.quantidade_de_toras

  if (qtd <= 10) return 'Agrupamento pequeno'
  if (qtd <= 50) return 'Agrupamento médio'
  return 'Agrupamento grande'
}

const getDescricaoPeso = () => {
  if (!agrupamento.value) return ''
  const peso = agrupamento.value.peso

  if (peso <= 100) return 'Leve'
  if (peso <= 500) return 'Médio'
  if (peso <= 1000) return 'Pesado'
  return 'Muito pesado'
}

const formatarData = (dateString) => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleString('pt-BR')
}

onMounted(() => {
  carregarAgrupamento()
})
</script>

<style scoped>
.page-detalhes {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.detalhes-header {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.bg-gradient-primary {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.opacity-90 {
  opacity: 0.9;
}

.full-height {
  height: 100%;
}

@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.detalhes-content .row > div {
  animation: fadeInUp 0.6s ease-out forwards;
}

.detalhes-content .row:nth-child(2) > div {
  animation-delay: 0.1s;
}

.detalhes-content .row:nth-child(3) > div {
  animation-delay: 0.2s;
}

@media (max-width: 768px) {
  .detalhes-header {
    padding: 1.5rem 0;
  }

  .text-h3 {
    font-size: 1.8rem !important;
  }
}
</style>
