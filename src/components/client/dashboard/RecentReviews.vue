<template>
  <q-scroll-area class="fit">
    <q-card flat class="full-height">
      <q-card-section>
        <div class="text-h6">Avaliações Recentes</div>
      </q-card-section>

      <q-card-section class="q-pt-none">
        <q-list separator>
          <q-item v-for="(review, index) in store.recentReviews" :key="index" class="q-px-none">
            <q-item-section>
              <q-item-label class="text-weight-medium">{{ review.name }}</q-item-label>
              <q-item-label caption>
                <q-rating :model-value="review.rating" size="xs" readonly />
              </q-item-label>
              <q-item-label class="q-mt-xs">"{{ review.comment }}"</q-item-label>
              <q-item-label caption>
                {{ review.service }} • {{ formatFeedbackDate(review.date) }}
              </q-item-label>
            </q-item-section>
          </q-item>
        </q-list>
      </q-card-section>

      <q-card-actions vertical align="stretch">
        <q-btn
          label="Ver todas as avaliações"
          color="primary"
          @click="goToAllReviews"
          icon="chevron_right"
        />
      </q-card-actions>
    </q-card>
  </q-scroll-area>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import { useAppStore } from '../../../stores/dashboard-Store';
import { formatFeedbackDate } from '../../../utils/formatters';

const router = useRouter();
const store = useAppStore();

function goToAllReviews(): void {
  void router.push('/reviews');
}
</script>
