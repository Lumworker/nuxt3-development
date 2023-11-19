<template #default>
  <v-app>
    <v-container>
      <v-row v-if="ticketStore.length > 0">
        <ticket-card :ticketStore="ticketStore" />
      </v-row>
      <v-row v-else>
        <v-col>
          <p>No tickets available.</p>
        </v-col>
      </v-row>
      <!-- <v-row>
        <v-col v-for="(ticket, index) in ticketStore" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-card :title="ticket.ticketType" prepend-icon="mdi-ticket " append-icon="mdi-open-in-new">
            <div class="ml-5 mb-3">
              <v-card-subtitle>Minimum Buying: {{ ticket.miniMumBuying }}</v-card-subtitle>
              <v-card-subtitle>Limit Per Day: {{ ticket.limitPerDay }}</v-card-subtitle>
              <v-card-subtitle>Price: {{ ticket.Price }}</v-card-subtitle>
            </div>
          </v-card>
        </v-col>
      </v-row> -->
    </v-container>
    <add-ticket-dialog :get-ticket-store-function="getTicketStore" />


  </v-app>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import AddTicketDialog from '@/components/AddTicketDialog.vue';
import TicketCard from '@/components/TicketCard.vue';

onMounted(async () => {
  await getTicketStore();

  onBeforeUnmount(() => {
    getTicketStore();
  });
});

interface TicketType {
  [x: string]: any;
  ticketType: string;
  miniMumBuying: number;
  limitPerDay: number;
  Price: number;
}
;

const ticketStore = ref<TicketType[]>([]);
const getTicketStore = async (): Promise<any> => {
  try {
    const response = await $fetch("/api/query?col=ticketStore");
    const { result } = response as { result: TicketType[] };

    if (result) {
      ticketStore.value = result.slice().sort((a, b) => a.ticketType.localeCompare(b.ticketType));
    } else {
      console.error("Invalid API response format");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

</script>


<style lang="scss">
@use './settings';
</style>