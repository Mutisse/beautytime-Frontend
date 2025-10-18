<template>
  <div class="q-mb-lg">
    <q-card>
      <q-card-section>
        <div class="text-h6">Serviços Disponíveis</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-md">
          <div v-for="service in store.services" :key="service.id" class="col-6 col-sm-4 col-md-3">
            <q-card flat bordered class="cursor-pointer" @click="goToService(service.id)">
              <q-card-section class="text-center">
                <q-icon :name="service.icon" size="xl" color="primary" />
                <div class="text-subtitle2 q-mt-md">{{ service.name }}</div>
                <div class="text-caption text-grey">{{ service.category }}</div>
                <div v-if="service.duration" class="text-caption">{{ service.duration }} min</div>
                <div v-if="service.price" class="text-caption text-weight-medium q-mt-xs">
                  R$ {{ service.price.toFixed(2) }}
                </div>
                <div v-if="service.description" class="text-caption text-grey q-mt-xs">
                  {{ service.description }}
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppStore } from '../../../../stores/dashboard-Store';

const router = useRouter();
const store = useAppStore();

function goToService(serviceId: number): void {
  void router.push(`/services/${serviceId}`);
}
</script>
