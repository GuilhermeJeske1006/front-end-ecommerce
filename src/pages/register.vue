<style lang="scss">
@use "@core/scss/template/pages/page-auth.scss";
</style>

<script setup>
import loading from "@/components/geral/LoadingOverlay.vue";
import UploadImage from "@/components/geral/UploadImage.vue";
import { useUsuarioStore } from "@/stores/UsuarioStore";
import { useRoute } from "vue-router";

const usuario = useUsuarioStore();
const route = useRoute();
const activeTab = ref(route.params.tab);
const isCurrentPasswordVisible = ref(false);

const erroNewPassword = reactive({
  erroMinimo: "A senha deve ter pelo menos 8 caracteres",
  erroMinusculo: "A senha deve conter pelo menos um caractere Maiusculo",
  erroSimbolo:
    "A senha deve conter pelo menos um número, símbolo ou caractere de espaço",
  erro: "",
});

const cadastro = ref({
  foto: "",
  name: "",
  email: "",
  password: "",
  cpf: "",
  telefone: "",
});

const validatePassword = () => {
  // Verifica se a senha tem pelo menos 8 caracteres
  if (cadastro.value.password.length >= 8) {
    erroNewPassword.erroMinimo = "";
  } else {
    erroNewPassword.erroMinimo = "A senha deve ter pelo menos 8 caracteres";
  }

  // Verifica se a senha tem pelo menos uma letra minúscula
  if (/[A-Z]/.test(cadastro.value.password)) {
    erroNewPassword.erroMinusculo = "";
  } else {
    erroNewPassword.erroMinusculo =
      "A senha deve conter pelo menos um caractere Maiusculo";
  }

  // Verifica se a senha tem pelo menos um número, símbolo ou caractere de espaço em branco
  if (/[0-9!@#$%^&*()\s]/.test(cadastro.value.password)) {
    erroNewPassword.erroSimbolo = "";
  } else {
    erroNewPassword.erroSimbolo =
      "A senha deve conter pelo menos um número, símbolo ou caractere de espaço.";
  }
};

const isValid = ref(false);

const nomeRule = [
  (v) => !!v || "Nome é obrigatório",
  (v) => (v && v.length >= 3) || "Nome deve ter pelo menos 3 caracteres",
];

const emailRule = [
  (v) => !!v || "Email é obrigatório",
  (v) => /.+@.+\..+/.test(v) || "Email deve ser válido",
];

const cpfRule = [
  (v) => !!v || "CPF é obrigatório",
  (v) => (v && v.length >= 14) || "CPF deve ter pelo menos 14 caracteres",
];
const telefoneRule = [
  (v) => !!v || "Telefone é obrigatório",
  (v) => {
    const telefoneFormatado = v.replace(/\D/g, ""); // Remove todos os caracteres não numéricos
    return (
      telefoneFormatado.length === 11 ||
      telefoneFormatado.length === 10 ||
      "Telefone deve estar no formato (XX) XXXXX-XXXX"
    );
  },
  (v) =>
    (v && v.replace(/\D/g, "").length >= 10) ||
    "Telefone deve ter pelo menos 10 dígitos",
];

const submit = () => {
  if (isValid.value) {
    const data = {
      name: cadastro.value.name,
      email: cadastro.value.email,
      password: cadastro.value.password,
      cpf: cadastro.value.cpf,
      foto: cadastro.value.foto,
      telefone: cadastro.value.telefone,
      is_master: true,
    };
    usuario.UsuarioCadastro(data);
  }
};

const formatTelefone = () => {
  let telefone = cadastro.value.telefone;

  telefone = telefone.replace(/\D/g, "");

  if (telefone.length > 11) {
    telefone = telefone
      .slice(0, 11)
      .replace(/(\d{2})(\d{5})(\d{4})/, "($1) $2-$3");
  } else if (telefone.length > 6) {
    telefone = telefone.replace(/(\d{2})(\d{5})(\d{0,4})/, "($1) $2-$3");
  } else if (telefone.length > 2) {
    telefone = telefone.replace(/(\d{2})(\d{0,5})/, "($1) $2");
  }

  cadastro.value.telefone = telefone;
};

const formatCpf = () => {
  let cpf = cadastro.value.cpf;

  cpf = cpf.replace(/\D/g, "");

  if (cpf.length > 11) {
    cpf = cpf.slice(0, 11);
  }

  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d)/, "$1.$2");
  cpf = cpf.replace(/(\d{3})(\d{1,2})$/, "$1-$2");

  cadastro.value.cpf = cpf;
};
</script>

<template>
  <div>
    <loading :is-loading="usuario.isLoading" />

    <VDivider />

    <VWindow v-model="activeTab" class="mt-5 disable-tab-transition">
      <!-- Account -->
      <VWindowItem value="account">
        <VRow>
          <VCol cols="12">
            <VCard title="Detalhes do usuario">
              <UploadImage :items="cadastro" />

              <VDivider />

              <VCardText>
                <!-- 👉 Form -->
                <VForm
                  class="mt-6"
                  ref="formUser"
                  v-model="isValid"
                  @submit.prevent="submit"
                >
                  <VRow>
                    <!-- 👉 First Name -->
                    <VCol md="6" cols="12">
                      <VTextField
                        v-model="cadastro.name"
                        placeholder="Ex: Joao da silva"
                        label="Seu nome"
                        :rules="nomeRule"
                      />
                    </VCol>

                    <!-- 👉 Last Name -->
                    <VCol md="6" cols="12">
                      <VTextField
                        v-model="cadastro.email"
                        placeholder="email@gmail.com"
                        type="email"
                        label="Seu email"
                        :rules="emailRule"
                      />
                    </VCol>
                    <VCol md="6" cols="12">
                      <VTextField
                        v-model="cadastro.cpf"
                        placeholder="111.111.111-11"
                        type="text"
                        @input="formatCpf"
                        label="Seu CPF"
                        :rules="cpfRule"
                      />
                    </VCol>
                    <VCol md="6" cols="12">
                      <VTextField
                        v-model="cadastro.telefone"
                        placeholder=""
                        type="text"
                        @input="formatTelefone"
                        label="Seu Telefone"
                        :rules="telefoneRule"
                      />
                    </VCol>

                    <VCol cols="12" md="6">
                      <!-- 👉 current password -->
                      <VTextField
                        v-model="cadastro.password"
                        :type="isCurrentPasswordVisible ? 'text' : 'password'"
                        :append-inner-icon="
                          isCurrentPasswordVisible ? 'bx-hide' : 'bx-show'
                        "
                        label="Senha"
                        placeholder="············"
                        @click:append-inner="
                          isCurrentPasswordVisible = !isCurrentPasswordVisible
                        "
                        @input="validatePassword"
                      />
                    </VCol>
                    <VCol cols="12" md="12">
                      <VCardText
                        v-if="
                          erroNewPassword.erroSimbolo != '' ||
                          erroNewPassword.erroMinusculo != '' ||
                          erroNewPassword.erroMinimo != ''
                        "
                      >
                        <p class="text-base font-weight-medium mt-2">
                          Requisitos de senha:
                        </p>

                        <ul class="d-flex flex-column gap-y-3">
                          <li
                            v-if="erroNewPassword.erroMinimo != ''"
                            class="d-flex"
                          >
                            <div>
                              <VIcon size="7" icon="bxs-circle" class="me-3" />
                            </div>
                            <span class="font-weight-medium">{{
                              erroNewPassword.erroMinimo
                            }}</span>
                          </li>
                          <li
                            v-if="erroNewPassword.erroMinusculo != ''"
                            class="d-flex"
                          >
                            <div>
                              <VIcon size="7" icon="bxs-circle" class="me-3" />
                            </div>
                            <span class="font-weight-medium">{{
                              erroNewPassword.erroMinusculo
                            }}</span>
                          </li>
                          <li
                            v-if="erroNewPassword.erroSimbolo != ''"
                            class="d-flex"
                          >
                            <div>
                              <VIcon size="7" icon="bxs-circle" class="me-3" />
                            </div>
                            <span class="font-weight-medium">{{
                              erroNewPassword.erroSimbolo
                            }}</span>
                          </li>
                        </ul>
                      </VCardText>
                    </VCol>

                    <!-- 👉 Form Actions -->
                    <VCol cols="12" class="d-flex flex-wrap gap-4">
                      <VBtn
                        v-if="
                          erroNewPassword.erroSimbolo != '' ||
                          erroNewPassword.erroMinusculo != '' ||
                          erroNewPassword.erroMinimo != ''
                        "
                        disabled="disabled"
                        >Salvar</VBtn
                      >
                      <VBtn v-else type="submit">Salvar</VBtn>
                    </VCol>
                  </VRow>
                </VForm>
              </VCardText>
            </VCard>
          </VCol>
        </VRow>
      </VWindowItem>
    </VWindow>
  </div>
</template>
