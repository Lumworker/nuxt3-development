<template>
    <div class="text-center">
        <v-overlay v-model="overlay"></v-overlay>
    </div>
</template>
<script setup lang="ts">

const props = defineProps({ overlay: Boolean });
const { overlay } = toRefs(props);

</script>