<template #default>
  <v-app>
    <v-container>
      <v-row>
        <v-col v-for="(ticket, index) in ticketStore" :key="index" cols="12" sm="6" md="4" lg="3">
          <v-card :title="ticket.ticketType" prepend-icon="mdi-ticket " append-icon="mdi-open-in-new">
            <div class="ml-5 mb-3">
              <v-card-subtitle>Minimum Buying: {{ ticket.miniMumBuying }}</v-card-subtitle>
              <v-card-subtitle>Limit Per Day: {{ ticket.limitPerDay }}</v-card-subtitle>
              <v-card-subtitle>Price: {{ ticket.Price }}</v-card-subtitle>
            </div>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
    <!-- Modal insert MasterTicketStore -->
    <div class="text-center">
      <v-btn color="primary" @click="dialog = true">
        addMasterTicketStore
      </v-btn>

      <v-dialog v-model="dialog" width="auto">
        <v-card>
          <v-card-text>
            <form @submit.prevent="addMasterTicketStore" id="form" class="card p-5">
              <h1 class="text-3xl font-bold underline">
                Add MasterTicketStore
              </h1>
              <v-container>
                <v-row>
                  <v-col v class="md-6 xs-12 w-full">
                    <v-text-field label="ticketType" v-model="formState.ticketType"
                      :error-messages="getErrorMessages('ticketType')" @input="clearFieldErrors('ticketType')"
                      variant="outlined" />
                  </v-col>
                  <v-col v class="md-6 xs-12 w-full">
                    <v-text-field label="miniMumBuying" v-model="formState.miniMumBuying"
                      :error-messages="getErrorMessages('miniMumBuying')" @input="clearFieldErrors('miniMumBuying')"
                      variant="outlined" />
                  </v-col>
                </v-row>
                <v-row>
                  <v-col v class="md-6 xs-12 w-full">
                    <v-text-field label="limitPerDay" v-model="formState.limitPerDay"
                      :error-messages="getErrorMessages('limitPerDay')" @input="clearFieldErrors('limitPerDay')"
                      variant="outlined" />
                  </v-col>
                  <v-col v class="md-6 xs-12 w-full">
                    <v-text-field label="Price" v-model="formState.Price" :error-messages="getErrorMessages('Price')"
                      @input="clearFieldErrors('Price')" variant="outlined" />
                  </v-col>
                </v-row>
              </v-container>
            </form>
          </v-card-text>
          <v-card-actions>

            <v-btn color="primary" block @click="addMasterTicketStore">confrim</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </div>

  </v-app>
</template>

<script setup lang="ts">
import { onMounted, onBeforeUnmount, ref } from 'vue';
interface TicketType {
  [x: string]: any;
  ticketType: string;
  miniMumBuying: number;
  limitPerDay: number;
  Price: number;
}
// type ValidationErrors = {
//   [K in keyof TicketType]: string;
// };
const validationErrors: Ref<{
  [K in keyof TicketType]: string;
}> = ref({
  ticketType: '',
  miniMumBuying: '',
  limitPerDay: '',
  Price: '',
});

const ticketTypePattern: RegExp = /^[A-Za-z]+$/;
const numericPattern: RegExp = /^\d+$/;

const validateForm = (): boolean => {
  validationErrors.value.ticketType = ticketTypePattern.test(formState.value.ticketType) ? '' : 'Invalid ticket type';
  validationErrors.value.miniMumBuying = numericPattern.test(String(formState.value.miniMumBuying)) ? '' : 'Invalid minimum buying value';
  validationErrors.value.limitPerDay = numericPattern.test(String(formState.value.limitPerDay)) ? '' : 'Invalid limit per day value';
  validationErrors.value.Price = numericPattern.test(String(formState.value.Price)) ? '' : 'Invalid price value';


  return Object.values(validationErrors.value).every((error) => error === '');
};

const getErrorMessages = (fieldName: keyof TicketType): string => {
  return validationErrors.value[fieldName];
};

const clearFieldErrors = (fieldName: keyof TicketType): void => {
  validationErrors.value[fieldName] = '';
};


const dialog = ref<boolean>(false);

const ticketStore = ref<TicketType[]>([]);

const formState = ref<TicketType>({
  ticketType: "B",
  miniMumBuying: 0,
  limitPerDay: 0,
  Price: 0,
  color: "",
});

const addMasterTicketStore = async (): Promise<any> => {
  try {
    // Validate form fields
    if (!validateForm()) {
      console.error("Form validation failed");
      return;
    }

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

// const changeColor = (index: number): void => {

// };
// Fetch data on component mount
onMounted(async () => {
  getTicketStore();

  onBeforeUnmount(() => {
    getTicketStore();
  });
});
</script>
<style lang="scss">
@use './settings';
</style>