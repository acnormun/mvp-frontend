<template>
  <q-card
    class="card-info"
    :class="{
      'card-clickable': clickable,
      'card-loading': loading
    }"
    @click="handleClick"
  >
    <q-tooltip v-if="tooltip" class="bg-dark">
      {{ tooltip }}
    </q-tooltip>

    <q-card-section class="card-header">
      <div class="row items-center no-wrap">
        <div class="col">
          <div class="card-title">{{ title }}</div>
          <div v-if="description" class="card-description">
            {{ description }}
          </div>
        </div>
        <div class="col-auto">
          <q-icon
            :name="icon"
            :color="iconColor"
            size="2rem"
            class="card-icon"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="card-content">
      <div v-if="loading" class="loading-container">
        <q-skeleton type="text" class="text-h4" />
        <q-skeleton v-if="valueSuffix" type="text" width="60%" />
      </div>
      <div v-else class="value-container">
        <div class="card-value">
          {{ formattedValue }}
          <span v-if="valueSuffix" class="value-suffix">{{ valueSuffix }}</span>
        </div>
      </div>
    </q-card-section>

    <q-card-actions v-if="showActions" class="card-actions">
      <q-btn
        :label="actionLabel"
        :color="iconColor"
        flat
        no-caps
        class="full-width"
        @click.stop="$emit('action')"
      />
    </q-card-actions>

    <q-inner-loading :showing="loading">
      <q-spinner-dots size="40px" color="primary" />
    </q-inner-loading>
  </q-card>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  title: {
    type: String,
    required: true
  },
  value: {
    type: [Number, String],
    default: 0
  },
  valueSuffix: {
    type: String,
    default: ''
  },
  description: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: 'info'
  },
  iconColor: {
    type: String,
    default: 'primary'
  },
  loading: {
    type: Boolean,
    default: false
  },
  clickable: {
    type: Boolean,
    default: false
  },
  tooltip: {
    type: String,
    default: ''
  },
  showActions: {
    type: Boolean,
    default: false
  },
  actionLabel: {
    type: String,
    default: 'Ação'
  }
})

const emit = defineEmits(['click', 'action'])

const formattedValue = computed(() => {
  if (typeof props.value === 'number') {
    return props.value.toLocaleString('pt-BR')
  }
  return props.value
})

const handleClick = () => {
  if (props.clickable && !props.loading) {
    emit('click')
  }
}
</script>

<style scoped>
.card-info {
  height: 100%;
  min-height: 180px;
  display: flex;
  flex-direction: column;
  transition: all 0.3s ease;
  border-radius: 12px;
  box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(0, 0, 0, 0.05);
  position: relative;
  overflow: hidden;
}

.card-info:hover {
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.12);
  transform: translateY(-2px);
}

.card-clickable {
  cursor: pointer;
}

.card-clickable:hover {
  box-shadow: 0 6px 24px rgba(0, 0, 0, 0.15);
  transform: translateY(-4px);
}

.card-clickable:active {
  transform: translateY(-1px);
  transition: transform 0.1s ease;
}

.card-header {
  padding: 16px 20px 8px 20px;
  flex-shrink: 0;
}

.card-title {
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  line-height: 1.4;
  margin-bottom: 4px;
}

.card-description {
  font-size: 12px;
  color: #6B7280;
  line-height: 1.3;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.card-icon {
  opacity: 0.8;
  transition: all 0.3s ease;
}

.card-clickable:hover .card-icon {
  opacity: 1;
  transform: scale(1.1);
}

.card-content {
  flex: 1;
  display: flex;
  align-items: center;
  padding: 8px 20px 16px 20px;
}

.loading-container {
  width: 100%;
}

.value-container {
  width: 100%;
  text-align: left;
}

.card-value {
  font-size: 2rem;
  font-weight: 700;
  color: #111827;
  line-height: 1.2;
  word-break: break-word;
}

.value-suffix {
  font-size: 0.9rem;
  font-weight: 500;
  color: #6B7280;
  margin-left: 4px;
}

.card-actions {
  padding: 0 16px 16px 16px;
  flex-shrink: 0;
}

.card-loading {
  pointer-events: none;
}

@media (max-width: 1024px) {
  .card-info {
    min-height: 160px;
  }

  .card-value {
    font-size: 1.75rem;
  }
}

@media (max-width: 768px) {
  .card-info {
    min-height: 140px;
  }

  .card-value {
    font-size: 1.5rem;
  }

  .card-header {
    padding: 12px 16px 6px 16px;
  }

  .card-content {
    padding: 6px 16px 12px 16px;
  }

  .card-actions {
    padding: 0 12px 12px 12px;
  }
}

@media (max-width: 480px) {
  .card-info {
    min-height: 120px;
  }

  .card-value {
    font-size: 1.25rem;
  }

  .card-title {
    font-size: 13px;
  }
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

.card-info {
  animation: fadeInUp 0.4s ease-out;
}

.card-clickable::before {
  content: '';
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: linear-gradient(135deg, transparent 0%, rgba(99, 102, 241, 0.02) 100%);
  opacity: 0;
  transition: opacity 0.3s ease;
  pointer-events: none;
}

.card-clickable:hover::before {
  opacity: 1;
}

.card-clickable::after {
  content: '';
  position: absolute;
  top: 0;
  right: 0;
  width: 0;
  height: 0;
  border-left: 12px solid transparent;
  border-top: 12px solid rgba(99, 102, 241, 0.1);
  opacity: 0;
  transition: opacity 0.3s ease;
}

.card-clickable:hover::after {
  opacity: 1;
}
</style>
