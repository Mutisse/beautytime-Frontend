<template>
  <div class="form-section">
    <h3><i class="fas fa-credit-card"></i> Métodos de Pagamento</h3>
    <p class="form-hint">Configure as opções de pagamento e políticas do seu salão</p>

    <!-- Políticas de Pagamento para Marcações -->
    <div class="payment-policies-section">
      <h4><i class="fas fa-hand-holding-usd"></i> Política de Pagamento para Marcações</h4>
      <p class="section-description">
        Defina como os clientes devem pagar pelas marcações no seu salão
      </p>

      <div class="payment-policies-options">
        <div class="policy-option">
          <input
            type="checkbox"
            id="full_payment"
            :checked="!!modeloSalon.paymentPolicies?.includes('full_payment')"
            @change="manterMudancaPoliticaPagamento('full_payment', $event)"
          />
          <label for="full_payment">
            <div class="policy-icon">
              <i class="fas fa-money-bill-wave"></i>
            </div>
            <div class="policy-content">
              <h5>Pagamento Total Antecipado</h5>
              <p>Cliente paga o valor total no momento da marcação</p>
              <small class="policy-hint">Recomendado para serviços de valor mais baixo</small>
            </div>
          </label>
        </div>

        <div class="policy-option">
          <input
            type="checkbox"
            id="deposit_50"
            :checked="!!modeloSalon.paymentPolicies?.includes('deposit_50')"
            @change="manterMudancaPoliticaPagamento('deposit_50', $event)"
          />
          <label for="deposit_50">
            <div class="policy-icon">
              <i class="fas fa-percentage"></i>
            </div>
            <div class="policy-content">
              <h5>Entrada de 50% + Saldo</h5>
              <p>50% no momento da marcação e 50% no dia do serviço</p>
              <small class="policy-hint">Ideal para serviços de valor médio a alto</small>
            </div>
          </label>
        </div>

        <div class="policy-option">
          <input
            type="checkbox"
            id="pay_at_salon"
            :checked="!!modeloSalon.paymentPolicies?.includes('pay_at_salon')"
            @change="manterMudancaPoliticaPagamento('pay_at_salon', $event)"
          />
          <label for="pay_at_salon">
            <div class="policy-icon">
              <i class="fas fa-store"></i>
            </div>
            <div class="policy-content">
              <h5>Pagamento no Salão</h5>
              <p>Cliente paga apenas quando chegar ao salão</p>
              <small class="policy-hint">Para clientes fiéis ou serviços rápidos</small>
            </div>
          </label>
        </div>

        <div class="policy-option">
          <input
            type="checkbox"
            id="both_options"
            :checked="!!modeloSalon.paymentPolicies?.includes('both_options')"
            @change="manterMudancaPoliticaPagamento('both_options', $event)"
          />
          <label for="both_options">
            <div class="policy-icon">
              <i class="fas fa-random"></i>
            </div>
            <div class="policy-content">
              <h5>Múltiplas Opções</h5>
              <p>Oferece diferentes formas de pagamento ao cliente</p>
              <small class="policy-hint">Mais flexibilidade para o cliente escolher</small>
            </div>
          </label>
        </div>
      </div>

      <!-- Mensagens informativas -->
      <div v-if="mensagemAtiva" class="policy-message" :class="tipoMensagem">
        <div class="message-content">
          <i :class="iconeMensagem"></i>
          <div class="message-text">
            <h5>{{ mensagemAtiva.titulo }}</h5>
            <p>{{ mensagemAtiva.descricao }}</p>
            <small v-if="mensagemAtiva.dica">{{ mensagemAtiva.dica }}</small>
          </div>
          <button class="close-message" @click="fecharMensagem">
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>

      <!-- Informações adicionais sobre políticas selecionadas -->
      <div v-if="politicasSelecionadas.length > 0" class="selected-policies-info">
        <h5><i class="fas fa-info-circle"></i> Resumo das Políticas Selecionadas</h5>
        <div class="policies-summary">
          <div
            v-for="politica in politicasSelecionadas"
            :key="politica.id"
            class="policy-summary-item"
          >
            <i class="fas fa-check-circle"></i>
            <span>{{ politica.descricao }}</span>
          </div>
        </div>

        <div class="policy-recommendation">
          <h6><i class="fas fa-lightbulb"></i> Recomendação:</h6>
          <p>{{ recomendacaoAtual }}</p>
        </div>
      </div>
    </div>

    <!-- Métodos de Pagamento Aceitos -->
    <div class="payment-methods-grid">
      <div class="payment-category">
        <h4><i class="fas fa-money-bill-wave"></i> Métodos de Pagamento Aceitos</h4>
        <p class="section-description">Selecione os métodos de pagamento que o seu salão aceita</p>

        <div class="payment-options">
          <div class="payment-option">
            <input
              type="checkbox"
              id="cash"
              :checked="modeloSalon.paymentMethods.includes('cash')"
              @change="manterMudancaMetodoPagamento('cash', $event)"
            />
            <label for="cash">
              <i class="fas fa-money-bill"></i>
              <span>Dinheiro</span>
            </label>
          </div>
          <div class="payment-option">
            <input
              type="checkbox"
              id="card"
              :checked="modeloSalon.paymentMethods.includes('card')"
              @change="manterMudancaMetodoPagamento('card', $event)"
            />
            <label for="card">
              <i class="fas fa-credit-card"></i>
              <span>Cartão (Débito/Crédito)</span>
            </label>
          </div>
          <div class="payment-option">
            <input
              type="checkbox"
              id="bank_transfer"
              :checked="modeloSalon.paymentMethods.includes('bank_transfer')"
              @change="manterMudancaMetodoPagamento('bank_transfer', $event)"
            />
            <label for="bank_transfer">
              <i class="fas fa-university"></i>
              <span>Transferência Bancária</span>
            </label>
          </div>
          <div class="payment-option">
            <input
              type="checkbox"
              id="mobile_wallet"
              :checked="modeloSalon.paymentMethods.includes('mobile_wallet')"
              @change="alternarCarteirasMoveis($event)"
            />
            <label for="mobile_wallet">
              <i class="fas fa-mobile-alt"></i>
              <span>Carteira Móvel</span>
            </label>
          </div>
        </div>
      </div>

      <!-- Carteiras Móveis (apenas se mobile_wallet estiver selecionado) -->
      <div v-if="modeloSalon.paymentMethods.includes('mobile_wallet')" class="payment-category">
        <h4><i class="fas fa-wallet"></i> Carteiras Móveis (Moçambique)</h4>
        <div class="payment-options">
          <div class="payment-option">
            <input
              type="checkbox"
              id="mpesa"
              :checked="modeloSalon.mobileWallets.includes('mpesa')"
              @change="manterMudancaCarteiraMovel('mpesa', $event)"
            />
            <label for="mpesa">
              <i class="fas fa-sim-card"></i>
              <span>MPesa (Vodacom)</span>
            </label>
          </div>
          <div class="payment-option">
            <input
              type="checkbox"
              id="e_mola"
              :checked="modeloSalon.mobileWallets.includes('e_mola')"
              @change="manterMudancaCarteiraMovel('e_mola', $event)"
            />
            <label for="e_mola">
              <i class="fas fa-mobile"></i>
              <span>e-Mola (Movitel)</span>
            </label>
          </div>
          <div class="payment-option">
            <input
              type="checkbox"
              id="movitel_mocamba"
              :checked="modeloSalon.mobileWallets.includes('movitel_mocamba')"
              @change="manterMudancaCarteiraMovel('movitel_mocamba', $event)"
            />
            <label for="movitel_mocamba">
              <i class="fas fa-sim-card"></i>
              <span>Mocamba (Movitel)</span>
            </label>
          </div>
        </div>
      </div>
    </div>

    <!-- Políticas do Salão -->
    <div class="policies-section">
      <h4><i class="fas fa-file-contract"></i> Políticas Operacionais do Salão</h4>

      <div class="form-group">
        <label for="cancellationPolicy">
          <i class="fas fa-ban"></i> Política de Cancelamento
        </label>
        <input
          type="text"
          id="cancellationPolicy"
          :value="modeloSalon.cancellationPolicy"
          @input="atualizarCampo('cancellationPolicy', ($event.target as HTMLInputElement).value)"
          placeholder="Ex: Cancelamento gratuito até 24h antes do serviço"
        />
        <small class="form-hint">Defina as regras para cancelamento de marcações</small>
      </div>

      <div class="form-group">
        <label for="lateArrivalPolicy"> <i class="fas fa-clock"></i> Política de Atrasos </label>
        <input
          type="text"
          id="lateArrivalPolicy"
          :value="modeloSalon.lateArrivalPolicy"
          @input="atualizarCampo('lateArrivalPolicy', ($event.target as HTMLInputElement).value)"
          placeholder="Ex: Tolerância de 15 minutos para atrasos"
        />
        <small class="form-hint">Estabeleça a tolerância para atrasos dos clientes</small>
      </div>

      <div class="form-group">
        <label for="childrenPolicy"> <i class="fas fa-child"></i> Política para Crianças </label>
        <textarea
          id="childrenPolicy"
          :value="modeloSalon.childrenPolicy"
          @input="atualizarCampo('childrenPolicy', ($event.target as HTMLTextAreaElement).value)"
          placeholder="Ex: Crianças acima de 12 anos podem ficar sem acompanhante adulto..."
          rows="3"
        />
        <small class="form-hint">Regras específicas para atendimento de crianças</small>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed, ref } from 'vue';
import type { SalonFormData } from '../../../../types/Salon-Types';

// Definir tipos para mensagens
interface MensagemPolitica {
  titulo: string;
  descricao: string;
  dica?: string;
  tipo: 'info' | 'warning' | 'success' | 'error';
}

interface PoliticaPagamento {
  id: string;
  descricao: string;
  mensagem: MensagemPolitica;
}

// Definir tipos estendidos para incluir paymentPolicies
interface ExtendedSalonFormData extends SalonFormData {
  paymentMethods: string[];
  mobileWallets: string[];
  cancellationPolicy: string;
  lateArrivalPolicy: string;
  childrenPolicy: string;
  paymentPolicies?: string[];
}

interface Props {
  salon: ExtendedSalonFormData;
}

interface Emits {
  (e: 'update:salon', value: ExtendedSalonFormData): void;
  (e: 'toggle-mobile-wallets'): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Refs para controlar mensagens
const mensagemAtiva = ref<MensagemPolitica | null>(null);
const mostrarMensagem = ref(false);

// Computed property para two-way binding adequado
const modeloSalon = computed({
  get: () => props.salon,
  set: (valor: ExtendedSalonFormData) => {
    emit('update:salon', valor);
  },
});

// Dicionário de políticas de pagamento
const politicasPagamento: Record<string, PoliticaPagamento> = {
  full_payment: {
    id: 'full_payment',
    descricao: 'Pagamento total antecipado na marcação',
    mensagem: {
      titulo: 'Pagamento Total Selecionado 💰',
      descricao: 'Os clientes pagarão 100% do valor no momento da reserva.',
      dica: 'Ideal para serviços até 500 MZN e para evitar faltas!',
      tipo: 'info',
    },
  },
  deposit_50: {
    id: 'deposit_50',
    descricao: '50% na marcação + 50% no dia do serviço',
    mensagem: {
      titulo: 'Entrada de 50% Selecionada ⚖️',
      descricao: 'Clientes pagam metade na reserva e o restante no dia do serviço.',
      dica: 'Perfeito para serviços entre 500-1500 MZN!',
      tipo: 'warning',
    },
  },
  pay_at_salon: {
    id: 'pay_at_salon',
    descricao: 'Pagamento realizado apenas no salão',
    mensagem: {
      titulo: 'Pagamento no Salão Selecionado 🏪',
      descricao: 'Clientes só pagam quando chegarem ao seu estabelecimento.',
      dica: 'Excelente para conquistar novos clientes!',
      tipo: 'success',
    },
  },
  both_options: {
    id: 'both_options',
    descricao: 'Oferece múltiplas opções de pagamento',
    mensagem: {
      titulo: 'Múltiplas Opções Selecionadas 🔄',
      descricao: 'Você oferecerá diferentes formas de pagamento para os clientes.',
      dica: 'Maximiza conversões atendendo todos os perfis!',
      tipo: 'info',
    },
  },
};

// Computed para obter políticas selecionadas com descrições
const politicasSelecionadas = computed(() => {
  if (!modeloSalon.value.paymentPolicies) return [];

  return modeloSalon.value.paymentPolicies
    .map((politicaId) => politicasPagamento[politicaId])
    .filter((politica): politica is PoliticaPagamento => politica !== undefined);
});

// Computed para recomendações baseadas nas seleções
const recomendacaoAtual = computed(() => {
  const politicas = modeloSalon.value.paymentPolicies || [];

  if (politicas.length === 0) {
    return 'Selecione pelo menos uma política de pagamento.';
  }

  if (politicas.includes('both_options')) {
    return 'Você oferecerá múltiplas opções - excelente para maximizar conversões!';
  }

  if (politicas.includes('full_payment') && politicas.includes('deposit_50')) {
    return 'Combinação perfeita: segurança do pagamento total + flexibilidade da entrada.';
  }

  if (politicas.includes('full_payment') && politicas.includes('pay_at_salon')) {
    return 'Estratégia inteligente: atrai novos clientes e garante receita.';
  }

  if (politicas.includes('deposit_50') && politicas.includes('pay_at_salon')) {
    return 'Bom equilíbrio entre compromisso do cliente e flexibilidade.';
  }

  if (politicas.length === 1) {
    const unicaPolitica = politicas[0];
    if (unicaPolitica === 'full_payment') {
      return 'Foco em segurança financeira - ideal se tem problemas com faltas.';
    } else if (unicaPolitica === 'deposit_50') {
      return 'Equilíbrio conservador - bom para maioria dos salões.';
    } else {
      return 'Foco em conversão - excelente para atrair novos clientes.';
    }
  }

  return 'Combinação personalizada - ajuste conforme sua necessidade.';
});

// Computed para tipo de mensagem (CSS class)
const tipoMensagem = computed(() => {
  if (!mensagemAtiva.value) return '';
  return `message-${mensagemAtiva.value.tipo || 'info'}`;
});

// Computed para ícone da mensagem
const iconeMensagem = computed(() => {
  if (!mensagemAtiva.value) return '';

  const icones: Record<string, string> = {
    info: 'fas fa-info-circle',
    warning: 'fas fa-exclamation-triangle',
    success: 'fas fa-check-circle',
    error: 'fas fa-exclamation-circle',
  };

  return icones[mensagemAtiva.value.tipo] || icones.info;
});

// Função para mostrar mensagem
const mostrarMensagemPolitica = (politicaId: string): void => {
  const politica = politicasPagamento[politicaId];
  if (politica && politica.mensagem) {
    mensagemAtiva.value = politica.mensagem;
    mostrarMensagem.value = true;

    // Auto-fechar após 8 segundos
    setTimeout(() => {
      if (mensagemAtiva.value === politica.mensagem) {
        fecharMensagem();
      }
    }, 8000);
  }
};

// Função para fechar mensagem
const fecharMensagem = (): void => {
  mensagemAtiva.value = null;
  mostrarMensagem.value = false;
};

// Função para lidar com mudanças nas políticas de pagamento
const manterMudancaPoliticaPagamento = (politica: string, evento: Event): void => {
  const alvo = evento.target as HTMLInputElement;
  const politicasAtuais = [...(modeloSalon.value.paymentPolicies || [])];

  if (alvo.checked) {
    // Adiciona política se não existir
    if (!politicasAtuais.includes(politica)) {
      politicasAtuais.push(politica);
      // Mostra mensagem informativa
      mostrarMensagemPolitica(politica);
    }
  } else {
    // Remove política
    const indice = politicasAtuais.indexOf(politica);
    if (indice > -1) {
      politicasAtuais.splice(indice, 1);
    }
  }

  modeloSalon.value = {
    ...modeloSalon.value,
    paymentPolicies: politicasAtuais,
  };
};

// Função para lidar com mudanças nos métodos de pagamento
const manterMudancaMetodoPagamento = (metodo: string, evento: Event): void => {
  const alvo = evento.target as HTMLInputElement;
  const metodosAtuais = [...modeloSalon.value.paymentMethods];

  if (alvo.checked) {
    // Adiciona método se não existir
    if (!metodosAtuais.includes(metodo)) {
      metodosAtuais.push(metodo);
    }
  } else {
    // Remove método
    const indice = metodosAtuais.indexOf(metodo);
    if (indice > -1) {
      metodosAtuais.splice(indice, 1);

      // Se remover mobile_wallet, limpa também as carteiras móveis
      if (metodo === 'mobile_wallet') {
        modeloSalon.value = {
          ...modeloSalon.value,
          paymentMethods: metodosAtuais,
          mobileWallets: [],
        };
        return;
      }
    }
  }

  modeloSalon.value = {
    ...modeloSalon.value,
    paymentMethods: metodosAtuais,
  };
};

// Função para lidar com mudanças nas carteiras móveis
const manterMudancaCarteiraMovel = (carteira: string, evento: Event): void => {
  const alvo = evento.target as HTMLInputElement;
  const carteirasAtuais = [...modeloSalon.value.mobileWallets];

  if (alvo.checked) {
    // Adiciona carteira se não existir
    if (!carteirasAtuais.includes(carteira)) {
      carteirasAtuais.push(carteira);
    }
  } else {
    // Remove carteira
    const indice = carteirasAtuais.indexOf(carteira);
    if (indice > -1) {
      carteirasAtuais.splice(indice, 1);
    }
  }

  modeloSalon.value = {
    ...modeloSalon.value,
    mobileWallets: carteirasAtuais,
  };
};

// Função para alternar carteiras móveis
const alternarCarteirasMoveis = (evento: Event): void => {
  const alvo = evento.target as HTMLInputElement;
  const metodosAtuais = [...modeloSalon.value.paymentMethods];

  if (alvo.checked) {
    // Adiciona mobile_wallet se não existir
    if (!metodosAtuais.includes('mobile_wallet')) {
      metodosAtuais.push('mobile_wallet');
    }
  } else {
    // Remove mobile_wallet e limpa carteiras móveis
    const indice = metodosAtuais.indexOf('mobile_wallet');
    if (indice > -1) {
      metodosAtuais.splice(indice, 1);
      modeloSalon.value = {
        ...modeloSalon.value,
        paymentMethods: metodosAtuais,
        mobileWallets: [],
      };
      return;
    }
  }

  modeloSalon.value = {
    ...modeloSalon.value,
    paymentMethods: metodosAtuais,
  };
};

// Função para atualizar campos de texto
const atualizarCampo = <K extends keyof ExtendedSalonFormData>(
  campo: K,
  valor: ExtendedSalonFormData[K],
): void => {
  modeloSalon.value = {
    ...modeloSalon.value,
    [campo]: valor,
  };
};
</script>

<style lang="scss" scoped>
.form-section {
  max-width: 800px;
  margin: 0 auto;
  padding: 24px;

  h3 {
    color: #333;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      color: #1976d2;
    }
  }

  .form-hint {
    color: #666;
    margin-bottom: 32px;
    font-size: 14px;
  }
}

.payment-policies-section,
.payment-methods-grid,
.policies-section {
  margin-bottom: 40px;
  padding: 24px;
  background: #f8f9fa;
  border-radius: 12px;
  border: 1px solid #e9ecef;

  h4 {
    color: #333;
    margin-bottom: 8px;
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      color: #1976d2;
    }
  }

  .section-description {
    color: #666;
    margin-bottom: 20px;
    font-size: 14px;
  }
}

.payment-policies-options {
  display: grid;
  gap: 16px;
  margin-bottom: 24px;
}

.policy-option {
  position: relative;

  input[type='checkbox'] {
    position: absolute;
    opacity: 0;

    &:checked + label {
      border-color: #1976d2;
      background: rgba(25, 118, 210, 0.05);

      .policy-icon {
        background: #1976d2;
        color: white;
      }
    }

    &:focus + label {
      outline: 2px solid #1976d2;
      outline-offset: 2px;
    }
  }

  label {
    display: flex;
    align-items: flex-start;
    gap: 16px;
    padding: 20px;
    border: 2px solid #e9ecef;
    border-radius: 8px;
    background: white;
    cursor: pointer;
    transition: all 0.3s ease;

    &:hover {
      border-color: #1976d2;
      transform: translateY(-2px);
      box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
    }
  }

  .policy-icon {
    width: 48px;
    height: 48px;
    border-radius: 8px;
    background: #f8f9fa;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 20px;
    color: #666;
    transition: all 0.3s ease;
    flex-shrink: 0;
  }

  .policy-content {
    flex: 1;

    h5 {
      margin: 0 0 8px 0;
      color: #333;
      font-size: 16px;
    }

    p {
      margin: 0 0 8px 0;
      color: #666;
      font-size: 14px;
      line-height: 1.4;
    }

    .policy-hint {
      color: #888;
      font-size: 12px;
      font-style: italic;
    }
  }
}

.payment-methods-grid {
  display: grid;
  gap: 32px;
}

.payment-category {
  h4 {
    margin-bottom: 16px;
  }
}

.payment-options {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: 12px;

  .payment-option {
    position: relative;

    input[type='checkbox'] {
      position: absolute;
      opacity: 0;

      &:checked + label {
        border-color: #1976d2;
        background: rgba(25, 118, 210, 0.05);
        color: #1976d2;

        i {
          color: #1976d2;
        }
      }

      &:focus + label {
        outline: 2px solid #1976d2;
        outline-offset: 2px;
      }
    }

    label {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 16px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      background: white;
      cursor: pointer;
      transition: all 0.3s ease;
      font-weight: 500;

      &:hover {
        border-color: #1976d2;
      }

      i {
        font-size: 18px;
        color: #666;
        transition: color 0.3s ease;
        width: 20px;
        text-align: center;
      }
    }
  }
}

.policies-section {
  .form-group {
    margin-bottom: 24px;

    label {
      display: block;
      margin-bottom: 8px;
      font-weight: 600;
      color: #333;
      display: flex;
      align-items: center;
      gap: 8px;

      i {
        color: #1976d2;
        width: 16px;
      }
    }

    input,
    textarea {
      width: 100%;
      padding: 12px 16px;
      border: 2px solid #e9ecef;
      border-radius: 8px;
      font-size: 14px;
      transition: border-color 0.3s ease;

      &:focus {
        outline: none;
        border-color: #1976d2;
      }

      &::placeholder {
        color: #999;
      }
    }

    textarea {
      resize: vertical;
      min-height: 80px;
    }

    .form-hint {
      display: block;
      margin-top: 6px;
      color: #666;
      font-size: 12px;
    }
  }
}

// Estilos para mensagens
.policy-message {
  margin-top: 16px;
  padding: 16px;
  border-radius: 8px;
  border-left: 4px solid;
  animation: slideIn 0.3s ease;

  &.message-info {
    background: #e3f2fd;
    border-left-color: #1976d2;
  }

  &.message-warning {
    background: #fff3e0;
    border-left-color: #ff9800;
  }

  &.message-success {
    background: #e8f5e8;
    border-left-color: #4caf50;
  }

  &.message-error {
    background: #ffebee;
    border-left-color: #f44336;
  }
}

.message-content {
  display: flex;
  align-items: flex-start;
  gap: 12px;

  i {
    font-size: 20px;
    margin-top: 2px;
    flex-shrink: 0;
  }

  .message-info & i {
    color: #1976d2;
  }

  .message-warning & i {
    color: #ff9800;
  }

  .message-success & i {
    color: #4caf50;
  }

  .message-error & i {
    color: #f44336;
  }
}

.message-text {
  flex: 1;

  h5 {
    margin: 0 0 4px 0;
    font-size: 14px;
    font-weight: 600;
  }

  p {
    margin: 0 0 6px 0;
    font-size: 13px;
    color: #666;
  }

  small {
    color: #888;
    font-size: 12px;
  }
}

.close-message {
  background: none;
  border: none;
  color: #999;
  cursor: pointer;
  padding: 4px;
  border-radius: 4px;
  transition: all 0.2s ease;
  flex-shrink: 0;

  &:hover {
    background: rgba(0, 0, 0, 0.1);
    color: #666;
  }
}

.selected-policies-info {
  margin-top: 24px;
  padding: 20px;
  background: white;
  border-radius: 8px;
  border: 1px solid #e9ecef;

  h5 {
    margin: 0 0 16px 0;
    color: #333;
    display: flex;
    align-items: center;
    gap: 8px;

    i {
      color: #1976d2;
    }
  }
}

.policies-summary {
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 16px;
}

.policy-summary-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  background: #f8f9fa;
  border-radius: 6px;
  font-size: 14px;

  i {
    color: #4caf50;
    font-size: 16px;
  }
}

.policy-recommendation {
  padding: 16px;
  background: rgba(25, 118, 210, 0.05);
  border-radius: 6px;
  border-left: 3px solid #1976d2;

  h6 {
    margin: 0 0 6px 0;
    color: #1976d2;
    font-size: 13px;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  p {
    margin: 0;
    font-size: 13px;
    color: #555;
    line-height: 1.4;
  }
}

// Animações
@keyframes slideIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

// Responsividade
@media (max-width: 768px) {
  .form-section {
    padding: 16px;
  }

  .payment-policies-section,
  .payment-methods-grid,
  .policies-section {
    padding: 16px;
  }

  .policy-option label {
    flex-direction: column;
    align-items: flex-start;
    text-align: left;
  }

  .payment-options {
    grid-template-columns: 1fr;
  }

  .message-content {
    flex-direction: column;
    gap: 8px;
  }

  .close-message {
    align-self: flex-end;
  }
}

@media (max-width: 480px) {
  .form-section {
    padding: 12px;
  }

  .payment-policies-section,
  .payment-methods-grid,
  .policies-section {
    padding: 12px;
  }

  .policy-option {
    label {
      padding: 16px;
    }

    .policy-icon {
      width: 40px;
      height: 40px;
      font-size: 18px;
    }
  }
}

// Dark mode support
@media (prefers-color-scheme: dark) {
  .form-section,
  .payment-policies-section,
  .payment-methods-grid,
  .policies-section {
    background: #1e1e1e;
    color: #e0e0e0;
  }

  h3,
  h4,
  h5 {
    color: #e0e0e0;
  }

  .form-hint,
  .section-description {
    color: #b0b0b0;
  }

  .policy-option,
  .payment-option {
    label {
      background: #2d2d2d;
      border-color: #404040;
      color: #e0e0e0;
    }

    .policy-content {
      h5 {
        color: #e0e0e0;
      }

      p {
        color: #b0b0b0;
      }
    }
  }

  .selected-policies-info {
    background: #2d2d2d;
    border-color: #404040;
  }

  .policy-summary-item {
    background: #363636;
  }
}
</style>
