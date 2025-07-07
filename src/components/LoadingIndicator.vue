<template>
  <div v-if="show" :class="containerClass">
    <div v-if="overlay" class="loading-overlay">
      <div class="loading-content">
        <LoadingSpinner
          :type="spinnerType"
          :size="size"
          :color="color"
        />
        <div v-if="message" class="loading-message">
          {{ message }}
        </div>
      </div>
    </div>
    <div v-else class="loading-inline">
      <LoadingSpinner
        :type="spinnerType"
        :size="size"
        :color="color"
      />
      <div v-if="message" class="loading-message q-ml-md">
        {{ message }}
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  show: {
    type: Boolean,
    default: false
  },
  message: {
    type: String,
    default: ''
  },
  overlay: {
    type: Boolean,
    default: false
  },
  type: {
    type: String,
    default: 'dots',
    validator: (value) => ['dots', 'spinner', 'bars', 'pulse', 'orbit'].includes(value)
  },
  size: {
    type: String,
    default: 'md'
  },
  color: {
    type: String,
    default: 'primary'
  },
  fullPage: {
    type: Boolean,
    default: false
  }
})

const containerClass = computed(() => ({
  'loading-container': true,
  'loading-fullpage': props.fullPage
}))

const spinnerType = computed(() => props.type)
</script>

<script>
export const LoadingSpinner = {
  name: 'LoadingSpinner',
  props: {
    type: {
      type: String,
      default: 'dots'
    },
    size: {
      type: String,
      default: 'md'
    },
    color: {
      type: String,
      default: 'primary'
    }
  },
  computed: {
    spinnerSize() {
      const sizes = {
        xs: '20px',
        sm: '30px',
        md: '40px',
        lg: '60px',
        xl: '80px'
      }
      return sizes[this.size] || sizes.md
    },
    spinnerComponent() {
      const components = {
        dots: 'q-spinner-dots',
        spinner: 'q-spinner',
        bars: 'q-spinner-bars',
        pulse: 'q-spinner-pulse',
        orbit: 'q-spinner-orbit'
      }
      return components[this.type] || components.dots
    }
  },
  template: `
    <component
      :is="spinnerComponent"
      :size="spinnerSize"
      :color="color"
    />
  `
}
</script>

<style scoped>
.loading-container {
  display: flex;
  align-items: center;
  justify-content: center;
}

.loading-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

.loading-fullpage {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(255, 255, 255, 0.9);
  z-index: 9998;
}

.loading-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  background: white;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.1);
  max-width: 300px;
  text-align: center;
}

.loading-inline {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.loading-message {
  margin-top: 1rem;
  font-size: 14px;
  color: #666;
  font-weight: 500;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: scale(0.9);
  }
  to {
    opacity: 1;
    transform: scale(1);
  }
}

.loading-content {
  animation: fadeIn 0.3s ease-out;
}

.loading-overlay {
  animation: fadeIn 0.2s ease-out;
}

@media (max-width: 480px) {
  .loading-content {
    max-width: 280px;
    padding: 1.5rem;
  }

  .loading-message {
    font-size: 13px;
  }
}
</style>
