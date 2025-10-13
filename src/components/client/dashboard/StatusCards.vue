<template>
  <div class="row q-col-gutter-md q-mb-lg">
    <div class="col-12 col-md-4">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="event" size="lg" color="primary" class="q-mr-md" />
          <div>
            <div class="text-h6">{{ store.upcomingAppointments.length }}</div>
            <div class="text-caption">Agendamentos</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-4">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="star" size="lg" color="amber" class="q-mr-md" />
          <div>
            <div class="text-h6">{{ store.averageRating }}</div>
            <div class="text-caption">Sua avaliação</div>
          </div>
        </q-card-section>
      </q-card>
    </div>

    <div class="col-12 col-md-4">
      <q-card>
        <q-card-section class="row items-center">
          <q-icon name="local_offer" size="lg" color="positive" class="q-mr-md" />
          <div>
            <div class="text-h6">{{ store.promotions.length }}</div>
            <div class="text-caption">Promoções</div>
          </div>
        </q-card-section>
      </q-card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAppStore } from '../../../stores/dashboard-Store';

const store = useAppStore();
</script>
