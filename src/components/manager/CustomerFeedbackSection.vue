<template>
  <q-card>
    <q-card-section>
      <div class="text-h6">Feedback dos Clientes</div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list separator>
        <q-item v-for="feedback in recentFeedback" :key="feedback.id" class="q-px-none">
          <q-item-section avatar>
            <q-rating :model-value="feedback.rating" size="sm" readonly />
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium">{{ feedback.client }}</q-item-label>
            <q-item-label caption>"{{ feedback.comment }}"</q-item-label>
            <q-item-label caption>
              {{ feedback.service }} • {{ formatDate(feedback.date) }}
            </q-item-label>
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>

    <q-card-actions align="right">
      <q-btn flat color="primary" label="Ver todos os feedbacks" no-caps @click="goToFeedback" />
    </q-card-actions>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

const router = useRouter();

const recentFeedback = [
  {
    id: 1,
    client: 'Maria Silva',
    rating: 5,
    comment: 'Serviço excelente, adorei o resultado!',
    service: 'Corte de Cabelo',
    date: '2023-12-10',
  },
  {
    id: 2,
    client: 'Carlos Oliveira',
    rating: 4,
    comment: 'Atendimento muito bom, mas a espera foi longa.',
    service: 'Coloração',
    date: '2023-12-09',
  },
  {
    id: 3,
    client: 'Juliana Pereira',
    rating: 5,
    comment: 'Profissional muito atenciosa, super recomendo!',
    service: 'Manicure',
    date: '2023-12-08',
  },
];

function formatDate(dateString: string): string {
  return new Date(dateString).toLocaleDateString('pt-BR');
}

function goToFeedback(): void {
  void router.push('/manager/feedback');
}
</script>
