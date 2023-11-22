<!-- components/DetailModal.vue -->

<template>
    <v-dialog v-model="dialog" max-width="800" @click:outside="handleOutsideClick">
        <div class="mt-10">
            <v-table fixed-header>
                <thead>
                    <tr>
                        <th class="text-left">Ticket Type</th>
                        <th class="text-left">Ticket Date</th>
                        <th class="text-left">Name</th>
                        <th class="text-left">Total Price</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in data" :key="item.id">
                        <td>{{ item.ticketType }}</td>
                        <td>{{ dayjs(item.buyerDate).format('YYYY-MM-DD') }}</td>
                        <td>{{ item.buyerName }}</td>
                        <td>{{ item.price }}</td>
                    </tr>
                </tbody>
            </v-table>
        </div>
    </v-dialog>
</template>


<script setup lang="ts">
import { defineProps } from 'vue';
import dayjs from 'dayjs';



// Props
const props = defineProps({
    dialog: Boolean,
    title: String,
    data: Array as () => DataItem[], // Explicitly specify the array type
    oncloseModalDetail: Function,
    getTicketTransaction: Function,
});

const { dialog, data } = toRefs(props);

// Interface for item in the 'data' array
interface DataItem {
    buyerDate: string;
    id: string;
    buyerName: string;
    ticketType: string;
    amout: string | number;
    price: string | number;
}


// Headers for the table
const headers = [
    { text: 'Ticket Type', value: 'ticketType' },
    { text: 'Ticket Date', value: 'buyerDate' },
    { text: 'Name', value: 'buyerName' },
    { text: 'Total Price', value: 'price' },
];

const handleOutsideClick = () => {
    if (props.oncloseModalDetail) {
        props.oncloseModalDetail();
        getTicketTransaction();
    }
};

const getTicketTransaction = () => {
    if (props.getTicketTransaction) {
        props.getTicketTransaction();
    }
};
</script>
