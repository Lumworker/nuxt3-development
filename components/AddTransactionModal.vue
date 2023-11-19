<!-- AddTransactionModal.vue -->
<template>
    <v-dialog v-model="dialog" max-width="600px" @input="emitClose">
        <v-card>
            <v-card-title class="headline">Add Transaction</v-card-title>
            <!-- Your modal content goes here -->
            <v-card-actions>
                <v-btn @click="emitClose">Close</v-btn>
            </v-card-actions>
        </v-card>
    </v-dialog>
</template>

<script setup>
import { ref, defineProps } from 'vue';

// Props
const props = defineProps({ ticketStore: Object });
const { dialog } = toRefs(props);
// Emit close event when the dialog is closed
const emitClose = () => {
    emit('close');
};

// Close the dialog when the component is unmounted
onBeforeUnmount(() => {
    emitClose();
});
</script>
