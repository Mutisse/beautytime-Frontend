import { defineStore } from 'pinia';
import { ref } from 'vue';
import type { BookingPayload } from '../types/booking-Type';

export const useBookingStore = defineStore('booking', () => {
  const bookings = ref<BookingPayload[]>([]);
  const loading = ref(false);
  const error = ref<string | null>(null);

  const createBooking = async (bookingData: BookingPayload) => {
    loading.value = true;
    error.value = null;

    try {
      // Simulação de uma chamada API
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Adicionar à lista de agendamentos
      bookings.value.push(bookingData);

      // Aqui você faria a chamada real para sua API
      // const response = await api.post('/bookings', bookingData)
      // return response.data

      return bookingData;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao criar agendamento';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const getBookings = async () => {
    loading.value = true;
    try {
      // Simulação de busca de agendamentos
      await new Promise((resolve) => setTimeout(resolve, 500));
      return bookings.value;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao buscar agendamentos';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  const updateBookingStatus = async (bookingId: string, status: string) => {
    loading.value = true;
    try {
      // Simulação de atualização
      await new Promise((resolve) => setTimeout(resolve, 500));

      const booking = bookings.value.find(
        (b) => b.services.some((s) => s.serviceId === bookingId), // Simulação de ID
      );

      if (booking) {
        booking.status = status;
      }

      return booking;
    } catch (err) {
      error.value = err instanceof Error ? err.message : 'Erro ao atualizar agendamento';
      throw err;
    } finally {
      loading.value = false;
    }
  };

  return {
    bookings,
    loading,
    error,
    createBooking,
    getBookings,
    updateBookingStatus,
  };
});
