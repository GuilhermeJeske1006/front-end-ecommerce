import axios from 'axios';
import { defineStore } from 'pinia';
import { useToast } from "vue-toastification";


export const useEmpresaStore = defineStore('empresa', {
  state() {
    return {
      isLoading: false,
      item: {
        endereco: {}
      },
      empresa_id: localStorage.getItem('empresa_id'),

    };
  },

  actions: {
    EmpresaListar() {
      this.isLoading = true
        return new Promise((resolve, reject) => {
          axios.defaults.headers.common['Authorization'] = `Bearer ${localStorage.getItem('token')}`;

          axios
            .get(`empresa/${this.empresa_id}`)
            .then((res) => {
              this.item = res.data
              resolve(); // Resolva a Promise sem nenhum valor adicional
            })
            .catch((error) => {
              reject(error); // Rejeite a Promise com o erro
            }).finally(() => {
              this.isLoading = false;
            });
        });
      },
      EmpresaEditar(endereco_id){
        this.isLoading = true

        return new Promise((resolve, reject) => {
          const form = {
            ...this.item,
            endereco_id
          }
  
          axios
            .put(`/empresa/editar/${this.empresa_id}`, form)
            .then((res) => {
              resolve(); // Resolva a Promise sem nenhum valor adicional
              useToast().success("Empresa editada com sucesso!");
  
            })
            .catch((error) => {
              reject(error); // Rejeite a Promise com o erro
              useToast().error("Erro ao editar a empresa!");
  
            })
            .finally(() => {
              this.isLoading = false; 
            });
        });
      },

      EmpresaCadastro(){
        this.isLoading = true

        return new Promise((resolve, reject) => {
          const form = {
            ...this.cadastro
          }
  
          axios
            .put(`/empresa/criar`, form)
            .then((res) => {
              resolve(); // Resolva a Promise sem nenhum valor adicional
              useToast().success("Empresa cadastrada com sucesso!");
              this.cadastro = {}
            })
            .catch((error) => {
              reject(error); // Rejeite a Promise com o erro
              useToast().error("Erro ao cadastrada a empresa!");
  
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
