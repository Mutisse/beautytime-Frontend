<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">
        <q-icon name="activity" class="q-mr-sm" />
        Atividade Recente
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list bordered separator>
        <q-item v-for="(activity, index) in activities" :key="index" class="q-pa-md">
          <q-item-section avatar>
            <q-avatar :color="activity.color" text-color="white">
              <q-icon :name="activity.icon" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium">{{ activity.title }}</q-item-label>
            <q-item-label caption>{{ activity.description }}</q-item-label>
          </q-item-section>

          <q-item-section side top>
            <q-item-label caption>{{ activity.time }}</q-item-label>
          </q-item-section>
        </q-item>
      </q-list>

      <div class="text-center q-mt-md">
        <q-btn label="Ver Todas" color="primary" flat no-caps />
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const activities = [
  {
    title: 'Novo usuário registrado',
    description: 'João Silva se cadastrou no sistema',
    time: '2 minutos atrás',
    icon: 'person_add',
    color: 'primary',
  },
  {
    title: 'Agendamento confirmado',
    description: 'Corte de cabelo - Salão Elegance',
    time: '15 minutos atrás',
    icon: 'event_available',
    color: 'positive',
  },
  {
    title: 'Pagamento aprovado',
    description: 'MTN 50,00 - Cartão de crédito',
    time: '1 hora atrás',
    icon: 'payment',
    color: 'info',
  },
  {
    title: 'Salão pendente',
    description: 'Novo salão aguardando aprovação',
    time: '3 horas atrás',
    icon: 'store',
    color: 'warning',
  },
];
</script>
