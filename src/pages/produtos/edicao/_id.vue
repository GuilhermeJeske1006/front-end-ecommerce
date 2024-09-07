<script setup>
import loading from "@/components/geral/LoadingOverlay.vue";
import router from "@/router";
import { useProdutoStore } from "@/stores/ProdutoStore";
import { computed, onMounted, ref, watch } from "vue";
import { useRoute } from "vue-router";
import arquivoProduto from "../cadastro/arquivoProduto.vue";
import corTamanhoProduto from "../cadastro/corTamanhoProduto.vue";
import InformacoesBasicas from "../cadastro/informacaoBasica.vue";
import siteProduto from "../cadastro/siteProduto.vue";

const produto = useProdutoStore();
const route = useRoute();
const activeTab = ref(route.params.tab);

const editar = ref({
  valor: "",
  nome: "",
  altura: "",
  largura: "",
  comprimento: "",
  peso: "",
  categoria_id: "",
  material: "",
  descricao: "",
  foto: "",
  cores: [],
  imagem: [],
  produto_destaque: false,
  ir_para_site: false,
});

onMounted(() => {
  produto.CategoriaListar();
  produto.ProdutoMostrar(route.params.id);
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

const formatValor = (value) => {
  value = value.replace(/\D/g, "");
  value = (value / 100).toFixed(2);
  value = value.replace(".", ",");
  value = value.replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  return "R$ " + value;
};

const formatImagemEnvio = (value) => {
  return value
    .map((item) => {
      if (item.startsWith("https")) {
        const lastSlashIndex = item.lastIndexOf("/");
        const secondLastSlashIndex = item.lastIndexOf("/", lastSlashIndex - 1);
        const trimmedUrl = item.substring(secondLastSlashIndex + 1);
        item = trimmedUrl;
      }
      return item;
    })
    .filter(Boolean);
};

const updateTable = computed(() => {
  if (produto.produto.id) {
    editar.value.valor = formatValor(produto.produto.valor.toString());
    editar.value.nome = produto.produto.nome;
    editar.value.altura = produto.produto.altura;
    editar.value.largura = produto.produto.largura;
    editar.value.comprimento = produto.produto.comprimento;
    editar.value.peso = produto.produto.peso;
    editar.value.categoria_id = produto.produto.categoria_id;
    editar.value.material = produto.produto.material;
    editar.value.descricao = produto.produto.descricao;
    editar.value.produto_destaque = produto.produto.produto_destaque;
    editar.value.ir_para_site = produto.produto.ir_para_site;
    editar.value.foto = produto.produto.foto;
    editar.value.cores = produto.produto.cores.map((item) => {
      return {
        cor: item.cor,
        id: item.id,
        tamanhos: produto.produto.tamanho.filter((tamanho) => {
          return tamanho.cor_id === item.id;
        }),
      };
    });
    editar.value.imagem = produto.produto.imagem.map((item) => {
      return item.imagem;
    });
  }
  return editar.value;
});

watch(
  updateTable,
  (newValue) => {
    editar.value = newValue;
  },
  { immediate: true }
);

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

const formatValorEnvio = (valor) => {
  let formattedValor = valor.replace(/^R\$\s*/, "");
  formattedValor = formattedValor.replace(",", ".");

  return formattedValor;
};

const submit = async () => {
  const data = {
    ...editar.value,
    valor: formatValorEnvio(editar.value.valor),
    imagem: formatImagemEnvio(editar.value.imagem),
  };

  await produto.ProdutoEditar(data, route.params.id);

  if (produto.produtoEditado) {
    router.push({ path: `/produtos/listar` });
  }
};

const updateCores = (item) => {
  editar.value.cores = item;
};
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
          :item="editar"
          :categoria="categoria"
          @next="goToTab('security')"
        />
      </VWindowItem>

      <VWindowItem value="security">
        <arquivoProduto
          @next="goToTab('item')"
          @pass="goToPass('account')"
          :item="editar.imagem"
        />
      </VWindowItem>

      <VWindowItem value="item">
        <corTamanhoProduto
          @next="goToTab('site')"
          @pass="goToPass('security')"
          @update:items="updateCores"
          :items="editar.cores"
        />
      </VWindowItem>

      <VWindowItem value="site">
        <siteProduto
          @submit="submit()"
          @pass="goToPass('item')"
          :item="editar"
        />
      </VWindowItem>
    </VWindow>
  </div>
</template>
