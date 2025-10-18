<!-- components/client/layout/NavigationMenu.vue -->
<template>
  <q-list padding class="menu-list">
    <!-- Dashboard -->
    <q-item clickable v-ripple to="/dashboard" exact>
      <q-item-section avatar>
        <q-icon name="dashboard" color="primary" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Dashboard</q-item-label>
      </q-item-section>
    </q-item>

    <!-- Agendamentos -->
    <q-expansion-item icon="event" label="Agendamentos" default-opened header-class="text-primary">
      <q-list class="q-pl-md">
        <q-item clickable v-ripple to="/agendamentos/novo">
          <q-item-section avatar>
            <q-icon name="add_circle" size="xs" color="green" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Novo Agendamento</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/agendamentos/proximos">
          <q-item-section avatar>
            <q-icon name="schedule" size="xs" color="blue" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Próximos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/agendamentos/historico">
          <q-item-section avatar>
            <q-icon name="history" size="xs" color="grey-6" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Histórico</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>

    <!-- Serviços -->
    <q-expansion-item icon="spa" label="Serviços" header-class="text-primary">
      <q-list class="q-pl-md">
        <q-item clickable v-ripple to="/servicos/explorar">
          <q-item-section avatar>
            <q-icon name="explore" size="xs" color="blue" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Explorar Serviços</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/servicos/favoritos">
          <q-item-section avatar>
            <q-icon name="favorite" size="xs" color="red" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Serviços Favoritos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/servicos/historico">
          <q-item-section avatar>
            <q-icon name="assignment" size="xs" color="orange" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Histórico</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>

    <!-- Salões -->
    <q-expansion-item icon="store" label="Salões" header-class="text-primary">
      <q-list class="q-pl-md">
        <q-item clickable v-ripple to="/saloes/proximos">
          <q-item-section avatar>
            <q-icon name="location_on" size="xs" color="green" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Salões Próximos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/saloes/favoritos">
          <q-item-section avatar>
            <q-icon name="favorite_border" size="xs" color="red" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Favoritos</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/saloes/avaliados">
          <q-item-section avatar>
            <q-icon name="star" size="xs" color="amber" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Melhores Avaliados</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>

    <!-- Promoções -->
    <q-item clickable v-ripple to="/promocoes">
      <q-item-section avatar>
        <q-icon name="local_offer" color="orange" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Promoções</q-item-label>
      </q-item-section>
      <q-item-section side>
        <q-badge v-if="activePromotionsCount > 0" color="red" rounded>
          {{ activePromotionsCount }}
        </q-badge>
      </q-item-section>
    </q-item>

    <!-- Pagamentos -->
    <q-expansion-item icon="payments" label="Pagamentos" header-class="text-primary">
      <q-list class="q-pl-md">
        <q-item clickable v-ripple to="/pagamentos/metodos">
          <q-item-section avatar>
            <q-icon name="credit_card" size="xs" color="blue" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Métodos de Pagamento</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/pagamentos/historico">
          <q-item-section avatar>
            <q-icon name="receipt" size="xs" color="green" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Histórico</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/pagamentos/cupons">
          <q-item-section avatar>
            <q-icon name="confirmation_number" size="xs" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Cupons de Desconto</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>

    <!-- Avaliações -->
    <q-expansion-item icon="reviews" label="Avaliações" header-class="text-primary">
      <q-list class="q-pl-md">
        <q-item clickable v-ripple to="/avaliacoes/minhas">
          <q-item-section avatar>
            <q-icon name="rate_review" size="xs" color="amber" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Minhas Avaliações</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/avaliacoes/pendentes">
          <q-item-section avatar>
            <q-icon name="pending_actions" size="xs" color="orange" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Avaliar Serviços</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>

    <!-- Suporte -->
    <q-expansion-item icon="support_agent" label="Suporte" header-class="text-primary">
      <q-list class="q-pl-md">
        <q-item clickable v-ripple to="/suporte/chat">
          <q-item-section avatar>
            <q-icon name="chat" size="xs" color="blue" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Chat com Suporte</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/suporte/faq">
          <q-item-section avatar>
            <q-icon name="help" size="xs" color="green" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Perguntas Frequentes</q-item-label>
          </q-item-section>
        </q-item>

        <q-item clickable v-ripple to="/suporte/central-ajuda">
          <q-item-section avatar>
            <q-icon name="contact_support" size="xs" color="purple" />
          </q-item-section>
          <q-item-section>
            <q-item-label>Central de Ajuda</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-expansion-item>

    <!-- Perfil -->
    <q-item clickable v-ripple to="/perfil">
      <q-item-section avatar>
        <q-icon name="person" color="primary" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Meu Perfil</q-item-label>
      </q-item-section>
    </q-item>

    <!-- Configurações -->
    <q-item clickable v-ripple to="/configuracoes">
      <q-item-section avatar>
        <q-icon name="settings" color="grey-6" />
      </q-item-section>
      <q-item-section>
        <q-item-label>Configurações</q-item-label>
      </q-item-section>
    </q-item>
  </q-list>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAppStore } from '../../../stores/dashboard-Store';

const store = useAppStore();

// Apenas propriedades que EXISTEM na store
const activePromotionsCount = computed(() => {
  if (!store.promotions || store.promotions.length === 0) return 0;

  const now = new Date();
  return store.promotions.filter((p) => {
    const validUntil = new Date(p.validUntil);
    return validUntil > now;
  }).length;
});
</script>

<style scoped>
.menu-list .q-item {
  border-radius: 8px;
  margin-bottom: 4px;
}

.menu-list .q-expansion-item {
  border-radius: 8px;
}

.menu-list .q-expansion-item__content .q-item {
  padding-left: 16px;
}

/* Cor do texto dos expansion items quando abertos */
:deep(.q-expansion-item--expanded .q-item__section--avatar .q-icon) {
  color: inherit;
}
</style>
