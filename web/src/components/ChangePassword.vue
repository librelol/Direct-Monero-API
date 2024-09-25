<template>
    <v-container>
      <v-row justify="center">
        <v-col cols="12" md="10"> <!-- Same structure as the user profile component -->
          <v-card class="elevation-12">
            <v-card-title>
              <span class="headline">Change Password</span>
            </v-card-title>
            <v-card-text>
              <v-form ref="form" v-model="valid" lazy-validation>
                <v-text-field
                  v-model="oldPassword"
                  :rules="oldPasswordRules"
                  label="Old Password"
                  type="password"
                  required
                ></v-text-field>
  
                <v-text-field
                  v-model="newPassword"
                  :rules="newPasswordRules"
                  label="New Password"
                  type="password"
                  required
                ></v-text-field>
  
                <v-text-field
                  v-model="confirmPassword"
                  :rules="confirmPasswordRules"
                  label="Confirm New Password"
                  type="password"
                  required
                ></v-text-field>
  
                <v-alert v-if="error" type="error" dismissible>
                  {{ error }}
                </v-alert>
                <v-alert v-if="success" type="success" dismissible>
                  {{ success }}
                </v-alert>
              </v-form>
            </v-card-text>
            <v-card-actions>
              <v-btn :disabled="!valid" color="primary" @click="changePassword">Change Password</v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </template>
  
  <script setup>
  import { ref } from 'vue';
  
  const oldPassword = ref('');
  const newPassword = ref('');
  const confirmPassword = ref('');
  const success = ref('');
  const error = ref('');
  const valid = ref(false);
  
  const oldPasswordRules = [
    v => !!v || 'Old Password is required.',
  ];
  
  const newPasswordRules = [
    v => !!v || 'New Password is required.',
    v => v.length >= 6 || 'New Password must be at least 6 characters long.',
  ];
  
  const confirmPasswordRules = [
    v => !!v || 'Confirm Password is required.',
    v => v === newPassword.value || 'Passwords do not match.',
  ];
  
  // Function to handle password change
  const changePassword = async () => {
    const token = localStorage.getItem('token'); // Retrieve token from local storage
    const response = await fetch('http://localhost:8000/api/change_password', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`, // Attach token to request
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        oldPassword: oldPassword.value,
        newPassword: newPassword.value,
      }),
    });
  
    if (response.ok) {
      success.value = 'Password changed successfully!';
      error.value = '';
      oldPassword.value = '';
      newPassword.value = '';
      confirmPassword.value = '';
    } else {
      const data = await response.json();
      error.value = data.message || 'An error occurred while changing the password.';
      success.value = '';
    }
  };
  </script>
  
  <style scoped>
  </style>
  