<template>
  <q-card>
    <q-card-section>
      <div class="row items-center">
        <div class="col">
          <div class="text-h6">Estoque Crítico</div>
        </div>
        <div class="col-auto">
          <q-btn flat color="primary" label="Gerenciar Estoque" no-caps @click="goToInventory" />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list separator>
        <q-item v-for="item in criticalItems" :key="item.id" class="q-px-none">
          <q-item-section avatar>
            <q-avatar :color="getStockColor(item)" text-color="white">
              <q-icon :name="getItemIcon(item.category)" />
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium">{{ item.name }}</q-item-label>
            <q-item-label caption>{{ item.category }}</q-item-label>
            <q-item-label caption>
              <q-linear-progress
                :value="item.currentStock / item.idealStock"
                :color="getProgressColor(item)"
                class="q-mt-xs"
              />
              {{ item.currentStock }} / {{ item.idealStock }} unidades
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn
              color="primary"
              icon="shopping_cart"
              label="Pedir"
              size="sm"
              no-caps
              @click="orderItem(item)"
            />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';
import type { InventoryItem } from '../../types/indexDashboard-Type';

const router = useRouter();

const criticalItems: InventoryItem[] = [
  {
    id: 1,
    name: 'Shampoo Profissional',
    category: 'Produtos Capilares',
    currentStock: 5,
    idealStock: 20,
  },
  {
    id: 2,
    name: 'Tinta para Cabelo',
    category: 'Químicos',
    currentStock: 3,
    idealStock: 15,
  },
  {
    id: 3,
    name: 'Esmalte Vermelho',
    category: 'Manicure',
    currentStock: 2,
    idealStock: 10,
  },
];

function getItemIcon(category: string): string {
  const icons: Record<string, string> = {
    'Produtos Capilares': 'spa',
    Químicos: 'science',
    Manicure: 'brush',
    Ferramentas: 'build',
  };
  return icons[category] || 'inventory';
}

function getStockColor(item: InventoryItem): string {
  const ratio = item.currentStock / item.idealStock;
  if (ratio < 0.2) return 'negative';
  if (ratio < 0.5) return 'warning';
  return 'positive';
}

function getProgressColor(item: InventoryItem): string {
  const ratio = item.currentStock / item.idealStock;
  if (ratio < 0.2) return 'negative';
  if (ratio < 0.5) return 'warning';
  return 'positive';
}

function goToInventory(): void {
  void router.push('/manager/inventory');
}

function orderItem(item: InventoryItem): void {
  console.log('Pedir item:', item.name);
  // Implementar lógica de pedido
}
</script>
