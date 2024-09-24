<template>
  <v-footer height="60" app>
    <div class="d-flex justify-content-between align-center" style="width: 100%; padding: 0 16px;">
      <div>
        <span>&copy; {{ new Date().getFullYear() }} My Application. All rights reserved.</span>
      </div>
      <div>
        <v-btn text @click="navigateToPrivacy">Privacy Policy</v-btn>
        <v-btn text @click="navigateToTerms">Terms of Service</v-btn>
      </div>
    </div>
  </v-footer>
</template>

<script setup>
import { useRouter } from 'vue-router';

const router = useRouter();

const navigateToPrivacy = () => {
  router.push('/privacy'); // Adjust the route as needed
};

const navigateToTerms = () => {
  router.push('/terms'); // Adjust the route as needed
};
</script>

<style scoped>

</style>
