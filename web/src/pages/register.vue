<template>
    <v-container class="fill-height" fluid>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4">
          <v-card>
            <v-card-title>
              <span class="headline">Register</span>
            </v-card-title>
            <v-card-text>
              <v-form @submit.prevent="register">
                <v-text-field
                  v-model="username"
                  label="Username"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="password"
                  label="Password"
                  type="password"
                  required
                ></v-text-field>
                <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert> <!-- Display error messages -->
                <v-alert v-if="successMessage" type="success">{{ successMessage }}</v-alert> <!-- Display success messages -->
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-spacer></v-spacer>
              <v-btn color="primary" @click="register">Register</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '',
        password: '',
        errorMessage: '',
        successMessage: '' // For displaying success messages
      };
    },
    methods: {
      async register() {
        this.errorMessage = ''; // Clear previous errors
        this.successMessage = ''; // Clear previous success messages
        try {
          const response = await fetch('http://localhost:8000/api/register', { // API endpoint for registration
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              username: this.username,
              password: this.password
            })
          });
  
          if (response.ok) {
            const data = await response.json();
            this.successMessage = data.message; // Show success message
            this.$router.push('/login'); // Redirect to login page on success
          } else {
            const errorData = await response.json();
            this.errorMessage = errorData.message; // Show error message
          }
        } catch (error) {
          console.error('Error registering:', error);
          this.errorMessage = 'Something went wrong, please try again.'; // Handle unexpected errors
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>