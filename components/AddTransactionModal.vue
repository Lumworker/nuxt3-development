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
                            <v-text-field variant="outlined" v-model="name.value.value"
                                :error-messages="name.errorMessage.value" label="Name"></v-text-field>
                        </v-col>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="ticketType.value.value"
                                :error-messages="ticketType.errorMessage.value" label="ticketType"></v-text-field>
                        </v-col>
                    </v-row>
                    <v-row>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="countTicket.value.value"
                                :error-messages="countTicket.errorMessage.value" label="countTicket"></v-text-field>
                        </v-col>
                        <v-col v class="md-6 xs-12 w-full">
                            <v-text-field variant="outlined" v-model="dateAt.value.value"
                                :error-messages="dateAt.errorMessage.value" label="dateAt"></v-text-field>
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
const props = defineProps({ dialog: Boolean, oncloseModalTransaction: { type: Function as PropType<() => void> }, ticketSelected: Object });
const { dialog, ticketSelected } = toRefs(props);

const loading = ref(false);
// Form fields without default values
const name = useField('name');
const ticketType = useField('ticketType');
const countTicket = useField('countTicket'); // Example default value
const dateAt = useField('dateAt'); // Example default value
const price = useField('price'); // Example default value



watch(() => countTicket.value.value, () => {
    price.value.value = updatePrice(countTicket.value.value as number, props.ticketSelected?.Price);
});
watch(() => props.ticketSelected, () => {
    console.log("🚀 ~ ticketSelected:", props.ticketSelected)
    name.value.value = 'John Doe';
    ticketType.value.value = props.ticketSelected?.ticketType || '';
    countTicket.value.value = props.ticketSelected?.miniMumBuying || null;
    price.value.value = updatePrice(props.ticketSelected?.miniMumBuying, props.ticketSelected?.Price) || 0;
    dateAt.value.value = props.ticketSelected?.dateAt || new Date();
});

onMounted(() => {
    name.value.value = 'John Doe';
    ticketType.value.value = props.ticketSelected?.ticketType || '';
    countTicket.value.value = props.ticketSelected?.miniMumBuying || null;
    price.value.value = updatePrice(props.ticketSelected?.miniMumBuying, props.ticketSelected?.Price) || 0;
    dateAt.value.value = props.ticketSelected?.dateAt || new Date();
})

const updatePrice = (counter: number = 0, price: number = 0) => {
    return counter * price;
};


// function onInvalidSubmit({ values, errors, results }: any) {
//     console.log('onInvalidSubmit():');
//     console.log(values);
//     console.log('Errors: ', errors);
//     console.log('Detailed results: ', results);
// }



const submit = handleSubmit(async (values) => {
    console.log("🚀 ~ countTicket :", values)
    // loading.value = true;

});

//for type script support
const handleOutsideClick = () => {
    if (props.oncloseModalTransaction) {
        props.oncloseModalTransaction();
    }
};

</script>
