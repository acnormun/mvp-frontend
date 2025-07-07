<template>
  <q-page class="page-agrupamentos">
    <section class="agrupamentos-header bg-gradient-green text-white q-py-lg">
      <div class="container">
        <div class="row items-center">
          <div class="col-12 col-md-8">
            <h1 class="text-h3 text-weight-bold q-mb-md">
              <q-icon name="inventory" class="q-mr-sm" />
              Gestão de Agrupamentos
            </h1>
            <p class="text-body1 opacity-90">
              Gerencie seus agrupamentos de madeira com validação, armazenamento local e cálculo de frete
            </p>
          </div>
          <div class="col-12 col-md-4 text-right">
            <BotaoCustom
              icon="add"
              label="Novo Agrupamento"
              variant="success"
              @click="abrirModalCadastro"
              tooltip="Criar novo agrupamento"
            />
          </div>
        </div>
      </div>
    </section>

    <section class="filtros-section bg-white q-py-md shadow-1">
      <div class="container">
        <div class="row items-center q-col-gutter-md">
          <div class="col-12 col-md-4">
            <q-input
              v-model="filtros.busca"
              label="Buscar agrupamento"
              placeholder="ID, peso, quantidade..."
              outlined
              dense
              clearable
              @input="filtrarAgrupamentos"
            >
              <template v-slot:prepend>
                <q-icon name="search" />
              </template>
            </q-input>
          </div>
          <div class="col-12 col-md-3">
            <q-select
              v-model="filtros.ordenacao"
              :options="opcoesOrdenacao"
              label="Ordenar por"
              outlined
              dense
              emit-value
              map-options
              @update:model-value="filtrarAgrupamentos"
            />
          </div>
          <div class="col-12 col-md-3">
            <q-input
              v-model.number="filtros.pesoMin"
              label="Peso mínimo (kg)"
              type="number"
              outlined
              dense
              @input="filtrarAgrupamentos"
            />
          </div>
          <div class="col-12 col-md-2">
            <BotaoCustom
              icon="refresh"
              label="Atualizar"
              @click="carregarAgrupamentos"
              :loading="loading"
              tooltip="Recarregar dados"
              full-width
            />
          </div>
        </div>
      </div>
    </section>

    <LoadingIndicator
      :show="loading && agrupamentosFiltrados.length === 0"
      message="Carregando agrupamentos..."
    />

    <section class="agrupamentos-content q-py-lg">
      <div class="container">
        <div class="row q-col-gutter-md q-mb-lg">
          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Total"
              :value="agrupamentos.length"
              icon="inventory"
              icon-color="primary"
              value-suffix=" agrupamentos"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Toras"
              :value="estatisticas.totalToras"
              icon="forest"
              icon-color="green"
              value-suffix=" unidades"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Peso Total"
              :value="estatisticas.pesoTotal"
              icon="scale"
              icon-color="orange"
              value-suffix=" kg"
            />
          </div>
          <div class="col-12 col-sm-6 col-md-3">
            <CardInfo
              title="Média/Agrupamento"
              :value="estatisticas.mediaPeso"
              icon="analytics"
              icon-color="purple"
              value-suffix=" kg"
            />
          </div>
        </div>
        <q-card class="shadow-2">
          <q-card-section>
            <div class="text-h6 text-weight-bold q-mb-md">
              Lista de Agrupamentos
              <q-chip
                v-if="agrupamentosFiltrados.length !== agrupamentos.length"
                :label="`${agrupamentosFiltrados.length} de ${agrupamentos.length}`"
                color="primary"
                text-color="white"
                class="q-ml-sm"
              />
            </div>
            <q-table
              :rows="agrupamentosFiltrados"
              :columns="colunas"
              row-key="id"
              :pagination="{ rowsPerPage: 10 }"
              flat
              bordered
              :loading="loading"
            >
              <template v-slot:body-cell-acoes="props">
                <q-td :props="props">
                  <div class="q-gutter-xs">
                    <BotaoCustom
                      icon="edit"
                      size="sm"
                      variant="info"
                      @click="abrirEdicao(props.row)"
                      tooltip="Editar agrupamento"
                    />
                    <BotaoCustom
                      icon="local_shipping"
                      size="sm"
                      variant="warning"
                      @click="abrirModalFrete(props.row)"
                      tooltip="Calcular frete"
                    />
                    <BotaoCustom
                      icon="visibility"
                      size="sm"
                      @click="verDetalhes(props.row)"
                      tooltip="Ver detalhes"
                    />
                    <BotaoCustom
                      icon="delete"
                      size="sm"
                      variant="danger"
                      @click="confirmarExclusao(props.row)"
                      tooltip="Excluir agrupamento"
                    />
                  </div>
                </q-td>
              </template>
              <template v-slot:no-data>
                <div class="text-center q-py-lg full-width">
                  <q-icon name="inventory" size="64px" color="grey-4" />
                  <div class="text-h6 text-grey-6 q-mt-md">
                    {{ filtros.busca ? 'Nenhum agrupamento encontrado' : 'Nenhum agrupamento cadastrado' }}
                  </div>
                  <div class="text-body2 text-grey-5 q-mb-md">
                    {{ filtros.busca ? 'Tente alterar os filtros de busca' : 'Cadastre seu primeiro agrupamento' }}
                  </div>
                  <BotaoCustom
                    v-if="!filtros.busca"
                    label="Novo Agrupamento"
                    icon="add"
                    variant="primary"
                    @click="abrirModalCadastro"
                  />
                </div>
              </template>
            </q-table>
          </q-card-section>
        </q-card>
      </div>
    </section>

    <q-dialog v-model="modalVisivel">
      <q-card style="min-width: 500px">
        <q-card-section>
          <div class="text-h6">
            {{ modoEdicao ? 'Editar' : 'Novo' }} Agrupamento
          </div>
        </q-card-section>
        <q-card-section>
          <FormularioGenerico
            :fields="camposFormulario"
            :initial-data="formData"
            :submit-label="modoEdicao ? 'Atualizar' : 'Cadastrar'"
            :loading="salvando"
            show-cancel-button
            @submit="salvarAgrupamento"
            @cancel="fecharModal"
            ref="formulario"
          />
        </q-card-section>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalFreteVisivel">
      <q-card style="min-width: 400px">
        <q-card-section>
          <div class="text-h6">Calcular Frete</div>
          <div class="text-body2 text-grey-6">
            Agrupamento #{{ agrupamentoSelecionado?.id }}
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
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'
import CardInfo from '../components/CardInfo.vue'
import BotaoCustom from '../components/BotaoCustom.vue'
import FormularioGenerico from '../components/FormularioGenerico.vue'
import LoadingIndicator from '../components/LoadingIndicator.vue'
import {
  buscarAgrupamentos as apiBuscar,
  cadastrarAgrupamento as apiCadastrar,
  editarAgrupamento as apiEditar,
  deletarAgrupamento as apiDeletar,
  calcularFrete as apiCalcularFrete
} from '../api/agrupamento.js'

const router = useRouter()
const $q = useQuasar()

const agrupamentos = ref([])
const loading = ref(false)
const modalVisivel = ref(false)
const modalFreteVisivel = ref(false)
const modoEdicao = ref(false)
const salvando = ref(false)
const calculandoFrete = ref(false)
const formData = ref({})
const agrupamentoSelecionado = ref(null)
const cepDestino = ref('')
const formulario = ref(null)

const filtros = ref({
  busca: '',
  ordenacao: 'id',
  pesoMin: null
})

const opcoesOrdenacao = [
  { label: 'ID', value: 'id' },
  { label: 'Quantidade de Toras', value: 'quantidade_de_toras' },
  { label: 'Peso (menor)', value: 'peso' },
  { label: 'Peso (maior)', value: 'peso_desc' }
]

const camposFormulario = [
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
  },
  {
    name: 'observacoes',
    label: 'Observações',
    type: 'textarea',
    rows: 3,
    tooltip: 'Observações adicionais sobre o agrupamento'
  }
]

const colunas = [
  { name: 'id', label: 'ID', field: 'id', align: 'left', sortable: true },
  { name: 'quantidade_de_toras', label: 'Toras', field: 'quantidade_de_toras', align: 'center', sortable: true },
  { name: 'peso', label: 'Peso (kg)', field: 'peso', align: 'center', sortable: true, format: val => `${val} kg` },
  { name: 'observacoes', label: 'Observações', field: 'observacoes', align: 'left' },
  { name: 'acoes', label: 'Ações', align: 'center', sortable: false }
]

const agrupamentosFiltrados = computed(() => {
  let resultado = [...agrupamentos.value]
  if (filtros.value.busca) {
    const busca = filtros.value.busca.toLowerCase()
    resultado = resultado.filter(item =>
      item.id.toString().includes(busca) ||
      item.quantidade_de_toras.toString().includes(busca) ||
      item.peso.toString().includes(busca) ||
      (item.observacoes && item.observacoes.toLowerCase().includes(busca))
    )
  }
  if (filtros.value.pesoMin !== null && filtros.value.pesoMin !== '') {
    resultado = resultado.filter(item => item.peso >= filtros.value.pesoMin)
  }
  resultado.sort((a, b) => {
    const campo = filtros.value.ordenacao
    if (campo === 'peso_desc') {
      return b.peso - a.peso
    }
    if (typeof a[campo] === 'number') {
      return a[campo] - b[campo]
    }
    return String(a[campo]).localeCompare(String(b[campo]))
  })
  return resultado
})

const estatisticas = computed(() => {
  if (agrupamentos.value.length === 0) {
    return {
      totalToras: 0,
      pesoTotal: 0,
      mediaPeso: 0
    }
  }
  return {
    totalToras: agrupamentos.value.reduce((sum, item) => sum + item.quantidade_de_toras, 0),
    pesoTotal: parseFloat(agrupamentos.value.reduce((sum, item) => sum + item.peso, 0).toFixed(1)),
    mediaPeso: parseFloat((agrupamentos.value.reduce((sum, item) => sum + item.peso, 0) / agrupamentos.value.length).toFixed(1))
  }
})

const carregarAgrupamentos = async () => {
  loading.value = true
  try {
    const dadosAPI = await apiBuscar()
    const dadosLocal = JSON.parse(localStorage.getItem('agrupamentos') || '[]')
    const todosAgrupamentos = []
    if (dadosAPI && Array.isArray(dadosAPI)) {
      todosAgrupamentos.push(...dadosAPI)
    }
    dadosLocal.forEach(itemLocal => {
      if (!todosAgrupamentos.find(item => item.id === itemLocal.id)) {
        todosAgrupamentos.push(itemLocal)
      }
    })
    agrupamentos.value = todosAgrupamentos
  } catch (error) {
    console.error('Erro ao carregar agrupamentos:', error)
    const dadosLocal = JSON.parse(localStorage.getItem('agrupamentos') || '[]')
    agrupamentos.value = dadosLocal
    $q.notify({
      type: 'warning',
      message: 'Carregados dados locais. Erro na conexão com servidor.'
    })
  } finally {
    loading.value = false
  }
}

const filtrarAgrupamentos = () => {}

const abrirModalCadastro = () => {
  modoEdicao.value = false
  formData.value = {}
  modalVisivel.value = true
}

const abrirEdicao = (agrupamento) => {
  modoEdicao.value = true
  formData.value = { ...agrupamento }
  modalVisivel.value = true
}

const fecharModal = () => {
  modalVisivel.value = false
  formData.value = {}
}

const salvarAgrupamento = async (dados) => {
  salvando.value = true
  try {
    let result
    if (modoEdicao.value) {
      result = await apiEditar(dados.id, dados)
      if (!result.error) {
        const agrupamentosLocal = JSON.parse(localStorage.getItem('agrupamentos') || '[]')
        const index = agrupamentosLocal.findIndex(item => item.id === dados.id)
        if (index !== -1) {
          agrupamentosLocal[index] = { ...dados, updatedAt: new Date().toISOString() }
          localStorage.setItem('agrupamentos', JSON.stringify(agrupamentosLocal))
        }
        $q.notify({
          type: 'positive',
          message: 'Agrupamento atualizado com sucesso!'
        })
      }
    } else {
      const jaExiste = agrupamentos.value.find(item => item.id === dados.id)
      if (jaExiste) {
        formulario.value?.showMessage('ID já existe. Use um ID diferente.', 'error')
        return
      }
      result = await apiCadastrar(dados)
      if (!result.error) {
        const agrupamentosLocal = JSON.parse(localStorage.getItem('agrupamentos') || '[]')
        agrupamentosLocal.push({
          ...dados,
          createdAt: new Date().toISOString()
        })
        localStorage.setItem('agrupamentos', JSON.stringify(agrupamentosLocal))
        $q.notify({
          type: 'positive',
          message: 'Agrupamento cadastrado com sucesso!'
        })
      }
    }
    if (result.error) {
      formulario.value?.showMessage(result.error, 'error')
    } else {
      modalVisivel.value = false
      carregarAgrupamentos()
    }
  } catch (error) {
    console.error('Erro ao salvar agrupamento:', error)
    formulario.value?.showMessage('Erro ao salvar agrupamento', 'error')
  } finally {
    salvando.value = false
  }
}

const confirmarExclusao = (agrupamento) => {
  $q.dialog({
    title: 'Confirmar Exclusão',
    message: `Deseja realmente excluir o agrupamento #${agrupamento.id}?`,
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      const result = await apiDeletar(agrupamento.id)
      if (!result.error) {
        const agrupamentosLocal = JSON.parse(localStorage.getItem('agrupamentos') || '[]')
        const novoArray = agrupamentosLocal.filter(item => item.id !== agrupamento.id)
        localStorage.setItem('agrupamentos', JSON.stringify(novoArray))
        $q.notify({
          type: 'positive',
          message: 'Agrupamento excluído com sucesso!'
        })
        carregarAgrupamentos()
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

const abrirModalFrete = (agrupamento) => {
  agrupamentoSelecionado.value = agrupamento
  cepDestino.value = ''
  modalFreteVisivel.value = true
}

const calcularFrete = async () => {
  if (!cepDestino.value || !agrupamentoSelecionado.value) return
  calculandoFrete.value = true
  try {
    const resultado = await apiCalcularFrete({
      ...agrupamentoSelecionado.value,
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

const verDetalhes = (agrupamento) => {
  router.push({ name: 'agrupamento-detalhes', params: { id: agrupamento.id } })
}

onMounted(() => {
  carregarAgrupamentos()
})
</script>

<style scoped>
.page-agrupamentos {
  min-height: 100vh;
  background: linear-gradient(180deg, #f8f9fa 0%, #e9ecef 100%);
}

.agrupamentos-header {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.bg-gradient-green {
  background: linear-gradient(135deg, #52c41a 0%, #389e0d 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 1rem;
}

.filtros-section {
  border-bottom: 1px solid #e9ecef;
}

.opacity-90 {
  opacity: 0.9;
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

.agrupamentos-content .row > div {
  animation: fadeInUp 0.5s ease-out forwards;
}

@media (max-width: 768px) {
  .agrupamentos-header {
    padding: 1.5rem 0;
  }

  .text-h3 {
    font-size: 1.8rem !important;
  }

  .q-gutter-xs > * {
    margin: 2px;
  }
}
</style>
