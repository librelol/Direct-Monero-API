<template>
    <v-container>
        <v-row justify="center">
            <v-col cols="12" md="10">
                <v-card class="elevation-12">
                    <v-card-title>
                        <span class="headline">Change Display Name</span>
                    </v-card-title>
                    <v-card-subtitle>
                        <span style="color: red; font-weight: bold;">Disclaimer: Use a generic name to protect your privacy</span>
                    </v-card-subtitle>
                    <v-card-text>
                        <v-form ref="form" v-model="valid" lazy-validation>
                            <v-text-field
                                v-model="newDisplayName"
                                :rules="displayNameRules"
                                label="New Display Name"
                                required
                            ></v-text-field>
                            <v-btn :disabled="!valid" color="primary" @click="changeDisplayName">
                                Change Display Name
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
import { ref } from 'vue';

const newDisplayName = ref('');
const valid = ref(false);
const success = ref('');
const error = ref('');

const displayNameRules = [
    v => !!v || 'Display name is required',
    v => (v && v.length <= 50) || 'Display name must be less than 50 characters',
    v => (v && (v.match(/\d/g) || []).length >= 4) || 'Display name must contain at least 4 numbers',
    v => (v && (v.match(/[a-zA-Z]/g) || []).length >= 2) || 'Display name must contain more than 2 letters',
];

const changeDisplayName = async () => {
    const token = localStorage.getItem('token');
    try {
        const response = await fetch('http://localhost:8000/api/change_display_name', {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ displayName: newDisplayName.value }),
        });

        if (!response.ok) {
            throw new Error('Failed to change display name');
        }

        const data = await response.json();
        success.value = data.message;
        error.value = '';
    } catch (err) {
        error.value = err.message;
        success.value = '';
    }
};
</script>