<template>
    <v-col v-for="(ticket, index) in ticketStore" :key="index" :cols="colSize" sm="6" md="4" lg="3">
        <v-card :title="ticket.ticketType" prepend-icon="mdi-ticket " append-icon="mdi-open-in-new">
            <div class="ml-5 mb-3">
                <v-card-subtitle>Minimum Buying: {{ ticket.miniMumBuying }}</v-card-subtitle>
                <v-card-subtitle>Limit Per Day: {{ ticket.limitPerDay }}</v-card-subtitle>
                <v-card-subtitle>Price: {{ ticket.Price }}</v-card-subtitle>
            </div>
        </v-card>
    </v-col>
</template>

<script setup>
import { toRefs, defineProps } from 'vue';

const colSize = "12"; // Adjust this value based on your layout requirements

const props = defineProps({ ticketStore: Object });
const { ticketStore } = toRefs(props);
</script>
