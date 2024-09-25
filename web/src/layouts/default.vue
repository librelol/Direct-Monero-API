<template>
  <v-app>
    <v-main>
      <Siderbar></Siderbar>
      <v-container style="overflow-y: auto; height: 100vh;">
        <router-view />
      </v-container>
    </v-main>
  </v-app>
</template>

<script setup>
  //
</script>
