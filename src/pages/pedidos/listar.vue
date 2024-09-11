<script setup>
import loading from "@/components/geral/LoadingOverlay.vue";
import CardPedido from "@/components/pedido/cardPedido.vue";
import filterPedido from "@/components/pedido/filterPedido.vue";
import modalImprimirEtiqueta from "@/components/pedido/modalImprimirEtiqueta.vue";
import modalPegarEnvio from "@/components/pedido/modalPagarEnvio.vue";
import router from "@/router";
import { usePedidoStore } from "@/stores/PedidoStore";
import { useProdutoStore } from "@/stores/ProdutoStore";
import { onMounted } from "vue";

const produto = useProdutoStore();
const pedido = usePedidoStore();
const pedidoSelecionado = ref(null);
const tableData = ref([]);
const tableColumns = ref([]);
const actions = ref(["Ver", "Pagar envio", "Imprimir etiqueta"]);

const updateTableData = (items) => {
  return items.map((item) => ({
    id: item.id,
    nome_usuario: item.usuario.name,
    valor: item.valor,
    status: item.status,
    status_envio: item.envio.status,
    forma_pagamento: item.forma_pagamento,
    dt_item: item.dt_item,
    ...item,
  }));
};

const handleActionClick = (action, item) => {
  if (action === "Ver") {
    router.push({ path: `/pedidos/ver/${item.id}` });
  } else if (action === "Pagar envio") {
    console.log("Pagar envio", item);
    pedidoSelecionado.value = item;
    pedido.modalPagarEnvio = true;
  } else if (action === "Imprimir etiqueta") {
    pedidoSelecionado.value = item;
    pedido.modalImprimirEtiqueta = true;
  }
};
onMounted(async () => {
  await pedido.PedidoListar();
  tableData.value = updateTableData(pedido.pedidos.data);
});

const computedTableData = computed(() => {
  return tableData.value;
});

const pageCount = computed(() => {
  return Math.ceil(tableData.value.length / 9);
});

const searchResult = (filterText) => {
  pedido.filtrar = filterText;
  pedido.PedidoListar();
};

watch(
  () => pedido?.pedidos,
  (newValue) => {
    tableData.value = updateTableData(newValue.data);
  }
);

watch(
  () => pedido?.pedidos?.meta?.current_page,
  (newValue, oldValue) => {
    if (newValue !== oldValue) {
      pedido.PedidoListar(newValue);
    }
  }
);
</script>

<template>
  <loading :is-loading="pedido.isLoading" />
  <modalImprimirEtiqueta :pedido="pedidoSelecionado" />
  <modalPegarEnvio :pedido="pedidoSelecionado" />
  <VRow>
    <VCol cols="12">
      <VCard title="Listagem de Pedidos">
        <VCardText>Veja a lista de todos os seus pedidos abaixo</VCardText>

        <VCardText>
          <filterPedido
            :placeholder="'Busque pelo nome'"
            :label="'Nome'"
            @action-click="searchResult"
            :btn="'Buscar'"
          />
        </VCardText>
        <VCardText>
          <CardPedido
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
