<template #default>
  <Loading :overlay="overlay" />
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
      :ticketSelected="ticketSelected" :getTicketTransaction="getTicketTransaction"
      :ticketTransaction="ticketTransaction" />

    <detail-modal :getTicketTransaction="getTicketTransaction" :dialog="isModalDetail" title="a" :data="dataModalDetail"
      :oncloseModalDetail="oncloseModalDetail" />
    <div>

      <h1 class="text-4xl font-extrabold">Transction</h1>
      <h5 class="text-xl ">สามารถคลิกข้อมูลในตารางเพื่อดูรายละเอียด</h5>
      <h5 class="">*เช่น คลิกที่ชื่อเพื่อดูตั๋วทั้งหมดที่คนดังกล่าวเป็นเจ้าของ</h5>
      <h5 class="">*เช่น คลิกที่ประเภทตั๋วนั้นๆ เพื่อดูตั๋วทั้งหมดที่ขายออก</h5>
      <h5 class="">*เช่น คลิกที่วันเพื่อดูตั๋วทั้งหมดในวันนั้น</h5>
      <v-table fixed-header height="300px">
        <thead>
          <tr>
            <th class="text-left">
              Ticket Type
            </th>
            <th class="text-left">
              Ticket Date
            </th>
            <th class="text-left">
              Name
            </th>
            <th class="text-left">
              Total amout
            </th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="item in ticketTransaction" :key="item.id" class="cursor-pointer">
            <td @click="getTransactionDetail('ticketType', item.ticketType)">
              {{ item.ticketType }}
            </td>
            <td @click="getTransactionDetail('buyerDate', item.buyerDate)">
              {{
                dayjs(item.buyerDate).format('YYYY-MM-DD')
              }}
            </td>
            <td @click="getTransactionDetail('buyerName', item.buyerName)">
              {{
                item.buyerName
              }}</td>
            <td>
              {{ item.amout }}
            </td>
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
import DetailModal from '@/components/DetailModal.vue';
import AddTransactionModal from '@/components/AddTransactionModal.vue';
import Loading from '@/components/Loading.vue';
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
};

interface TicketSelected {
  [x: string]: any;
  ticketSelected: any;
};

interface DataItem {
  [x: string]: any;
  buyerDate: string;
  id: string;
  buyerName: string;
  ticketType: string;
  amout: string | number; // Fix the typo here
  price: string | number;
}

const ticketStore = ref<TicketType[]>([]);
const ticketSelected = ref<TicketSelected>({ ticketSelected: null });
const ticketTransaction = ref<TicketType[]>([]);
const dataModalDetail = ref<DataItem[]>([]);
const overlay = ref<boolean>(false);

const getTicketStore = async (): Promise<any> => {
  try {
    overlay.value = true
    const response = await $fetch("/api/query?col=ticketStore");
    const { result } = response as { result: TicketType[] };

    overlay.value = false
    if (result) {
      ticketStore.value = result.slice().sort((a, b) => a.ticketType.localeCompare(b.ticketType));
    } else {
      console.error("Invalid API response format");
    }
  } catch (error) {
    overlay.value = false
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

const getTransactionDetail = async (param: string, condition: string): Promise<any> => {
  try {
    const response = await $fetch(`/api/querycondition?col=ticketTransaction&param=${param}&condition=${condition}`);
    const { result } = response as { result: any[] };

    if (result) {
      isModalDetail.value = true;
      dataModalDetail.value = result;
      console.log("🚀 ~ result:", result)
    } else {
      console.error("Invalid API response format");
    }
  } catch (error) {
    console.error("Error fetching data:", error);
  }
};

const isModalAddTransOpen = ref(false);
const isModalDetail = ref(false);

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


const oncloseModalDetail = () => {
  // Close the modal
  isModalDetail.value = false;
};

</script>


<style lang="scss">
@use './settings';
</style>