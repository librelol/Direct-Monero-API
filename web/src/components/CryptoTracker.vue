<template>
    <v-container>
        <v-row>
            <v-col cols="12">
                <v-text-field
                    v-model="search"
                    label="Search for a cryptocurrency"
                    clearable
                ></v-text-field>
            </v-col>
        </v-row>
        <v-row>
            <v-col
                v-for="crypto in filteredCryptos"
                :key="crypto.id"
                cols="12"
                md="4"
            >
                <v-card>
                    <v-card-title>{{ crypto.name }}</v-card-title>
                    <v-card-subtitle>{{ crypto.symbol.toUpperCase() }}</v-card-subtitle>
                    <v-card-text>
                        <div>Current Price: ${{ crypto.current_price }}</div>
                        <div>Market Cap: ${{ crypto.market_cap }}</div>
                        <div>24h Change: {{ crypto.price_change_percentage_24h }}%</div>
                    </v-card-text>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<script>
import axios from 'axios';

export default {
    data() {
        return {
            cryptos: [],
            search: '',
        };
    },
    computed: {
        filteredCryptos() {
            return this.cryptos.filter((crypto) =>
                crypto.name.toLowerCase().includes(this.search.toLowerCase())
            );
        },
    },
    created() {
        this.fetchCryptos();
    },
    methods: {
        async fetchCryptos() {
            try {
                const response = await axios.get(
                    'https://api.coingecko.com/api/v3/coins/markets',
                    {
                        params: {
                            vs_currency: 'usd',
                            order: 'market_cap_desc',
                            per_page: 10,
                            page: 1,
                            sparkline: false,
                        },
                    }
                );
                this.cryptos = response.data;
            } catch (error) {
                console.error('Error fetching cryptocurrencies:', error);
            }
        },
    },
};
</script>

<style scoped>
.v-card {
    margin-bottom: 20px;
}
</style>