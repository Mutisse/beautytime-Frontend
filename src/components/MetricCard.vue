<!-- src/components/MetricCard.vue -->
<template>
  <div
    class="metric-card"
    :class="[
      `metric-card--${type}`,
      { 'metric-card--success': trendType === 'positive' },
      { 'metric-card--warning': trendType === 'negative' },
      { 'metric-card--info': trendType === 'neutral' },
    ]"
  >
    <div class="metric-card__header">
      <h3 class="metric-card__title">{{ title }}</h3>
      <q-icon :name="icon" class="metric-card__icon" />
    </div>

    <div class="metric-card__value">{{ value }}</div>
    <p class="metric-card__label">{{ label }}</p>

    <div v-if="trend" class="metric-card__trend" :class="`metric-card__trend--${trendType}`">
      <q-icon :name="trendIcon" class="q-mr-xs" />
      {{ trend }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

interface Props {
  title: string;
  value: string | number;
  icon: string; // Quasar icon name as string
  trend?: string;
  trendType?: 'positive' | 'negative' | 'neutral';
  type?: 'primary' | 'default';
  label?: string;
}

const props = withDefaults(defineProps<Props>(), {
  trendType: 'neutral',
  type: 'default',
  label: '',
});

const trendIcon = computed(() => {
  switch (props.trendType) {
    case 'positive':
      return 'arrow_upward';
    case 'negative':
      return 'arrow_downward';
    default:
      return 'remove';
  }
});
</script>

<style scoped lang="scss">
.metric-card {
  // Estilos permanecem os mesmos do SCSS anterior
  background: rgba(255, 255, 255, 0.95);
  border-radius: 15px;
  padding: 25px;
  box-shadow:
    0 10px 30px rgba(0, 0, 0, 0.1),
    0 1px 8px rgba(0, 0, 0, 0.05);
  transition: all 0.3s ease;
  border: 1px solid rgba(255, 255, 255, 0.3);
  position: relative;
  overflow: hidden;

  @supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
    background: rgba(255, 255, 255, 0.85);
    backdrop-filter: blur(10px);
    -webkit-backdrop-filter: blur(10px);
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow:
      0 20px 40px rgba(0, 0, 0, 0.15),
      0 3px 12px rgba(0, 0, 0, 0.08);
  }

  &--primary {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;

    @supports (backdrop-filter: blur(10px)) or (-webkit-backdrop-filter: blur(10px)) {
      background: linear-gradient(
        135deg,
        rgba(102, 126, 234, 0.9) 0%,
        rgba(118, 75, 162, 0.9) 100%
      );
      backdrop-filter: blur(10px);
      -webkit-backdrop-filter: blur(10px);
    }

    .metric-card__value,
    .metric-card__title {
      color: white;
    }

    .metric-card__label {
      color: rgba(255, 255, 255, 0.9);
    }
  }

  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 15px;
  }

  &__title {
    font-size: 1.1rem;
    font-weight: 600;
    margin: 0;
    color: #2c3e50;
  }

  &__icon {
    font-size: 1.5rem;
    opacity: 0.8;
    filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.1));
  }

  &__value {
    font-size: 2.5rem;
    font-weight: 700;
    margin: 10px 0;
    color: #2c3e50;
    text-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  }

  &__label {
    font-size: 0.9rem;
    color: #7f8c8d;
    margin: 0;
    font-weight: 400;
  }

  &__trend {
    display: flex;
    align-items: center;
    margin-top: 10px;
    font-size: 0.9rem;
    font-weight: 500;

    &--positive {
      color: #4caf50;
    }

    &--negative {
      color: #f44336;
    }

    &--neutral {
      color: #ff9800;
    }
  }
}
</style>
