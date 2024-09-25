<template>
  <v-navigation-drawer theme="dark" permanent>
    <v-list color="transparent">
      <v-list-item title="Crypto Market" subtitle="Vuetify"></v-list-item>
      <v-divider></v-divider>
      <v-list-item 
        v-for="item in menuItems" 
        :key="item.title" 
        @click="navigateTo(item.route)"
      >
        <v-list-item-title>
          <v-icon left>{{ item.icon }}</v-icon>
          {{ item.title }}
        </v-list-item-title>
      </v-list-item>
    </v-list>

    <template v-slot:append>
      <div class="pa-2">
        <v-btn block class="bg-deep-purple" @click="logout">Logout</v-btn>
      </div>
    </template>
  </v-navigation-drawer>
</template>

<script>
export default {
  data() {
    return {
      menuItems: [
        { title: 'Dashboard', route: '/dashboard', icon: 'mdi-view-dashboard' },
        { title: 'Settings', route: '/settings', icon: 'mdi-gavel' },
      ],
    };
  },
  methods: {
    navigateTo(route) {
      this.$router.push(route); // Navigate to the selected route
    },
    logout() {
      localStorage.removeItem('token'); // Clear the token
      this.$router.push('/login'); // Redirect to login page
    },
  },
};
</script>

<style scoped>
/* Add any additional styles if needed */
</style>
