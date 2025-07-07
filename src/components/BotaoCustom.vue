<template>
  <q-btn
    :class="buttonClass"
    :color="color"
    :text-color="textColor"
    :size="size"
    :loading="loading"
    :disable="disable"
    :outline="outline"
    :flat="flat"
    :round="round"
    :fab="fab"
    :icon="icon"
    :icon-right="iconRight"
    :label="label"
    :no-caps="noCaps"
    :ripple="ripple"
    @click="handleClick"
    v-bind="$attrs"
  >
    <slot />
    <q-tooltip
      v-if="tooltip"
      class="bg-grey-9"
      :delay="tooltipDelay"
    >
      {{ tooltip }}
    </q-tooltip>
    <q-badge
      v-if="badge"
      :color="badgeColor"
      :text-color="badgeTextColor"
      floating
      rounded
    >
      {{ badge }}
    </q-badge>
  </q-btn>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  label: {
    type: String,
    default: ''
  },
  icon: {
    type: String,
    default: ''
  },
  iconRight: {
    type: String,
    default: ''
  },
  color: {
    type: String,
    default: 'primary'
  },
  textColor: {
    type: String,
    default: ''
  },
  size: {
    type: String,
    default: 'md'
  },
  loading: {
    type: Boolean,
    default: false
  },
  disable: {
    type: Boolean,
    default: false
  },
  outline: {
    type: Boolean,
    default: false
  },
  flat: {
    type: Boolean,
    default: false
  },
  round: {
    type: Boolean,
    default: false
  },
  fab: {
    type: Boolean,
    default: false
  },
  noCaps: {
    type: Boolean,
    default: true
  },
  ripple: {
    type: Boolean,
    default: true
  },
  tooltip: {
    type: String,
    default: ''
  },
  tooltipDelay: {
    type: Number,
    default: 500
  },
  badge: {
    type: [String, Number],
    default: ''
  },
  badgeColor: {
    type: String,
    default: 'red'
  },
  badgeTextColor: {
    type: String,
    default: 'white'
  },
  variant: {
    type: String,
    default: 'default',
    validator: (value) => ['default', 'success', 'warning', 'danger', 'info', 'gradient'].includes(value)
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  animated: {
    type: Boolean,
    default: false
  }
})

const emit = defineEmits(['click'])

const buttonClass = computed(() => {
  const classes = []
  if (props.variant !== 'default') {
    classes.push(`btn-${props.variant}`)
  }
  if (props.fullWidth) {
    classes.push('full-width')
  }
  if (props.animated) {
    classes.push('btn-animated')
  }
  return classes.join(' ')
})

const handleClick = (event) => {
  if (!props.disable && !props.loading) {
    emit('click', event)
  }
}
</script>

<style scoped>
.btn-success {
  background: linear-gradient(135deg, #00e676 0%, #00c853 100%);
  color: white;
}

.btn-success:hover {
  background: linear-gradient(135deg, #00c853 0%, #009624 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(0, 200, 83, 0.4);
}

.btn-warning {
  background: linear-gradient(135deg, #ffc107 0%, #ff8f00 100%);
  color: #fff;
}

.btn-warning:hover {
  background: linear-gradient(135deg, #ff8f00 0%, #e65100 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(255, 143, 0, 0.4);
}

.btn-danger {
  background: linear-gradient(135deg, #f44336 0%, #d32f2f 100%);
  color: white;
}

.btn-danger:hover {
  background: linear-gradient(135deg, #d32f2f 0%, #b71c1c 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(211, 47, 47, 0.4);
}

.btn-info {
  background: linear-gradient(135deg, #2196f3 0%, #1976d2 100%);
  color: white;
}

.btn-info:hover {
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(25, 118, 210, 0.4);
}

.btn-gradient {
  background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
  color: white;
}

.btn-gradient:hover {
  background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(118, 75, 162, 0.4);
}

.btn-animated {
  transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
  position: relative;
  overflow: hidden;
}

.btn-animated:before {
  content: '';
  position: absolute;
  top: 0;
  left: -100%;
  width: 100%;
  height: 100%;
  background: linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent);
  transition: left 0.5s;
}

.btn-animated:hover:before {
  left: 100%;
}

.btn-animated:hover {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(0, 0, 0, 0.15);
}

.btn-animated:active {
  transform: translateY(0);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
}

.full-width {
  width: 100%;
}

.q-btn:not(.q-btn--disable):hover {
  transition: all 0.3s ease;
}
</style>
