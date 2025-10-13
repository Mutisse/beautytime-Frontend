<template>
  <div class="form-section">
    <h3><i class="fas fa-clock"></i> Horário de Funcionamento</h3>

    <div class="hours-grid">
      <div
        v-for="(dayConfig, dayName) in daysOfWeek"
        :key="dayName"
        class="day-schedule"
        :class="{ 'is-open': getOpeningHours(dayName)?.isClosed !== true }"
      >
        <div class="day-header">
          <h4>{{ dayConfig.label }}</h4>
          <div class="toggle-switch small">
            <input
              type="checkbox"
              :id="`day-active-${dayName}`"
              :checked="getOpeningHours(dayName)?.isClosed !== true"
              @change="$emit('toggle-day', dayName, ($event.target as HTMLInputElement).checked)"
            />
            <label :for="`day-active-${dayName}`" class="toggle-label"></label>
            <span>{{ getOpeningHours(dayName)?.isClosed !== true ? 'Aberto' : 'Fechado' }}</span>
          </div>
        </div>

        <div v-if="getOpeningHours(dayName)?.isClosed !== true" class="day-times">
          <div class="time-inputs">
            <div class="form-group">
              <label :for="`open-${dayName}`">Abertura</label>
              <input
                type="time"
                :id="`open-${dayName}`"
                :value="getOpeningHours(dayName)?.open"
                @input="
                  $emit(
                    'update-opening-hours',
                    dayName,
                    'open',
                    ($event.target as HTMLInputElement).value,
                  )
                "
              />
            </div>
            <div class="form-group">
              <label :for="`close-${dayName}`">Fechamento</label>
              <input
                type="time"
                :id="`close-${dayName}`"
                :value="getOpeningHours(dayName)?.close"
                @input="
                  $emit(
                    'update-opening-hours',
                    dayName,
                    'close',
                    ($event.target as HTMLInputElement).value,
                  )
                "
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue';
import type { SalonFormData, OpeningHours } from '../../../../types/Salon-Types';

interface DayConfig {
  label: string;
}

interface Props {
  salon: SalonFormData;
  daysOfWeek: Record<string, DayConfig>;
}

const props = defineProps<Props>();

const getOpeningHours = (dayName: string): OpeningHours | undefined => {
  return props.salon.openingHours?.find((hours) => hours.day === dayName);
};

defineEmits(['toggle-day', 'update-opening-hours']);
</script>



<style scoped>
.hours-grid {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
  gap: 16px;
  margin-top: 24px;
}

.day-schedule {
  padding: 20px;
  border: 2px solid #e0e0e0;
  border-radius: 12px;
  transition: all 0.3s ease;
  background: white;
}

.day-schedule.is-open {
  border-color: #c8e6c9;
  background-color: #f1f8e9;
}

.day-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 16px;
}

.day-header h4 {
  margin: 0;
  color: #424242;
  font-size: 1rem;
  font-weight: 600;
}

.toggle-switch.small .toggle-label {
  width: 40px;
  height: 20px;
}

.toggle-switch.small .toggle-label::after {
  width: 16px;
  height: 16px;
  top: 2px;
  left: 2px;
}

.toggle-switch.small input:checked + .toggle-label::after {
  transform: translateX(20px);
}

.day-times {
  margin-top: 12px;
}

.time-inputs {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px;
}

.time-inputs .form-group {
  margin-bottom: 0;
}

.time-inputs label {
  font-size: 0.875rem;
  font-weight: 500;
  color: #616161;
}

.time-inputs input {
  padding: 10px 12px;
  font-size: 0.875rem;
}

/* Responsive */
@media (max-width: 768px) {
  .hours-grid {
    grid-template-columns: 1fr;
  }

  .time-inputs {
    grid-template-columns: 1fr;
  }

  .day-header {
    flex-direction: column;
    align-items: flex-start;
    gap: 12px;
  }

  .day-header h4 {
    font-size: 0.9rem;
  }
}
</style>