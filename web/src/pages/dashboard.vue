<template>
    <v-app>
      <v-navigation-drawer app permanent>
        <v-list>
          <v-list-item v-for="item in menuItems" :key="item.title" @click="navigateTo(item.route)">
            <v-list-item-title>{{ item.title }}</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-navigation-drawer>
  
      <v-app-bar app>
        <v-toolbar-title>My Dashboard</v-toolbar-title>
      </v-app-bar>
  
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
              <v-card-actions>
                <v-btn color="red" @click="logout">Logout</v-btn>
              </v-card-actions>
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
        username: '', // To hold the logged-in user's username
        menuItems: [
          { title: 'Dashboard', route: '/' },
          { title: 'Profile', route: '/profile' },
          { title: 'Settings', route: '/settings' },
        ],
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
      async logout() {
        localStorage.removeItem('token'); // Clear the token
        this.username = ''; // Reset the username
        this.$router.push('/login'); // Redirect to login page
      },
      navigateTo(route) {
        this.$router.push(route); // Navigate to the selected route
      },
    },
  };
  </script>
  
  <style scoped>
  .fill-height {
    height: 100vh;
  }
  </style>
  