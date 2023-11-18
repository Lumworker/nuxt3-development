<template>
  <v-app>
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12">
          <v-row>
            <v-col>
              <v-card class="pa-3 text-center">
                <pre>{{ ticketStore }}</pre>
              </v-card>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
    </v-container>
    <div>
      <form @submit.prevent="addFirestoreData" id="form" class="card p-5">
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
            <input class="input" type="text" v-model="formState.miniMumBuying" />
          </div>
        </div>

        <div class="field">
          <label class="label">limitPerDay</label>
          <div class="control">
            <input class="input" type="text" v-model="formState.limitPerDay" />
          </div>
        </div>

        <div class="field">
          <label class="label">Price</label>
          <div class="control">
            <input class="input" type="text" v-model="formState.Price" />
          </div>
        </div>

        <!-- <div class="field is-grouped mt-5">
          <div class="control">
            <button class="button is-link">Submit</button>
          </div>
        </div> -->
      </form>

      <v-icon :icon="mdiAccount" />
      <v-btn @click="addFirestoreData">
        addFirestoreData
      </v-btn>
    </div>
  </v-app>
</template>

<script>
import { onMounted, ref } from 'vue';
import { mdiAccount } from '@mdi/js'

export default {
  data: () => ({
    mdiAccount
  }),
  setup() {

    const ticketStore = ref([]);

    const formState = ref({
      ticketType: "B",
      miniMumBuying: "5",
      limitPerDay: 10,
      Price: 2000
    });


    const addFirestoreData = async () => {
      // console.log("🚀 ~ data:", data.target)
      document.getElementById("form").reset();
      try {
        const { result } = await $fetch("/api/add?col=ticketStore", {
          method: "POST",
          body: JSON.stringify(formState.value),
        });
        getTicketStore();
        return result;
      } catch (error) {
        console.log(error.message);
      }
    };

    const getTicketStore = async () => {
      try {
        const { result } = await $fetch("/api/query?col=ticketStore");
        // Update the reactive variable
        ticketStore.value = result.slice().sort((a, b) => a.ticketType.localeCompare(b.ticketType));
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    }

    // Fetch data on component mount
    onMounted(async () => {
      getTicketStore()

      onBeforeUnmount(() => { getTicketStore() }
      );
    });


    // Return the reactive variable and the handleClick function
    return {
      ticketStore,
      addFirestoreData,
      formState
    };
  },
};
</script>

<style scoped></style>
