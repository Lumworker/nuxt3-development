<template>
  <v-app>
    <v-container fluid fill-height>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="6">
          <!-- Rounded box with medium size -->
          <v-card class="rounded-box" elevation="12">
            <!-- Three horizontal cards -->
            <v-row>
              <v-col v-for="card in cards" :key="card.id" cols="4">
                <v-card class="pa-3 text-center">
                  <!-- Ticket movie icon -->
                  <v-icon color="primary">mdi-movie-ticket</v-icon>
                  <div>{{ card.title }}</div>
                </v-card>
              </v-col>
            </v-row>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      cards: [
        { id: 1, title: 'Movie 1' },
        { id: 2, title: 'Movie 2' },
        { id: 3, title: 'Movie 3' },
      ],
    };
  },
};
</script>

<style scoped>
.rounded-box {
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}
</style>
