<template>
  <q-card>
    <q-card-section>
      <div class="row items-center">
        <div class="col">
          <div class="text-h6">Equipe em Destaque</div>
        </div>
        <div class="col-auto">
          <q-btn flat color="primary" label="Gerenciar" no-caps @click="goToTeam" />
        </div>
      </div>
    </q-card-section>

    <q-card-section class="q-pt-none">
      <q-list separator>
        <q-item v-for="member in teamMembers" :key="member.id" class="q-px-none">
          <q-item-section avatar>
            <q-avatar color="primary" text-color="white">
              {{ getInitials(member.name) }}
            </q-avatar>
          </q-item-section>

          <q-item-section>
            <q-item-label class="text-weight-medium">{{ member.name }}</q-item-label>
            <q-item-label caption>{{ member.role }}</q-item-label>
            <q-item-label caption class="row items-center">
              <q-icon name="event" size="xs" class="q-mr-xs" />
              {{ member.bookings }} agendamentos
              <q-icon
                name="trending_up"
                size="xs"
                class="q-ml-sm q-mr-xs"
                :class="member.performance > 0 ? 'text-positive' : 'text-negative'"
              />
              {{ member.performance }}%
            </q-item-label>
          </q-item-section>

          <q-item-section side>
            <q-btn flat round dense icon="mail" color="primary" @click="contactMember(member)" />
          </q-item-section>
        </q-item>
      </q-list>
    </q-card-section>
  </q-card>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router';

interface TeamMember {
  id: number;
  name: string;
  role: string;
  bookings: number;
  performance: number;
}

const router = useRouter();

const teamMembers: TeamMember[] = [
  {
    id: 1,
    name: 'João Santos',
    role: 'Cabeleireiro Sênior',
    bookings: 12,
    performance: 15,
  },
  {
    id: 2,
    name: 'Ana Costa',
    role: 'Colorista',
    bookings: 8,
    performance: 8,
  },
  {
    id: 3,
    name: 'Paula Rodrigues',
    role: 'Manicure',
    bookings: 10,
    performance: 12,
  },
];

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .toUpperCase();
}

function goToTeam(): void {
  void router.push('/manager/team');
}

function contactMember(member: TeamMember): void {
  console.log('Contatar:', member.name);
  // Implementar lógica de contato
}
</script>
