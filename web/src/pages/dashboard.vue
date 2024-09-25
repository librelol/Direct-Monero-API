<template>
    <v-app>

      <v-content>
        <v-container>
          <v-row>
            <v-col>
              <v-card>
                <v-card-title>
                  <span class="headline">Welcome, {{ username }}</span>
                </v-card-title>
                <v-card-text>
                  <p>This is your dashboard.</p>
                </v-card-text>
              </v-card>
            </v-col>
          </v-row>
        </v-container>
      </v-content>
    </v-app>
  </template>
  
  <script>
  export default {
    data() {
      return {
        username: '', // To hold the logged-in user's username
      };
    },
    mounted() {
      this.fetchUsername(); // Fetch username when component is mounted
    },
    methods: {
      async fetchUsername() {
        try {
          const token = localStorage.getItem('token'); // Assuming token is stored in localStorage
          const response = await fetch('http://localhost:8000/api/me', {
            method: 'GET',
            headers: {
              Authorization: `Bearer ${token}`, // Attach token to the request
              'Content-Type': 'application/json',
            },
          });
  
          if (!response.ok) {
            throw new Error('Failed to fetch username');
          }
  
          const data = await response.json();
          this.username = data.username; // Store username in data
        } catch (error) {
          console.error('Error fetching username:', error);
          this.username = 'Guest'; // Fallback if there's an error
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>
  