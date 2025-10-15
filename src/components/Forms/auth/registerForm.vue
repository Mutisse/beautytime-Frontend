<template>
  <div class="register-form-container">
    <!-- Progress Steps - 4 STEPS -->
    <div class="progress-section">
      <div class="progress-steps">
        <div class="step" :class="{ active: currentStep >= 1, completed: currentStep > 1 }">
          <div class="step-number">1</div>
          <span class="step-label">Dados</span>
        </div>
        <div class="step" :class="{ active: currentStep >= 2, completed: currentStep > 2 }">
          <div class="step-number">2</div>
          <span class="step-label">Perfil</span>
        </div>
        <div class="step" :class="{ active: currentStep >= 3, completed: currentStep > 3 }">
          <div class="step-number">3</div>
          <span class="step-label">Senha</span>
        </div>
        <div class="step" :class="{ active: currentStep >= 4 }">
          <div class="step-number">4</div>
          <span class="step-label">Confirmação</span>
        </div>
      </div>
    </div>

    <!-- Form Content -->
    <div class="form-content-area">
      <q-form @submit="handleRegister" class="register-form-inner">
        <transition name="slide-fade" mode="out-in">
          <!-- Step 1: Dados Pessoais -->
          <div v-if="currentStep === 1" key="step1" class="form-step-inner">
            <div class="step-header-compact">
              <div class="header-icon-compact">
                <q-icon name="person" color="primary" size="20px" />
              </div>
              <h2>Informações Pessoais</h2>
              <p>Preencha seus dados básicos para começar</p>
            </div>

            <div class="form-grid-compact">
              <q-input
                v-model="registerForm.firstName"
                label="Nome *"
                outlined
                dense
                class="form-input-compact"
                :rules="[(val: string) => !!val || 'Nome é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" color="primary" />
                </template>
              </q-input>

              <q-input
                v-model="registerForm.lastName"
                label="Sobrenome *"
                outlined
                dense
                class="form-input-compact"
                :rules="[(val: string) => !!val || 'Sobrenome é obrigatório']"
              >
                <template v-slot:prepend>
                  <q-icon name="badge" color="primary" />
                </template>
              </q-input>

              <q-input
                v-model="registerForm.email"
                label="Email *"
                type="email"
                outlined
                dense
                class="form-input-compact"
                :rules="[
                  (val: string) => !!val || 'Email é obrigatório',
                  (val: string) => /.+@.+\..+/.test(val) || 'Email inválido',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="email" color="primary" />
                </template>
              </q-input>

              <q-input
                v-model="registerForm.phone"
                label="Telefone *"
                outlined
                dense
                mask="+258 ### ## ## ##"
                unmasked-value
                class="form-input-compact"
                :rules="[
                  (val: string) => !!val || 'Telefone é obrigatório',
                  (val: string) => val.replace(/[^0-9]/g, '').length >= 9 || 'Telefone incompleto',
                ]"
              >
                <template v-slot:prepend>
                  <q-icon name="phone" color="primary" />
                </template>
              </q-input>
            </div>

            <div class="step-actions-clean">
              <q-btn
                color="primary"
                label="Continuar"
                @click="nextStep"
                class="next-btn-clean"
                :disable="!isStep1Valid"
              />
            </div>
          </div>

          <!-- Step 2: Tipo de Perfil - DUAS COLUNAS -->
          <div v-else-if="currentStep === 2" key="step2" class="form-step-inner">
            <div class="step-header-compact">
              <div class="header-icon-compact">
                <q-icon name="groups" color="primary" size="20px" />
              </div>
              <h2>Tipo de Perfil</h2>
              <p>Selecione como você vai usar o BeautyTime</p>
            </div>

            <div class="profile-content-columns">
              <div class="profiles-grid-columns">
                <div
                  class="profile-card-column"
                  :class="{ active: registerForm.userType === 'client' }"
                  @click="registerForm.userType = 'client'"
                >
                  <div class="profile-icon-column">
                    <q-icon name="person" size="28px" />
                  </div>
                  <div class="profile-content-column">
                    <h4>Cliente</h4>
                    <p>Agendar serviços em salões de beleza e barbearias</p>
                  </div>
                  <q-icon
                    name="check_circle"
                    :color="registerForm.userType === 'client' ? 'primary' : 'grey-4'"
                    size="24px"
                    class="check-icon-column"
                  />
                </div>

                <div
                  class="profile-card-column"
                  :class="{ active: registerForm.userType === 'owner' }"
                  @click="registerForm.userType = 'owner'"
                >
                  <div class="profile-icon-column">
                    <q-icon name="store" size="28px" />
                  </div>
                  <div class="profile-content-column">
                    <h4>Proprietário</h4>
                    <p>Gerenciar meu salão de beleza ou barbearia</p>
                  </div>
                  <q-icon
                    name="check_circle"
                    :color="registerForm.userType === 'owner' ? 'primary' : 'grey-4'"
                    size="24px"
                    class="check-icon-column"
                  />
                </div>
              </div>
            </div>

            <div class="step-actions-clean">
              <q-btn flat color="grey" label="Voltar" @click="prevStep" class="back-btn-clean" />
              <q-btn
                color="primary"
                label="Continuar"
                @click="nextStep"
                class="next-btn-clean"
                :disable="!isStep2Valid"
              />
            </div>
          </div>

          <!-- Step 3: Senha - COM POLÍTICAS AVANÇADAS -->
          <div v-else-if="currentStep === 3" key="step3" class="form-step-inner">
            <div class="step-header-compact">
              <div class="header-icon-compact">
                <q-icon name="lock" color="primary" size="20px" />
              </div>
              <h2>Segurança da Conta</h2>
              <p>Crie uma senha forte e segura</p>
            </div>

            <div class="password-content-columns">
              <div class="password-grid-columns">
                <q-input
                  v-model="registerForm.password"
                  label="Senha *"
                  :type="showPassword ? 'text' : 'password'"
                  outlined
                  dense
                  class="password-input-column"
                  :rules="passwordRules"
                  @update:model-value="validatePassword"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" color="primary" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="showPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showPassword = !showPassword"
                    />
                  </template>
                </q-input>

                <q-input
                  v-model="registerForm.confirmPassword"
                  label="Confirmar senha *"
                  :type="showConfirmPassword ? 'text' : 'password'"
                  outlined
                  dense
                  class="password-input-column"
                  :rules="confirmPasswordRules"
                >
                  <template v-slot:prepend>
                    <q-icon name="lock" color="primary" />
                  </template>
                  <template v-slot:append>
                    <q-icon
                      :name="showConfirmPassword ? 'visibility_off' : 'visibility'"
                      class="cursor-pointer"
                      @click="showConfirmPassword = !showConfirmPassword"
                    />
                  </template>
                </q-input>
              </div>

              <!-- Políticas de Senha -->
              <div class="password-policies-column" v-if="registerForm.password">
                <h4>Requisitos de Segurança:</h4>
                <div class="policy-list">
                  <div class="policy-item" :class="{ valid: passwordRequirements.length.valid }">
                    <q-icon
                      :name="
                        passwordRequirements.length.valid
                          ? 'check_circle'
                          : 'radio_button_unchecked'
                      "
                      :color="passwordRequirements.length.valid ? 'positive' : 'grey'"
                    />
                    <span>Mínimo 8 caracteres</span>
                  </div>
                  <div class="policy-item" :class="{ valid: passwordRequirements.uppercase.valid }">
                    <q-icon
                      :name="
                        passwordRequirements.uppercase.valid
                          ? 'check_circle'
                          : 'radio_button_unchecked'
                      "
                      :color="passwordRequirements.uppercase.valid ? 'positive' : 'grey'"
                    />
                    <span>Pelo menos 1 letra maiúscula</span>
                  </div>
                  <div class="policy-item" :class="{ valid: passwordRequirements.lowercase.valid }">
                    <q-icon
                      :name="
                        passwordRequirements.lowercase.valid
                          ? 'check_circle'
                          : 'radio_button_unchecked'
                      "
                      :color="passwordRequirements.lowercase.valid ? 'positive' : 'grey'"
                    />
                    <span>Pelo menos 1 letra minúscula</span>
                  </div>
                  <div class="policy-item" :class="{ valid: passwordRequirements.number.valid }">
                    <q-icon
                      :name="
                        passwordRequirements.number.valid
                          ? 'check_circle'
                          : 'radio_button_unchecked'
                      "
                      :color="passwordRequirements.number.valid ? 'positive' : 'grey'"
                    />
                    <span>Pelo menos 1 número</span>
                  </div>
                  <div class="policy-item" :class="{ valid: passwordRequirements.special.valid }">
                    <q-icon
                      :name="
                        passwordRequirements.special.valid
                          ? 'check_circle'
                          : 'radio_button_unchecked'
                      "
                      :color="passwordRequirements.special.valid ? 'positive' : 'grey'"
                    />
                    <span>Pelo menos 1 caractere especial (@$!%*?&)</span>
                  </div>
                  <div class="policy-item" :class="{ valid: passwordRequirements.noSpaces.valid }">
                    <q-icon
                      :name="
                        passwordRequirements.noSpaces.valid
                          ? 'check_circle'
                          : 'radio_button_unchecked'
                      "
                      :color="passwordRequirements.noSpaces.valid ? 'positive' : 'grey'"
                    />
                    <span>Não pode conter espaços</span>
                  </div>
                </div>
              </div>

              <!-- Barra de progresso da senha -->
              <div class="password-strength-column" v-if="registerForm.password">
                <div class="strength-label-column">
                  Força da senha:
                  <span :class="passwordStrength.class">{{ passwordStrength.text }}</span>
                  <span class="strength-score">({{ passwordStrength.score }}/5)</span>
                </div>
                <div class="strength-bar-column">
                  <div
                    class="strength-fill-column"
                    :class="passwordStrength.class"
                    :style="{ width: passwordStrength.percentage + '%' }"
                  ></div>
                </div>
                <div class="strength-tips" v-if="passwordStrength.tips.length">
                  <q-icon name="lightbulb" size="16px" color="warning" />
                  <span>Dica: {{ passwordStrength.tips[0] }}</span>
                </div>
              </div>
            </div>

            <div class="step-actions-clean">
              <q-btn flat color="grey" label="Voltar" @click="prevStep" class="back-btn-clean" />
              <q-btn
                color="primary"
                label="Continuar"
                @click="nextStep"
                class="next-btn-clean"
                :disable="!isStep3Valid"
              />
            </div>
          </div>

          <!-- Step 4: Confirmação - ORDEM ALTERADA -->
          <div v-else key="step4" class="form-step-inner">
            <div class="step-header-compact">
              <div class="header-icon-compact">
                <q-icon name="verified" color="primary" size="20px" />
              </div>
              <h2>Confirmação Final</h2>
              <p>Revise seus dados e aceite os termos</p>
            </div>

            <div class="confirmation-content-reordered">
              <!-- PRIMEIRO: Termos de Compromisso -->
              <div class="terms-section-reordered">
                <h3>Termos de Compromisso BeautyTime</h3>
                <div class="terms-content-reordered">
                  <p>
                    <strong>Declaro sob minha responsabilidade que:</strong>
                  </p>
                  <ul>
                    <li>Todas as informações fornecidas são verdadeiras e precisas</li>
                    <li>Comprometo-me a utilizar a plataforma de forma ética e responsável</li>
                    <li>Concordo em respeitar os horários agendados e políticas de cancelamento</li>
                    <li>
                      Autorizo o tratamento dos meus dados pessoais conforme a Política de
                      Privacidade
                    </li>
                    <li>
                      Aceito receber comunicações relacionadas aos meus agendamentos e serviços
                    </li>
                    <li>
                      Comprometo-me a manter conduta respeitosa com todos os profissionais e
                      usuários
                    </li>
                    <li>Estou ciente das consequências do descumprimento destes termos</li>
                  </ul>
                  <p class="terms-note">
                    Ao prosseguir, você concorda integralmente com estes Termos de Compromisso e
                    nossa Política de Privacidade.
                  </p>
                </div>
              </div>

              <!-- SEGUNDO: Resumo dos Dados -->
              <div class="summary-section-reordered">
                <h3>Resumo do Seu Perfil</h3>
                <div class="summary-items-reordered">
                  <div class="summary-item-reordered">
                    <q-icon name="badge" size="16px" color="grey-6" />
                    <label>Nome Completo:</label>
                    <span>{{ fullName }}</span>
                  </div>
                  <div class="summary-item-reordered">
                    <q-icon name="email" size="16px" color="grey-6" />
                    <label>Email:</label>
                    <span>{{ registerForm.email }}</span>
                  </div>
                  <div class="summary-item-reordered">
                    <q-icon name="phone" size="16px" color="grey-6" />
                    <label>Telefone:</label>
                    <span>{{ formattedPhone }}</span>
                  </div>
                  <div class="summary-item-reordered">
                    <q-icon name="groups" size="16px" color="grey-6" />
                    <label>Perfil:</label>
                    <span class="profile-badge-reordered">{{ userTypeLabel }}</span>
                  </div>
                  <div class="summary-item-reordered">
                    <q-icon name="security" size="16px" color="grey-6" />
                    <label>Segurança:</label>
                    <span class="security-badge" :class="passwordStrength.class">
                      Senha {{ passwordStrength.text.toLowerCase() }}
                    </span>
                  </div>
                </div>
              </div>

              <!-- TERCEIRO: Checkbox de Aceitação -->
              <div class="acceptance-section">
                <q-checkbox
                  v-model="registerForm.acceptedTerms"
                  label="Declaro que li, compreendi e concordo com todos os Termos de Compromisso acima"
                  class="acceptance-checkbox"
                  dense
                />
              </div>
            </div>

            <div class="step-actions-clean">
              <q-btn flat color="grey" label="Voltar" @click="prevStep" class="back-btn-clean" />
              <q-btn
                type="submit"
                color="primary"
                label="Criar minha conta"
                class="register-btn-clean"
                :loading="loading"
                :disable="!registerForm.acceptedTerms"
              />
            </div>
          </div>
        </transition>
      </q-form>
    </div>

    <!-- OTP Verification Popup -->
    <OTPVerificationPopup
      v-if="showOtpPopup"
      :email="registerForm.email"
      @verify="handleOtpVerify"
      @resend="handleOtpResend"
      @close="handleOtpClose"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, computed, reactive } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import { useAuthStore } from '../../../stores/auth-store';
import OTPVerificationPopup from '../../Popup/OTPVerificationPopup.vue';
import type { RegisterPayload } from '../../../types/auth-Types';
import { UserMainRole, EmployeeSubRole } from '../../../types/auth-Types';

interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  userType: 'client' | 'owner';
  password: string;
  confirmPassword: string;
  acceptedTerms: boolean;
}

interface PasswordStrength {
  text: string;
  class: string;
  percentage: number;
  score: number;
  tips: string[];
}

interface PasswordRequirements {
  length: { valid: boolean; message: string };
  uppercase: { valid: boolean; message: string };
  lowercase: { valid: boolean; message: string };
  number: { valid: boolean; message: string };
  special: { valid: boolean; message: string };
  noSpaces: { valid: boolean; message: string };
}

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

const loading = ref(false);
const currentStep = ref(1);
const showPassword = ref(false);
const showConfirmPassword = ref(false);
const showOtpPopup = ref(false);

const registerForm = ref<RegisterFormData>({
  firstName: '',
  lastName: '',
  email: '',
  phone: '',
  userType: 'client',
  password: '',
  confirmPassword: '',
  acceptedTerms: false,
});

const passwordRequirements = reactive<PasswordRequirements>({
  length: { valid: false, message: 'Mínimo 8 caracteres' },
  uppercase: { valid: false, message: 'Pelo menos 1 letra maiúscula' },
  lowercase: { valid: false, message: 'Pelo menos 1 letra minúscula' },
  number: { valid: false, message: 'Pelo menos 1 número' },
  special: { valid: false, message: 'Pelo menos 1 caractere especial (@$!%*?&)' },
  noSpaces: { valid: false, message: 'Não pode conter espaços' },
});

const fullName = computed(() =>
  `${registerForm.value.firstName} ${registerForm.value.lastName}`.trim(),
);

const formattedPhone = computed(() => {
  const phone = registerForm.value.phone.replace(/\D/g, '');
  return phone
    ? `+258 ${phone.slice(0, 3)} ${phone.slice(3, 5)} ${phone.slice(5, 7)} ${phone.slice(7, 9)}`
    : '';
});

const userTypeLabel = computed(() =>
  registerForm.value.userType === 'client' ? 'Cliente' : 'Proprietário',
);

const isStep1Valid = computed(() => {
  const form = registerForm.value;
  return (
    form.firstName &&
    form.lastName &&
    form.email &&
    /.+@.+\..+/.test(form.email) &&
    form.phone.replace(/[^0-9]/g, '').length >= 9
  );
});

const isStep2Valid = computed(() => {
  return registerForm.value.userType;
});

const isStep3Valid = computed(() => {
  const form = registerForm.value;
  const allRequirementsMet = Object.values(passwordRequirements).every((req) => req.valid);
  return (
    form.password &&
    form.confirmPassword &&
    form.password === form.confirmPassword &&
    allRequirementsMet
  );
});

const passwordRules = [
  (val: string) => !!val || 'Senha é obrigatória',
  (val: string) => val.length >= 8 || 'Mínimo 8 caracteres',
  (val: string) => /[A-Z]/.test(val) || 'Pelo menos 1 letra maiúscula',
  (val: string) => /[a-z]/.test(val) || 'Pelo menos 1 letra minúscula',
  (val: string) => /[0-9]/.test(val) || 'Pelo menos 1 número',
  (val: string) => /[@$!%*?&]/.test(val) || 'Pelo menos 1 caractere especial (@$!%*?&)',
  (val: string) => !/\s/.test(val) || 'Não pode conter espaços',
];

const confirmPasswordRules = [
  (val: string) => !!val || 'Confirme sua senha',
  (val: string) => val === registerForm.value.password || 'Senhas não coincidem',
];

const validatePassword = () => {
  const password = registerForm.value.password;
  passwordRequirements.length.valid = password.length >= 8;
  passwordRequirements.uppercase.valid = /[A-Z]/.test(password);
  passwordRequirements.lowercase.valid = /[a-z]/.test(password);
  passwordRequirements.number.valid = /[0-9]/.test(password);
  passwordRequirements.special.valid = /[@$!%*?&]/.test(password);
  passwordRequirements.noSpaces.valid = !/\s/.test(password);
};

const passwordStrength = computed((): PasswordStrength => {
  const password = registerForm.value.password;
  if (!password)
    return {
      text: '',
      class: '',
      percentage: 0,
      score: 0,
      tips: [],
    };

  let score = 0;
  const tips: string[] = [];

  if (password.length >= 8) score += 1;
  if (password.length >= 12) score += 1;
  if (/[A-Z]/.test(password)) score += 1;
  if (/[a-z]/.test(password)) score += 1;
  if (/[0-9]/.test(password)) score += 1;
  if (/[@$!%*?&]/.test(password)) score += 1;
  if (password.length > 14) score += 1;

  if (password.length < 8) tips.push('Tente uma senha com pelo menos 8 caracteres');
  if (!/[A-Z]/.test(password)) tips.push('Adicione uma letra maiúscula');
  if (!/[a-z]/.test(password)) tips.push('Adicione uma letra minúscula');
  if (!/[0-9]/.test(password)) tips.push('Inclua um número');
  if (!/[@$!%*?&]/.test(password)) tips.push('Use um caractere especial (@$!%*?&)');
  if (/\s/.test(password)) tips.push('Remova os espaços da senha');
  if (password.length < 12 && score >= 4)
    tips.push('Tente uma senha mais longa para maior segurança');

  const percentage = Math.min((score / 6) * 100, 100);

  let text = '';
  let className = '';

  if (score <= 2) {
    text = 'Muito Fraca';
    className = 'very-weak';
  } else if (score === 3) {
    text = 'Fraca';
    className = 'weak';
  } else if (score === 4) {
    text = 'Média';
    className = 'medium';
  } else if (score === 5) {
    text = 'Forte';
    className = 'strong';
  } else {
    text = 'Muito Forte';
    className = 'very-strong';
  }

  return { text, class: className, percentage, score, tips };
});

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) {
    return error.message;
  }
  if (typeof error === 'string') {
    return error;
  }
  try {
    return JSON.stringify(error);
  } catch {
    return 'Erro ao criar conta';
  }
}

const nextStep = () => currentStep.value < 4 && currentStep.value++;
const prevStep = () => currentStep.value > 1 && currentStep.value--;

// ✅ MÉTODO CORRIGIDO: Usar apenas verifyOtpAndCompleteRegistration
const handleOtpVerify = async (payload: { email: string; code: string }) => {
  try {
    // ✅ CORREÇÃO: Removida a variável 'result' não utilizada
    await authStore.verifyOtpAndCompleteRegistration(payload.code);

    showOtpPopup.value = false;

    $q.notify({
      type: 'positive',
      message: 'Conta criada com sucesso! Bem-vindo ao BeautyTime!',
      position: 'top',
      timeout: 3000,
    });

    await router.push('/dashboard');
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    $q.notify({
      type: 'negative',
      message: errorMessage || 'Erro ao verificar código',
      position: 'top',
      timeout: 5000,
    });
    throw error;
  }
};
const handleOtpResend = async (payload: { email: string }) => {
  try {
    await authStore.resendOtp({
      email: payload.email,
    });

    $q.notify({
      type: 'positive',
      message: 'Código reenviado com sucesso!',
      position: 'top',
    });
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: 'Erro ao reenviar código',
      position: 'top',
    });
    throw error;
  }
};

const handleOtpClose = () => {
  showOtpPopup.value = false;
  $q.notify({
    type: 'info',
    message: 'Verificação de email cancelada',
    position: 'top',
  });
};

const handleRegister = async () => {
  try {
    loading.value = true;

    const emailExists = await authStore.checkEmailExists(registerForm.value.email);

    if (emailExists) {
      $q.notify({
        type: 'negative',
        message: 'Este email já está registrado. Por favor, use outro email.',
        position: 'top',
        timeout: 5000,
      });
      return;
    }

    const role =
      registerForm.value.userType === 'client' ? UserMainRole.CLIENT : UserMainRole.EMPLOYEE;

    const registrationPayload: RegisterPayload = {
      firstName: registerForm.value.firstName,
      lastName: registerForm.value.lastName,
      email: registerForm.value.email,
      password: registerForm.value.password,
      phone: registerForm.value.phone,
      role: role,
      ...(registerForm.value.userType === 'owner' && {
        subRole: EmployeeSubRole.SALON_OWNER,
      }),
      acceptTerms: registerForm.value.acceptedTerms,
    };

    await authStore.startRegistration(registrationPayload);

    await authStore.requestOtp({
      email: registerForm.value.email,
      purpose: 'registration',
      name: `${registerForm.value.firstName} ${registerForm.value.lastName}`,
    });

    showOtpPopup.value = true;

    $q.notify({
      type: 'positive',
      message: 'Código de verificação enviado para seu email!',
      position: 'top',
    });
  } catch (error: unknown) {
    const errorMessage = getErrorMessage(error);
    $q.notify({
      type: 'negative',
      message: errorMessage || 'Erro ao iniciar registro. Tente novamente.',
      position: 'top',
      timeout: 5000,
    });
  } finally {
    loading.value = false;
  }
};
</script>
<style lang="scss" scoped>
.register-form-container {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  height: 100%;
  padding: 0;
}

/* Progress Steps - 4 STEPS */
.progress-section {
  flex-shrink: 0;
  padding: 0 0 20px 0;
}

.progress-steps {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 20px;
}

.step {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;

  .step-number {
    width: 26px;
    height: 26px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600;
    font-size: 0.75rem;
    background: #f8f9fa;
    color: #adb5bd;
    border: 2px solid #e9ecef;
  }

  &.active .step-number {
    background: #1976d2;
    color: white;
    border-color: #1976d2;
  }

  &.completed .step-number {
    background: #4caf50;
    color: white;
    border-color: #4caf50;
  }

  .step-label {
    font-size: 0.7rem;
    font-weight: 500;
    color: #adb5bd;
  }

  &.active .step-label {
    color: #1976d2;
    font-weight: 600;
  }
}

/* Form Content Area */
.form-content-area {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}

.register-form-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}

.form-step-inner {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  width: 100%;
  overflow: hidden;
}

/* Step Header */
.step-header-compact {
  text-align: center;
  margin-bottom: 25px;
  flex-shrink: 0;

  .header-icon-compact {
    margin: 0 auto 12px auto;
    background: rgba(25, 118, 210, 0.1);
    width: 45px;
    height: 45px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  h2 {
    margin: 0 0 8px 0;
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.2rem;
  }

  p {
    margin: 0;
    color: #6c757d;
    font-size: 0.85rem;
  }
}

/* Step 1: Dados Pessoais */
.form-grid-compact {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 15px;
  margin-bottom: 20px;
  flex: 1;
  min-height: 0;
  overflow: auto;
  padding: 5px 0;
}

.form-input-compact {
  :deep(.q-field__control) {
    border-radius: 8px;
    min-height: 45px;
  }

  :deep(.q-field__native) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
}

/* Step 2: Perfil - DUAS COLUNAS */
.profile-content-columns {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  padding: 10px 0;
}

.profiles-grid-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto;
  width: 100%;
}

.profile-card-column {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 25px 20px;
  background: #f8f9fa;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  text-align: center;
  position: relative;

  &:hover {
    background: #e9ecef;
    transform: translateY(-2px);
  }

  &.active {
    background: rgba(25, 118, 210, 0.1);
    border: 2px solid #1976d2;
  }

  .profile-icon-column {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 60px;
    height: 60px;
    background: rgba(25, 118, 210, 0.1);
    border-radius: 12px;
    color: #1976d2;
    margin-bottom: 15px;
  }

  .profile-content-column {
    flex: 1;

    h4 {
      margin: 0 0 8px 0;
      font-weight: 600;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    p {
      margin: 0;
      color: #6c757d;
      font-size: 0.85rem;
      line-height: 1.4;
    }
  }

  .check-icon-column {
    position: absolute;
    top: 15px;
    right: 15px;
  }
}

/* Step 3: Senha - COM POLÍTICAS AVANÇADAS */
.password-content-columns {
  flex: 1;
  display: flex;
  flex-direction: column;
  min-height: 0;
  overflow: auto;
  padding: 10px 0;
}

.password-grid-columns {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
  max-width: 600px;
  margin: 0 auto 20px auto;
  width: 100%;
}

.password-input-column {
  :deep(.q-field__control) {
    border-radius: 8px;
    min-height: 45px;
  }

  :deep(.q-field__native) {
    padding: 10px 12px;
    font-size: 0.9rem;
  }
}

/* Políticas de Senha */
.password-policies-column {
  max-width: 600px;
  margin: 0 auto 20px auto;
  width: 100%;
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;

  h4 {
    margin: 0 0 15px 0;
    font-weight: 600;
    color: #2c3e50;
    font-size: 1rem;
    text-align: center;
  }

  .policy-list {
    display: flex;
    flex-direction: column;
    gap: 10px;

    .policy-item {
      display: flex;
      align-items: center;
      gap: 10px;
      padding: 8px 12px;
      border-radius: 6px;
      transition: all 0.3s ease;
      font-size: 0.85rem;

      &:not(.valid) {
        color: #6c757d;
        background: rgba(108, 117, 125, 0.05);
      }

      &.valid {
        color: #2e7d32;
        background: rgba(46, 125, 50, 0.1);
        font-weight: 500;
      }

      .q-icon {
        font-size: 18px;
      }
    }
  }
}

.password-strength-column {
  max-width: 600px;
  margin: 0 auto;
  width: 100%;

  .strength-label-column {
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 0.85rem;
    color: #6c757d;
    margin-bottom: 8px;

    span {
      font-weight: 600;
      font-size: 0.85rem;

      &.very-weak {
        color: #d32f2f;
      }
      &.weak {
        color: #f44336;
      }
      &.medium {
        color: #ff9800;
      }
      &.strong {
        color: #4caf50;
      }
      &.very-strong {
        color: #2e7d32;
      }
    }

    .strength-score {
      font-size: 0.8rem;
      color: #6c757d;
      font-weight: normal;
    }
  }

  .strength-bar-column {
    height: 8px;
    background: #e9ecef;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;

    .strength-fill-column {
      height: 100%;
      border-radius: 4px;
      transition: all 0.3s ease;

      &.very-weak {
        background: #d32f2f;
      }
      &.weak {
        background: #f44336;
      }
      &.medium {
        background: #ff9800;
      }
      &.strong {
        background: #4caf50;
      }
      &.very-strong {
        background: #2e7d32;
      }
    }
  }

  .strength-tips {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px 12px;
    background: rgba(255, 152, 0, 0.1);
    border-radius: 6px;
    font-size: 0.8rem;
    color: #e65100;

    .q-icon {
      flex-shrink: 0;
    }
  }
}

/* Step 4: Confirmação - ORDEM ALTERADA */
.confirmation-content-reordered {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 25px;
  min-height: 0;
  overflow: auto;
  padding: 10px 0;
}

/* PRIMEIRO: Termos de Compromisso */
.terms-section-reordered {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;

  h3 {
    margin: 0 0 20px 0;
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1rem;
    text-align: center;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 12px;
  }

  .terms-content-reordered {
    p {
      margin: 0 0 15px 0;
      color: #2c3e50;
      font-size: 0.95rem;
      line-height: 1.5;
    }

    ul {
      margin: 0 0 20px 0;
      padding-left: 20px;

      li {
        color: #6c757d;
        font-size: 0.9rem;
        line-height: 1.6;
        margin-bottom: 8px;
      }
    }

    .terms-note {
      background: rgba(25, 118, 210, 0.05);
      border-left: 4px solid #1976d2;
      padding: 12px 15px;
      border-radius: 0 8px 8px 0;
      font-weight: 500;
      color: #1976d2;
    }
  }
}

/* SEGUNDO: Resumo dos Dados */
.summary-section-reordered {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 25px;

  h3 {
    margin: 0 0 20px 0;
    font-weight: 600;
    color: #2c3e50;
    font-size: 1.1rem;
    text-align: center;
    border-bottom: 2px solid #e9ecef;
    padding-bottom: 12px;
  }
}

.summary-items-reordered {
  .summary-item-reordered {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 12px 0;
    border-bottom: 1px solid #e9ecef;

    &:last-child {
      border-bottom: none;
    }

    label {
      font-weight: 500;
      color: #6c757d;
      font-size: 0.9rem;
      min-width: 120px;
    }

    span {
      font-weight: 600;
      color: #2c3e50;
      font-size: 0.9rem;
      flex: 1;
    }

    .profile-badge-reordered {
      padding: 6px 12px;
      background: rgba(25, 118, 210, 0.1);
      color: #1976d2;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;
    }

    .security-badge {
      padding: 6px 12px;
      border-radius: 12px;
      font-size: 0.85rem;
      font-weight: 600;

      &.very-weak {
        background: rgba(211, 47, 47, 0.1);
        color: #d32f2f;
      }
      &.weak {
        background: rgba(244, 67, 54, 0.1);
        color: #f44336;
      }
      &.medium {
        background: rgba(255, 152, 0, 0.1);
        color: #ff9800;
      }
      &.strong {
        background: rgba(76, 175, 80, 0.1);
        color: #4caf50;
      }
      &.very-strong {
        background: rgba(46, 125, 50, 0.1);
        color: #2e7d32;
      }
    }
  }
}

/* TERCEIRO: Checkbox de Aceitação */
.acceptance-section {
  background: #f8f9fa;
  border-radius: 12px;
  padding: 20px;

  .acceptance-checkbox {
    :deep(.q-checkbox__label) {
      font-size: 0.9rem;
      color: #2c3e50;
      font-weight: 500;
      line-height: 1.4;
    }
  }
}

/* Botões */
.step-actions-clean {
  display: flex;
  gap: 12px;
  justify-content: center;
  margin-top: auto;
  padding-top: 25px;
  flex-shrink: 0;
  border-top: 1px solid #e9ecef;

  .back-btn-clean,
  .next-btn-clean,
  .register-btn-clean {
    min-width: 110px;
    height: 40px;
    font-weight: 600;
    border-radius: 8px;
    text-transform: none;
    font-size: 0.9rem;
  }
}

/* Animations */
.slide-fade-enter-active,
.slide-fade-leave-active {
  transition: all 0.3s ease;
}

.slide-fade-enter-from {
  opacity: 0;
  transform: translateX(15px);
}

.slide-fade-leave-to {
  opacity: 0;
  transform: translateX(-15px);
}

/* Responsive */
@media (max-width: 768px) {
  .form-grid-compact,
  .profiles-grid-columns,
  .password-grid-columns {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .progress-steps {
    gap: 15px;
  }

  .step-actions-clean {
    flex-direction: column;

    .back-btn-clean,
    .next-btn-clean,
    .register-btn-clean {
      min-width: auto;
      width: 100%;
    }
  }

  .profile-card-column {
    padding: 20px 15px;

    .profile-icon-column {
      width: 50px;
      height: 50px;
    }
  }

  .terms-section-reordered,
  .summary-section-reordered {
    padding: 20px;
  }

  .password-policies-column {
    padding: 15px;
  }

  .strength-label-column {
    flex-direction: column;
    align-items: flex-start;
    gap: 5px;
  }
}
</style>
