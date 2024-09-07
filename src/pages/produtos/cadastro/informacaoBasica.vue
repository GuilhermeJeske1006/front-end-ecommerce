<template>
  <div>
    <VRow>
      <VCol cols="12">
        <VCard title="Informações basicas">
          <VCardText class="d-flex">
            <!-- 👉 Avatar -->
            <VAvatar
              rounded="lg"
              size="100"
              class="me-6"
              :image="props.item.foto"
            />

            <!-- 👉 Upload Photo -->
            <form
              enctype="multipart/form-data"
              class="d-flex flex-column justify-center gap-5"
            >
              <div class="d-flex flex-wrap gap-2">
                <VBtn color="primary" @click="refInputEl?.click()">
                  <VIcon icon="bx-cloud-upload" class="d-sm-none" />
                  <span class="d-none d-sm-block">Carregar nova foto</span>
                </VBtn>

                <input
                  ref="refInputEl"
                  type="file"
                  name="file"
                  accept=".jpeg,.png,.jpg,GIF"
                  hidden
                  @input="changeAvatar"
                />

                <VBtn
                  type="reset"
                  color="error"
                  variant="tonal"
                  @click="resetAvatar"
                >
                  <span class="d-none d-sm-block">Remover</span>
                  <VIcon icon="bx-refresh" class="d-sm-none" />
                </VBtn>
              </div>

              <p class="text-body-1 mb-0">
                JPG, GIF ou PNG permitidos. Tamanho máximo de 800K
              </p>
            </form>
          </VCardText>

          <VDivider />

          <VCardText>
            <!-- 👉 Form -->
            <VForm
              ref="form"
              v-model="isValid"
              @submit.prevent="next"
              class="mt-6"
            >
              <VRow>
                <!-- 👉 First Name -->
                <VCol md="4" cols="12">
                  <VTextField
                    v-model="item.nome"
                    placeholder="ex: Camiseta polo, calça"
                    label="Nome produto"
                    :rules="[nomeRule]"
                  />
                </VCol>

                <!-- 👉 Last Name -->
                <VCol md="4" cols="12">
                  <VTextField
                    v-model="item.valor"
                    placeholder="R$ "
                    label="Valor do produto"
                    @input="formatValor"
                    :rules="[valorRule]"
                  />
                </VCol>

                <!-- 👉 Email -->
                <VCol cols="12" md="4">
                  <VSelect
                    v-model="item.categoria_id"
                    label="Categoria"
                    :items="props.categoria"
                    item-title="nome_categoria"
                    item-value="id"
                    placeholder="Selecione a categoria"
                    :rules="[categoriaRule]"
                  />
                </VCol>

                <!-- 👉 Phone -->
                <VCol md="3" cols="12">
                  <VTextField
                    v-model="item.peso"
                    placeholder="ex: 0.3, 0.5"
                    label="Peso"
                    :rules="[pesoRule]"
                  />
                </VCol>

                <!-- 👉 Address -->
                <VCol md="3" cols="12">
                  <VTextField
                    v-model="item.largura"
                    placeholder="ex: 11, 12"
                    label="Largura"
                    :rules="[larguraRule]"
                  />
                </VCol>
                <VCol md="3" cols="12">
                  <VTextField
                    v-model="item.altura"
                    placeholder="ex: 5, 2"
                    label="Altura"
                    :rules="[alturaRule]"
                  />
                </VCol>
                <VCol md="3" cols="12">
                  <VTextField
                    v-model="item.comprimento"
                    placeholder="ex: 4, 5"
                    label="Comprimento"
                    :rules="[ComprimentoRule]"
                  />
                </VCol>

                <!-- 👉 State -->
                <VCol cols="12" md="12">
                  <VTextField
                    v-model="item.material"
                    label="Material"
                    placeholder="ex: microfibra, algodão"
                  />
                </VCol>

                <!-- 👉 Timezone -->
                <VCol cols="12" md="12">
                  <v-textarea
                    v-model="item.descricao"
                    label="Descrição sobre o produto"
                    placeholder="ex: 1"
                  />
                </VCol>
                <!-- 👉 Form Actions -->
                <VCol cols="12" class="d-flex flex-wrap gap-4">
                  <VBtn type="submit">Proximo</VBtn>
                </VCol>
              </VRow>
            </VForm>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script setup>
import { defineEmits, defineProps, ref } from "vue";

const props = defineProps({
  item: {
    type: Object,
    required: true,
  },
  categoria: {
    type: Object,
    required: true,
  },
});

const isValid = ref(false);

const refInputEl = ref();
const accountDataLocal = ref(
  structuredClone(JSON.parse(JSON.stringify(props.item)))
);

const formatValor = (event) => {
  let value = event.target.value.replace(/\D/g, "");
  value = (value / 100).toFixed(2) + "";
  value = value.replace(".", ",");
  value = value.replace(/(\d)(?=(\d{3})+\,)/g, "$1.");
  props.item.valor = "R$ " + value;
};

const changeAvatar = (event) => {
  const fileReader = new FileReader();
  const files = event.target.files;
  if (files && files.length) {
    fileReader.readAsDataURL(files[0]);
    fileReader.onload = () => {
      if (typeof fileReader.result === "string") {
        accountDataLocal.value.foto = fileReader.result;
        props.item.foto = fileReader.result;
      }
    };
  }
};
// reset avatar image
const resetAvatar = () => {
  props.item.foto = "";
};

const pesoRule = (value) => {
  const gramPattern = /^0\.[1-9]+$/;
  const kiloPattern = /^[1-9][0-9]*(\.[0-9]+)?$/;

  if (gramPattern.test(value) || kiloPattern.test(value)) {
    return true;
  }
  return "Peso deve ser 0.x para gramas ou x.x para kilos, ex: 0.3 (gramas), 1.0 (kilos)";
};

const nomeRule = (value) => {
  if (value.length > 0) {
    return true;
  }
  return "Preencha o campo nome";
};

const valorRule = (value) => {
  const currencyPattern = /^R\$\s?\d+(\.\d{3})*,\d{2}$/;
  if (currencyPattern.test(value)) {
    return true;
  }
  return "Valor deve estar no formato correto, ex: R$ 123,45";
};

const categoriaRule = (value) => {
  if (value !== null) {
    return true;
  }
  return "Selecione a categoria";
};

const larguraRule = (value) => {
  const cmPattern = /^[1-9][0-9]*$/;
  if (cmPattern.test(value)) {
    return true;
  }
  return "Largura deve ser um número inteiro em centímetros, ex: 11, 12";
};

const alturaRule = (value) => {
  const cmPattern = /^[1-9][0-9]*$/;
  if (cmPattern.test(value)) {
    return true;
  }
  return "Altura deve ser um número inteiro em centímetros, ex: 11, 12";
};

const ComprimentoRule = (value) => {
  const cmPattern = /^[1-9][0-9]*$/;
  if (cmPattern.test(value)) {
    return true;
  }
  return "Comprimento deve ser um número inteiro em centímetros, ex: 11, 12";
};

const emit = defineEmits(["next"]);

const next = () => {
  // if (isValid.value == true) {
  emit("next", "security");
  // }
};
</script>
