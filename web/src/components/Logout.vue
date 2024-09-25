<template>
    <v-btn color="red" @click="logout">
      Logout
    </v-btn>
  </template>
  
  <script>
  export default {
    methods: {
      logout() {
        // Clear the token from local storage
        localStorage.removeItem('token');
        
        // Redirect to login page
        this.$router.push('/');
      }
    }
  };
  </script>
  
  <style scoped>
  /* You can add additional styling here if needed */
  </style>
  