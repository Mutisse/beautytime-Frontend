<template>
  <div class="form-section">
    <h3><i class="fas fa-address-book"></i> Contato</h3>

    <div class="contact-grid">
      <div class="form-group" :class="fieldClasses(errors.phone || '', modeloSalon.phone)">
        <label for="phone"><i class="fas fa-phone"></i> Telefone *</label>
        <input
          id="phone"
          type="tel"
          :value="modeloSalon.phone"
          @input="atualizarCampoTelefone('phone', $event)"
          @blur="emitirValidacao('phone', modeloSalon.phone, validateRequired)"
          placeholder="+258 84 123 4567"
        />
        <span class="error-message">{{ errors.phone }}</span>
      </div>

      <div class="form-group" :class="fieldClasses(errors.email || '', modeloSalon.email)">
        <label for="email"><i class="fas fa-envelope"></i> Email *</label>
        <input
          id="email"
          type="email"
          :value="modeloSalon.email"
          @input="atualizarCampo('email', ($event.target as HTMLInputElement).value)"
          @blur="emitirValidacao('email', modeloSalon.email, validateEmail)"
          placeholder="seu@email.com"
        />
        <span class="error-message">{{ errors.email }}</span>
      </div>

      <div class="form-group">
        <label><i class="fas fa-globe"></i> Website</label>
        <input 
          type="url" 
          :value="modeloSalon.website"
          @input="atualizarCampo('website', ($event.target as HTMLInputElement).value)"
          placeholder="https://www.exemplo.com" 
        />
      </div>

      <!-- Novo campo para WhatsApp -->
      <div class="form-group">
        <label><i class="fab fa-whatsapp"></i> WhatsApp</label>
        <div class="phone-input-container">
          <input
            type="tel"
            :value="modeloSalon.whatsapp"
            @input="atualizarCampoTelefone('whatsapp', $event)"
            placeholder="+258 84 123 4567"
          />
        </div>
        <small class="form-hint">Número para contato via WhatsApp</small>
      </div>

      <!-- Novo campo para Facebook -->
      <div class="form-group">
        <label><i class="fab fa-facebook"></i> Facebook</label>
        <div class="social-input-container">
          <span class="social-prefix">facebook.com/</span>
          <input
            type="text"
            :value="modeloSalon.facebook"
            @input="atualizarCampo('facebook', ($event.target as HTMLInputElement).value)"
            placeholder="nome.da.pagina"
          />
        </div>
        <small class="form-hint">Nome da página do Facebook (sem o URL completo)</small>
      </div>

      <!-- Novo campo para Instagram -->
      <div class="form-group">
        <label><i class="fab fa-instagram"></i> Instagram</label>
        <div class="social-input-container">
          <span class="social-prefix">@</span>
          <input
            type="text"
            :value="modeloSalon.instagram"
            @input="atualizarCampo('instagram', ($event.target as HTMLInputElement).value)"
            placeholder="nomedousuario"
          />
        </div>
        <small class="form-hint">Nome de usuário do Instagram (sem o @)</small>
      </div>
    </div>

    <!-- Preview dos links sociais -->
    <div v-if="hasSocialLinks" class="social-links-preview">
      <h4><i class="fas fa-eye"></i> Pré-visualização dos Links</h4>
      <div class="preview-links">
        <div v-if="modeloSalon.whatsapp" class="preview-item">
          <span class="preview-label">WhatsApp:</span>
          <a
            :href="`https://wa.me/${formatarNumeroWhatsapp(modeloSalon.whatsapp)}`"
            target="_blank"
            class="preview-link"
          >
            <i class="fab fa-whatsapp"></i> https://wa.me/{{ formatarNumeroWhatsapp(modeloSalon.whatsapp) }}
          </a>
        </div>
        <div v-if="modeloSalon.facebook" class="preview-item">
          <span class="preview-label">Facebook:</span>
          <a :href="`https://facebook.com/${modeloSalon.facebook}`" target="_blank" class="preview-link">
            <i class="fab fa-facebook"></i> https://facebook.com/{{ modeloSalon.facebook }}
          </a>
        </div>
        <div v-if="modeloSalon.instagram" class="preview-item">
          <span class="preview-label">Instagram:</span>
          <a
            :href="`https://instagram.com/${modeloSalon.instagram}`"
            target="_blank"
            class="preview-link"
          >
            <i class="fab fa-instagram"></i> https://instagram.com/{{ modeloSalon.instagram }}
          </a>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits, computed } from 'vue';
import type { SalonFormData } from '../../../../types/Salon-Types';

// Função para formatar número de telefone
const formatarTelefone = (valor: string): string => {
  if (!valor) return '+258 ';
  
  // Remove tudo que não é dígito
  const digitos = valor.replace(/\D/g, '');
  
  // Se começar com 258, mantém como código do país
  if (digitos.startsWith('258')) {
    const numero = digitos.substring(3);
    return formatarNumeroMocambique('258' + numero);
  }
  
  // Se não tiver código do país, adiciona +258 automaticamente
  if (!digitos.startsWith('258') && digitos.length > 0) {
    return formatarNumeroMocambique('258' + digitos);
  }
  
  return formatarNumeroMocambique(digitos);
};

// Função específica para formatação de números de Moçambique
const formatarNumeroMocambique = (digitos: string): string => {
  if (digitos.length === 0) return '+258 ';
  
  if (digitos.startsWith('258')) {
    const numero = digitos.substring(3);
    
    if (numero.length <= 2) {
      return `+258 ${numero}`;
    } else if (numero.length <= 5) {
      return `+258 ${numero.substring(0, 2)} ${numero.substring(2)}`;
    } else if (numero.length <= 8) {
      return `+258 ${numero.substring(0, 2)} ${numero.substring(2, 5)} ${numero.substring(5)}`;
    } else {
      return `+258 ${numero.substring(0, 2)} ${numero.substring(2, 5)} ${numero.substring(5, 8)}`;
    }
  }
  
  // Se não começar com 258, formata como número local
  if (digitos.length <= 2) {
    return `+258 ${digitos}`;
  } else if (digitos.length <= 5) {
    return `+258 ${digitos.substring(0, 2)} ${digitos.substring(2)}`;
  } else if (digitos.length <= 8) {
    return `+258 ${digitos.substring(0, 2)} ${digitos.substring(2, 5)} ${digitos.substring(5)}`;
  } else {
    return `+258 ${digitos.substring(0, 2)} ${digitos.substring(2, 5)} ${digitos.substring(5, 8)}`;
  }
};

// Função para formatar número para WhatsApp (apenas dígitos)
const formatarNumeroWhatsapp = (valor: string): string => {
  return valor.replace(/\D/g, '');
};

// Função para validar email
const validateEmail = (valor: unknown): string | true => {
  if (!valor) return 'Este campo é obrigatório';

  const valorString = typeof valor === 'string' ? valor : String();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  
  if (!emailRegex.test(valorString)) {
    return 'Por favor, insira um email válido';
  }
  return true;
};

// Função para validar campo obrigatório
const validateRequired = (valor: unknown): string | true => {
  if (valor === null || valor === undefined || valor === '') {
    return 'Este campo é obrigatório';
  }
  
  if (typeof valor === 'string' && valor.trim() === '') {
    return 'Este campo é obrigatório';
  }
  
  return true;
};

// Classes para campos com erro/sucesso
const fieldClasses = (
  erro: string,
  valor: unknown,
): { 'has-error': boolean; 'has-success': boolean } => ({
  'has-error': !!erro,
  'has-success': !!valor && !erro,
});

// Props e Emits
interface Props {
  salon: SalonFormData & {
    website: string;
    whatsapp: string;
    facebook: string;
    instagram: string;
  };
  errors: Record<string, string>;
}

interface Emits {
  (e: 'update:salon', value: SalonFormData): void;
  (e: 'validate-field', field: string, value: unknown, validator: (value: unknown) => string | true): void;
}

const props = defineProps<Props>();
const emit = defineEmits<Emits>();

// Computed property para two-way binding adequado
const modeloSalon = computed({
  get: () => props.salon,
  set: (valor: SalonFormData) => {
    emit('update:salon', valor);
  }
});

// Função para atualizar campos de telefone com formatação automática
const atualizarCampoTelefone = (campo: 'phone' | 'whatsapp', evento: Event) => {
  const input = evento.target as HTMLInputElement;
  const valor = input.value;
  
  // Formata o telefone automaticamente
  const valorFormatado = formatarTelefone(valor);
  
  // Atualiza o valor formatado no input
  input.value = valorFormatado;
  
  // Emite o valor sem formatação para o modelo (apenas dígitos)
  const digitos = valorFormatado.replace(/\D/g, '');
  modeloSalon.value = {
    ...modeloSalon.value,
    [campo]: digitos
  };
};

// Função para atualizar campos normais
const atualizarCampo = <K extends keyof SalonFormData>(campo: K, valor: SalonFormData[K]) => {
  modeloSalon.value = {
    ...modeloSalon.value,
    [campo]: valor
  };
};

// Função para emitir validação
const emitirValidacao = (campo: string, valor: unknown, validador: (value: unknown) => string | true) => {
  emit('validate-field', campo, valor, validador);
};

// Computed para verificar se há links sociais
const hasSocialLinks = computed(() => {
  return !!(modeloSalon.value.whatsapp || modeloSalon.value.facebook || modeloSalon.value.instagram);
});
</script>

<style scoped>
.contact-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

.form-group {
  margin-bottom: 20px;
  position: relative;
}

.form-group label {
  display: block;
  margin-bottom: 8px;
  font-weight: 500;
  color: #424242;
  display: flex;
  align-items: center;
  gap: 8px;
}

.form-group input,
.form-group select,
.form-group textarea {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid #e0e0e0;
  border-radius: 8px;
  font-size: 14px;
  transition: all 0.3s ease;
  background-color: white;
}

.form-group input:focus,
.form-group select:focus,
.form-group textarea:focus {
  outline: none;
  border-color: #1976d2;
  box-shadow: 0 0 0 3px rgba(25, 118, 210, 0.1);
}

.form-group.has-error input,
.form-group.has-error select,
.form-group.has-error textarea {
  border-color: #f44336;
  box-shadow: 0 0 0 3px rgba(244, 67, 54, 0.1);
}

.form-group.has-success input,
.form-group.has-success select,
.form-group.has-success textarea {
  border-color: #4caf50;
  box-shadow: 0 0 0 3px rgba(76, 175, 80, 0.1);
}

.social-input-container,
.phone-input-container {
  display: flex;
  align-items: center;
}

.social-prefix {
  background-color: #f5f5f5;
  padding: 12px 12px;
  border: 2px solid #e0e0e0;
  border-right: none;
  border-radius: 8px 0 0 8px;
  color: #757575;
  font-size: 14px;
}

.social-input-container input,
.phone-input-container input {
  border-radius: 0 8px 8px 0;
}

.error-message {
  color: #f44336;
  font-size: 12px;
  margin-top: 6px;
  display: block;
}

.form-hint {
  color: #757575;
  font-size: 12px;
  margin-top: 6px;
  display: block;
}

.social-links-preview {
  margin-top: 24px;
  padding: 16px;
  background-color: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
}

.social-links-preview h4 {
  margin-bottom: 12px;
  color: #1976d2;
  display: flex;
  align-items: center;
  gap: 8px;
}

.preview-links {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.preview-item {
  display: flex;
  align-items: center;
  gap: 12px;
}

.preview-label {
  font-weight: 500;
  color: #424242;
  min-width: 80px;
}

.preview-link {
  color: #1976d2;
  text-decoration: none;
  font-size: 14px;
  display: flex;
  align-items: center;
  gap: 6px;
}

.preview-link:hover {
  text-decoration: underline;
}

/* Responsive */
@media (max-width: 768px) {
  .contact-grid {
    grid-template-columns: 1fr;
  }
  
  .preview-item {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }
  
  .preview-label {
    min-width: auto;
  }
}
</style>