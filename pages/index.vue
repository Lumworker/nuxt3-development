<template #default>
  <v-app>
    <h1 class="text-4xl font-extrabold">Click Ticket To Add transction</h1>
    <v-container>
      <v-row v-if="ticketStore.length > 0">
        <ticket-card :ticketStore="ticketStore" :click-select-ticket-store="clickSelectTicketStore" />
      </v-row>
      <v-row v-else>
        <p>No tickets available.</p>
      </v-row>
      <v-row>
        <add-ticket-dialog :get-ticket-store-function="getTicketStore" />
      </v-row>

    </v-container>
    <add-transaction-modal :dialog="isModalAddTransOpen" :onclose-modal-transaction="oncloseModalTransaction"
      :ticketSelected="ticketSelected" :getTicketTransaction="getTicketTransaction" />

    <div>

      <h1 class="text-4xl font-extrabold">Transction</h1>
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
            <td>{{ dayjs(item.buyerDate).format('YYYY-MM-DD HH:mm:ss') }}</td>
            <td>{{ item.ticketType }}</td>
            <td>{{ item.amout }}</td>
          </tr>
        </tbody>
      </v-table>
    </div>
    <!-- {{ ticketTransaction }} -->
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import AddTicketDialog from '@/components/AddTicketDialog.vue';
import TicketCard from '@/components/TicketCard.vue';
import AddTransactionModal from '@/components/AddTransactionModal.vue';
import dayjs from 'dayjs';

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
interface TicketSelected {
  [x: string]: any;
  ticketSelected: any;
}
;

const ticketStore = ref<TicketType[]>([]);
const ticketSelected = ref<TicketSelected>({ ticketSelected: null });
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

const isModalAddTransOpen = ref(false);

//finction click add transaction
const clickSelectTicketStore = (ticket: any) => {
  ticketSelected.value = ticket;
  // console.log("🚀 ~ ticketSelected:", ticketSelected.value)
  isModalAddTransOpen.value = true;
};

const oncloseModalTransaction = () => {
  // Close the modal
  isModalAddTransOpen.value = false;
};

</script>


<style lang="scss">
@use './settings';
</style>