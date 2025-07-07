<template>
  <q-form
    @submit="handleSubmit"
    class="q-gutter-md"
  >
    <div
      v-for="field in fieldsArray"
      :key="field.name"
      class="form-field"
    >
      <q-input
        v-if="isTextInput(field.type)"
        v-model="formData[field.name]"
        :label="field.label"
        :placeholder="field.placeholder || ''"
        :rules="getFieldRules(field)"
        :type="field.type"
        outlined
        dense
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-icon
            v-if="field.icon"
            :name="field.icon"
          />
        </template>
        <q-tooltip v-if="field.tooltip" class="bg-grey-9">
          {{ field.tooltip }}
        </q-tooltip>
      </q-input>

      <q-input
        v-else-if="field.type === 'number'"
        v-model.number="formData[field.name]"
        :label="field.label"
        :placeholder="field.placeholder || ''"
        :rules="getFieldRules(field)"
        type="number"
        :step="field.step || 'any'"
        :min="field.min"
        :max="field.max"
        outlined
        dense
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-icon
            v-if="field.icon"
            :name="field.icon"
          />
        </template>
        <q-tooltip v-if="field.tooltip" class="bg-grey-9">
          {{ field.tooltip }}
        </q-tooltip>
      </q-input>

      <q-select
        v-else-if="field.type === 'select'"
        v-model="formData[field.name]"
        :options="field.options || []"
        :label="field.label"
        :rules="getFieldRules(field)"
        outlined
        dense
        emit-value
        map-options
        class="q-mb-md"
      >
        <q-tooltip v-if="field.tooltip" class="bg-grey-9">
          {{ field.tooltip }}
        </q-tooltip>
      </q-select>

      <q-input
        v-else-if="field.type === 'textarea'"
        v-model="formData[field.name]"
        :label="field.label"
        :placeholder="field.placeholder || ''"
        :rules="getFieldRules(field)"
        type="textarea"
        :rows="field.rows || 3"
        outlined
        class="q-mb-md"
      >
        <q-tooltip v-if="field.tooltip" class="bg-grey-9">
          {{ field.tooltip }}
        </q-tooltip>
      </q-input>

      <q-input
        v-else-if="field.type === 'date'"
        v-model="formData[field.name]"
        :label="field.label"
        :rules="getFieldRules(field)"
        outlined
        dense
        class="q-mb-md"
      >
        <template v-slot:append>
          <q-icon name="event" class="cursor-pointer">
            <q-popup-proxy cover transition-show="scale" transition-hide="scale">
              <q-date v-model="formData[field.name]">
                <div class="row items-center justify-end">
                  <q-btn v-close-popup label="Fechar" color="primary" flat />
                </div>
              </q-date>
            </q-popup-proxy>
          </q-icon>
        </template>
        <q-tooltip v-if="field.tooltip" class="bg-grey-9">
          {{ field.tooltip }}
        </q-tooltip>
      </q-input>
    </div>

    <div class="row q-gutter-sm q-mt-lg">
      <q-btn
        type="submit"
        :label="submitLabel"
        color="primary"
        :loading="loading"
        :disable="!isFormValid"
        class="flex-1"
      />

      <q-btn
        v-if="showClearButton"
        @click="clearForm"
        label="Limpar"
        color="grey"
        outline
        :disable="loading"
      />

      <q-btn
        v-if="showCancelButton"
        @click="$emit('cancel')"
        label="Cancelar"
        color="negative"
        flat
        :disable="loading"
      />
    </div>

    <div v-if="message" class="q-mt-md">
      <q-banner
        :class="messageClasses"
        rounded
      >
        <template v-slot:avatar>
          <q-icon :name="messageIcon" />
        </template>
        {{ message }}
      </q-banner>
    </div>
  </q-form>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'

const props = defineProps({
  fields: {
    type: Array,
    required: true,
    default: () => []
  },
  initialData: {
    type: Object,
    default: () => ({})
  },
  submitLabel: {
    type: String,
    default: 'Salvar'
  },
  showClearButton: {
    type: Boolean,
    default: true
  },
  showCancelButton: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['submit', 'cancel', 'change'])

const formData = ref({})
const message = ref('')
const messageType = ref('success')

const fieldsArray = computed(() => {
  return Array.isArray(props.fields) ? props.fields : []
})

onMounted(() => {
  initializeForm()
})

watch(() => props.initialData, () => {
  initializeForm()
}, { deep: true })

const initializeForm = () => {
  const data = {}
  fieldsArray.value.forEach(field => {
    if (field && field.name) {
      data[field.name] = props.initialData[field.name] || field.default || (field.type === 'number' ? 0 : '')
    }
  })
  formData.value = data
}

const isFormValid = computed(() => {
  return fieldsArray.value.every(field => {
    if (!field) return true
    if (field.required) {
      const value = formData.value[field.name]
      return value !== null && value !== undefined && value !== ''
    }
    return true
  })
})

const messageClasses = computed(() => {
  const classes = []
  switch (messageType.value) {
    case 'success':
      classes.push('bg-positive', 'text-white')
      break
    case 'error':
      classes.push('bg-negative', 'text-white')
      break
    case 'warning':
      classes.push('bg-warning', 'text-dark')
      break
    case 'info':
      classes.push('bg-info', 'text-white')
      break
  }
  return classes
})

const messageIcon = computed(() => {
  const icons = {
    success: 'check_circle',
    error: 'error',
    warning: 'warning',
    info: 'info'
  }
  return icons[messageType.value] || 'info'
})

const isTextInput = (type) => {
  return ['text', 'email', 'password'].includes(type)
}

const getFieldRules = (field) => {
  if (!field) return []

  const rules = []

  if (field.required) {
    rules.push(val => (val !== null && val !== undefined && val !== '') || `${field.label} é obrigatório`)
  }

  if (field.type === 'email') {
    rules.push(val => !val || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val) || 'Email inválido')
  }

  if (field.minLength) {
    rules.push(val => !val || val.length >= field.minLength || `Mínimo ${field.minLength} caracteres`)
  }

  if (field.maxLength) {
    rules.push(val => !val || val.length <= field.maxLength || `Máximo ${field.maxLength} caracteres`)
  }

  if (field.min !== undefined && field.type === 'number') {
    rules.push(val => val === null || val === undefined || val >= field.min || `Valor mínimo: ${field.min}`)
  }

  if (field.max !== undefined && field.type === 'number') {
    rules.push(val => val === null || val === undefined || val <= field.max || `Valor máximo: ${field.max}`)
  }

  return rules
}

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('submit', { ...formData.value })
  }
}

const clearForm = () => {
  initializeForm()
  message.value = ''
  emit('change', { ...formData.value })
}

const showMessage = (text, type = 'success') => {
  message.value = text
  messageType.value = type

  setTimeout(() => {
    message.value = ''
  }, 5000)
}

watch(formData, (newData) => {
  emit('change', { ...newData })
}, { deep: true })

defineExpose({
  formData,
  showMessage,
  clearForm
})
</script>

<style scoped>
.form-field {
  margin-bottom: 16px;
}
</style>
