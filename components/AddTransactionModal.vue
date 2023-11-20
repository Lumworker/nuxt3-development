<!-- AddTransactionModal.vue -->
<template>
    <v-dialog v-model="dialog" fluid max-width="700" :persistent="false" @click:outside="handleOutsideClick()">
        <v-card>
            {{ ticketSelected }}
            <form @submit.prevent="submit">
                <v-container class="m-10">
                    <h1 class="text-3xl font-bold underline mb-3">
                        Buy Ticket
                    </h1>
                    <v-row>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="buyerName.value.value"
                                :error-messages="buyerName.errorMessage.value" label="buyerName"></v-text-field>
                        </v-col>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="ticketType.value.value"
                                :error-messages="ticketType.errorMessage.value" label="ticketType"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="amout.value.value"
                                :error-messages="amout.errorMessage.value" label="amout"></v-text-field>
                        </v-col>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="buyerDate.value.value"
                                :error-messages="buyerDate.errorMessage.value" label="buyerDate"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="price.value.value"
                                :error-messages="price.errorMessage.value" label="Price"></v-text-field>
                        </v-col>
                    </v-row>

                    <v-row>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-card-actions>
                                <v-btn type="submit" block class="text-none mb-4" color="indigo-darken-3" size="x-large"
                                    :disabled="loading" :loading="loading" variant="flat">
                                    Verify and continue
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
const { handleSubmit } = useForm({})

// Props
const props = defineProps({
    dialog: Boolean,
    oncloseModalTransaction: { type: Function as PropType<() => void> },
    getTicketTransaction: { type: Function as PropType<() => void> },
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
    buyerDate.value.value = props.ticketSelected?.buyerDate || new Date();
});

onMounted(() => {
    buyerName.value.value = 'John Doe';
    ticketType.value.value = props.ticketSelected?.ticketType || '';
    amout.value.value = props.ticketSelected?.miniMumBuying || null;
    price.value.value = updatePrice(props.ticketSelected?.miniMumBuying, props.ticketSelected?.Price) || 0;
    buyerDate.value.value = props.ticketSelected?.buyerDate || new Date();
})

const updatePrice = (counter: number = 0, price: number = 0) => {
    return counter * price;
};

const addTicketTransaction = async (payload: object): Promise<any> => {

    loading.value = true;
    try {
        // Validate form fields
        // if (!validateForm()) {
        //     console.error("Form validation failed");
        //     return;
        // }

        const { result } = await $fetch("/api/add?col=ticketTransaction", {
            method: "POST",
            body: JSON.stringify(payload),
        });
        handleOutsideClick();
        getTicketTransaction();
        loading.value = false;
        return result;
    } catch (error) {
        loading.value = false;
        console.log((error as Error).message);
    }
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
