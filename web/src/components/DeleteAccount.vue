<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10">
          <v-card class="elevation-12">
            <v-card-title>
              <span class="headline">Delete Account</span>
            </v-card-title>
            <v-card-subtitle>
              <span style="color: red; font-weight: bold;">Warning: This action is irreversible. Please enter your username and type "I confirm" to delete your account.</span>
            </v-card-subtitle>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="username"
                  :rules="usernameRules"
                  label="Username"
                  required
                ></v-text-field>
                <v-text-field
                  v-model="confirmationText"
                  :rules="confirmationRules"
                  label='Type "I confirm"'
                  required
                ></v-text-field>
                <v-btn :disabled="!valid" color="primary" @click="deleteAccount">
                  Delete Account
                </v-btn>
                <v-alert v-if="success" type="success">{{ success }}</v-alert>
                <v-alert v-if="error" type="error">{{ error }}</v-alert>
              </v-form>
            </v-card-text>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref, defineEmits } from 'vue';
  
  const username = ref('');
  const confirmationText = ref('');
  const valid = ref(false);
  const success = ref('');
  const error = ref('');
  
  const usernameRules = [
    v => !!v || 'Username is required',
  ];
  
  const confirmationRules = [
    v => !!v || 'Confirmation is required',
    v => v === 'I confirm' || 'You must type "I confirm" to delete your account',
  ];
  
  const emit = defineEmits(['accountDeleted']);
  
  const deleteAccount = async () => {
    const token = localStorage.getItem('token');
    try {
      const response = await fetch('http://localhost:8000/api/user/delete_account', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username: username.value }),
      });
  
      if (!response.ok) {
        throw new Error('Failed to delete account, make sure its your username not your display name');
      }
  
      const data = await response.json();
      success.value = data.message;
      error.value = '';
      emit('accountDeleted'); // Emit the accountDeleted event
        window.location.href = '/';
    } catch (err) {
      error.value = err.message;
      success.value = '';
    }
  };
  </script>