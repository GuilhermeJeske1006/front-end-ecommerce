import axios from 'axios';
import { defineStore } from 'pinia';
import { useToast } from 'vue-toastification';


export const usePedidoStore = defineStore('pedido', {
  state() {
    return {
      isLoading: false,
      empresa_id: localStorage.getItem('empresa_id'),
      pedidos: [],
      pedido: {},
      envioPago: false,
      modalPagarEnvio: false,
      etiqueta: {
        url: null,
      },
      modalImprimirEtiqueta: false,
      filtrar: '',
    };
  },

  actions: {
    PedidoListar(page) {
      this.isLoading = true

      return new Promise((resolve, reject) => {
        axios
          .get(`pedidos/gestao/${this.empresa_id}`
          , { params: {name: this.filtrar, page: page } }
          )
          .then((res) => {
            this.pedidos = res.data;
            resolve();
          })
          .catch((error) => {
            reject(error);
          })
          .finally(() => {
            this.isLoading = false; // Defina o estado isLoading como false após a chamada
          });
      });
    },

    pedidoMostrar(id) {
        this.isLoading = true
    
        return new Promise((resolve, reject) => {
            axios
            .get(`pedido/${id}`)
            .then((res) => {
                resolve(res.data);
                this.pedido = res.data.data;
            })
            .catch((error) => {
                reject(error);
            })
            .finally(() => {
                this.isLoading = false; // Defina o estado isLoading como false após a chamada
            });
        });
    },

    pagarEnvio(pedidos) {
      this.isLoading = true
    
      return new Promise((resolve, reject) => {
          axios
          .post(`envio/pagar`, {
            empresa_id: this.empresa_id,
            pedidos
          })
          .then((res) => {
              resolve(res.data);
              this.envioPago = true
              useToast().success('Envio pago com sucesso');
          })
          .catch((error) => {
              reject(error);
              useToast().error('Erro ao pagar envio');
          })
          .finally(() => {
              this.isLoading = false;
          });
      });
  },    

  imprimirEtiqueta(pedidos) {
    this.isLoading = true

    console.log(pedidos);
  
    return new Promise((resolve, reject) => {
        axios
        .post(`envio/imprimir-etiqueta`, {
          empresa_id: this.empresa_id,
          pedidos
        })
        .then((res) => {
            resolve(res.data);
            this.etiqueta = res.data.data;
            useToast().success('Envio pago com sucesso');
        })
        .catch((error) => {
            reject(error);
            useToast().error('Erro ao pagar envio');
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
