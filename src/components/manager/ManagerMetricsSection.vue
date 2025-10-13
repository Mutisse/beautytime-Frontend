<template>
  <div class="row q-col-gutter-md q-mb-lg">
    <!-- Agendamentos -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="metric-card">
        <q-card-section class="row items-center">
          <q-icon name="event" size="lg" color="primary" class="q-mr-md" />
          <div>
            <div class="text-h6">42</div>
            <div class="text-caption">Agendamentos Hoje</div>
            <div class="text-caption text-green">
              <q-icon name="arrow_upward" size="xs" />
              +12% desde ontem
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Receita -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="metric-card">
        <q-card-section class="row items-center">
          <q-icon name="attach_money" size="lg" color="positive" class="q-mr-md" />
          <div>
            <div class="text-h6">2.850 (MT)</div>
            <div class="text-caption">Receita Diária</div>
            <div class="text-caption text-green">
              <q-icon name="arrow_upward" size="xs" />
              +8% desde ontem
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Clientes -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="metric-card">
        <q-card-section class="row items-center">
          <q-icon name="people" size="lg" color="info" class="q-mr-md" />
          <div>
            <div class="text-h6">18</div>
            <div class="text-caption">Novos Clientes</div>
            <div class="text-caption text-green">
              <q-icon name="arrow_upward" size="xs" />
              +5% este mês
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <!-- Satisfação -->
    <div class="col-12 col-sm-6 col-md-3">
      <q-card class="metric-card">
        <q-card-section class="row items-center">
          <q-icon name="star" size="lg" color="amber" class="q-mr-md" />
          <div>
            <div class="text-h6">4.8</div>
            <div class="text-caption">Avaliação Média</div>
            <div class="text-caption text-grey">
              <q-icon name="arrow_forward" size="xs" />
              estável
            </div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
// Seção de métricas do manager
</script>

<style scoped>
.metric-card {
  transition: transform 0.2s ease;
}

.metric-card:hover {
  transform: translateY(-5px);
}
</style>
