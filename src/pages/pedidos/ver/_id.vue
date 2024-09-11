<script setup>
import loading from "@/components/geral/LoadingOverlay.vue";
import modalImprimirEtiqueta from "@/components/pedido/modalImprimirEtiqueta.vue";
import modalPegarEnvio from "@/components/pedido/modalPagarEnvio.vue";
import { usePedidoStore } from "@/stores/PedidoStore";
import { computed, ref } from "vue";
import { useRoute } from "vue-router";

const order = usePedidoStore();
const route = useRoute();

const pedido = ref({
  item_pedidos: [],
  endereco: {},
  envio: {},
  usuario: {},
});

onMounted(() => {
  order.pedidoMostrar(route.params.id);
});

const updateTableData = computed(() => {
  pedido.value = order.pedido;
  return pedido.value;
});

const formaPagamento = computed(() => {
  const forma = pedido.value.forma_pagamento;

  if (forma === "BOLETO") {
    return "Boleto";
  } else if (forma === "CREDITO") {
    return "Cartão de crédito";
  } else if (forma === "PIX") {
    return "Pix";
  } else {
    return "Não informado";
  }
});

watch(
  updateTableData,
  (newValue) => {
    pedido.value = newValue;
  },
  { immediate: true }
);

watch(
  () => order?.pedido,
  (newValue) => {
    pedido.value = newValue;
  }
);
</script>

<template>
  <VRow>
    <!-- 👉 Lifetime Membership -->
    <VCol cols="12">
      <VCard>
        <VRow no-gutters>
          <VCol cols="12" sm="8" md="12" lg="7" order="2" order-lg="1">
            <VCardItem>
              <VCardTitle>Informações do pedido</VCardTitle>
            </VCardItem>

            <VCardText class="d-flex justify-center">
              <div class="me-auto pe-4">
                <p class="d-flex align-center mb-6">
                  <VIcon color="primary" icon="bx-credit-card" />
                  <span class="ms-3">{{ formaPagamento }}</span>
                </p>

                <p class="d-flex align-center mb-6">
                  <VIcon color="primary" icon="bx-select-multiple" />
                  <span class="ms-3">{{ pedido.status_pedido_nome }}</span>
                </p>
              </div>

              <VDivider v-if="$vuetify.display.smAndUp" vertical inset />

              <div class="ms-auto ps-4">
                <p class="d-flex align-center mb-6">
                  <VIcon color="primary" icon="bx-dollar" />
                  <span class="ms-3">{{ "R$ " + pedido?.valor }}</span>
                </p>
              </div>
            </VCardText>

            <VCardText>
              <VDivider />
            </VCardText>

            <VCardItem>
              <VCardTitle>Informação do cliente</VCardTitle>
            </VCardItem>
            <VCardText class="d-flex justify-center">
              <div class="me-auto pe-4">
                <p class="d-flex align-center mb-6">
                  <VIcon color="primary" icon="bx-user" />
                  <span class="ms-3">{{ pedido.usuario?.name }}</span>
                </p>

                <p class="d-flex align-center mb-6">
                  <VIcon color="primary" icon="bx-mail-send" />
                  <span class="ms-3">{{ pedido.usuario?.email }}</span>
                </p>
              </div>

              <VDivider v-if="$vuetify.display.smAndUp" vertical inset />

              <div class="ms-auto ps-4">
                <p class="d-flex align-center mb-6">
                  <VIcon color="primary" icon="bx-id-card" />
                  <span class="ms-3">{{ pedido.usuario?.cpf }}</span>
                </p>

                <p class="d-flex align-center mb-6">
                  <VIcon color="primary" icon="bx-phone" />
                  <span class="ms-3">{{ pedido.usuario?.telefone }}</span>
                </p>
              </div>
            </VCardText>

            <VCardText>
              <VDivider />
            </VCardText>

            <VCardItem>
              <VCardTitle>Endereço de entrega</VCardTitle>
            </VCardItem>
            <VCardText class="d-flex justify-center">
              <div class="me-auto pe-4">
                <p class="d-flex align-center mb-6">
                  <span class="ms-3 font-weight-black">CEP: </span>
                  <span class="ms-3">{{ pedido.endereco?.cep }}</span>
                </p>

                <p class="d-flex align-center mb-6">
                  <span class="ms-3 font-weight-black">RUA: </span>
                  <span class="ms-3">{{ pedido.endereco?.rua }}</span>
                </p>

                <p class="d-flex align-center mb-6">
                  <span class="ms-3 font-weight-black">CIDADE: </span>
                  <span class="ms-3">{{ pedido.endereco?.cidade }}</span>
                </p>

                <p class="d-flex align-center mb-6">
                  <span class="ms-3 font-weight-black">ESTADO: </span>
                  <span class="ms-3">{{ pedido.endereco?.estado }}</span>
                </p>
              </div>

              <VDivider v-if="$vuetify.display.smAndUp" vertical inset />

              <div class="ms-auto ps-4">
                <p class="d-flex align-center mb-6">
                  <span class="ms-3 font-weight-black">BAIRRO: </span>
                  <span class="ms-3">{{ pedido.endereco?.bairro }}</span>
                </p>

                <p class="d-flex align-center mb-6">
                  <span class="ms-3 font-weight-black">NÚMERO: </span>
                  <span class="ms-3">{{ pedido.endereco?.numero }}</span>
                </p>

                <p class="d-flex align-center mb-6">
                  <span class="ms-3 font-weight-black">COMPLEMENTO: </span>
                  <span class="ms-3">{{ pedido.endereco?.complemento }}</span>
                </p>

                <p class="d-flex align-center mb-6">
                  <span class="ms-3 font-weight-black">PAÍS: </span>
                  <span class="ms-3">{{ pedido.endereco?.pais }}</span>
                </p>
              </div>
            </VCardText>
          </VCol>

          <VCol
            cols="12"
            sm="4"
            md="12"
            lg="5"
            order="1"
            order-lg="2"
            class="member-pricing-bg text-center"
          >
            <div
              class="ms-auto ps-4 membership-pricing d-flex flex-column align-center py-14 h-100 justify-center"
            >
              <p class="mb-5">
                <sub class="text-h5">R$</sub>
                <sup class="text-h3 font-weight-medium">{{
                  pedido.envio?.valor?.toFixed(2)
                }}</sup>
              </p>
              <p class="d-flex align-center mb-6">
                <span class="ms-3 font-weight-black">COD_RASTREIO: </span>
                <span class="ms-3">{{ pedido.envio?.codigo_rastreio }}</span>
              </p>

              <p class="d-flex align-center mb-6">
                <span class="ms-3 font-weight-black">STATUS: </span>
                <span class="ms-3">{{ pedido.envio?.status_envio }}</span>
              </p>

              <p class="d-flex align-center mb-6">
                <span class="ms-3 font-weight-black">AGÊNCIA: </span>
                <span class="ms-3">{{ pedido.envio?.agencia }}</span>
              </p>

              <p class="d-flex align-center mb-6">
                <span class="ms-3 font-weight-black">SERVIÇO: </span>
                <span class="ms-3">{{ pedido.envio?.servico }}</span>
              </p>
              <div v-if="pedido.status_pedido_id == 2">
                <VBtn
                  class="mt-8"
                  v-if="pedido.envio?.status_envio_id == 1"
                  @click="order.modalPagarEnvio = true"
                >
                  Pagar envio
                </VBtn>
                <VBtn
                  class="mt-8"
                  v-else
                  @click="order.modalImprimirEtiqueta = true"
                >
                  Imprimir etiqueta
                </VBtn>
              </div>
            </div>
          </VCol>
        </VRow>

        <v-row>
          <VCol cols="12">
            <VCardItem>
              <VCardTitle>Produtos do pedido</VCardTitle>
            </VCardItem>
            <VTable>
              <thead>
                <tr>
                  <th>Imagem</th>
                  <th class="text-uppercase">Nome produto</th>
                  <th>Valor</th>
                  <th>Quantidade</th>
                  <th>Cor</th>
                  <th>Tamanho</th>
                </tr>
              </thead>

              <tbody>
                <tr v-for="item in pedido.item_pedidos" :key="item.id">
                  <td>
                    <VAvatar
                      class="cursor-pointer"
                      color="primary"
                      variant="tonal"
                    >
                      <VImg :src="item.produtos?.foto_url" />
                    </VAvatar>
                  </td>
                  <td class="text-center">
                    {{ item.produtos.nome }}
                  </td>
                  <td class="text-center">
                    {{ "R$ " + item.valor.toFixed(2) }}
                  </td>
                  <td class="text-center">
                    {{ item.quantidade }}
                  </td>
                  <td class="text-center">
                    {{ item.cor.cor }}
                  </td>
                  <td class="text-center">
                    {{ item.tamanho.tamanho }}
                  </td>
                </tr>
              </tbody>
            </VTable>
          </VCol>
        </v-row>
      </VCard>
    </VCol>
  </VRow>
  <modalImprimirEtiqueta :pedido="pedido" />
  <modalPegarEnvio :pedido="pedido" />
  <loading :isLoading="order.isLoading" />
</template>

<style lang="scss" scoped>
.avatar-center {
  position: absolute;
  border: 3px solid rgb(var(--v-theme-surface));
  inset-block-start: -2rem;
  inset-inline-start: 1rem;
}

// membership pricing
.member-pricing-bg {
  position: relative;
  background-color: rgba(var(--v-theme-on-surface), var(--v-hover-opacity));
}

.membership-pricing {
  sup {
    inset-block-start: 9px;
  }
}
</style>
