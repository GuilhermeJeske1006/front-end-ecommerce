<script setup>
import { usePedidoStore } from "@/stores/PedidoStore";

const props = defineProps({
  pedido: {
    type: Object,
    required: true,
  },
});

const pedido = usePedidoStore();

const pagarEnvio = async () => {
  const data = [props.pedido.envio.codigo_rastreio];
  await pedido.pagarEnvio(data);
  if (pedido.envioPago) {
    pedido.modalPagarEnvio = false;
  }
};
</script>

<template>
  <div class="text-center">
    <v-dialog v-model="pedido.modalPagarEnvio" width="500">
      <VCard>
        <VWindow>
          <VWindowItem class="text-center">
            <VCardItem>
              <VCardTitle>ATENÇÃO!</VCardTitle>
              <VDivider />
            </VCardItem>
            <VCardText
              >O valor da pagar desse envio será de
              <b> {{ "R$ " + props.pedido?.envio?.valor.toFixed(2) }}</b
              >, para que que seja feito,
              <b>
                você precisa que tenha esse saldo na sua conta do melhor envio!!
              </b>
            </VCardText>

            <VCardText>
              <VBtn
                class="mr-2"
                color="error"
                @click="pedido.modalPagarEnvio = false"
              >
                Cancelar
              </VBtn>
              <VBtn class="ml-2" @click="pagarEnvio">Pagar</VBtn>
            </VCardText>
          </VWindowItem>
        </VWindow>
      </VCard>
    </v-dialog>
  </div>
</template>
