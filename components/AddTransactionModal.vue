<!-- AddTransactionModal.vue -->
<template>
    <v-dialog v-model="dialog" fluid max-width="700" :persistent="false" @click:outside="handleOutsideClick()">
        <v-card>
        <!-- {{ ticketSelected }}
            --
                {{ ticketTransaction }} -->
            <form @submit.prevent="submit">
                <v-container class="m-10">
                    <h1 class="text-3xl font-bold underline mb-3">
                        Buy Ticket
                    </h1>
                    <v-row>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="buyerName.value.value"
                                :error-messages="buyerName.errorMessage.value" label="Name"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="amout.value.value"
                                :error-messages="amout.errorMessage.value" label="amout"></v-text-field>
                        </v-col>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="buyerDate.value.value" :formatter="format"
                                :error-messages="buyerDate.errorMessage.value" label="Ticket Date"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="ticketType.value.value" readonly
                                :error-messages="ticketType.errorMessage.value" label="Type of Ticket"></v-text-field>
                        </v-col>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="price.value.value" readonly
                                :error-messages="price.errorMessage.value" label="Total Price"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-card-actions>
                                <v-btn type="submit" block class="text-none mb-4" color="indigo-darken-3" size="x-large"
                                    :disabled="loading" :loading="loading" variant="flat">
                                    Submit
                                </v-btn>

                            </v-card-actions>
                        </v-col>
                    </v-row>
                </v-container>

            </form>
        </v-card>
    </v-dialog>
</template>

<script setup lang="ts">
import { defineProps, onMounted, ref } from 'vue';
import { useField, useForm, ErrorMessage } from 'vee-validate'
import dayjs from 'dayjs';

const { handleSubmit } = useForm({})


// Props
const props = defineProps({
    dialog: Boolean,
    oncloseModalTransaction: { type: Function as PropType<() => void> },
    getTicketTransaction: { type: Function as PropType<() => void> },
    ticketTransaction: Array,
    ticketSelected: Object
});
const { dialog, ticketSelected } = toRefs(props);

const loading = ref(false);
// Form fields without default values
const buyerName = useField('buyerName');
const ticketType = useField('ticketType');
const amout = useField('amout'); // Example default value
const buyerDate = useField('buyerDate'); // Example default value
const price = useField('price'); // Example default value




watch(() => amout.value.value, () => {
    price.value.value = updatePrice(amout.value.value as number, props.ticketSelected?.Price);
});
watch(() => props.ticketSelected, () => {
    console.log("🚀 ~ ticketSelected:", props.ticketSelected)
    buyerName.value.value = 'John Doe';
    ticketType.value.value = props.ticketSelected?.ticketType || '';
    amout.value.value = props.ticketSelected?.miniMumBuying || null;
    price.value.value = updatePrice(props.ticketSelected?.miniMumBuying, props.ticketSelected?.Price) || 0;
    buyerDate.value.value = format(props.ticketSelected?.buyerDate) || format(new Date());
});

onMounted(() => {
    buyerName.value.value = 'John Doe';
    ticketType.value.value = props.ticketSelected?.ticketType || '';
    amout.value.value = props.ticketSelected?.miniMumBuying || null;
    price.value.value = updatePrice(props.ticketSelected?.miniMumBuying, props.ticketSelected?.Price) || 0;
    buyerDate.value.value = format(props.ticketSelected?.buyerDate) || format(new Date());
})

const updatePrice = (counter: number = 0, price: number = 0) => {
    const total = formatPrice(counter * price)
    return total;
};


const validateForm = (payload: any): boolean => {
    // Extract relevant information from props
    const { ticketSelected, ticketTransaction } = props;

    // Ensure ticketTransaction is an array
    if (!Array.isArray(ticketTransaction)) {
        alert('Invalid ticket data');
        return false;
    }

    // Extract ticket type and amout from the payload
    const { ticketType, amout, buyerDate } = payload;

    // Validate buyerDate format
    if (!isDateValid(buyerDate)) {
        alert('Invalid date format. Please use YYYY-MM-DD.');
        return false;
    }
    // Validate that amout is a positive number
    const amoutNum = parseInt(amout, 10);
    if (isNaN(amoutNum) || amoutNum <= 0) {
        alert('Invalid amount. Please enter a positive number.');
        return false;
    }

    // Find tickets in ticketTransaction that match buyerDate and ticketType
    const matchingTickets = ticketTransaction?.filter(
        (ticket: any) => ticket.buyerDate === buyerDate && ticket.ticketType === ticketType
    );

    // Extract limitPerDay and miniMumBuying from the found ticketSelected
    const limitPerDay = parseInt(ticketSelected?.limitPerDay, 10) || 0;
    const minimumBuying = parseInt(ticketSelected?.miniMumBuying, 10) || 0;

    // Calculate the total amount from matching tickets
    const totalAmout = matchingTickets?.reduce((acc: number, ticket: any) => acc + parseInt(ticket.amout, 10), 0);

    // Calculate the remaining amount that the user can fill
    const remainingAmout = Math.max(limitPerDay - totalAmout, 0);

    // Check if the available amount is zero (sold out)
    if (remainingAmout === 0) {
        alert('Sold Out. No more available.');
        return false;
    }

    // Ensure the total amout does not exceed the limitPerDay and is above minimumBuying
    if (totalAmout + amoutNum > limitPerDay || amoutNum < minimumBuying) {
        alert(`Exceeds limit or below minimum. Fill up to ${remainingAmout} more.`);
        return false;
    }

    // If all conditions pass, return true
    return true;
};


const addTicketTransaction = async (payload: object): Promise<any> => {

    loading.value = true;
    try {

        //example payload
        // {
        //     "buyerName": "John Doe",
        //         "amout": "2",
        //             "price": 10000,
        //                 "ticketType": "A",
        //                     "buyerDate": "2023-11-22",
        //                         "id": "2023-11-2210000"
        // }

        // Validate form fields
        if (!validateForm(payload)) {
            console.error("Form validation failed");
            loading.value = false;
            return;
        } else {
            console.log("CALL API")
            const { result } = await $fetch("/api/add?col=ticketTransaction", {
                method: "POST",
                body: JSON.stringify(payload),
            });
            handleOutsideClick();
            getTicketTransaction();
            loading.value = false;
            return result;
        }
    } catch (error) {
        loading.value = false;
        alert((error as Error).message);
    }
};

const isDateValid = (dateString: string): boolean => {
    const regex = /^\d{4}-\d{2}-\d{2}$/;
    return regex.test(dateString);
};


const submit = handleSubmit(async (values) => {
    console.log("🚀 ~ amout :", values)
    if (values) {
        const payload = {
            buyerName: values.buyerName,
            amout: values.amout,
            price: values.price,
            ticketType: values.ticketType,
            buyerDate: values.buyerDate,
            id: values.buyerDate + values.price,
        }
        addTicketTransaction(payload)
    }

});

const format = (value: string | Date): string => {
    // Use dayjs.js to format the date
    return dayjs(value).format('YYYY-MM-DD'); // Adjust the format as needed
};

// Format the price value with commas
const formatPrice = (value: number): string => {
    return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
//for type script support
const handleOutsideClick = () => {
    if (props.oncloseModalTransaction) {
        props.oncloseModalTransaction();
    }
};
//for type script support
const getTicketTransaction = () => {
    if (props.getTicketTransaction) {
        props.getTicketTransaction();
    }
};

</script>
