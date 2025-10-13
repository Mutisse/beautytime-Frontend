<template>
  <q-card flat class="charts-card q-pa-md">
    <q-card-section class="card-header">
      <div class="text-h6 text-weight-bold">Desempenho e Estatísticas</div>
      <q-btn flat round icon="refresh" size="sm" @click="refreshCharts" class="refresh-btn">
        <q-tooltip>Atualizar gráficos</q-tooltip>
      </q-btn>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row q-col-gutter-xl">
        <!-- Gráfico Principal - Linha -->
        <div class="col-12 col-md-8">
          <div class="chart-header">
            <div class="text-subtitle1 text-weight-medium">Métricas Mensais</div>
            <q-select
              v-model="timeRange"
              :options="timeOptions"
              dense
              outlined
              options-dense
              style="min-width: 120px"
              emit-value
              map-options
            />
          </div>
          <div ref="lineChartContainer" class="chart-wrapper"></div>
        </div>

        <!-- Gráfico Secundário - Pizza/Rosca -->
        <div class="col-12 col-md-4">
          <div class="chart-header">
            <div class="text-subtitle1 text-weight-medium">Distribuição</div>
            <q-btn-toggle
              v-model="chartType"
              :options="[
                { label: 'Pizza', value: 'pie' },
                { label: 'Rosca', value: 'doughnut' },
              ]"
              size="sm"
              flat
              dense
            />
          </div>
          <div ref="pieChartContainer" class="chart-wrapper"></div>
        </div>
      </div>
    </q-card-section>

    <!-- Legenda e Estatísticas Rápidas -->
    <q-card-actions class="q-px-md q-pt-none">
      <div class="row items-center full-width">
        <div class="col-12 col-md-8">
          <div class="legend-items">
            <div v-for="item in legendItems" :key="item.name" class="legend-item">
              <q-icon :name="item.icon" :color="item.color" size="16px" />
              <span class="q-ml-xs text-caption">{{ item.name }}</span>
              <q-badge :color="item.color" class="q-ml-xs">
                {{ item.value }}
              </q-badge>
            </div>
          </div>
        </div>
        <div class="col-12 col-md-4 text-right">
          <div class="text-caption text-grey">Última atualização: {{ lastUpdate }}</div>
        </div>
      </div>
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { onMounted, ref, watch, onUnmounted, computed } from 'vue';
import { useQuasar } from 'quasar';

// Primeiro, vamos definir tipos básicos para evitar dependências problemáticas
interface EChartsInstance {
  setOption: (option: unknown, notMerge?: boolean, lazyUpdate?: boolean) => void;
  resize: () => void;
  dispose: () => void;
}

interface EChartsType {
  init: (dom: HTMLElement, theme?: string, opts?: unknown) => EChartsInstance;
}

// Interfaces para nossos dados
interface ChartDataItem {
  date: string;
  visits: number;
  revenue: number;
  newUsers: number;
  appointments: number;
}

interface SalonDataItem {
  status: string;
  value: number;
  color: string;
}

interface LegendItem {
  name: string;
  value: string;
  color: string;
  icon: string;
}

interface TooltipParam {
  axisValue?: string;
  value: number;
  seriesName?: string;
  color?: string;
  data?: number;
}

const $q = useQuasar();
const lineChartContainer = ref<HTMLElement>();
const pieChartContainer = ref<HTMLElement>();

// Usando tipos específicos em vez de any
let lineChart: EChartsInstance | null = null;
let pieChart: EChartsInstance | null = null;

// Estados reativos
const timeRange = ref('monthly');
const chartType = ref('doughnut');
const isLoading = ref(false);

// Opções de tempo
const timeOptions = [
  { label: 'Diário', value: 'daily' },
  { label: 'Semanal', value: 'weekly' },
  { label: 'Mensal', value: 'monthly' },
  { label: 'Anual', value: 'yearly' },
];

// Dados de exemplo
const chartData = ref<ChartDataItem[]>([
  { date: '2024-01-01', visits: 1542, revenue: 2875000, newUsers: 89, appointments: 345 },
  { date: '2024-02-01', visits: 1896, revenue: 3420000, newUsers: 112, appointments: 412 },
  { date: '2024-03-01', visits: 2104, revenue: 3980000, newUsers: 134, appointments: 487 },
  { date: '2024-04-01', visits: 1954, revenue: 3650000, newUsers: 98, appointments: 423 },
  { date: '2024-05-01', visits: 2432, revenue: 4560000, newUsers: 156, appointments: 534 },
  { date: '2024-06-01', visits: 2678, revenue: 5120000, newUsers: 178, appointments: 589 },
]);

const salonsData = ref<SalonDataItem[]>([
  { status: 'Ativos', value: 187, color: '#21ba45' },
  { status: 'Inativos', value: 23, color: '#f2c037' },
  { status: 'Pendentes', value: 15, color: '#c10015' },
  { status: 'Em análise', value: 8, color: '#9c27b0' },
]);

// Cores
const colors = {
  visits: '#1976d2',
  revenue: '#21ba45',
  newUsers: '#f2c037',
  appointments: '#9c27b0',
  grid: $q.dark.isActive ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
  text: $q.dark.isActive ? '#fff' : '#2c3e50',
};

// Função para formatar valores em Meticais
const formatMetical = (value: number): string => {
  if (value >= 1000000) {
    return `MT ${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `MT ${(value / 1000).toFixed(1)}k`;
  }
  return `MT ${value}`;
};

// Itens da legenda
const legendItems = computed((): LegendItem[] => [
  {
    name: 'Visitas',
    value: chartData.value.reduce((sum, d) => sum + d.visits, 0).toLocaleString('pt-BR'),
    color: colors.visits,
    icon: 'visibility',
  },
  {
    name: 'Receita',
    value: formatMetical(chartData.value.reduce((sum, d) => sum + d.revenue, 0)),
    color: colors.revenue,
    icon: 'attach_money',
  },
  {
    name: 'Novos Usuários',
    value: chartData.value.reduce((sum, d) => sum + d.newUsers, 0).toLocaleString('pt-BR'),
    color: colors.newUsers,
    icon: 'person_add',
  },
  {
    name: 'Agendamentos',
    value: chartData.value.reduce((sum, d) => sum + d.appointments, 0).toLocaleString('pt-BR'),
    color: colors.appointments,
    icon: 'event',
  },
]);

// Última atualização
const lastUpdate = computed((): string => {
  return new Date().toLocaleTimeString('pt-BR', {
    hour: '2-digit',
    minute: '2-digit',
  });
});

const initCharts = async (): Promise<void> => {
  if (!lineChartContainer.value || !pieChartContainer.value) return;

  isLoading.value = true;

  try {
    // Importação correta do ECharts - acessando o default corretamente
    const echartsModule = await import('echarts');
    // O ECharts é exportado como default, então precisamos acessá-lo assim
    const echarts = echartsModule.default as unknown as EChartsType;

    // Destruir gráficos existentes
    if (lineChart) {
      lineChart.dispose();
      lineChart = null;
    }
    if (pieChart) {
      pieChart.dispose();
      pieChart = null;
    }

    // Inicializar gráficos - agora o TypeScript sabe que init existe
    lineChart = echarts.init(lineChartContainer.value);
    pieChart = echarts.init(pieChartContainer.value);

    // Configurar opções
    lineChart.setOption(getLineChartOption());
    pieChart.setOption(getPieChartOption());

    // Adicionar redimensionamento responsivo
    window.addEventListener('resize', handleResize);
  } catch (error) {
    console.error('Erro ao carregar gráficos:', error);
  } finally {
    isLoading.value = false;
  }
};

// Funções de opções com tipos explícitos
const getLineChartOption = (): unknown => {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'axis',
      axisPointer: {
        type: 'shadow',
      },
      formatter: (params: unknown) => {
        const tooltipParams = params as TooltipParam[];
        if (!tooltipParams || !tooltipParams.length) return '';

        const axisValue = tooltipParams[0]?.axisValue || '';
        let result = `<div style="font-weight: bold; margin-bottom: 5px;">${axisValue}</div>`;

        tooltipParams.forEach((item: TooltipParam) => {
          let value = item.value.toString();
          if (item.seriesName === 'Receita') {
            value = formatMetical(item.value);
          }
          result += `
            <div style="display: flex; align-items: center; margin: 5px 0;">
              <span style="display: inline-block; width: 10px; height: 10px; border-radius: 50%; background: ${item.color}; margin-right: 8px;"></span>
              <span style="flex: 1;">${item.seriesName}:</span>
              <span style="font-weight: bold;">${value}</span>
            </div>
          `;
        });
        return result;
      },
    },
    legend: {
      data: ['Visitas', 'Receita', 'Novos Usuários', 'Agendamentos'],
      textStyle: { color: colors.text },
      right: 10,
      top: 0,
    },
    grid: {
      left: '3%',
      right: '4%',
      bottom: '3%',
      top: '60px',
      containLabel: true,
    },
    xAxis: {
      type: 'category',
      data: chartData.value.map((d) =>
        new Date(d.date).toLocaleDateString('pt-BR', {
          month: 'short',
          year: '2-digit',
        }),
      ),
      axisLine: { lineStyle: { color: colors.grid } },
      axisLabel: { color: colors.text, fontSize: 11 },
    },
    yAxis: [
      {
        type: 'value',
        name: 'Quantidade',
        position: 'left',
        axisLine: { lineStyle: { color: colors.grid } },
        axisLabel: { color: colors.text },
        splitLine: { lineStyle: { color: colors.grid } },
      },
      {
        type: 'value',
        name: 'Receita (MT)',
        position: 'right',
        axisLine: { lineStyle: { color: colors.grid } },
        axisLabel: {
          color: colors.text,
          formatter: (value: number) => {
            if (value >= 1000000) return `MT ${(value / 1000000).toFixed(1)}M`;
            if (value >= 1000) return `MT ${(value / 1000).toFixed(0)}k`;
            return `MT ${value}`;
          },
        },
        splitLine: { show: false },
      },
    ],
    series: [
      {
        name: 'Visitas',
        type: 'line',
        data: chartData.value.map((d) => d.visits),
        smooth: true,
        lineStyle: { width: 3, color: colors.visits },
        itemStyle: { color: colors.visits },
        symbol: 'circle',
        symbolSize: 8,
        areaStyle: {
          color: {
            type: 'linear',
            x: 0,
            y: 0,
            x2: 0,
            y2: 1,
            colorStops: [
              { offset: 0, color: `${colors.visits}40` },
              { offset: 1, color: `${colors.visits}00` },
            ],
          },
        },
      },
      {
        name: 'Receita',
        type: 'line',
        yAxisIndex: 1,
        data: chartData.value.map((d) => d.revenue),
        smooth: true,
        lineStyle: { width: 3, color: colors.revenue },
        itemStyle: { color: colors.revenue },
        symbol: 'circle',
        symbolSize: 8,
      },
      {
        name: 'Novos Usuários',
        type: 'bar',
        data: chartData.value.map((d) => d.newUsers),
        itemStyle: { color: colors.newUsers },
        barWidth: '35%',
      },
      {
        name: 'Agendamentos',
        type: 'bar',
        data: chartData.value.map((d) => d.appointments),
        itemStyle: { color: colors.appointments },
        barWidth: '35%',
      },
    ],
  };
};

const getPieChartOption = (): unknown => {
  return {
    backgroundColor: 'transparent',
    tooltip: {
      trigger: 'item',
      formatter: '{a} <br/>{b}: {c} ({d}%)',
    },
    legend: {
      orient: 'vertical',
      right: 10,
      top: 'center',
      textStyle: { color: colors.text },
      formatter: (name: string) => {
        const data = salonsData.value.find((item) => item.status === name);
        return `${name}: ${data?.value || 0}`;
      },
    },
    series: [
      {
        name: 'Status dos Salões',
        type: 'pie',
        radius: chartType.value === 'pie' ? '70%' : ['40%', '70%'],
        center: ['40%', '50%'],
        avoidLabelOverlap: false,
        itemStyle: {
          borderColor: $q.dark.isActive ? '#1e1e1e' : '#fff',
          borderWidth: 2,
        },
        label: {
          show: true,
          formatter: '{d}%',
          color: colors.text,
        },
        emphasis: {
          label: { show: true, fontSize: 14, fontWeight: 'bold' },
          itemStyle: {
            shadowBlur: 10,
            shadowOffsetX: 0,
            shadowColor: 'rgba(0, 0, 0, 0.5)',
          },
        },
        labelLine: { show: true },
        data: salonsData.value.map((item) => ({
          value: item.value,
          name: item.status,
          itemStyle: { color: item.color },
        })),
      },
    ],
  };
};

const handleResize = (): void => {
  lineChart?.resize();
  pieChart?.resize();
};

// ✅ CORREÇÃO: Adicionar void para promises flutuantes
const refreshCharts = (): void => {
  void initCharts();
};

// Watchers
watch(
  () => $q.dark.isActive,
  () => {
    void initCharts();
  },
);
watch(chartType, () => {
  void initCharts();
});
watch(timeRange, () => {
  void initCharts();
});

// ✅ CORREÇÃO: Adicionar void para promises flutuantes
onMounted(() => {
  void initCharts();
});

onUnmounted(() => {
  lineChart?.dispose();
  pieChart?.dispose();
  window.removeEventListener('resize', handleResize);
});
</script>

<style lang="scss" scoped>
.charts-card {
  border-radius: 16px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
  transition: box-shadow 0.3s ease;

  &:hover {
    box-shadow: 0 8px 30px rgba(0, 0, 0, 0.12);
  }
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 16px;
}

.refresh-btn {
  color: #1976d2;
}

.chart-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.chart-wrapper {
  height: 320px;
  width: 100%;
  border-radius: 12px;
  overflow: hidden;
}

.legend-items {
  display: flex;
  flex-wrap: wrap;
  gap: 16px;
}

.legend-item {
  display: flex;
  align-items: center;
  padding: 4px 8px;
  background: rgba(0, 0, 0, 0.04);
  border-radius: 6px;
}

// Responsividade
@media (max-width: 1023px) {
  .chart-wrapper {
    height: 280px;
  }

  .legend-items {
    gap: 8px;
  }
}

@media (max-width: 599px) {
  .chart-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .chart-wrapper {
    height: 250px;
  }

  .legend-items {
    flex-direction: column;
    gap: 6px;
  }
}
</style>
