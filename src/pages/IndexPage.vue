<template>
  <q-page class="q-pa-md">
    <div class="row items-center q-mb-md">
      <q-btn label="Novo Agrupamento" color="primary" @click="abrirModalCadastro" />
    </div>
    <q-table
      title="Agrupamentos"
      :rows="agrupamentos"
      :columns="columns"
      row-key="id"
      flat bordered
      >
    <template v-slot:body-cell-actions="props">
      <q-td align="center" >
        <q-btn
          flat
          dense
          color="primary"
          icon="edit"
          @click="abrirEdicao(props.row)"
        />
        <q-btn
          flat
          dense
          color="negative"
          icon="delete"
          @click="excluirAgrupamento(props.row.id)"
        />
        <q-btn
          dense
          color="deep-orange"
          icon="map"
          @click="() => { modalFreteVisivel = true; agrupamentoSelecionado = props.row }"
        />
      </q-td>
    </template>
    </q-table>

    <!-- Modal Cadastro / Edição -->
    <q-dialog v-model="modalVisivel">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">{{ modoEdicao ? 'Editar' : 'Cadastrar' }} Agrupamento</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="form.id" label="ID" type="number" :disable="modoEdicao" />
          <q-input v-model="form.quantidade_de_toras" label="Quantidade de Toras" type="number" />
          <q-input v-model="form.peso" label="Peso (kg)" type="number" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn flat label="Salvar" color="primary" @click="salvarAgrupamento" />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <q-dialog v-model="modalFreteVisivel">
      <q-card style="min-width: 350px">
        <q-card-section>
          <div class="text-h6">Calcular Frete</div>
        </q-card-section>

        <q-card-section>
          <q-input v-model="cepDestino" label="CEP de Destino" mask="#####-###" />
        </q-card-section>

        <q-card-actions align="right">
          <q-btn flat label="Cancelar" color="primary" v-close-popup />
          <q-btn :loading="carregandoFrete" flat label="Calcular" color="deep-orange" @click="calcularFrete(agrupamentoSelecionado)" />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </q-page>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import {
  cadastrarAgrupamento as apiCadastrar,
  deletarAgrupamento as apiDeletar,
  editarAgrupamento as apiEditar,
  buscarAgrupamentos as apiBuscar,
  calcularFrete as apiCalcularFrete
} from '../api/agrupamento.js'
import { Notify } from 'quasar'

const agrupamentos = ref([])
const modalVisivel = ref(false)
const modoEdicao = ref(false)
const cepDestino = ref('')
const modalFreteVisivel = ref(false)
const agrupamentoSelecionado = ref(null)
const carregandoFrete = ref(false)
const form = ref({ id: '', quantidade_de_toras: '', peso: '' })

const columns = [
  { name: 'id', label: 'ID', align: 'left', field: 'id' },
  { name: 'quantidade_de_toras', label: 'Toras', align: 'left', field: 'quantidade_de_toras' },
  { name: 'peso', label: 'Peso (kg)', align: 'left', field: 'peso' },
  { name: 'actions', label: 'Ações', align: 'center', field: 'actions', sortable: false }
]

const abrirModalCadastro = () => {
  modoEdicao.value = false
  form.value = { id: '', quantidade_de_toras: '', peso: '' }
  modalVisivel.value = true
}

const abrirEdicao = (agrupamento) => {
  modoEdicao.value = true
  form.value = { ...agrupamento }
  modalVisivel.value = true
}

const salvarAgrupamento = async () => {

    if (modoEdicao.value) {
     const {error} = await apiEditar(form.value.id, form.value)
     if(error) {
      Notify.create({
        type: 'negative',
        message: error
      })
     }
    } else {
      const {error} = await apiCadastrar(form.value)
      if(error) {
        Notify.create({
          type: 'negative',
          message: error
        })
      }
    }

    modalVisivel.value = false
    await apiBuscar().then((data) => {
      agrupamentos.value = data
    })
    Notify.create({
      type: 'positive',
      message: 'Agrupamento salvo com sucesso!'
    })
}

const excluirAgrupamento = async (id) => {
    const {error} = await apiDeletar(id)
    if(error) {
      Notify.create({
        type: 'negative',
        message: error
      })
    }
    await apiBuscar().then((data) => {
      agrupamentos.value = data
    })
    Notify.create({
      type: 'positive',
      message: 'Agrupamento excluído com sucesso!'
    })
}

const calcularFrete = async (agrupamento) => {
    carregandoFrete.value = true
    const origem = '30130-010'
    const destino = cepDestino.value

    const body = {
      cep_origem: origem,
      cep_destino: destino,
      peso: agrupamento.peso
    }

    const {data, error} = await apiCalcularFrete(body)
    console.log('data', data)

    if(error) {
      Notify.create({
        type: 'negative',
        message: error
      })
    } else {
      console.log('aquii')
      Notify.create({
        type: 'info',
        message: `Distância: ${data.distancia_km} km | Frete estimado: R$ ${data.valor_frete > 0 ? data.valor_frete.toFixed(2) : '0,00'}`
      })
      carregandoFrete.value = false
      modalFreteVisivel.value = false
    }

}


onMounted(() => {
  apiBuscar().then((data) => {
    agrupamentos.value = data
  })
})
</script>

<style scoped>
.q-page {
  max-width: 900px;
  margin: 0 auto;
}
</style>