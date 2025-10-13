<template>
  <q-card class="q-mb-lg">
    <q-card-section>
      <div class="text-h6">Ações Rápidas</div>
    </q-card-section>
    <q-card-section class="q-pt-none">
      <div class="row q-col-gutter-md">
        <!-- Novo Agendamento -->
        <div class="col-6 col-sm-4 col-md-3">
          <q-btn
            color="primary"
            icon="store"
            label="Gerenciar Salões"
            no-caps
            class="full-width action-btn"
            @click="goToNewSalon"
          />
        </div>

        <!-- Gerenciar Equipe -->
        <div class="col-6 col-sm-4 col-md-3">
          <q-btn
            color="secondary"
            icon="groups"
            label="Gerenciar Equipe"
            no-caps
            class="full-width action-btn"
            @click="goToTeam"
          />
        </div>

        <!-- Relatórios -->
        <div class="col-6 col-sm-4 col-md-3">
          <q-btn
            color="accent"
            icon="analytics"
            label="Relatórios"
            no-caps
            class="full-width action-btn"
            @click="goToReports"
          />
        </div>

        <!-- Estoque -->
        <div class="col-6 col-sm-4 col-md-3">
          <q-btn
            color="warning"
            icon="inventory"
            label="Ver Estoque"
            no-caps
            class="full-width action-btn"
            @click="goToInventory"
          />
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

function goToNewSalon(): void {
  void router.push('/ownerManager/add/new-salon');
}

function goToTeam(): void {
  void router.push('/ownerManager/team');
}

function goToReports(): void {
  void router.push('/ownerManager/reports');
}

function goToInventory(): void {
  void router.push('/ownerManager/inventory');
}
</script>

<style scoped>
.action-btn {
  height: 80px;
  font-weight: 500;
}
</style>
