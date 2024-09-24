<template>
    <v-container class="fill-height" fluid>
        <v-row align="center" justify="center">
            <v-col cols="12" sm="8" md="4">
                <v-card>
                    <v-card-title>
                        <span class="headline">Login</span>
                    </v-card-title>
                    <v-card-text>
                        <v-form @submit.prevent="login">
                            <v-text-field
                                v-model="username"
                                label="Username"
                                required
                            ></v-text-field>
                            <v-text-field
                                v-model="password"
                                label="Password"
                                type="password"
                                required
                            ></v-text-field>
                            <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert> <!-- Display error messages -->
                        </v-form>
                    </v-card-text>
                    <v-card-actions>
                        <v-spacer></v-spacer>
                        <v-btn color="primary" @click="login">Login</v-btn>
                    </v-card-actions>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    data() {
        return {
            username: '', // Change 'email' to 'username'
            password: '',
            errorMessage: '' // For displaying error messages
        };
    },
    methods: {
        async login() {
            this.errorMessage = ''; // Clear previous errors
            try {
                const response = await fetch('http://localhost:8000/api/login', { // API endpoint for login
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        username: this.username, // Pass username instead of email
                        password: this.password
                    })
                });

                if (response.ok) {
                    const data = await response.json();
                    localStorage.setItem('token', data.token); // Store token in localStorage
                    this.$router.push('/dashboard'); // Redirect to dashboard on success
                } else {
                    const errorData = await response.json();
                    this.errorMessage = errorData.message; // Show error message
                }
            } catch (error) {
                console.error('Error logging in:', error);
                this.errorMessage = 'Something went wrong, please try again.'; // Handle unexpected errors
            }
        }
    }
};
</script>

<style scoped>
.fill-height {
    height: 100vh;
}
</style>
