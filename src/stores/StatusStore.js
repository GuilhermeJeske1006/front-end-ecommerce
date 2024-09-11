import axios from 'axios';
import { defineStore } from 'pinia';


export const useStatusStore = defineStore('status', {
  state() {
    return {
      isLoading: false,
      status_pagamento: {},
      status_envio: {},
    };
  },

  actions: {
    GetStatusPagamento() {
      this.isLoading = true

      return new Promise((resolve, reject) => {
        axios
          .get(`/status-pagamento`)
          .then((res) => {
            this.status_pagamento = res.data
            
            resolve(); 
          })
          .catch((error) => {
            reject(error); 
          })
          .finally(() => {
            this.isLoading = false; 
          });
      });
    },

    GetStatusEnvio() {
        this.isLoading = true
  
        return new Promise((resolve, reject) => {
          axios
            .get(`/status-envio`)
            .then((res) => {
              this.status_envio = res.data
              
              resolve();
            })
            .catch((error) => {
              reject(error); 
            })
            .finally(() => {
              this.isLoading = false; 
            });
        });
      },

    
  },

  getters: {

  },
});
