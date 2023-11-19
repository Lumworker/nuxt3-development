<!-- AddTransactionModal.vue -->
<template>
    <v-dialog v-model="dialog" max-width="auto" :persistent="false" @click:outside="props.closeModalTransaction()">
        <v-card>
            <v-card-title class="headline">Add Transaction</v-card-title>

            <v-card-actions>
                <v-btn color="primary" block @click="props.closeModalTransaction()">Close</v-btn>
            </v-card-actions>

        </v-card>
    </v-dialog>
</template>

<script setup>
import { defineProps } from 'vue';

// Props
const props = defineProps({ dialog: Boolean, closeModalTransaction: { type: Function } });
const { dialog } = toRefs(props);

</script>
