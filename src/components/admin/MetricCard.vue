<template>
  <q-card
    flat
    bordered
    :class="['metric-card', { 'metric-hover': hover }]"
    @mouseenter="hover = true"
    @mouseleave="hover = false"
  >
    <q-card-section class="q-pa-md">
      <div class="row items-center no-wrap">
        <div class="col-auto">
          <q-avatar :color="color" text-color="white" size="56px">
            <q-icon :name="icon" size="24px" />
          </q-avatar>
        </div>

        <div class="col q-ml-md">
          <div class="text-caption text-grey-7">{{ title }}</div>
          <div class="text-h5 text-weight-bold q-mt-xs">{{ value }}</div>

          <div class="row items-center q-mt-xs">
            <q-icon
              :name="change >= 0 ? 'arrow_upward' : 'arrow_downward'"
              :color="change >= 0 ? 'positive' : 'negative'"
              size="16px"
            />
            <span
              :class="['text-caption', 'q-ml-xs', change >= 0 ? 'text-positive' : 'text-negative']"
            >
              {{ change >= 0 ? '+' : '' }}{{ change }}%
            </span>
          </div>
        </div>
      </div>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { ref } from 'vue';

defineProps<{
  title: string;
  value: number;
  change: number;
  icon: string;
  color: string;
}>();

const hover = ref(false);
</script>

<style scoped>
.metric-card {
  transition: all 0.3s ease;
  border-radius: 12px;
}

.metric-hover {
  transform: translateY(-4px);
  box-shadow: 0 8px 25px -8px rgba(0, 0, 0, 0.15);
}
</style>
