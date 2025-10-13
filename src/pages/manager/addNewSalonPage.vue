<template>
  <div class="admin-layout">
    <!-- Top Navigation Menu -->
    <header class="top-nav">
      <div class="nav-container">
        <!-- Logo e Botão Voltar -->
        <div class="nav-brand">
          <div class="brand-section">
            <q-btn
              v-if="showBackButton"
              @click="goBack"
              icon="keyboard_arrow_left"
              flat
              dense
              class="back-button"
              size="sm"
            />
            <div class="logo">
              <q-icon name="fas fa-gem" />
              <span>BeautyManager</span>
            </div>
          </div>
        </div>

        <!-- Main Navigation -->
        <nav class="main-nav">
          <ul class="nav-menu">
            <li class="nav-item" :class="{ active: currentMenu === 'mysalons' }">
              <a href="#" @click.prevent="setCurrentMenu('mysalons')" class="nav-link">
                <q-icon name="fas fa-store" />
                <span>Meus Salões</span>
              </a>
            </li>
            <li class="nav-item" :class="{ active: currentMenu === 'salon' }">
              <a href="#" @click.prevent="setCurrentMenu('salon')" class="nav-link">
                <q-icon name="fas fa-plus-circle" />
                <span>Adicionar Salão</span>
              </a>
            </li>
            
           
            <li class="nav-item" :class="{ active: currentMenu === 'reports' }">
              <a href="#" @click.prevent="setCurrentMenu('reports')" class="nav-link">
                <q-icon name="fas fa-chart-bar" />
                <span>Relatórios</span>
              </a>
            </li>
            <li class="nav-item" :class="{ active: currentMenu === 'settings' }">
              <a href="#" @click.prevent="setCurrentMenu('settings')" class="nav-link">
                <q-icon name="fas fa-cog" />
                <span>Configurações</span>
              </a>
            </li>
          </ul>
        </nav>

        <!-- User Actions -->
        <div class="nav-actions">
          <!-- Quick Stats -->
          <div class="quick-stats">
            <div class="stat-item">
              <q-icon name="fas fa-store" class="stat-icon" />
              <div class="stat-info">
                <span class="stat-value">12</span>
                <span class="stat-label">Salões</span>
              </div>
            </div>
            <div class="stat-item">
              <q-icon name="fas fa-calendar-check" class="stat-icon" />
              <div class="stat-info">
                <span class="stat-value">156</span>
                <span class="stat-label">Agendamentos</span>
              </div>
            </div>
          </div>

          <!-- Action Buttons -->
          <div class="action-buttons">
            <q-btn class="btn-notification" flat dense round icon="fas fa-bell">
              <q-badge color="red" floating rounded>3</q-badge>
              <q-menu anchor="bottom middle" self="top middle">
                <q-card style="width: 320px">
                  <q-card-section class="notification-header">
                    <div class="text-h6">Notificações</div>
                    <q-btn flat dense icon="fas fa-cog" size="sm" />
                  </q-card-section>
                  <q-list separator>
                    <q-item clickable v-ripple>
                      <q-item-section avatar>
                        <q-avatar color="blue" text-color="white" icon="fas fa-calendar" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Novo agendamento</q-item-label>
                        <q-item-label caption>Cliente Maria agendou para amanhã</q-item-label>
                      </q-item-section>
                    </q-item>
                    <q-item clickable v-ripple>
                      <q-item-section avatar>
                        <q-avatar color="green" text-color="white" icon="fas fa-dollar-sign" />
                      </q-item-section>
                      <q-item-section>
                        <q-item-label>Pagamento recebido</q-item-label>
                        <q-item-label caption>Salão Central - R$ 150,00</q-item-label>
                      </q-item-section>
                    </q-item>
                  </q-list>
                </q-card>
              </q-menu>
            </q-btn>

            <q-btn class="btn-help" flat dense round icon="fas fa-question-circle" />

            <!-- User Profile -->
            <div class="user-profile">
              <q-btn class="btn-profile" flat dense round>
                <q-avatar size="32px" class="user-avatar">
                  <img
                    src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=face"
                    alt="Admin"
                  />
                </q-avatar>
                <span class="user-name">Carlos Silva</span>
                <q-icon name="fas fa-chevron-down" size="12px" />

                <q-menu anchor="bottom middle" self="top middle">
                  <q-card style="width: 200px">
                    <q-card-section class="text-center">
                      <q-avatar size="60px" class="q-mb-sm">
                        <img
                          src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=60&h=60&fit=crop&crop=face"
                        />
                      </q-avatar>
                      <div class="text-h6">Carlos Silva</div>
                      <div class="text-caption text-grey">Administrador</div>
                    </q-card-section>
                    <q-separator />
                    <q-list>
                      <q-item clickable v-close-popup>
                        <q-item-section avatar>
                          <q-icon name="fas fa-user" />
                        </q-item-section>
                        <q-item-section>Meu Perfil</q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section avatar>
                          <q-icon name="fas fa-cog" />
                        </q-item-section>
                        <q-item-section>Configurações</q-item-section>
                      </q-item>
                      <q-separator />
                      <q-item clickable v-close-popup>
                        <q-item-section avatar>
                          <q-icon name="fas fa-sign-out-alt" />
                        </q-item-section>
                        <q-item-section>Sair</q-item-section>
                      </q-item>
                    </q-list>
                  </q-card>
                </q-menu>
              </q-btn>
            </div>
          </div>
        </div>

        <!-- Mobile Menu Trigger -->
        <q-btn
          v-if="$q.screen.lt.md"
          flat
          dense
          round
          icon="fas fa-bars"
          class="mobile-menu-trigger"
          @click="toggleMobileMenu"
        />
      </div>

      <!-- Mobile Menu -->
      <div class="mobile-menu" :class="{ active: mobileMenuActive }">
        <div class="mobile-menu-header">
          <q-btn
            v-if="showBackButton"
            @click="goBack"
            icon="fas fa-arrow-left"
            flat
            dense
            class="mobile-back-button"
          />
          <span class="mobile-menu-title">Navegação</span>
          <q-btn
            flat
            dense
            round
            icon="fas fa-times"
            class="mobile-close-button"
            @click="toggleMobileMenu"
          />
        </div>
        <ul class="mobile-nav-menu">
          <li class="mobile-nav-item" :class="{ active: currentMenu === 'mysalons' }">
            <a href="#" @click.prevent="setCurrentMenu('mysalons')" class="mobile-nav-link">
              <q-icon name="fas fa-store" />
              <span>Meus Salões</span>
            </a>
          </li>
          <li class="mobile-nav-item" :class="{ active: currentMenu === 'salon' }">
            <a href="#" @click.prevent="setCurrentMenu('salon')" class="mobile-nav-link">
              <q-icon name="fas fa-plus-circle" />
              <span>Adicionar Salão</span>
            </a>
          </li>
          <li class="mobile-nav-item" :class="{ active: currentMenu === 'reports' }">
            <a href="#" @click.prevent="setCurrentMenu('reports')" class="mobile-nav-link">
              <q-icon name="fas fa-chart-bar" />
              <span>Relatórios</span>
            </a>
          </li>
          <li class="mobile-nav-item" :class="{ active: currentMenu === 'settings' }">
            <a href="#" @click.prevent="setCurrentMenu('settings')" class="mobile-nav-link">
              <q-icon name="fas fa-cog" />
              <span>Configurações</span>
            </a>
          </li>
        </ul>
      </div>
    </header>

    <!-- Main Content -->
    <div class="main-content">
      <div class="content-header">
        <div class="header-left">
          <div class="breadcrumb">
            <span>Dashboard</span>
            <q-icon name="fas fa-chevron-right" size="12px" />
            <span class="current-page">{{ getCurrentPageTitle }}</span>
          </div>
          <h1>{{ getMainTitle }}</h1>
          <p class="page-description">
            {{ getPageDescription }}
          </p>
        </div>

        <div class="header-info">
          <div class="welcome-time">
            <span class="welcome-text">Olá, Carlos!</span>
            <span class="time">{{ currentTime }}</span>
          </div>
        </div>
      </div>

      <div class="content-area">
        <!-- Componente: Meus Salões -->
        <transition name="fade-slide" mode="out-in">
          <MySalons v-if="currentMenu === 'mysalons'" key="mysalons" />
        </transition>

        <!-- Componente: Adicionar Salão -->
        <transition name="fade-slide" mode="out-in">
          <SalonCreate v-if="currentMenu === 'salon'" key="salon" />
        </transition>

        <!-- Componente: Serviços -->
        <transition name="fade-slide" mode="out-in">
          <ServicesManagement
            v-if="currentMenu === 'services'"
            :showAddServiceModal="showAddServiceModal"
            @update:showAddServiceModal="showAddServiceModal = $event"
            key="services"
          />
        </transition>

        <!-- Componente: Relatórios -->
        <transition name="fade-slide" mode="out-in">
          <ReportsDashboard v-if="currentMenu === 'reports'" key="reports" />
        </transition>

        <!-- Componente: Configurações -->
        <transition name="fade-slide" mode="out-in">
          <SettingsPanel v-if="currentMenu === 'settings'" key="settings" />
        </transition>
      </div>
    </div>

    <!-- Mobile overlay -->
    <div
      class="mobile-overlay"
      :class="{ active: mobileMenuActive }"
      @click="toggleMobileMenu"
    ></div>
  </div>
</template>
<script lang="ts">
import { ref, computed, onMounted, onUnmounted, defineComponent } from 'vue';

import MySalons from '../../components/manager/salons/MySalons.vue';
import SalonCreate from '../../components/Forms/salons/SalonCreateForm.vue';
import ServicesManagement from '../../components/manager/salons/ServicesManagement.vue';
import ReportsDashboard from '../../components/manager/salons/ReportsDashboard.vue';
import SettingsPanel from '../../components/manager/salons/SettingsPanel.vue';

type MenuType = 'mysalons' | 'salon' | 'services' | 'reports' | 'settings' | '';

export default defineComponent({
  name: 'AdminDashboard',
  components: {
    MySalons,
    SalonCreate,
    ServicesManagement,
    ReportsDashboard,
    SettingsPanel,
  },
  setup() {
    // State variables
    const currentMenu = ref<MenuType>('mysalons');
    const showAddServiceModal = ref<boolean>(false);
    const currentTime = ref<string>('');
    const mobileMenuActive = ref<boolean>(false);
    const menuHistory = ref<MenuType[]>(['mysalons']);
    const routeHistory = ref<string[]>([]);

    // Computed properties
    const showBackButton = computed(() => {
      return (
        routeHistory.value.length > 1 ||
        menuHistory.value.length > 1 ||
        currentMenu.value !== 'mysalons'
      );
    });

    const getCurrentPageTitle = computed(() => {
      const titles: Record<MenuType, string> = {
        mysalons: 'Meus Salões',
        salon: 'Novo Salão',
        services: 'Serviços',
        reports: 'Relatórios',
        settings: 'Configurações',
        '': 'Dashboard',
      };
      return titles[currentMenu.value] || 'Dashboard';
    });

    const getMainTitle = computed(() => {
      const titles: Record<MenuType, string> = {
        mysalons: 'Meus Salões',
        salon: 'Adicionar Novo Salão',
        services: 'Gerenciar Serviços',
        reports: 'Relatórios e Analytics',
        settings: 'Configurações do Sistema',
        '': 'Dashboard',
      };
      return titles[currentMenu.value] || 'Dashboard';
    });

    const getPageDescription = computed(() => {
      const descriptions: Record<MenuType, string> = {
        mysalons: 'Gerencie todos os seus estabelecimentos e visualize métricas',
        salon: 'Cadastre um novo salão na plataforma',
        services: 'Adicione e gerencie serviços dos salões',
        reports: 'Acompanhe métricas e desempenho dos seus salões',
        settings: 'Configure as preferências do sistema',
        '': 'Painel administrativo',
      };
      return descriptions[currentMenu.value] || 'Painel administrativo';
    });

    // Methods
    const updateTime = (): void => {
      const now = new Date();
      currentTime.value = now.toLocaleTimeString('pt-BR', {
        hour: '2-digit',
        minute: '2-digit',
      });
    };

    const setCurrentMenu = (menu: MenuType): void => {
      if (currentMenu.value !== menu) {
        menuHistory.value.push(menu);
        routeHistory.value.push(menu);
      }
      currentMenu.value = menu;

      if (mobileMenuActive.value) {
        mobileMenuActive.value = false;
      }
    };

    const goBack = (): void => {
      if (routeHistory.value.length > 1) {
        routeHistory.value.pop();
        const previousRoute = routeHistory.value[routeHistory.value.length - 1];

        if (previousRoute === 'dashboard') {
          currentMenu.value = '';
          menuHistory.value = [''];
        } else {
          // Garantir que o tipo seja válido
          const validMenuTypes: MenuType[] = [
            'mysalons',
            'salon',
            'services',
            'reports',
            'settings',
            '',
          ];
          currentMenu.value = validMenuTypes.includes(previousRoute as MenuType)
            ? (previousRoute as MenuType)
            : 'mysalons';
          menuHistory.value = [currentMenu.value];
        }
      } else if (menuHistory.value.length > 1) {
        menuHistory.value.pop();
        const previousMenu = menuHistory.value[menuHistory.value.length - 1];
        // Garantir que não seja undefined
        currentMenu.value = previousMenu || 'mysalons';
      } else {
        currentMenu.value = '';
        menuHistory.value = [''];
        routeHistory.value = ['dashboard'];
      }

      if (mobileMenuActive.value) {
        mobileMenuActive.value = false;
      }
    };

    const toggleMobileMenu = (): void => {
      mobileMenuActive.value = !mobileMenuActive.value;
    };

    // Lifecycle
    let timeInterval: NodeJS.Timeout;

    onMounted(() => {
      updateTime();
      timeInterval = setInterval(updateTime, 60000);

      if (routeHistory.value.length === 0) {
        routeHistory.value.push('dashboard');
      }
    });

    onUnmounted(() => {
      if (timeInterval) {
        clearInterval(timeInterval);
      }
    });

    return {
      currentMenu,
      showAddServiceModal,
      currentTime,
      mobileMenuActive,
      menuHistory,
      routeHistory,
      showBackButton,
      getCurrentPageTitle,
      getMainTitle,
      getPageDescription,
      setCurrentMenu,
      goBack,
      toggleMobileMenu,
    };
  },
});
</script>

<style lang="scss" scoped>
.admin-layout {
  min-height: 100vh;
  background: linear-gradient(135deg, #f0f4f8 0%, #e2e8f0 100%);
  font-family: 'Inter', 'Segoe UI', Roboto, sans-serif;
}

/* Top Navigation */
.top-nav {
  background: linear-gradient(180deg, #1e293b 0%, #0f172a 100%);
  color: white;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  position: sticky;
  top: 0;
  z-index: 1000;

  .nav-container {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 24px;
    height: 70px;
  }
}

.nav-brand {
  .brand-section {
    display: flex;
    align-items: center;
    gap: 16px;

    .back-button {
      color: rgba(255, 255, 255, 0.9) !important;
      transition: all 0.3s ease;
      border-radius: 8px;
      width: 36px;
      height: 36px;

      &:hover {
        color: white !important;
        background: rgba(255, 255, 255, 0.1) !important;
        transform: translateX(-2px);
      }
    }

    .logo {
      display: flex;
      align-items: center;
      gap: 12px;
      font-size: 1.4rem;
      font-weight: 700;
      color: white;

      i {
        font-size: 1.8rem;
        color: #60a5fa;
        background: linear-gradient(135deg, #60a5fa, #3b82f6);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
      }
    }
  }
}

.main-nav {
  flex: 1;
  display: flex;
  justify-content: center;

  .nav-menu {
    display: flex;
    list-style: none;
    margin: 0;
    padding: 0;
    gap: 8px;
  }

  .nav-item {
    &.active {
      .nav-link {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border-bottom: 3px solid #60a5fa;
      }
    }
  }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 12px 20px;
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    transition: all 0.3s ease;
    border-radius: 8px 8px 0 0;
    border-bottom: 3px solid transparent;
    font-weight: 500;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
      color: white;
    }

    i {
      font-size: 1.1rem;
    }
  }
}

.nav-actions {
  display: flex;
  align-items: center;
  gap: 20px;

  .quick-stats {
    display: flex;
    gap: 16px;

    .stat-item {
      display: flex;
      align-items: center;
      gap: 8px;
      padding: 8px 12px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 8px;

      .stat-icon {
        color: #60a5fa;
        font-size: 1rem;
      }

      .stat-info {
        display: flex;
        flex-direction: column;

        .stat-value {
          font-weight: 700;
          color: white;
          font-size: 0.85rem;
        }

        .stat-label {
          color: rgba(255, 255, 255, 0.7);
          font-size: 0.7rem;
        }
      }
    }
  }

  .action-buttons {
    display: flex;
    align-items: center;
    gap: 8px;

    .q-btn {
      color: rgba(255, 255, 255, 0.9) !important;
      transition: all 0.3s ease;

      &:hover {
        color: white !important;
        background: rgba(255, 255, 255, 0.1) !important;
      }
    }

    .user-profile {
      .btn-profile {
        display: flex;
        align-items: center;
        gap: 8px;
        padding: 8px 12px;
        border-radius: 20px;
        background: rgba(255, 255, 255, 0.1);
        transition: all 0.3s ease;

        &:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .user-name {
          font-size: 0.9rem;
          font-weight: 500;
        }
      }
    }
  }
}

/* Mobile Menu */
.mobile-menu {
  position: absolute;
  top: 100%;
  left: 0;
  width: 100%;
  background: #1e293b;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  transform: translateY(-10px);
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.active {
    transform: translateY(0);
    opacity: 1;
    visibility: visible;
  }

  .mobile-menu-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 16px 20px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
    background: rgba(255, 255, 255, 0.05);

    .mobile-back-button {
      color: rgba(255, 255, 255, 0.9) !important;
      transition: all 0.3s ease;

      &:hover {
        color: white !important;
        background: rgba(255, 255, 255, 0.1) !important;
      }
    }

    .mobile-menu-title {
      font-weight: 600;
      font-size: 1rem;
    }

    .mobile-close-button {
      color: rgba(255, 255, 255, 0.9) !important;
    }
  }

  .mobile-nav-menu {
    list-style: none;
    margin: 0;
    padding: 16px 0;
    max-height: 60vh;
    overflow-y: auto;
  }

  .mobile-nav-item {
    &.active {
      .mobile-nav-link {
        background: rgba(255, 255, 255, 0.15);
        color: white;
        border-left: 4px solid #60a5fa;
      }
    }
  }

  .mobile-nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 16px 24px;
    color: rgba(255, 255, 255, 0.9);
    text-decoration: none;
    transition: all 0.3s ease;
    border-left: 4px solid transparent;

    &:hover {
      background: rgba(255, 255, 255, 0.1);
    }

    i {
      font-size: 1.2rem;
      width: 20px;
      text-align: center;
    }
  }
}

.mobile-menu-trigger {
  display: none;
  color: white !important;
}

/* Main Content */
.main-content {
  flex: 1;
  background: #f8fafc;
  min-height: calc(100vh - 70px);
}

.content-header {
  background: white;
  padding: 24px 32px;
  border-bottom: 1px solid #e2e8f0;
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.breadcrumb {
  display: flex;
  align-items: center;
  gap: 8px;
  color: #64748b;
  font-size: 0.85rem;
  margin-bottom: 8px;

  .current-page {
    color: #3b82f6;
    font-weight: 600;
  }
}

.header-left {
  h1 {
    margin: 0;
    color: #1e293b;
    font-size: 2rem;
    font-weight: 700;
    background: linear-gradient(135deg, #1e293b, #0f172a);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
  }

  .page-description {
    margin: 8px 0 0;
    color: #64748b;
    font-size: 1rem;
    max-width: 600px;
  }
}

.header-info {
  .welcome-time {
    display: flex;
    flex-direction: column;
    align-items: flex-end;

    .welcome-text {
      font-weight: 600;
      color: #1e293b;
      font-size: 0.9rem;
    }

    .time {
      color: #3b82f6;
      font-size: 0.8rem;
      font-weight: 700;
      margin-top: 2px;
    }
  }
}

/* Content Area */
.content-area {
  padding: 32px;
}

/* Dashboard Welcome */
.dashboard-welcome {
  .welcome-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 32px;

    .welcome-text {
      h1 {
        font-size: 2.5rem;
        font-weight: 700;
        background: linear-gradient(135deg, #1e293b, #0f172a);
        -webkit-background-clip: text;
        -webkit-text-fill-color: transparent;
        background-clip: text;
        margin-bottom: 8px;
      }

      p {
        font-size: 1.1rem;
        color: #64748b;
        margin: 0;
      }
    }

    .welcome-actions {
      display: flex;
      gap: 12px;

      .action-btn {
        border-radius: 12px;
        font-weight: 600;
        padding: 12px 24px;
      }
    }
  }

  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
    gap: 24px;
    margin-bottom: 32px;

    .stat-card {
      border-radius: 16px;
      transition: all 0.3s ease;
      border: none;

      &:hover {
        transform: translateY(-4px);
        box-shadow: 0 8px 25px rgba(0, 0, 0, 0.1);
      }

      &.primary {
        background: linear-gradient(135deg, #3b82f6, #1d4ed8);
        color: white;
      }

      &.success {
        background: linear-gradient(135deg, #10b981, #047857);
        color: white;
      }

      &.warning {
        background: linear-gradient(135deg, #f59e0b, #d97706);
        color: white;
      }

      &.info {
        background: linear-gradient(135deg, #6366f1, #4f46e5);
        color: white;
      }

      .stat-content {
        display: flex;
        align-items: center;
        gap: 16px;

        .stat-icon {
          font-size: 2.5rem;
          opacity: 0.9;
        }

        .stat-info {
          .stat-value {
            font-size: 2rem;
            font-weight: 700;
            line-height: 1;
          }

          .stat-label {
            font-size: 0.9rem;
            opacity: 0.9;
          }
        }
      }
    }
  }

  .recent-activity {
    .q-card {
      border-radius: 16px;
      border: none;
      box-shadow: 0 2px 12px rgba(0, 0, 0, 0.08);
    }
  }
}

/* Mobile Overlay */
.mobile-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  z-index: 99;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;

  &.active {
    opacity: 1;
    visibility: visible;
  }
}

/* Animações */
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

.fade-scale-enter-active,
.fade-scale-leave-active {
  transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
}

.fade-scale-enter-from {
  opacity: 0;
  transform: scale(0.9);
}

.fade-scale-leave-to {
  opacity: 0;
  transform: scale(1.1);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .main-nav {
    .nav-menu {
      gap: 4px;
    }

    .nav-link {
      padding: 12px 16px;
      font-size: 0.9rem;

      span {
        display: none;
      }
    }
  }

  .nav-actions {
    .quick-stats {
      display: none;
    }
  }
}

@media (max-width: 768px) {
  .top-nav {
    .nav-container {
      padding: 0 16px;
    }
  }

  .main-nav {
    display: none;
  }

  .nav-actions {
    .action-buttons {
      .user-profile {
        .btn-profile {
          .user-name {
            display: none;
          }
        }
      }
    }
  }

  .mobile-menu-trigger {
    display: block;
  }

  .content-header {
    flex-direction: column;
    gap: 16px;
    padding: 20px 24px;
  }

  .header-info {
    align-self: flex-start;

    .welcome-time {
      align-items: flex-start;
    }
  }

  .content-area {
    padding: 20px;
  }
}

@media (max-width: 480px) {
  .dashboard-welcome {
    .welcome-header {
      flex-direction: column;
      gap: 20px;

      .welcome-actions {
        width: 100%;
        justify-content: flex-start;

        .action-btn {
          width: 100%;
        }
      }
    }
  }

  .stats-grid {
    grid-template-columns: 1fr !important;
  }
}
</style>
