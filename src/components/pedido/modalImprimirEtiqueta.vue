<script setup>
import { usePedidoStore } from "@/stores/PedidoStore";
import { watch } from "vue";

const props = defineProps({
  pedido: {
    type: Object,
    required: true,
  },
});

const pedido = usePedidoStore();

const imprimirEtiqueta = async () => {
  const data = [props.pedido.envio.codigo_rastreio];
  await pedido.imprimirEtiqueta(data);
};

watch(
  () => pedido.etiqueta.url,
  (value) => {
    if (value) {
      window.open(value, "_blank");
      pedido.modalImprimirEtiqueta = false;
    }
  }
);
</script>

<template>
  <div class="text-center">
    <v-dialog v-model="pedido.modalImprimirEtiqueta" width="500">
      <VCard>
        <VWindow>
          <VWindowItem class="text-center">
            <VCardItem>
              <VCardTitle>ATENÇÃO!</VCardTitle>
              <VDivider />
            </VCardItem>
            <VCardText>
              Ao imprimir a etiqueta, cole a mesma na caixa do produto e leve
              para a agência dos correios mais próxima.
            </VCardText>

            <VCardText>
              <VBtn
                class="mr-2"
                color="error"
                @click="pedido.modalImprimirEtiqueta = false"
              >
                Cancelar
              </VBtn>
              <VBtn class="ml-2" @click="imprimirEtiqueta"
                >Imprimir etiqueta</VBtn
              >
            </VCardText>
          </VWindowItem>
        </VWindow>
      </VCard>
    </v-dialog>
  </div>
</template>
