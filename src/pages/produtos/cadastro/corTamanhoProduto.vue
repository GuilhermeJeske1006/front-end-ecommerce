<template>
  <div>
    <VRow>
      <VCol cols="12">
        <VCard title="Cores e tamanhos do produto">
          <VCardText>
            <!-- Formulário para adicionar cor -->
            <div class="mt-6">
              <VRow v-if="!showInput">
                <VCol md="12" cols="12">
                  <VBtn
                    style="text-align: center"
                    color="secondary"
                    append-icon="bxs-plus-circle"
                    @click="showInput = true"
                  >
                    Adicionar Cor
                  </VBtn>
                </VCol>
              </VRow>

              <VRow v-if="showInput">
                <VCol md="8" cols="12">
                  <VTextField
                    v-model="textInput"
                    placeholder="ex: Azul, Vermelho, Preto"
                    label="Cor"
                  />
                </VCol>
                <VCol md="2" cols="12">
                  <VBtn @click="addItem">+</VBtn>
                </VCol>
              </VRow>

              <!-- Tabela de cores -->
              <VRow v-if="cores.length > 0">
                <VCol md="12" cols="12">
                  <div
                    v-for="(color, index) in cores"
                    :key="index"
                    class="mb-8"
                  >
                    <VRow>
                      <VCol md="6" cols="12">
                        <VTextField
                          v-model="color.cor"
                          placeholder="ex: Azul, Vermelho, Preto"
                          label="Nome da cor"
                        />
                      </VCol>
                      <VCol md="6" cols="12">
                        <IconBtn @click="addTamanho(index)">
                          <VIcon icon="bxs-plus-circle" />
                        </IconBtn>
                        <IconBtn @click="removeItem(index)">
                          <VIcon icon="bxs-trash" />
                        </IconBtn>
                      </VCol>
                    </VRow>

                    <VRow
                      md="12"
                      cols="12"
                      v-for="(size, sizeIndex) in color.tamanhos"
                      :key="sizeIndex"
                    >
                      <VCol md="5" cols="12">
                        <VTextField
                          v-model="size.tamanho"
                          placeholder="ex: P, M, G"
                          label="Nome do tamanho"
                        />
                      </VCol>
                      <VCol md="5" cols="12">
                        <VTextField
                          v-model="size.qtdTamanho"
                          placeholder="ex: 10, 20, 30"
                          label="Quantidade"
                          @input="
                            size.qtdTamanho = size.qtdTamanho.replace(/\D/g, '')
                          "
                        />
                      </VCol>
                      <VCol md="2" cols="12">
                        <IconBtn @click="removeTamanho(index, sizeIndex)">
                          <VIcon icon="bxs-trash" />
                        </IconBtn>
                      </VCol>
                    </VRow>
                  </div>
                </VCol>
              </VRow>

              <VRow>
                <VCol cols="12" class="d-flex flex-wrap gap-4">
                  <VBtn @click="next">Próximo</VBtn>
                  <VBtn color="secondary" variant="tonal" @click="pass">
                    Anterior
                  </VBtn>
                </VCol>
              </VRow>
            </div>
          </VCardText>
        </VCard>
      </VCol>
    </VRow>
  </div>
</template>

<script>
export default {
  data() {
    return {
      showInput: false,
      textInput: "",
      selectedColorIndex: null,
      cores: [],
    };
  },
  props: {
    items: {
      type: Array,
      default: () => [],
      required: true,
    },
  },

  watch: {
    items: {
      immediate: true,
      handler(value) {
        this.cores = value;
      },
    },
  },

  methods: {
    addItem() {
      if (this.textInput.trim() !== "") {
        this.cores.push({ cor: this.textInput, tamanhos: [] });
        this.textInput = "";
        this.showInput = false; // Oculta o campo de entrada após adicionar
      } else {
        alert("Por favor, insira uma cor.");
      }
    },
    pass() {
      this.$emit("pass", "security");
    },
    next() {
      this.$emit("next", "site");
      this.$emit("update:items", this.cores);
    },
    removeItem(index) {
      this.cores.splice(index, 1);
      if (this.selectedColorIndex === index) {
        this.selectedColorIndex = null;
      } else if (this.selectedColorIndex > index) {
        this.selectedColorIndex--;
      }
    },
    addTamanho(index) {
      this.selectedColorIndex = index;
      const selectedColor = this.cores[index];
      if (selectedColor) {
        selectedColor.tamanhos.push({ tamanho: "", qtdTamanho: "" });
      }
    },
    removeTamanho(colorIndex, sizeIndex) {
      if (this.cores[colorIndex]) {
        this.cores[colorIndex].tamanhos.splice(sizeIndex, 1);
      }
    },
  },
};
</script>
