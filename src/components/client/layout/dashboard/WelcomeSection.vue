<template>
  <div class="q-mb-lg">
    <q-card class="bg-primary text-white">
      <q-card-section>
        <div class="text-h4">{{ welcomeMessage }}, {{ userName }}!</div>
        <div class="text-subtitle1 q-mt-sm">Como podemos ajudá-lo hoje?</div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAuthStore } from 'src/stores/auth-store';

const authStore = useAuthStore();

const userName = computed(() => authStore.currentUser?.fullName?.display || 'Cliente');
const welcomeMessage = computed(() => getWelcomeMessage());

const getWelcomeMessage = (): string => {
  const hour = new Date().getHours();

  if (hour >= 5 && hour < 12) {
    return 'Bom dia';
  } else if (hour >= 12 && hour < 18) {
    return 'Boa tarde';
  } else {
    return 'Boa noite';
  }
};
</script>
