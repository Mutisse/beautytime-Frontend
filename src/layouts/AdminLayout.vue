
<!-- layouts/ClientLayout.vue -->
<template>
  <q-layout>
    <!-- Seu header/sidebar aqui -->

    <q-page-container>
      <!-- ESSENCIAL: Esta tag renderiza as páginas filhas -->
      <router-view />
    </q-page-container>
  </q-layout>
</template>
