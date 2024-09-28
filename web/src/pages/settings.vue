<template>
  <v-container>
    <v-row justify="center">
      <v-col cols="12" md="8"> <!-- Adjusted column width for better layout -->
        <v-card class="elevation-12">
          <v-card-title>
            <span class="headline">User Profile</span>
          </v-card-title>
          <v-card-text>
            <v-list>
              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>DisplayName:</v-list-item-title>
                  <v-list-item-subtitle>{{ displayName }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>

              <v-list-item>
                <v-list-item-content>
                  <v-list-item-title>Public Key:</v-list-item-title>
                  <v-list-item-subtitle>{{ publicKey }}</v-list-item-subtitle>
                </v-list-item-content>
              </v-list-item>
            </v-list>

            <v-divider></v-divider> <!-- Divider for separation -->

            <v-alert v-if="error" type="error" dismissible>
              {{ error }}
            </v-alert>
            <v-alert v-if="success" type="success" dismissible>
              {{ success }}
            </v-alert>
          </v-card-text>
          <v-card-actions>
            <PublicKey @update="fetchUserProfile" />
          </v-card-actions>
          
          <v-divider></v-divider> <!-- Divider for separation -->

          <v-card-actions>
            <ChangePassword @passwordChanged="fetchUserProfile" />
          </v-card-actions>

          <v-card-actions>
            <ChangeDisplayName @displayNameChanged="fetchUserProfile" />
          </v-card-actions>

          <v-card-actions>
              <DeleteAccount @accountDeleted="handleAccountDeletion" />
          </v-card-actions>
          
        </v-card>
        <v-spacer></v-spacer>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import ChangePassword from '@/components/ChangePassword.vue';
import PublicKey from '@/components/PublicKey.vue'; // Ensure PublicKey is imported

const displayName= ref('');
const publicKey = ref('');
const success = ref('');
const error = ref('');

const fetchUserProfile = async () => {
  const token = localStorage.getItem('token');
  try {
    const response = await fetch('http://localhost:8000/api/me', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch user profile');
    }

    const data = await response.json();
    displayName.value = data.displayName;
    publicKey.value = data.public_key || 'Not set';
    success.value = '';
    error.value = '';
  } catch (err) {
    error.value = err.message;
    success.value = '';
  }
};

onMounted(fetchUserProfile);
</script>

<style scoped>
.v-card {
  padding: 20px; /* Add padding for better spacing */
}

.v-list-item-title {
  font-weight: bold; /* Make titles bold */
}

.v-divider {
  margin: 20px 0; /* Add margin to dividers for spacing */
}
</style>
