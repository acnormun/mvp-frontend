import axios from 'axios'

const API_URL = 'http://127.0.0.1:5000'

export async function buscarAgrupamentos() {
  const { data } = await axios.get(`${API_URL}/buscar_agrupamentos`)
  return data
}

export async function cadastrarAgrupamento(payload) {
  try {
    await axios.post(`${API_URL}/cadastrar_agrupamento`, payload)
    return { success: 'Agrupamento cadastrado com sucesso!' }
  } catch (error) {
    console.log('error', error)
    return { error: 'Erro ao cadastrar agrupamento.' }
  }
}

export async function deletarAgrupamento(id) {
  try {
    await axios.delete(`${API_URL}/deletar_agrupamento/${id}`)
    return { success: 'Agrupamento excluído com sucesso!' }
  } catch (error) {
    return { error: 'Erro ao excluir agrupamento.' }
  }
}

export async function abrirEdicao(id) {
  try {
    const { data: agrupamentos } = await axios.get(`${API_URL}/buscar_agrupamentos`)
    const agrupamento = agrupamentos.find((item) => item.id === id)

    if (agrupamento) {
      document.getElementById('editId').value = agrupamento.id
      document.getElementById('editQuantidade').value = agrupamento.quantidade_de_toras
      document.getElementById('editPeso').value = agrupamento.peso

      new bootstrap.Modal(document.getElementById('editModal')).show()

      document.getElementById('editForm').onsubmit = function (event) {
        event.preventDefault()
        editarAgrupamento(agrupamento.id)
      }
    }
  } catch (error) {
    return { error: 'Erro ao abrir edição.' }
  }
}

export async function editarAgrupamento(id, payload) {

  try {
    await axios.put(`${API_URL}/editar_agrupamento/${id}`, payload)
    return { success: 'Agrupamento atualizado com sucesso!' }
  } catch (error) {
    return { error: 'Erro ao editar agrupamento.' }
  }
}

export async function calcularFrete(agrupamento) {
  try {
    const { data } = await axios.post(`${API_URL}/calcular_frete`, {
      cep_origem: '78050269',
      cep_destino: agrupamento.cep_destino
    })

    console.log('data', data, agrupamento)
    const valorFrete = data.distancia_km * agrupamento.peso * 0.05
    console.log('valorFrete', valorFrete)
    return { data: { valor_frete: valorFrete, distancia_km: data.distancia_km } }
  } catch (error) {
    return { error: 'Erro ao calcular frete.' }
  }
}

