<template>
  <div class="q-mb-lg">
    <q-card>
      <q-card-section>
        <div class="text-h6">Promoções</div>
      </q-card-section>
      <q-card-section class="q-pt-none">
        <div class="row q-col-gutter-md">
          <div v-for="promotion in store.promotions" :key="promotion.id" class="col-12 col-md-6">
            <q-card class="bg-primary text-white">
              <q-card-section>
                <div class="text-h6">{{ promotion.title }}</div>
                <div>{{ promotion.description }}</div>
                <div class="text-caption q-mt-xs">
                  Válido até: {{ formatDate(promotion.validUntil) }}
                </div>
                <q-btn
                  class="q-mt-md"
                  color="white"
                  text-color="primary"
                  label="Reservar Agora"
                  @click="goToPromotion(promotion.id)"
                />
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
import { formatFeedbackDate } from '../../../../utils/formatters';

const router = useRouter();
const store = useAppStore();

function formatDate(dateString: string): string {
  return formatFeedbackDate(dateString);
}

function goToPromotion(promotionId: number): void {
  void router.push(`/promotions/${promotionId}`);
}
</script>
