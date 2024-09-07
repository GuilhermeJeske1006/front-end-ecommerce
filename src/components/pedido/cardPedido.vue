<script>
import { formatDate } from "@/@core/utils/formatters";

export default {
  name: "Table",
  props: {
    items: {
      type: Array,
      required: true,
    },
    columns: {
      type: Array,
      required: true,
    },
    actions: {
      type: Array,
      required: true,
    },
  },

  methods: {
    handleActionClick(action, item) {
      this.$emit("action-click", action, item);
    },

    formatMetodo(forma_pagamento) {
      if (forma_pagamento == "BOLETO") {
        return "Boleto";
      } else if (forma_pagamento == "PIX") {
        return "Pix";
      } else if (forma_pagamento == "CREDITO") {
        return "Cartão de crédito";
      }
    },

    formatStatus(status) {
      if (status == "WAITING_PAYMENT") {
        return "Aguardando pagamento";
      } else if (status == "PAID") {
        return "Pago";
      } else if (status == "CANCELED") {
        return "Cancelado";
      }
    },

    formatDate(date) {
      return formatDate(date);
    },

    formatVal(val) {
      return val.toLocaleString("pt-BR", {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      });
    },
  },
};
</script>

<template>
  <VRow>
    <VCol sm="6" cols="12" v-for="item in items" :key="item.dessert">
      <VCard>
        <div
          class="d-flex justify-space-between flex-wrap flex-md-nowrap flex-column flex-md-row"
        >
          <div class="ma-auto pa-5">
            <VCardText class="text-subtitle-1">
              <span>Forma de pagamento: </span>
              <span class="font-weight-medium">
                <span>{{ formatMetodo(item.forma_pagamento) }}</span>
              </span>
            </VCardText>
            <VDivider />

            <VCardText class="text-subtitle-1">
              <span>Status do pagamento: </span>
              <span class="font-weight-medium">
                <span>{{ formatStatus(item.status) }}</span>
              </span>
            </VCardText>
            <VDivider />

            <VCardText class="text-subtitle-1">
              <span>Status do envio: </span>
              <span class="font-weight-medium">
                <span>{{ item.status_envio }}</span>
              </span>
            </VCardText>
          </div>

          <VDivider :vertical="$vuetify.display.mdAndUp" />

          <div>
            <VCardItem>
              <VCardTitle>ID do pedido: {{ item.id }}</VCardTitle>
            </VCardItem>

            <VCardText>
              <VDivider />
            </VCardText>

            <VCardText class="text-subtitle-1">
              <span>Data do pedido : </span>
              <span class="font-weight-medium">
                <span>{{ formatDate(item.dt_item) }}</span>
              </span>
            </VCardText>
            <VCardText>
              <VDivider />
            </VCardText>

            <VCardText class="text-subtitle-1">
              <span>Valor :</span>
              <span class="font-weight-medium">
                R$
                <span>{{ formatVal(item.valor) }}</span>
              </span>
            </VCardText>
            <VDivider />

            <VCardActions class="justify-space-between">
              <VBtn @click="handleActionClick('Editar', item)">
                <VIcon icon="mdi-eye-arrow-left" />
                <span class="ms-2">Ver mais</span>
              </VBtn>

              <IconBtn>
                <VIcon icon="bx-dots-vertical" />

                <VMenu activator="parent">
                  <v-list>
                    <v-list-item
                      v-for="(action, index) in actions"
                      :key="index"
                      link
                      @click="handleActionClick(action, item)"
                    >
                      <v-list-item-title>{{ action }}</v-list-item-title>
                    </v-list-item>
                  </v-list>
                </VMenu>
              </IconBtn>
            </VCardActions>
          </div>
        </div>
      </VCard>
    </VCol>
  </VRow>
</template>
