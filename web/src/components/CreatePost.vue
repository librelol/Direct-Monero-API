<template>
    <v-container>
      <v-form ref="form" v-model="valid" @submit.prevent="submitForm">
        <v-text-field
          v-model="post.title"
          :rules="[rules.required]"
          label="Title"
          required
        ></v-text-field>
  
        <v-textarea
          v-model="post.productDescription"
          label="Product Description"
        ></v-textarea>
  
        <v-text-field
          v-model="post.price"
          :rules="[rules.required, rules.number]"
          label="Price"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="post.amountPerPrice"
          :rules="[rules.required, rules.number]"
          label="Amount Per Price"
          required
        ></v-text-field>
  
        <v-text-field
          v-model="post.unitAmount"
          :rules="[rules.required, rules.number]"
          label="Unit Amount"
          required
        ></v-text-field>
  
        <v-switch
          v-model="post.onSale"
          label="On Sale"
        ></v-switch>
  
        <v-file-input
          v-model="image"
          label="Upload Image"
          accept="image/*"
          prepend-icon="mdi-camera"
        ></v-file-input>
  
        <v-btn :disabled="!valid" color="success" @click="submitForm">
          Submit
        </v-btn>
      </v-form>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    data() {
      return {
        valid: false,
        post: {
          title: '',
          productDescription: '',
          price: '',
          amountPerPrice: '',
          unitAmount: '',
          onSale: false,
        },
        image: null,
        rules: {
          required: value => !!value || 'Required.',
          number: value => !isNaN(value) || 'Must be a number.',
        },
      };
    },
    methods: {
      async submitForm() {
        if (this.$refs.form.validate()) {
          const formData = new FormData();
          formData.append('title', this.post.title);
          formData.append('productDescription', this.post.productDescription);
          formData.append('price', this.post.price);
          formData.append('amountPerPrice', this.post.amountPerPrice);
          formData.append('unitAmount', this.post.unitAmount);
          formData.append('onSale', this.post.onSale);
          if (this.image) {
            formData.append('image', this.image);
          }
  
          try {
            const response = await axios.post('http://localhost:8000/api/post/create_post', formData, {
              headers: {
                'Content-Type': 'multipart/form-data',
                Authorization: `Bearer ${localStorage.getItem('token')}`,
              },
            });
            console.log(response.data);
            this.$emit('postCreated', response.data.post);
          } catch (error) {
            console.error(error);
          }
        }
      },
    },
  };
  </script>
  
  <style scoped>
  .v-container {
    max-width: 600px;
    margin: 0 auto;
  }
  </style>