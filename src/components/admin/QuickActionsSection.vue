<template>
  <q-card class="q-mb-lg">
    <q-card-section>
      <div class="text-h6">
        <q-icon name="flash_on" class="q-mr-sm" />
        Ações Rápidas
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <div class="row q-col-gutter-md">
        <div
          v-for="action in quickActions"
          :key="action.to"
          class="col-12 col-sm-6 col-md-4 col-lg-3"
        >
          <q-btn :to="action.to" flat no-caps class="full-width action-btn" :color="action.color">
            <div class="column items-center q-pa-md">
              <q-avatar :color="action.color" text-color="white" size="48px" class="q-mb-sm">
                <q-icon :name="action.icon" size="24px" />
              </q-avatar>
              <div class="text-center">{{ action.label }}</div>
            </div>
          </q-btn>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
const quickActions = [
  { to: '/admin/users', label: 'Aprovar Usuários', icon: 'person_add', color: 'primary' },
  { to: '/admin/salons', label: 'Aprovar Salões', icon: 'check_circle', color: 'positive' },
  { to: '/admin/permissions', label: 'Permissões', icon: 'lock', color: 'purple' },
  { to: '/admin/reports', label: 'Relatórios', icon: 'analytics', color: 'info' },
  { to: '/admin/logs', label: 'Visualizar Logs', icon: 'list', color: 'grey' },
  { to: '/admin/backup', label: 'Backup', icon: 'backup', color: 'orange' },
  { to: '/admin/appointments', label: 'Agendamentos', icon: 'event', color: 'teal' },
  { to: '/admin/settings', label: 'Configurações', icon: 'settings', color: 'brown' },
  { to: '/admin/promotions', label: 'Promoções', icon: 'local_offer', color: 'pink' },
  { to: '/admin/feedback', label: 'Feedbacks', icon: 'feedback', color: 'cyan' },
  { to: '/admin/system-status', label: 'Status do Sistema', icon: 'monitor_heart', color: 'lime' },
  
];
</script>

<style scoped>
.action-btn {
  height: 120px;
  border-radius: 12px;
  border: 1px solid #e0e0e0;
  transition: all 0.3s ease;
}

.action-btn:hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
}
</style>
