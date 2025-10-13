<template>
  <q-list padding>
    <!-- Dashboard -->
    <q-item clickable v-ripple to="/staff/dashboard" exact>
      <q-item-section avatar>
        <q-icon name="dashboard" />
      </q-item-section>
      <q-item-section>Dashboard</q-item-section>
    </q-item>

    <!-- Agenda -->
    <q-expansion-item icon="event" label="Agenda" header-class="text-primary">
      <q-item clickable v-ripple to="/staff/agenda">
        <q-item-section avatar>
          <q-icon name="calendar_month" />
        </q-item-section>
        <q-item-section>Agenda Diária</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/staff/schedule">
        <q-item-section avatar>
          <q-icon name="schedule" />
        </q-item-section>
        <q-item-section>Minha Escala</q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- Clientes -->
    <q-item clickable v-ripple to="/staff/clients">
      <q-item-section avatar>
        <q-icon name="people" />
      </q-item-section>
      <q-item-section>Clientes</q-item-section>
    </q-item>

    <!-- Serviços -->
    <q-item clickable v-ripple to="/staff/services">
      <q-item-section avatar>
        <q-icon name="cut" />
      </q-item-section>
      <q-item-section>Meus Serviços</q-item-section>
    </q-item>

    <!-- Materiais -->
    <q-item clickable v-ripple to="/staff/materials">
      <q-item-section avatar>
        <q-icon name="inventory" />
      </q-item-section>
      <q-item-section>Materiais</q-item-section>
    </q-item>

    <!-- Relatórios -->
    <q-item clickable v-ripple to="/staff/reports">
      <q-item-section avatar>
        <q-icon name="analytics" />
      </q-item-section>
      <q-item-section>Relatórios</q-item-section>
    </q-item>

    <!-- Configurações -->
    <q-expansion-item icon="settings" label="Configurações" header-class="text-primary">
      <q-item clickable v-ripple to="/staff/profile">
        <q-item-section avatar>
          <q-icon name="person" />
        </q-item-section>
        <q-item-section>Meu Perfil</q-item-section>
      </q-item>
      <q-item clickable v-ripple to="/staff/availability">
        <q-item-section avatar>
          <q-icon name="event_available" />
        </q-item-section>
        <q-item-section>Disponibilidade</q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

<script setup lang="ts">
// Componente de navegação para staff
</script>
