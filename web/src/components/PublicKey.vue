<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10">
          <v-card class="elevation-12">
            <v-card-title>
              <span class="headline">Update Public Key</span>
            </v-card-title>
            <v-card-text>
              <v-textarea
                v-model="publicKey"
                label="PGP Public Key"
                placeholder="Enter your PGP public key"
                outlined
                required
                rows="10"
                counter="900"
              />
              <v-alert v-if="error" type="error" dismissible>
                {{ error }}
              </v-alert>
              <v-alert v-if="success" type="success" dismissible>
                {{ success }}
              </v-alert>
            </v-card-text>
            <v-card-actions>
              <v-btn color="primary" @click="updatePublicKey">Update</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const publicKey = ref(''); // Reactive variable to hold the public key
  const success = ref(''); // Reactive variable for success message
  const error = ref(''); // Reactive variable for error message
  
  const updatePublicKey = async () => {
    try {
      const token = localStorage.getItem('token'); // Retrieve token from local storage
      const response = await fetch('http://localhost:8000/api/profile/public_key', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`, // Attach token to request
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ public_key: publicKey.value }), // Send public key in request body
      });
  
      if (!response.ok) {
        throw new Error('Failed to update public key');
      }
  
      const data = await response.json();
      success.value = data.message || 'Public key updated successfully'; // Set success message
      error.value = ''; // Clear error message
      publicKey.value = ''; // Clear input field
    } catch (err) {
      error.value = err.message; // Set error message
      success.value = ''; // Clear success message
    }
  };
  </script>
  
  <style scoped>
  
  </style>
  