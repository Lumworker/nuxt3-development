<template #default>
  <v-app>
    <v-container>
      <v-row>
        <v-col v-for="(ticket, index) in ticketStore" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-card :color="ticket.color" @click="changeColor(index)">
            <v-card-title>{{ ticket.ticketType }}</v-card-title>
            <v-card-subtitle>Minimum Buying: {{ ticket.miniMumBuying }}</v-card-subtitle>
            <v-card-subtitle>Limit Per Day: {{ ticket.limitPerDay }}</v-card-subtitle>
            <v-card-subtitle>Price: {{ ticket.Price }}</v-card-subtitle>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    
    <div>
      <form @submit.prevent="addMasterTicketStore" id="form" class="card p-5">
        <h2 class="subtitle is-3">Add page</h2>
        <div class="field">
          <label class="label">ticketType</label>
          <div class="control">
            <input class="input" type="text" v-model="formState.ticketType" />
          </div>
        </div>

        <div class="field">
          <label class="label">miniMumBuying</label>
          <div class="control">
            <input class="input" type="number" v-model="formState.miniMumBuying" />
          </div>
        </div>

        <div class="field">
          <label class="label">limitPerDay</label>
          <div class="control">
            <input class="input" type="number" v-model="formState.limitPerDay" />
          </div>
        </div>

        <div class="field">
          <label class="label">Price</label>
          <div class="control">
            <input class="input" type="number" v-model="formState.Price" />
          </div>
        </div>
      </form>

      <v-icon :icon="mdiAccount" />
      <v-btn @click="addMasterTicketStore">addMasterTicketStore</v-btn>
    </div>
  </v-app>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
import { mdiAccount } from '@mdi/js';

interface TicketType {
  ticketType: string;
  miniMumBuying: number;
  limitPerDay: number;
  Price: number;
}

const ticketStore = ref<TicketType[]>([]);

const formState = ref<TicketType>({
  ticketType: "B",
  miniMumBuying: 0,
  limitPerDay: 0,
  Price: 0,
});

const addMasterTicketStore = async (): Promise<any> => {
  try {
    const { result } = await $fetch("/api/add?col=ticketStore", {
      method: "POST",
      body: JSON.stringify(formState.value),
    });
    (document.getElementById("form") as HTMLFormElement).reset();
    await getTicketStore();
    return result;
  } catch (error) {
    console.log((error as Error).message);
  }
};

const getTicketStore = async (): Promise<void> => {
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

const changeColor = (index: number): void => {
  // Set the clicked card to a different color
  ticketStore.value[index].color = ticketStore.value[index].color === "primary" ? "secondary" : "primary";

  // Remove color from other cards
  ticketStore.value.forEach((ticket, i) => {
    if (i !== index) {
      ticket.color = "";
    }
  });
};


// Fetch data on component mount
onMounted(async () => {
  getTicketStore();

  onBeforeUnmount(() => {
    getTicketStore();
  });
});
</script>

<style scoped></style>
