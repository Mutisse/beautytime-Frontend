<template>
  <q-header elevated class="bg-primary text-white">
    <q-toolbar>
      <q-btn
        flat
        dense
        round
        icon="menu"
        aria-label="Menu"
        @click="$emit('toggle-drawer')"
        class="q-mr-sm"
      />

      <q-toolbar-title class="text-h6"> Painel de Gestão </q-toolbar-title>

      <div class="row items-center q-gutter-sm">
        <!-- Data atual -->
        <div class="text-caption">
          {{ currentDate }}
        </div>

        <!-- Notificações -->
        <q-btn flat round dense icon="notifications">
          <q-badge v-if="unreadNotifications > 0" color="red" floating>
            {{ unreadNotifications > 9 ? '9+' : unreadNotifications }}
          </q-badge>
          <q-menu>
            <q-list style="min-width: 300px">
              <q-item-label header>Notificações</q-item-label>
              <q-item v-for="(notification, index) in notifications" :key="index">
                <q-item-section>
                  <q-item-label>{{ notification.title }}</q-item-label>
                  <q-item-label caption>{{ notification.message }}</q-item-label>
                </q-item-section>
              </q-item>
              <q-separator />
              <q-item clickable v-close-popup @click="goToNotifications">
                <q-item-section>Ver todas</q-item-section>
              </q-item>
            </q-list>
          </q-menu>
        </q-btn>

        <!-- Perfil do Usuário -->
        <q-btn-dropdown flat no-caps :label="userDisplayName">
          <q-list>
            <q-item clickable v-close-popup @click="goToProfile">
              <q-item-section avatar>
                <q-icon name="person" />
              </q-item-section>
              <q-item-section>Meu Perfil</q-item-section>
            </q-item>

            <q-separator />

            <q-item clickable v-close-popup @click="handleLogout" class="text-negative">
              <q-item-section avatar>
                <q-icon name="logout" />
              </q-item-section>
              <q-item-section>Sair</q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div>
    </q-toolbar>
  </q-header>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../stores/auth-store';
import { useAppStore } from '../../stores/dashboard-Store';

// Defina as props e emits corretamente
defineProps<{
  leftDrawerOpen: boolean;
}>();

// Emit definition without unused variable
defineEmits(['toggle-drawer']);

const $q = useQuasar();
const router = useRouter();
const authStore = useAuthStore();
const appStore = useAppStore();

const currentDate = computed(() => {
  return new Date().toLocaleDateString('pt-BR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
});

const userDisplayName = computed(() => {
  return authStore.userFullName || 'Usuário';
});

const unreadNotifications = computed(() => appStore.unreadNotifications);
const notifications = computed(() => appStore.notifications);

function goToNotifications(): void {
  void router.push('/manager/notifications');
}

function goToProfile(): void {
  void router.push('/manager/profile');
}

async function handleLogout(): Promise<void> {
  try {
    // 1. Executa logout na store
    await authStore.logout();

    // 2. Redireciona para página de login
    await router.push('/auth');

    // 3. Feedback positivo
    $q.notify({
      type: 'positive',
      message: 'Logout realizado com sucesso!',
      timeout: 2000,
    });
  } catch (error) {
    console.error('Logout error:', error);
    $q.notify({
      type: 'negative',
      message: 'Erro ao fazer logout. Tente novamente.',
      timeout: 3000,
    });
  }
}
</script>
