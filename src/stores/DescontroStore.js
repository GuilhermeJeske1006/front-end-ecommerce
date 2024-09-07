import axios from 'axios';
import { defineStore } from 'pinia';
import { useToast } from "vue-toastification";
import { useProdutoStore } from './ProdutoStore';

export const useDescontoStore = defineStore('desconto', {
  state() {
    return {
      isLoading: false,
      empresa_id: localStorage.getItem('empresa_id'),


    };
  },

  actions: {
    AdicionarDesconto(data){
        useProdutoStore().isLoading = true

      return new Promise((resolve, reject) => {

        axios
          .post(`/desconto`, data)
          .then((res) => {
            resolve(); // Resolva a Promise sem nenhum valor adicional
            useToast().success("Desconto cadastrado com sucesso!");

          })
          .catch((error) => {
            console.log(error);
            reject(error); // Rejeite a Promise com o erro
            useToast().error("Erro ao cadastrar desconto!");

          })
          .finally(() => {
            useProdutoStore().isLoading = false; // Defina o estado isLoading como false após a chamada
          });
      });
    },

    DescontoDeletar(id){
      useProdutoStore().isLoading = true

      return new Promise((resolve, reject) => {
        axios
          .delete(`/desconto/${id}`)
          .then((res) => {
            resolve(); // Resolva a Promise sem nenhum valor adicional
            useToast().success("Desconto deletado com sucesso!");

          })
          .catch((error) => {
            console.log(error);
            reject(error); // Rejeite a Promise com o erro
            useToast().error("Erro ao deletar desconto!");

          })
          .finally(() => {
            useProdutoStore().isLoading = false; // Defina o estado isLoading como false após a chamada
          });
      });
    }


    
  },

  getters: {

  },
});
