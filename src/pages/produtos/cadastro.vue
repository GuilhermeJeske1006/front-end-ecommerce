<script setup>
import loading from "@/components/geral/LoadingOverlay.vue";
import { useProdutoStore } from "@/stores/ProdutoStore";
import { computed, onMounted, ref } from "vue";
import arquivoProduto from "./cadastro/arquivoProduto.vue";
import corTamanhoProduto from "./cadastro/corTamanhoProduto.vue";
import InformacoesBasicas from "./cadastro/informacaoBasica.vue";
import siteProduto from "./cadastro/siteProduto.vue";

import router from "@/router";
import { useRoute } from "vue-router";

const produto = useProdutoStore();
const route = useRoute();
const activeTab = ref(route.params.tab);

onMounted(() => {
  produto.CategoriaListar();
});

const categoria = computed(() => {
  let result = [];
  if (Array.isArray(produto.categoria)) {
    result = produto.categoria.map((element) => {
      return { nome_categoria: element.categoria, id: element.id };
    });
  }
  return result;
});

// tabs
const tabs = [
  {
    title: "Informações basicas",
    icon: "bx-user",
    tab: "account",
  },
  {
    title: "Arquivos",
    icon: "bxs-file",
    tab: "security",
  },
  {
    title: "Item",
    icon: "bx-bell",
    tab: "item",
  },
  {
    title: "Site",
    icon: "bx-sitemap",
    tab: "site",
  },
];

const goToTab = (item) => {
  activeTab.value = item;
};

const goToPass = (item) => {
  activeTab.value = item;
};

const formatValor = (valor) => {
  if (typeof valor === "string") {
    let formattedValor = valor.replace(/^R\$\s*/, "");
    formattedValor = formattedValor.replace(",", ".");
    return formattedValor;
  }
};

const submit = async () => {
  const data = {
    ...cadastro.value,
    valor: formatValor(cadastro.value.valor),
  };

  await produto.ProdutoSalvar(data);

  if (produto.produtoSalvo) {
    router.push({ path: "/produtos/listar" });
  }
};

const updateCores = (item) => {
  cadastro.cores = item;
};

const cadastro = ref({
  nome: "",
  valor: "",
  categoria_id: "",
  foto: "",
  largura: "",
  altura: "",
  comprimento: "",
  peso: "",
  material: "",
  descricao: "",
  ir_para_site: true,
  produto_destaque: false,
  itens: [],
  cores: [],
  fotos: [],
});
</script>

<template>
  <div>
    <loading :is-loading="produto.isLoading" />

    <VTabs v-model="activeTab" show-arrows>
      <VTab disabled v-for="item in tabs" :key="item.icon" :value="item.tab">
        <VIcon size="20" start :icon="item.icon" />
        {{ item.title }}
      </VTab>
    </VTabs>
    <VDivider />

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition">
      <VWindowItem value="account">
        <InformacoesBasicas
          :item="cadastro"
          :categoria="categoria"
          @next="goToTab('security')"
        />
      </VWindowItem>

      <VWindowItem value="security">
        <arquivoProduto
          @next="goToTab('item')"
          @pass="goToPass('account')"
          :item="cadastro.fotos"
        />
      </VWindowItem>

      <!-- Notification -->
      <VWindowItem value="item">
        <corTamanhoProduto
          @next="goToTab('site')"
          @pass="goToPass('security')"
          @update:items="updateCores"
          :items="cadastro.cores"
        />
      </VWindowItem>

      <VWindowItem value="site">
        <siteProduto
          @submit="submit()"
          @pass="goToPass('item')"
          :item="cadastro"
        />
      </VWindowItem>
    </VWindow>
  </div>
</template>
