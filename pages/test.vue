<template>
    <v-container>
        <v-row justify="space-around">
            <v-date-picker color="primary" v-model="date" :min="mindate" max="2018-03-20"></v-date-picker>
        </v-row>
    </v-container>
</template>
<script setup lang="ts">
import dayjs from 'dayjs';
import { ref } from 'vue';
const date = ref(new Date('2018-03-02'));
const mindate = ref(dayjs('2018-03-02').subtract(1, "year"));
</script>
