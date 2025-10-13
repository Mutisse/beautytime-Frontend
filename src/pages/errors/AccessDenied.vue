<template>
  <q-layout view="hHh Lpr lFf">
    <q-page-container>
      <q-page class="access-denied-container flex flex-center" :class="{ 'dark-mode': $q.dark.isActive }">
        <div class="background-gradient"></div>
        
        <q-card class="access-denied-card" :class="cardAnimation">
          <div class="illustration-container">
            <q-card class="glass-card">
              <q-img
                src="https://img.freepik.com/premium-vector/vector-illustration-about-access-denied-concept-with-confused-people-with-access-denied_675567-3714.jpg?w=2000"
                alt="Acesso Negado"
                class="error-illustration"
              >
                <template v-slot:error>
                  <div class="flex flex-center column text-negative">
                    <q-icon name="block" size="xl" />
                    <div class="text-h6 q-mt-md">Acesso Negado</div>
                  </div>
                </template>
              </q-img>
            </q-card>
            <div class="light-spot"></div>
          </div>

          <div class="content">
            <div class="header">
              <h1 class="title text-h4">
                <span class="title-text">Acesso Negado</span>
              </h1>
              <div class="title-divider"></div>
            </div>
            
            <p class="message">
              Você não possui as permissões necessárias para acessar este conteúdo.
              <br />
              Entre em contato com o administrador do sistema para solicitar acesso.
            </p>

            <div class="actions">
              <q-btn 
                @click="goToDashboard" 
                class="primary-button" 
                color="primary"
                :class="{ 'button-hover': primaryHover }"
                @mouseenter="primaryHover = true"
                @mouseleave="primaryHover = false"
              >
                <q-icon name="home" class="button-icon" :class="{ 'icon-hover': primaryHover }" />
                <span class="button-text">Voltar ao Início</span>
              </q-btn>
              
              <q-btn 
                @click="contactSupport" 
                class="secondary-button" 
                color="white"
                text-color="dark"
                :class="{ 'button-hover': secondaryHover }"
                @mouseenter="secondaryHover = true"
                @mouseleave="secondaryHover = false"
              >
                <q-icon name="support" class="button-icon" :class="{ 'icon-hover': secondaryHover }" />
                <span class="button-text">Contatar Suporte</span>
              </q-btn>
            </div>
          </div>
        </q-card>
        
        <div class="particles-container">
          <div v-for="index in particleCount" :key="index" class="particle" :style="particleStyle()"></div>
        </div>
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useQuasar } from 'quasar'

const $q = useQuasar()
const router = useRouter()
const particleCount = ref($q.screen.width < 768 ? 15 : 30)
const primaryHover = ref(false)
const secondaryHover = ref(false)
const cardAnimation = ref('card-entering')

// Estilo das partículas
const particleStyle = () => {
  const size = Math.random() * 5 + 2
  return {
    width: `${size}px`,
    height: `${size}px`,
    left: `${Math.random() * 100}%`,
    top: `${Math.random() * 100}%`,
    background: $q.dark.isActive ? 'rgba(220, 38, 38, 0.15)' : 'rgba(239, 68, 68, 0.15)',
    opacity: `${Math.random() * 0.4 + 0.1}`,
    animationDelay: `${Math.random() * 5}s`,
    animationDuration: `${Math.random() * 10 + 10}s`
  }
}

const goToDashboard = (): void => {
  cardAnimation.value = 'card-exiting'
  setTimeout(() => {
    void router.push({ name: 'auth' })
  }, 500)
}

const contactSupport = (): void => {
  void router.push({ name: 'SuportTech' })
}

onMounted(() => {
  cardAnimation.value = 'card-enter'
})
</script>

<style lang="scss" scoped>
.access-denied-container {
  position: relative;
  min-height: 100vh;
  padding: 1rem;
  background-color: #ffffff;
  color: #1e293b;
  overflow: hidden;
  transition: all 0.5s ease;

  &.dark-mode {
    background-color: #0f172a;
    color: #ffffff;
  }
}

.background-gradient {
  position: absolute;
  top: -50%;
  left: -50%;
  width: 200%;
  height: 200%;
  background: radial-gradient(circle at center, 
    rgba(239, 68, 68, 0.1) 0%, 
    transparent 70%);
  animation: rotate-gradient 60s linear infinite;
  z-index: 0;

  .dark-mode & {
    background: radial-gradient(circle at center, 
      rgba(220, 38, 38, 0.1) 0%, 
      transparent 70%);
  }
}

.access-denied-card {
  position: relative;
  display: flex;
  max-width: 1000px;
  width: 100%;
  height: auto;
  min-height: 500px;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(12px);
  border-radius: 16px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1);
  overflow: hidden;
  z-index: 2;
  opacity: 0;
  transform: translateY(50px);
  transition: all 0.5s ease;

  &.card-enter {
    opacity: 1;
    transform: translateY(0);
  }

  &.card-entering {
    opacity: 1;
    transform: translateY(0);
    transition: all 0.8s cubic-bezier(0.34, 1.56, 0.64, 1);
  }

  &.card-exiting {
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.5s ease;
  }

  .dark-mode & {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.glass-card {
  position: relative;
  width: 100%;
  height: 100%;
  background: rgba(255, 255, 255, 0.25);
  backdrop-filter: blur(8px);
  border-radius: 12px;
  border: 1px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  padding: 1rem;
  display: flex;
  justify-content: center;
  align-items: center;

  .dark-mode & {
    background: rgba(15, 23, 42, 0.5);
    border: 1px solid rgba(255, 255, 255, 0.1);
  }
}

.illustration-container {
  flex: 1;
  padding: 1.5rem;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
  background: linear-gradient(135deg, #f7f6f7 0%, #fbfdff 100%);
}

.error-illustration {
  max-width: 90%;
  height: auto;
  filter: drop-shadow(0 10px 20px rgba(0, 0, 0, 0.33));
  position: relative;
  z-index: 2;
  animation: float 6s ease-in-out infinite;
}

.light-spot {
  position: absolute;
  width: 150px;
  height: 150px;
  background: radial-gradient(circle, 
    rgba(255, 255, 255, 0.3) 0%, 
    transparent 70%);
  filter: blur(20px);
  z-index: 1;
  animation: light-pulse 8s ease-in-out infinite;
}

.content {
  flex: 1;
  padding: 2rem;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

.header {
  margin-bottom: 1.5rem;
}

.title {
  font-size: 1.75rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  position: relative;
  color: #ef4444;

  .dark-mode & {
    color: #fca5a5;
  }
}

.title-text {
  display: inline-block;
  animation: text-focus-in 0.8s ease both;
}

.title-divider {
  height: 3px;
  width: 50px;
  background: #ef4444;
  border-radius: 50%;
  margin-top: 0.75rem;
  animation: underlineExpand 0.8s ease-out forwards;

  .dark-mode & {
    background: #fca5a5;
  }
}

.message {
  font-size: 1rem;
  line-height: 1.6;
  color: #64748b;
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-out 0.3s both;

  .dark-mode & {
    color: #f8fafc;
  }
}

.actions {
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.primary-button,
.secondary-button {
  position: relative;
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.25rem;
  font-size: 0.875rem;
  font-weight: 600;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.3s ease;
  overflow: hidden;
  z-index: 1;
  border: none;
}

.primary-button {
  background-color: #ef4444;
  color: white;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);

  &.button-hover {
    background-color: #dc2626;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .dark-mode & {
    background-color: #dc2626;

    &.button-hover {
      background-color: #b91c1c;
    }
  }
}

.secondary-button {
  background-color: #f8fafc;
  color: #1e293b;
  border: 1px solid #e2e8f0;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);

  &.button-hover {
    background-color: #f1f5f9;
    transform: translateY(-2px);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.1);
  }

  .dark-mode & {
    background-color: #1e293b;
    color: #f8fafc;
    border-color: #334155;

    &.button-hover {
      background-color: #334155;
    }
  }
}

.button-icon {
  width: 18px;
  height: 18px;
  transition: all 0.3s ease;

  &.icon-hover {
    transform: translateY(-3px);
  }
}

.particles-container {
  position: absolute;
  width: 100%;
  height: 100%;
  top: 0;
  left: 0;
  pointer-events: none;
  z-index: 1;
}

.particle {
  position: absolute;
  border-radius: 50%;
  background-color: rgba(239, 68, 68, 0.15);
  animation: float-particle infinite ease-in-out;
  will-change: transform;

  .dark-mode & {
    background-color: rgba(220, 38, 38, 0.15);
  }
}

/* Keyframes */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-8px);
  }
}

@keyframes float-particle {
  0%, 100% {
    transform: translateY(0) translateX(0);
  }
  25% {
    transform: translateY(-15px) translateX(8px);
  }
  50% {
    transform: translateY(0) translateX(15px);
  }
  75% {
    transform: translateY(8px) translateX(-8px);
  }
}

@keyframes rotate-gradient {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

@keyframes light-pulse {
  0%, 100% {
    opacity: 0.6;
    transform: scale(1);
  }
  50% {
    opacity: 0.3;
    transform: scale(1.1);
  }
}

@keyframes underlineExpand {
  from {
    width: 0;
    opacity: 0;
  }
  to {
    width: 50px;
    opacity: 1;
  }
}

@keyframes text-focus-in {
  0% {
    filter: blur(8px);
    opacity: 0;
  }
  100% {
    filter: blur(0px);
    opacity: 1;
  }
}

/* Responsividade melhorada */
@media (max-width: 1024px) {
  .access-denied-card {
    flex-direction: column;
    height: auto;
  }
  
  .illustration-container {
    padding: 1rem;
    min-height: 300px;
  }
  
  .content {
    padding: 1.5rem;
    text-align: center;
  }
  
  .title-divider {
    margin: 0.75rem auto;
  }
  
  .actions {
    justify-content: center;
  }
}

@media (max-width: 600px) {
  .access-denied-container {
    padding: 0.5rem;
  }
  
  .access-denied-card {
    margin: 0.5rem;
  }
  
  .title {
    font-size: 1.5rem;
  }
  
  .message {
    font-size: 0.875rem;
  }
  
  .actions {
    flex-direction: column;
    gap: 0.5rem;
  }
  
  .primary-button,
  .secondary-button {
    width: 100%;
    justify-content: center;
  }
  
  .particle {
    display: none;
  }
  
  .illustration-container {
    min-height: 250px;
  }
}

@media (hover: none) {
  .error-illustration {
    animation: float 6s ease-in-out infinite !important;
  }
  
  .glass-card {
    cursor: default;
  }
}

/* Acessibilidade */
.primary-button:focus-visible,
.secondary-button:focus-visible {
  outline: 2px solid #ef4444;
  outline-offset: 2px;

  .dark-mode & {
    outline: 2px solid #dc2626;
  }
}

.secondary-button:focus-visible {
  outline: 2px solid #94a3b8;
  outline-offset: 2px;

  .dark-mode & {
    outline: 2px solid #64748b;
  }
}

.primary-button:active,
.secondary-button:active {
  transform: translateY(1px) !important;
}
</style>