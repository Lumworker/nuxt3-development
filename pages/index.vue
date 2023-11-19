<template #default>
  <v-app>
    <v-container>
      <v-row v-if="ticketStore.length > 0">
        <ticket-card :ticketStore="ticketStore" :click-select-ticket-store="clickSelectTicketStore" />
      </v-row>
      <v-row v-else>
        <v-col>
          <p>No tickets available.</p>
        </v-col>
      </v-row>

    </v-container>
    <add-ticket-dialog :get-ticket-store-function="getTicketStore" />
    <add-transaction-modal :dialog="isModalOpen" :close-modal-transaction="closeModalTransaction" />

    <template>
      <v-table fixed-header height="300px">
        <thead>
          <tr>
            <th class="text-left">
              buyerName
            </th>
            <th class="text-left">
              buyerDate
            </th>
            <th class="text-left">
              ticketType
            </th>
            <th class="text-left">
              amout
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ticketTransaction" :key="item.id">
            <td>{{ item.buyerName }}</td>
            <td>{{ item.buyerDate }}</td>
            <td>{{ item.ticketType }}</td>
            <td>{{ item.amout }}</td>
          </tr>
        </tbody>
      </v-table>
    </template>
    <!-- {{ ticketTransaction }} -->
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import AddTicketDialog from '@/components/AddTicketDialog.vue';
import TicketCard from '@/components/TicketCard.vue';
import AddTransactionModal from '@/components/AddTransactionModal.vue';

onMounted(async () => {
  await getTicketStore();
  await getTicketTransaction();

  onBeforeUnmount(() => {
    getTicketStore();
    getTicketTransaction();
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
const ticketTransaction = ref<TicketType[]>([]);
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

const getTicketTransaction = async (): Promise<any> => {
  try {
    const response = await $fetch("/api/query?col=ticketTransaction");
    const { result } = response as { result: any[] };

    if (result) {
      ticketTransaction.value = result;
    } else {
      console.error("Invalid API response format");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const isModalOpen = ref(false);

const clickSelectTicketStore = (ticket: Object) => {
  console.log("🚀 ~  index ticket:", ticket)
  // Handle the click event here
  // Open the modal
  isModalOpen.value = true;
  console.log(isModalOpen.value)
};
const closeModalTransaction = () => {
  // Close the modal
  isModalOpen.value = false;
};

</script>


<style lang="scss">
@use './settings';
</style>