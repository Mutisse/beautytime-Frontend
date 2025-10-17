<!-- src/components/BusinessIntelligenceKPIs.vue -->
<template>
  <div class="bi-kpis">
    <div class="bi-kpis__grid">
      <div class="kpi-item">
        <div class="kpi-header">
          <q-icon name="person" size="sm" />
          <span class="kpi-title">CLV</span>
        </div>
        <div class="kpi-value">{{ formatCurrency(kpis?.customerLifetimeValue || 0) }}</div>
        <div class="kpi-label">Valor do Cliente</div>
      </div>

      <div class="kpi-item">
        <div class="kpi-header">
          <q-icon name="trending_down" size="sm" />
          <span class="kpi-title">Churn</span>
        </div>
        <div class="kpi-value">{{ (kpis?.churnRate || 0).toFixed(1) }}%</div>
        <div class="kpi-label">Taxa de Cancelamento</div>
      </div>

      <div class="kpi-item">
        <div class="kpi-header">
          <q-icon name="savings" size="sm" />
          <span class="kpi-title">CAC</span>
        </div>
        <div class="kpi-value">{{ formatCurrency(kpis?.acquisitionCost || 0) }}</div>
        <div class="kpi-label">Custo de Aquisição</div>
      </div>

      <div class="kpi-item">
        <div class="kpi-header">
          <q-icon name="workspace_premium" size="sm" />
          <span class="kpi-title">Produtividade</span>
        </div>
        <div class="kpi-value">{{ (kpis?.employeeProductivity || 0).toFixed(1) }}%</div>
        <div class="kpi-label">Eficiência</div>
      </div>
    </div>

    <!-- Insights -->
    <div v-if="kpis" class="kpi-insights">
      <div class="text-caption text-weight-medium q-mb-xs">Insights:</div>
      <div class="insights-list">
        <div 
          v-for="insight in getInsights()" 
          :key="insight.text"
          class="insight-item"
        >
          <q-icon :name="insight.icon" :color="insight.color" size="xs" />
          <span class="q-ml-xs">{{ insight.text }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
export interface BusinessIntelligenceKPIs {
  customerLifetimeValue: number;
  churnRate: number;
  acquisitionCost: number;
  employeeProductivity: number;
}

interface Props {
  kpis?: BusinessIntelligenceKPIs;
}

interface Insight {
  text: string;
  icon: string;
  color: 'positive' | 'negative' | 'warning' | 'info';
}

const props = defineProps<Props>();

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const getInsights = (): Insight[] => {
  const insights: Insight[] = [];
  
  if (!props.kpis) return insights;

  // Insight baseado no CLV
  if (props.kpis.customerLifetimeValue > 1000) {
    insights.push({
      text: 'CLV alto - clientes valiosos',
      icon: 'trending_up',
      color: 'positive'
    });
  } else if (props.kpis.customerLifetimeValue < 300) {
    insights.push({
      text: 'CLV baixo - revisar estratégia',
      icon: 'trending_down',
      color: 'warning'
    });
  }

  // Insight baseado no churn rate
  if (props.kpis.churnRate < 5) {
    insights.push({
      text: 'Baixa rotatividade de clientes',
      icon: 'thumb_up',
      color: 'positive'
    });
  } else if (props.kpis.churnRate > 15) {
    insights.push({
      text: 'Alta taxa de cancelamento',
      icon: 'warning',
      color: 'negative'
    });
  }

  // Insight baseado no CAC
  if (props.kpis.acquisitionCost > 500) {
    insights.push({
      text: 'CAC elevado - otimizar marketing',
      icon: 'savings',
      color: 'warning'
    });
  }

  // Insight baseado na produtividade
  if (props.kpis.employeeProductivity > 80) {
    insights.push({
      text: 'Alta produtividade da equipe',
      icon: 'workspace_premium',
      color: 'positive'
    });
  } else if (props.kpis.employeeProductivity < 50) {
    insights.push({
      text: 'Baixa produtividade - treinamento necessário',
      icon: 'engineering',
      color: 'warning'
    });
  }

  // Insight sobre relação CLV/CAC
  if (props.kpis.customerLifetimeValue > 0 && props.kpis.acquisitionCost > 0) {
    const clvCacRatio = props.kpis.customerLifetimeValue / props.kpis.acquisitionCost;
    if (clvCacRatio > 3) {
      insights.push({
        text: 'Excelente ROI em aquisição',
        icon: 'star',
        color: 'positive'
      });
    } else if (clvCacRatio < 1) {
      insights.push({
        text: 'ROI negativo - revisar aquisição',
        icon: 'dangerous',
        color: 'negative'
      });
    }
  }

  return insights.slice(0, 3); // Limita a 3 insights
};
</script>

<style scoped lang="scss">
.bi-kpis {
  &__grid {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 1rem;
    margin-bottom: 1rem;
  }
}

.kpi-item {
  padding: 1rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  text-align: center;
  
  .kpi-header {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
    margin-bottom: 0.5rem;
  }
  
  .kpi-title {
    font-size: 0.8rem;
    font-weight: 600;
    text-transform: uppercase;
  }
  
  .kpi-value {
    font-size: 1.25rem;
    font-weight: bold;
    margin: 0.5rem 0;
  }
  
  .kpi-label {
    font-size: 0.75rem;
    opacity: 0.8;
  }
}

.kpi-insights {
  .insights-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .insight-item {
    display: flex;
    align-items: center;
    font-size: 0.8rem;
    padding: 0.5rem;
    background: rgba(255, 255, 255, 0.05);
    border-radius: 4px;
  }
}

@media (max-width: 768px) {
  .bi-kpis__grid {
    grid-template-columns: 1fr;
  }
}
</style>