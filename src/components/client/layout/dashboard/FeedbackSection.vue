<template>
  <q-card>
    <q-card-section>
      <div class="row items-center q-mb-md">
        <q-icon name="chat" size="md" color="primary" class="q-mr-md" />
        <div>
          <div class="text-h6">Feedback dos Clientes</div>
          <div class="row items-center">
            <span class="text-h5 text-weight-bold q-mr-sm">{{ store.averageRating }}</span>
            <q-rating :model-value="parseFloat(store.averageRating)" size="sm" readonly />
            <span class="text-caption q-ml-sm">({{ store.feedbacks.length }} avaliações)</span>
          </div>
        </div>
      </div>

      <div class="row q-col-gutter-md q-mb-md">
        <div class="col-12 col-md-4">
          <q-select
            v-model="store.filters.salon"
            :options="store.salonOptions"
            label="Filtrar por salão"
            outlined
            dense
            emit-value
            map-options
            options-dense
          >
            <template v-slot:prepend>
              <q-icon name="store" />
            </template>
          </q-select>
        </div>
      </div>

      <div>
        <q-card
          v-for="(feedback, index) in store.filteredFeedbacks"
          :key="index"
          class="q-mb-sm"
          flat
          bordered
        >
          <q-card-section>
            <div class="row items-center q-mb-sm">
              <q-avatar size="lg" class="bg-grey-3">
                <q-icon
                  :name="feedback.gender === 'male' ? 'face' : 'face_3'"
                  size="lg"
                  color="grey"
                />
                <q-badge floating>{{ feedback.rating }}<q-icon name="star" size="xs" /></q-badge>
              </q-avatar>
              <div class="q-ml-md">
                <div class="text-weight-bold">{{ feedback.name }}</div>
                <div class="text-caption row items-center">
                  <q-icon name="store" size="xs" class="q-mr-xs" />
                  {{ feedback.salon }}
                </div>
                <div class="text-caption text-grey">{{ formatFeedbackDate(feedback.date) }}</div>
              </div>
            </div>

            <p class="q-my-sm">"{{ feedback.comment }}"</p>

            <q-badge :icon="getServiceIcon(feedback.service)" color="primary">
              {{ feedback.service }}
            </q-badge>
          </q-card-section>
        </q-card>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useAppStore } from '../../../../stores/dashboard-Store';
import { formatFeedbackDate, getServiceIcon } from '../../../../utils/formatters';

const store = useAppStore();
</script>
