<template>
  <q-layout view="lHh Lpr lFf" class="bg-grey-1">
    <!-- Cabeçalho simplificado sem controle de menu lateral -->
    <q-header elevated class="bg-white text-primary shadow-1">
      <q-toolbar class="q-py-sm">
        <q-toolbar-title class="row items-center no-wrap">
          <q-icon name="spa" size="28px" color="primary" class="q-mr-sm" />
          <span class="text-weight-bold">BeautyTime</span>
        </q-toolbar-title>

        <!-- Navegação principal - Visível em desktop -->
        <div class="row items-center q-gutter-xl q-mr-lg desktop-navigation">
          <q-btn flat label="Home" color="primary" to="/" class="text-weight-medium nav-btn" icon="home"/>
          <q-btn
            flat
            label="Sobre"
            color="primary"
            icon="info"
            to="/about"
            class="text-weight-medium nav-btn"
          />
          <q-btn
            flat
            label="Serviços"
            color="primary"
            icon="style"
            to="/beauty-services"
            class="text-weight-medium nav-btn"
          />
        </div>

        <q-space />

        <!-- Menu mobile -->
        <q-btn flat round dense icon="menu" class="mobile-menu-btn" @click="toggleMobileMenu" />

        <!-- Controles de autenticação -->
        <div class="row items-center q-gutter-sm desktop-auth">
          <template v-if="user">
            <q-btn flat label="Agendar" color="primary" to="/appointments" class="q-px-md" />
            <q-btn round dense flat>
              <q-avatar size="36px">
                <q-icon name="account_circle" size="24px" v-if="!userInitials" />
                <span v-else class="text-caption">{{ userInitials }}</span>
              </q-avatar>
              <q-menu>
                <q-list style="min-width: 150px">
                  <q-item clickable v-close-popup>
                    <q-item-section>Perfil</q-item-section>
                  </q-item>
                  <q-item clickable v-close-popup @click="authStore.logout">
                    <q-item-section>Sair</q-item-section>
                  </q-item>
                </q-list>
              </q-menu>
            </q-btn>
          </template>
        </div>
      </q-toolbar>

      <!-- Menu mobile expandido -->
      <div v-if="mobileMenuOpen" class="mobile-menu bg-white">
        <div class="column q-pa-md">
          <q-btn
            flat
            label="Home"
            color="primary"
            to="/"
            class="q-mb-sm mobile-nav-btn"
            @click="mobileMenuOpen = false"
          />
          <q-btn
            flat
            label="Sobre"
            color="primary"
            to="/about"
            class="q-mb-sm mobile-nav-btn"
            @click="mobileMenuOpen = false"
          />
          <q-btn
            flat
            label="Serviços"
            color="primary"
            to="/services"
            class="q-mb-sm mobile-nav-btn"
            @click="mobileMenuOpen = false"
          />
          <template v-if="user">
            <q-separator class="q-my-sm" />
            <q-btn
              flat
              label="Agendar"
              color="primary"
              to="/appointments"
              class="q-mb-sm"
              @click="mobileMenuOpen = false"
            />
          </template>
          <template v-else>
            <q-separator class="q-my-sm" />
            <q-btn
              unelevated
              label="Fazer Login"
              color="primary"
              to="/auth"
              class="q-mb-sm"
              @click="mobileMenuOpen = false"
            />
          </template>
        </div>
      </div>
    </q-header>

    <!-- Conteúdo da página -->
    <q-page-container>
      <router-view v-slot="{ Component }">
        <transition name="fade" mode="out-in">
          <component :is="Component" />
        </transition>
      </router-view>
    </q-page-container>

    <!-- Botão de Login Flutuante com Texto -->
    <q-page-sticky
      v-if="!user"
      position="bottom-right"
      :offset="[18, 18]"
      class="floating-login-container"
    >
      <div class="row items-center q-gutter-sm">
        <!-- Texto visível -->
        <q-card v-if="showFloatingText" class="floating-text-card bg-primary text-white shadow-4">
          <q-card-section class="text-card-section">
            <div class="text-content text-weight-medium">Faça login para agendar</div>
          </q-card-section>
          <q-tooltip anchor="top middle" self="bottom middle" class="bg-dark text-white">
            Clique para acessar sua conta
          </q-tooltip>
        </q-card>

        <!-- Botão flutuante -->
        <q-btn
          fab
          icon="login"
          color="primary"
          to="/auth"
          class="shadow-4 floating-login-btn"
          size="lg"
          @mouseenter="showFloatingText = true"
          @mouseleave="showFloatingText = false"
        >
          <q-tooltip
            anchor="center left"
            self="center right"
            :offset="[10, 10]"
            class="bg-primary text-white mobile-tooltip"
          >
          </q-tooltip>
        </q-btn>
      </div>
    </q-page-sticky>

    <!-- Footer movido para o layout para aparecer em todas as páginas -->
    <footer class="footer bg-dark text-white">
      <div class="container">
        <div class="row q-col-gutter-lg">
          <!-- Coluna Sobre -->
          <div class="col-12 col-md-4">
            <div class="row items-center q-mb-md">
              <q-icon name="spa" size="md" color="primary" class="q-mr-sm" />
              <h3 class="text-h6 text-weight-bold q-ma-none">BeautyTime Moçambique</h3>
            </div>
            <p class="text-caption text-grey-4">
              A primeira plataforma digital de agendamento de serviços de beleza e estética em
              Moçambique. Conectamos você aos melhores profissionais do país.
            </p>
            <div class="row q-gutter-sm q-mt-md">
              <!-- Facebook -->
              <q-btn
                round
                dense
                flat
                color="grey-4"
                icon="thumb_up"
                size="sm"
                href="https://facebook.com/beautytimemz"
                target="_blank"
              >
                <q-tooltip class="bg-blue text-white"> Siga-nos no Facebook </q-tooltip>
              </q-btn>

              <!-- Instagram -->
              <q-btn
                round
                dense
                flat
                color="grey-4"
                icon="photo_camera"
                size="sm"
                href="https://instagram.com/beautytimemz"
                target="_blank"
              >
                <q-tooltip class="bg-pink text-white"> Siga-nos no Instagram </q-tooltip>
              </q-btn>

              <!-- WhatsApp -->
              <q-btn
                round
                dense
                flat
                color="grey-4"
                icon="chat"
                size="sm"
                href="https://wa.me/258851234567"
                target="_blank"
              >
                <q-tooltip class="bg-green text-white"> Fale connosco no WhatsApp </q-tooltip>
              </q-btn>

              <!-- Twitter -->
              <q-btn
                round
                dense
                flat
                color="grey-4"
                icon="rss_feed"
                size="sm"
                href="https://twitter.com/beautytimemz"
                target="_blank"
              >
                <q-tooltip class="bg-blue-3 text-white"> Siga-nos no Twitter </q-tooltip>
              </q-btn>

              <!-- YouTube -->
              <q-btn
                round
                dense
                flat
                color="grey-4"
                icon="play_arrow"
                size="sm"
                href="https://youtube.com/beautytimemz"
                target="_blank"
              >
                <q-tooltip class="bg-red text-white"> Inscreva-se no YouTube </q-tooltip>
              </q-btn>

              <!-- TikTok -->
              <q-btn
                round
                dense
                flat
                color="grey-4"
                icon="music_note"
                size="sm"
                href="https://tiktok.com/@beautytimemz"
                target="_blank"
              >
                <q-tooltip class="bg-dark text-white"> Siga-nos no TikTok </q-tooltip>
              </q-btn>

              <!-- LinkedIn -->
              <q-btn
                round
                dense
                flat
                color="grey-4"
                icon="work"
                size="sm"
                href="https://linkedin.com/company/beautytimemz"
                target="_blank"
              >
                <q-tooltip class="bg-blue-9 text-white"> Conecte-se no LinkedIn </q-tooltip>
              </q-btn>

              <!-- Pinterest -->
              <q-btn
                round
                dense
                flat
                color="grey-4"
                icon="push_pin"
                size="sm"
                href="https://pinterest.com/beautytimemz"
                target="_blank"
              >
                <q-tooltip class="bg-red-9 text-white"> Siga-nos no Pinterest </q-tooltip>
              </q-btn>
            </div>
          </div>

          <!-- Coluna Cidades -->
          <div class="col-6 col-md-2">
            <h4 class="text-caption text-weight-bold q-mb-md">Nossas Cidades</h4>
            <div class="column q-gutter-y-xs">
              <span class="text-caption text-grey-4">Maputo</span>
              <span class="text-caption text-grey-4">Matola</span>
              <span class="text-caption text-grey-4">Beira</span>
              <span class="text-caption text-grey-4">Nampula</span>
              <span class="text-caption text-grey-4">Chimoio</span>
            </div>
          </div>

          <!-- Coluna Serviços -->
          <div class="col-6 col-md-3">
            <h4 class="text-caption text-weight-bold q-mb-md">Serviços Populares</h4>
            <div class="column q-gutter-y-xs">
              <span class="text-caption text-grey-4">Penteado Afro</span>
              <span class="text-caption text-grey-4">Tranças Moçambicanas</span>
              <span class="text-caption text-grey-4">Manicure & Pedicure</span>
              <span class="text-caption text-grey-4">Maquilhagem Tradicional</span>
              <span class="text-caption text-grey-4">Cuidados com Pele</span>
            </div>
          </div>

          <!-- Coluna Contato Moçambique -->
          <div class="col-12 col-md-3">
            <h4 class="text-caption text-weight-bold q-mb-md">Contacte-nos</h4>
            <div class="column q-gutter-y-sm">
              <div class="row items-center">
                <q-icon name="email" size="xs" class="q-mr-sm text-grey-4" />
                <span class="text-caption text-grey-4">info@beautytime.co.mz</span>
              </div>
              <div class="row items-center">
                <q-icon name="phone" size="xs" class="q-mr-sm text-grey-4" />
                <span class="text-caption text-grey-4">+258 84 123 4567</span>
              </div>
              <div class="row items-center">
                <q-icon name="phone" size="xs" class="q-mr-sm text-grey-4" />
                <span class="text-caption text-grey-4">+258 85 765 4321</span>
              </div>
              <div class="row items-start">
                <q-icon name="location_on" size="xs" class="q-mr-sm text-grey-4 q-mt-xs" />
                <span class="text-caption text-grey-4"
                  >Av. 25 de Setembro<br />Maputo, Moçambique</span
                >
              </div>
            </div>
          </div>
        </div>

        <!-- Divisor -->
        <q-separator color="grey-8" class="q-my-lg" />

        <!-- Rodapé inferior -->
        <div class="row items-center justify-between footer-bottom">
          <div class="col-12 col-md-auto q-mb-md q-mb-md-none">
            <span class="text-caption text-grey-5">
              © 2024 BeautyTime Moçambique. Todos os direitos reservados.
            </span>
          </div>
          <div class="col-12 col-md-auto">
            <span class="text-caption text-grey-5">
              Desenvolvido por
              <a
                href="https://mutisse.github.io/portifolio/"
                target="_blank"
                rel="noopener noreferrer"
                class="developer-link"
              >
                Mutisse
              </a>
              - Orgulhosamente Moçambicano
            </span>
          </div>
        </div>
      </div>
    </footer>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '../stores/auth-store';

const authStore = useAuthStore();
const mobileMenuOpen = ref(false);
const showFloatingText = ref(false);
const isMobile = ref(false);

const user = computed(() => authStore.user);
const userInitials = computed(() => {
  if (!user.value) return '';
  return `${user.value.fullName.firstName.charAt(0)}${user.value.fullName.lastName.charAt(0)}`;
});

const toggleMobileMenu = () => {
  mobileMenuOpen.value = !mobileMenuOpen.value;
};

const checkScreenSize = () => {
  isMobile.value = window.innerWidth < 768;
};

onMounted(() => {
  checkScreenSize();
  window.addEventListener('resize', checkScreenSize);
});

onUnmounted(() => {
  window.removeEventListener('resize', checkScreenSize);
});
</script>

<style lang="scss" scoped>
.footer {
  padding: 60px 0 30px;
  background: #1a1a1a;

  .container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 0 16px;
  }
}

.q-header {
  border-bottom: 1px solid rgba(0, 0, 0, 0.08);
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

// Estilos para o botão flutuante com texto - CORRIGIDOS
.floating-login-container {
  z-index: 6000;

  .floating-text-card {
    border-radius: 20px;
    animation: fadeIn 0.3s ease;
    min-width: max-content; // Garante que o cartão tenha largura suficiente
    white-space: nowrap; // Impede quebra de linha

    .text-card-section {
      padding: 10px 16px; // Padding maior para melhor visualização
      min-height: auto; // Remove altura mínima fixa
    }

    .text-content {
      font-size: 0.875rem; // Tamanho de fonte consistente
      line-height: 1.2; // Altura de linha adequada
      letter-spacing: 0.2px; // Pequeno espaçamento para melhor legibilidade
    }
  }

  .floating-login-btn {
    transition: all 0.3s ease;

    &:hover {
      transform: scale(1.1);
    }
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateX(10px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

// Estilos para a navegação
.q-btn--flat {
  &:hover {
    background-color: rgba(0, 0, 0, 0.04);
  }

  &.router-link-active {
    color: var(--q-primary);
    background-color: rgba(0, 0, 0, 0.08);
  }
}

.developer-link {
  color: var(--q-primary);
  text-decoration: none;

  &:hover {
    text-decoration: underline;
  }
}

// Responsividade
.mobile-menu-btn {
  display: none;
}

.mobile-menu {
  display: none;
  border-top: 1px solid rgba(0, 0, 0, 0.1);
}

// Desktop primeiro
@media (min-width: 1024px) {
  .desktop-navigation {
    display: flex !important;
  }

  .desktop-auth {
    display: flex !important;
  }
}

// Tablet
@media (max-width: 1023px) and (min-width: 768px) {
  .desktop-navigation {
    display: flex !important;
  }

  .q-gutter-xl {
    gap: 16px;
  }

  .floating-text-card {
    display: none; // Esconde texto em tablet para economizar espaço
  }
}

// Mobile
@media (max-width: 767px) {
  .desktop-navigation {
    display: none !important;
  }

  .desktop-auth {
    display: none !important;
  }

  .mobile-menu-btn {
    display: block;
  }

  .mobile-menu {
    display: block;
  }

  .floating-login-container {
    bottom: 80px !important; // Ajusta posição para não sobrepor footer mobile

    .floating-text-card {
      display: none; // Esconde texto em mobile
    }

    .floating-login-btn {
      width: 56px !important;
      height: 56px !important;
    }
  }

  .footer {
    padding: 40px 0 20px;

    .container {
      padding: 0 12px;
    }
  }

  .footer-bottom {
    text-align: center;

    .col-12 {
      margin-bottom: 16px;
    }
  }

  .mobile-tooltip {
    display: none; // Esconde tooltip em mobile
  }
}

// Mobile pequeno
@media (max-width: 480px) {
  .q-toolbar__title {
    font-size: 1.1rem;
  }

  .footer {
    padding: 30px 0 15px;

    .row.q-col-gutter-lg {
      margin: -8px;

      > [class*='col-'] {
        padding: 8px;
      }
    }
  }

  .floating-login-container {
    .floating-login-btn {
      width: 48px !important;
      height: 48px !important;
    }
  }
}

// Ajustes para telas muito grandes
@media (min-width: 1440px) {
  .container {
    max-width: 1400px;
  }
}

// Garantir que o texto não seja cortado em nenhum dispositivo
.floating-text-card {
  // Forçar display block para melhor controle
  display: block !important;

  // Garantir que o conteúdo tenha espaço suficiente
  .q-card__section {
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 10px 16px !important;
  }

  // Texto sempre visível completo
  .text-content {
    display: block;
    overflow: visible !important;
    text-overflow: unset !important;
    white-space: nowrap !important;
  }
}

// Melhorar a aparência dos botões de redes sociais
.q-btn--round {
  transition: all 0.3s ease;

  &:hover {
    transform: scale(1.1);
    background-color: rgba(255, 255, 255, 0.1) !important;
  }
}

// Tooltips personalizados para redes sociais
.q-tooltip {
  font-size: 0.75rem;
  padding: 6px 10px;
  border-radius: 6px;
}
</style>
