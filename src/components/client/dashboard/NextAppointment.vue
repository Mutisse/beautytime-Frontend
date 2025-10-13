<template>
  <q-card class="q-mb-lg">
    <q-card-section>
      <div class="row items-center">
        <div class="col">
          <div class="text-h6">Próximo Agendamento</div>
        </div>
        <div class="col-auto">
          <q-badge
            :color="getStatusColor(store.nextBooking?.status || '')"
            :label="formatStatus(store.nextBooking?.status || '')"
          />
        </div>
      </div>
    </q-card-section>

    <q-card-section v-if="store.nextBooking">
      <div class="row q-col-gutter-md">
        <div class="col-12 col-md-6">
          <div class="row items-center">
            <q-icon
              :name="getServiceIcon(store.nextBooking.service)"
              size="md"
              color="primary"
              class="q-mr-md"
            />
            <div>
              <div class="text-weight-medium">{{ store.nextBooking.service }}</div>
              <div class="text-caption row items-center">
                <q-icon name="schedule" size="xs" class="q-mr-xs" />
                {{ formatBookingDate(store.nextBooking.date) }}, {{ store.nextBooking.time }}
              </div>
            </div>
          </div>
        </div>

        <div class="col-12 col-md-6">
          <div class="row items-center">
            <q-avatar size="md" class="q-mr-md bg-grey-3">
              <q-icon name="store" size="lg" color="grey" />
            </q-avatar>
            <div>
              <div class="text-weight-medium">{{ store.nextBooking.salonName }}</div>
              <div class="text-caption row items-center">
                <q-icon name="place" size="xs" class="q-mr-xs" />
                {{ store.nextBooking.salonAddress }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </q-card-section>

    <q-card-actions v-if="store.nextBooking" align="right">
      <q-btn
        label="Ver detalhes"
        color="primary"
        @click="goToBookingDetails(store.nextBooking.id)"
        icon="chevron_right"
      />
    </q-card-actions>

    <q-card-section v-else>
      <div class="text-center text-grey q-py-md">
        <q-icon name="event_busy" size="xl" />
        <div class="q-mt-md">Nenhum agendamento confirmado</div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppStore } from '../../../stores/dashboard-Store';
import {
  formatStatus,
  getStatusColor,
  formatBookingDate,
  getServiceIcon,
} from '../../../utils/formatters';

const router = useRouter();
const store = useAppStore();

function goToBookingDetails(id: string): void {
  void router.push(`/booking/${id}`);
}
</script>
