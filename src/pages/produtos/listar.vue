<script setup>
import CardTable from "@/components/cardTable.vue";
import Filter from "@/components/filter.vue";
import loading from "@/components/geral/LoadingOverlay.vue";
import modalDesconto from "@/components/produto/modalDesconto.vue";
import modalExcluir from "@/components/produto/modalExcluir.vue";
import modalRemoverDesconto from "@/components/produto/modalRemoverDesconto.vue";
import router from "@/router";
import { useProdutoStore } from "@/stores/ProdutoStore";
import { onMounted } from "vue";

const produto = useProdutoStore();
const produtoId = ref(null);
const tableData = ref([]);
const tableColumns = ref(["id", "foto", "nome", "valor", "categoria"]);
const actions = ref([
  "Editar",
  "Excluir",
  "Adicionar desconto",
  "Remover desconto",
]);

const updateTableData = (items) => {
  return items.map((item) => ({
    id: item.id,
    foto: item.foto,
    nome: item.nome,
    valor: item.valor,
    categoria: item.categoria.categoria,
    descricao: item.descricao,
    desconto:
      item.desconto.length > 0
        ? item.desconto[item.desconto.length - 1].valor_final
        : null,
  }));
};

const itemProduto = ref(null);

const handleActionClick = (action, item) => {
  if (action === "Editar") {
    router.push({ path: `/produtos/edicao/${item.id}` });
  } else if (action === "Excluir") {
    console.log(item);
    produto.modalExcluir = true;
    produtoId.value = item.id;
  } else if (action === "Adicionar desconto") {
    produto.modalDesconto = true;
    itemProduto.value = item;
  } else if (action === "Remover desconto") {
    produto.modalRemoverDesconto = true;
    itemProduto.value = item;
  }
};
onMounted(async () => {
  await produto.ProdutoListar();
  tableData.value = updateTableData(produto.produtos.data);
});

const computedTableData = computed(() => {
  return tableData.value;
});

const pageCount = computed(() => {
  return Math.ceil(tableData.value.length / 9);
});

const searchResult = (filterText) => {
  produto.filtrar = filterText;
  produto.ProdutoListar();
};

watch(
  () => produto?.produtos,
  (newValue) => {
    tableData.value = updateTableData(newValue.data);
  }
);

watch(
  () => produto?.produtos?.meta?.current_page,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      produto.ProdutoListar(newValue);
    }
  }
);
</script>

<template>
  <modalExcluir :produtoId="produtoId" />
  <modalDesconto :itemProduto="itemProduto" />
  <modalRemoverDesconto :itemProduto="itemProduto" />
  <loading :is-loading="produto.isLoading" />

  <VRow>
    <VCol cols="12">
      <VCard title="Listagem de Produtos">
        <VCardText>Veja a lista de todos os seus produtos abaixo</VCardText>

        <VCardText>
          <Filter
            :placeholder="'Busque pelo nome'"
            :label="'Nome'"
            @action-click="searchResult"
            :btn="'Buscar'"
          />
        </VCardText>
        <VCardText>
          <CardTable
            :items="computedTableData"
            :columns="tableColumns"
            :actions="actions"
            @action-click="handleActionClick"
          />
        </VCardText>

        <div class="text-center pt-2">
          <v-pagination
            class="my-4"
            v-model="produto.produtos.meta.current_page"
            :length="pageCount"
          ></v-pagination>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>
