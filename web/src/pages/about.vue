<template>
    <v-container class="about">
        <v-row>
            <v-col>
                <v-card>
                    <v-card-title>
                        About Us
                    </v-card-title>
                    <v-card-text>
                        Welcome to Crypto Market! We provide the latest information and trends in the cryptocurrency world.
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
export default {
    name: 'About'
}
</script>

<style scoped>
.about {
    padding: 20px;
}

.v-card-title {
    font-size: 2em;
    margin-bottom: 10px;
}

.v-card-text {
    font-size: 1.2em;
}
</style>