<template>
  <v-app>
    <v-main>
      <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
          <v-col cols="12" md="8">
            <v-card>
              <v-card-title>
                <span class="headline">Welcome to a Crypto-Based marketplace</span>
              </v-card-title>
              <v-card-text>
                <p>
                  We’re excited to have you here! This application is designed to help you manage your tasks efficiently.
                </p>
                <p>
                  Please log in or register to get started!
                </p>
              </v-card-text>
              <v-card-actions>
                <v-btn color="primary" @click="navigateToLogin">Login</v-btn>
                <v-btn color="secondary" @click="navigateToRegister">Register</v-btn>
              </v-card-actions>
            </v-card>
          </v-col>
        </v-row>
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>

</script>

<style scoped>
</style>
