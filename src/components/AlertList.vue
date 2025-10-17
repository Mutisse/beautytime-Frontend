<!-- src/components/AlertList.vue -->
<template>
  <div class="alert-list">
    <div class="alert-list__header">
      <h3>Alertas do Sistema</h3>
      <q-badge color="red" v-if="alerts && alerts.length > 0">
        {{ alerts.length }}
      </q-badge>
    </div>

    <div v-if="!alerts || alerts.length === 0" class="no-alerts">
      <q-icon name="check_circle" size="2rem" color="#4caf50" />
      <div class="no-alerts-text">Nenhum alerta no momento</div>
    </div>

    <div v-else class="alert-list__items">
      <div
        v-for="alert in alerts.slice(0, 5)"
        :key="alert.id"
        class="alert-list__item"
        :class="`alert-list__item--${alert.severity}`"
      >
        <q-icon :name="getAlertIcon(alert.severity)" class="alert-list__icon" />
        <div class="alert-list__content">
          <div class="alert-list__title">{{ alert.title }}</div>
          <div class="alert-list__message">{{ alert.message }}</div>
          <div class="alert-list__time">{{ formatTime(alert.timestamp) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { SystemAlert } from 'src/types/analytics';

interface Props {
  alerts?: SystemAlert[];
}

defineProps<Props>();

const getAlertIcon = (severity: string) => {
  switch (severity) {
    case 'critical':
      return 'error';
    case 'warning':
      return 'warning';
    default:
      return 'info';
  }
};

const formatTime = (timestamp: string) => {
  return new Date(timestamp).toLocaleTimeString('pt-BR');
};
</script>

<style scoped lang="scss">
.alert-list {
  &__header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 1rem;
    
    h3 {
      margin: 0;
      font-size: 1.1rem;
      font-weight: 600;
    }
  }

  &__items {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
  }

  &__item {
    display: flex;
    align-items: flex-start;
    gap: 0.75rem;
    padding: 1rem;
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.05);
    border-left: 4px solid;

    &--critical {
      border-left-color: #f44336;
      background: rgba(244, 67, 54, 0.1);
    }

    &--warning {
      border-left-color: #ff9800;
      background: rgba(255, 152, 0, 0.1);
    }

    &--info {
      border-left-color: #2196f3;
      background: rgba(33, 150, 243, 0.1);
    }
  }

  &__icon {
    margin-top: 0.125rem;
    flex-shrink: 0;
  }

  &__content {
    flex: 1;
  }

  &__title {
    font-weight: 600;
    margin-bottom: 0.25rem;
    font-size: 0.9rem;
  }

  &__message {
    font-size: 0.8rem;
    opacity: 0.8;
    margin-bottom: 0.5rem;
    line-height: 1.4;
  }

  &__time {
    font-size: 0.7rem;
    opacity: 0.6;
  }
}

.no-alerts {
  text-align: center;
  padding: 40px 20px;
  color: #7f8c8d;

  .no-alerts-text {
    margin-top: 10px;
    font-weight: 500;
  }
}

@media (max-width: 768px) {
  .alert-list {
    &__item {
      padding: 0.75rem;
    }
    
    &__header {
      h3 {
        font-size: 1rem;
      }
    }
  }
}
</style>