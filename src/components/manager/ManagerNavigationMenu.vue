<template>
  <q-list padding>
    <!-- Dashboard -->
    <q-item clickable v-ripple to="#" exact>
      <q-item-section avatar>
        <q-icon name="dashboard" />
      </q-item-section>
      <q-item-section>Dashboard</q-item-section>
    </q-item>

    <!-- Agendamentos -->
    <q-expansion-item icon="event" label="Agendamentos" header-class="text-primary">
      <q-item clickable v-ripple to="/manager/bookings">
        <q-item-section avatar>
          <q-icon name="list" />
        </q-item-section>
        <q-item-section>Todos os Agendamentos</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/manager/calendar">
        <q-item-section avatar>
          <q-icon name="calendar_month" />
        </q-item-section>
        <q-item-section>Calendário</q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- Equipe -->
    <q-expansion-item icon="groups" label="Equipe" header-class="text-primary">
      <q-item clickable v-ripple to="/manager/team">
        <q-item-section avatar>
          <q-icon name="people" />
        </q-item-section>
        <q-item-section>Gerenciar Equipe</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/manager/schedule">
        <q-item-section avatar>
          <q-icon name="schedule" />
        </q-item-section>
        <q-item-section>Escalas</q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- Clientes -->
    <q-item clickable v-ripple to="/manager/clients">
      <q-item-section avatar>
        <q-icon name="person" />
      </q-item-section>
      <q-item-section>Clientes</q-item-section>
    </q-item>

    <!-- Financeiro -->
    <q-expansion-item icon="attach_money" label="Financeiro" header-class="text-primary">
      <q-item clickable v-ripple to="/manager/revenue">
        <q-item-section avatar>
          <q-icon name="trending_up" />
        </q-item-section>
        <q-item-section>Receitas</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/manager/expenses">
        <q-item-section avatar>
          <q-icon name="trending_down" />
        </q-item-section>
        <q-item-section>Despesas</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/manager/reports">
        <q-item-section avatar>
          <q-icon name="analytics" />
        </q-item-section>
        <q-item-section>Relatórios</q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- Estoque -->
    <q-item clickable v-ripple to="/manager/inventory">
      <q-item-section avatar>
        <q-icon name="inventory" />
      </q-item-section>
      <q-item-section>Estoque</q-item-section>
    </q-item>

    
    
    <!-- Configurações -->
    <q-expansion-item icon="settings" label="Configurações" header-class="text-primary">
      <q-item clickable v-ripple to="/manager/profile">
        <q-item-section avatar>
          <q-icon name="person" />
        </q-item-section>
        <q-item-section>Meu Perfil</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/manager/salon-settings">
        <q-item-section avatar>
          <q-icon name="store" />
        </q-item-section>
        <q-item-section>Configurações do Salão</q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts">
// Componente de navegação para manager
</script>
