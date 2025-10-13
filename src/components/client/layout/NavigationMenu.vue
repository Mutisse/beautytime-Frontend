<template>
  <q-list padding>
    <!-- Menu Busca -->
    <q-expansion-item icon="search" label="Busca" default-opened header-class="text-primary">
      <q-item clickable v-ripple :to="{ name: 'client-nearby-salons' }">
        <q-item-section avatar>
          <q-icon name="place" />
        </q-item-section>
        <q-item-section>Salões Próximos</q-item-section>
      </q-item>
      <q-separator />

      <q-item-label header class="text-caption">Filtrar por:</q-item-label>

      <q-item clickable v-ripple :to="{ name: 'client-favorites' }">
        <q-item-section avatar>
          <q-icon name="favorite" />
        </q-item-section>
        <q-item-section>Meus Favoritos</q-item-section>
      </q-item>

      <q-item clickable v-ripple :to="{ name: 'client-filter-rating' }">
        <q-item-section avatar>
          <q-icon name="star" />
        </q-item-section>
        <q-item-section>Filtrar por Avaliação</q-item-section>
      </q-item>

      <q-item clickable v-ripple :to="{ name: 'client-promotions' }">
        <q-item-section avatar>
          <q-icon name="local_offer" />
        </q-item-section>
        <q-item-section>Promoções</q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- Menu Agenda -->
    <q-expansion-item icon="event" label="Agenda" header-class="text-primary">
      <q-item clickable v-ripple :to="{ name: 'client-appointments' }">
        <q-item-section avatar>
          <q-icon name="event_available" />
        </q-item-section>
        <q-item-section>Meus Agendamentos</q-item-section>
      </q-item>

      <q-item clickable v-ripple :to="{ name: 'client-home-service' }">
        <q-item-section avatar>
          <q-icon name="home" />
        </q-item-section>
        <q-item-section>Serviço Domiciliar</q-item-section>
      </q-item>

      <q-item clickable v-ripple :to="{ name: 'client-reschedule' }">
        <q-item-section avatar>
          <q-icon name="update" />
        </q-item-section>
        <q-item-section>Reagendar/Cancelar</q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- Menu Pagamento -->
    <q-expansion-item icon="credit_card" label="Pagamento" header-class="text-primary">
      <q-item clickable v-ripple :to="{ name: 'client-pay-online' }">
        <q-item-section avatar>
          <q-icon name="payments" />
        </q-item-section>
        <q-item-section>Pagar Online</q-item-section>
      </q-item>

      <q-item clickable v-ripple :to="{ name: 'client-payment-methods' }">
        <q-item-section avatar>
          <q-icon name="account_balance_wallet" />
        </q-item-section>
        <q-item-section>Métodos de Pagamento</q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- Menu Histórico -->
    <q-expansion-item icon="history" label="Histórico" header-class="text-primary">
      <q-item clickable v-ripple :to="{ name: 'client-previous-services' }">
        <q-item-section avatar>
          <q-icon name="hourglass_empty" />
        </q-item-section>
        <q-item-section>Serviços Anteriores</q-item-section>
      </q-item>

      <q-item clickable v-ripple :to="{ name: 'client-given-ratings' }">
        <q-item-section avatar>
          <q-icon name="star_rate" />
        </q-item-section>
        <q-item-section>Avaliações Feitas</q-item-section>
      </q-item>
    </q-expansion-item>

    <!-- Menu Configurações -->
    <q-expansion-item icon="settings" label="Configurações" header-class="text-primary">


      <q-item clickable v-ripple :to="{ name: 'client-privacy' }">
        <q-item-section avatar>
          <q-icon name="lock" />
        </q-item-section>
        <q-item-section>Privacidade e Segurança</q-item-section>
      </q-item>

      <q-item clickable v-ripple :to="{ name: 'client-preferences' }">
        <q-item-section avatar>
          <q-icon name="tune" />
        </q-item-section>
        <q-item-section>Preferências</q-item-section>
      </q-item>

      <q-item clickable v-ripple :to="{ name: 'client-help' }">
        <q-item-section avatar>
          <q-icon name="help" />
        </q-item-section>
        <q-item-section>Ajuda e Suporte</q-item-section>
      </q-item>
    </q-expansion-item>
  </q-list>
</template>

