<template>
  <q-page class="bg-grey-1">
    <!-- Hero Section com animações -->
    <section class="hero-section">
      <div class="hero-background">
        <q-img
          src="https://attualizecontabil.com.br/wp-content/uploads/2020/06/Imagens-blog-33.png"
          alt="Salão de beleza"
          class="hero-bg-image"
          :ratio="16 / 9"
        />
        <div class="hero-overlay"></div>
        <!-- Partículas animadas -->
        <div class="floating-particles">
          <div
            v-for="i in mobileParticles"
            :key="i"
            class="particle"
            :style="particleStyle()"
          ></div>
        </div>
      </div>

      <div class="hero-content container">
        <div class="row">
          <!-- Conteúdo principal à EXTREMA DIREITA -->
          <div class="col-12 col-md-8 col-lg-6 content-right">
            <!-- Badge animado -->
            <div class="hero-badge animated-fade-in">
              <span class="badge-text">🎯 Plataforma Nº1 em Moçambique</span>
            </div>

            <h1 class="hero-title text-weight-bold text-white animated-slide-up">
              Seu salão de beleza digital
            </h1>
            <p class="hero-subtitle text-white animated-slide-up delay-1">
              Agende serviços estéticos com profissionais certificados
              <span class="text-weight-bold gradient-text">quando e onde quiser</span>
            </p>

            <!-- Estatísticas -->
            <div class="stats-row animated-fade-in delay-2">
              <div class="stat-item">
                <div class="stat-number">500+</div>
                <div class="stat-label">Profissionais</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">10k+</div>
                <div class="stat-label">Clientes</div>
              </div>
              <div class="stat-item">
                <div class="stat-number">50+</div>
                <div class="stat-label">Salões</div>
              </div>
            </div>

            <div class="cta-container animated-fade-in delay-3">
              <q-btn
                unelevated
                label="Agendar Agora"
                color="primary"
                size="lg"
                class="cta-button cta-pulse"
                icon="calendar_today"
                to="/auth"
              />
              <q-btn
                outline
                label="Como Funciona"
                color="white"
                size="lg"
                class="secondary-button"
                icon="play_circle"
                @click="scrollToHowItWorks"
              />
            </div>
          </div>
        </div>

        <!-- Cards CENTRALIZADOS - OCULTOS NO MOBILE -->
        <div class="floating-cards-container">
          <div class="floating-card card-1">
            <q-icon name="verified" color="positive" size="16px" class="q-mr-xs" />
            <span class="card-text">Profissionais Verificados</span>
          </div>
          <div class="floating-card card-2">
            <q-icon name="star" color="amber" size="16px" class="q-mr-xs" />
            <span class="card-text">Avaliação 5★</span>
          </div>
          <div class="floating-card card-3">
            <q-icon name="schedule" color="primary" size="16px" class="q-mr-xs" />
            <span class="card-text">Agendamento Rápido</span>
          </div>
        </div>

        <!-- Scroll indicator -->
        <div class="scroll-indicator">
          <div class="scroll-arrow"></div>
        </div>
      </div>
    </section>

    <!-- Benefícios com animações -->
    <section class="section benefits-section">
      <div class="container">
        <div class="text-center section-header animated-fade-in">
          <h2 class="section-title text-weight-bold">Por que escolher o BeautyTime?</h2>
          <p class="section-subtitle text-grey-7">
            Tudo o que você precisa em uma única plataforma
          </p>
        </div>

        <div class="benefits-grid">
          <div v-for="(benefit, index) in benefits" :key="index" class="benefit-item">
            <q-card class="benefit-card animated-card">
              <div class="icon-container">
                <q-icon :name="benefit.icon" color="primary" class="benefit-icon" />
              </div>
              <h3 class="benefit-title text-weight-bold">{{ benefit.title }}</h3>
              <p class="benefit-description text-grey-7">{{ benefit.description }}</p>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Demonstração do App com animações -->
    <section class="section app-demo-section bg-white" id="how-it-works">
      <div class="container">
        <div class="app-demo-content">
          <div class="demo-visual">
            <div class="floating-image">
              <q-img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                alt="Demonstração do app"
                class="demo-image"
              />
            </div>
          </div>
          <div class="demo-text">
            <h2 class="section-title text-weight-bold animated-slide-right">Como funciona</h2>
            <p class="section-subtitle text-grey-7 animated-slide-right delay-1">
              Uma experiência simples e intuitiva para clientes e profissionais
            </p>

            <div class="steps-container">
              <div
                v-for="(step, index) in appSteps"
                :key="index"
                class="step-item animated-stagger"
                :style="`animation-delay: ${index * 0.2}s`"
              >
                <div class="step-number pulse-animation">{{ index + 1 }}</div>
                <div class="step-content">
                  <h3 class="step-title text-weight-bold">{{ step.title }}</h3>
                  <p class="step-description text-grey-7">{{ step.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Depoimentos com animações -->
    <section class="section testimonials-section">
      <div class="container">
        <div class="text-center section-header animated-fade-in">
          <h2 class="section-title text-weight-bold">O que estão dizendo</h2>
          <p class="section-subtitle text-grey-7">Avaliações de clientes e profissionais</p>
        </div>

        <div class="testimonials-grid">
          <div v-for="(testimonial, index) in testimonials" :key="index" class="testimonial-item">
            <q-card class="testimonial-card animated-card">
              <q-card-section class="testimonial-content">
                <q-rating
                  v-model="testimonial.rating"
                  size="sm"
                  color="amber"
                  readonly
                  class="q-mb-sm"
                />
                <p class="testimonial-text text-grey-8">{{ testimonial.text }}</p>
                <div class="testimonial-author">
                  <q-avatar size="sm" class="avatar-glow">
                    <img :src="testimonial.avatar" />
                  </q-avatar>
                  <div class="author-info">
                    <div class="author-name text-weight-bold">{{ testimonial.name }}</div>
                    <div class="author-role text-caption text-grey">{{ testimonial.role }}</div>
                  </div>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Serviços Populares -->
    <section class="section services-section bg-grey-2">
      <div class="container">
        <div class="text-center section-header animated-fade-in">
          <h2 class="section-title text-weight-bold">Serviços Mais Procurados</h2>
          <p class="section-subtitle text-grey-7">
            Descubra os serviços mais populares da nossa plataforma
          </p>
        </div>

        <div class="services-grid">
          <div v-for="(service, index) in popularServices" :key="index" class="service-item">
            <q-card class="service-card animated-card" @click="redirectToAuth(service)">
              <q-img
                :src="service.image"
                :alt="service.name"
                class="service-image"
                :ratio="16 / 9"
              />
              <q-card-section class="service-content">
                <div class="service-header">
                  <h3 class="service-title text-weight-bold">{{ service.name }}</h3>
                  <q-icon :name="service.icon" color="primary" size="24px" />
                </div>
                <p class="service-description text-grey-7">{{ service.description }}</p>
                <div class="service-footer">
                  <div class="service-price text-weight-bold text-primary">
                    {{ service.price }}
                  </div>
                  <q-btn
                    unelevated
                    color="primary"
                    label="Agendar"
                    size="sm"
                    class="service-button"
                    @click.stop="redirectToAuth(service)"
                  />
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="section faq-section bg-white">
      <div class="container">
        <div class="text-center section-header animated-fade-in">
          <h2 class="section-title text-weight-bold">Perguntas Frequentes</h2>
          <p class="section-subtitle text-grey-7">Tire suas dúvidas sobre a plataforma</p>
        </div>

        <div class="faq-container">
          <div v-for="(faq, index) in faqs" :key="index" class="faq-item animated-card">
            <q-expansion-item
              :label="faq.question"
              class="faq-question text-weight-medium"
              header-class="faq-header"
            >
              <q-card>
                <q-card-section class="faq-answer text-grey-7">
                  {{ faq.answer }}
                </q-card-section>
              </q-card>
            </q-expansion-item>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Final com animação -->
    <section class="section cta-section bg-primary text-white">
      <div class="container text-center">
        <h2 class="cta-title text-weight-bold animated-pulse">
          Pronto para transformar sua rotina de beleza?
        </h2>
        <p class="cta-subtitle animated-fade-in">
          Cadastre-se gratuitamente e descubra os melhores profissionais perto de você
        </p>
        <div class="cta-buttons animated-fade-in delay-1">
          <q-btn
            unelevated
            color="white"
            text-color="primary"
            label="Começar Agora"
            size="lg"
            to="/auth"
            class="cta-main-button cta-glow"
          />
          <q-btn
            outline
            color="white"
            label="Saber mais"
            size="lg"
            to="/about"
            class="cta-secondary-button"
          />
        </div>
      </div>
    </section>
  </q-page>
</template>

<script lang="ts">
import { defineComponent, ref, onMounted, computed } from 'vue';
import { useRouter } from 'vue-router';

interface Service {
  name: string;
  description: string;
  price: string;
  icon: string;
  image: string;
}

export default defineComponent({
  name: 'IndexPage',
  setup() {
    const router = useRouter();
    const isMobile = ref(false);

    const mobileParticles = computed(() => (isMobile.value ? 6 : 12));

    const particleStyle = () => {
      const size = isMobile.value ? Math.random() * 3 + 1 : Math.random() * 4 + 2;
      const duration = Math.random() * 15 + 10;
      const delay = Math.random() * 5;

      return {
        width: `${size}px`,
        height: `${size}px`,
        animationDuration: `${duration}s`,
        animationDelay: `${delay}s`,
        left: `${Math.random() * 100}%`,
      };
    };

    const redirectToAuth = (service?: Service): void => {
      if (service) {
        localStorage.setItem('selectedService', JSON.stringify(service));
      }
      void router.push('/auth');
    };

    const scrollToHowItWorks = () => {
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    const checkScreenSize = () => {
      isMobile.value = window.innerWidth < 768;
    };

    onMounted(() => {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            if (entry.isIntersecting) {
              entry.target.classList.add('animated-visible');
            }
          });
        },
        { threshold: 0.1 },
      );

      document
        .querySelectorAll(
          '.animated-fade-in, .animated-slide-up, .animated-slide-right, .animated-card',
        )
        .forEach((el) => {
          observer.observe(el);
        });
    });

    const benefits = ref([
      {
        icon: 'calendar_today',
        title: 'Agendamento 24/7',
        description: 'Marque seu horário a qualquer momento, sem ligações ou espera',
      },
      {
        icon: 'location_on',
        title: 'Salões próximos',
        description: 'Encontre os melhores profissionais na sua região',
      },
      {
        icon: 'verified_user',
        title: 'Profissionais verificados',
        description: 'Todos os parceiros passam por avaliação de qualificação',
      },
      {
        icon: 'payments',
        title: 'Pagamento seguro',
        description: 'Diversas opções de pagamento com total segurança',
      },
    ]);

    const appSteps = ref([
      {
        title: 'Crie sua conta',
        description: 'Registre-se em menos de 1 minuto',
      },
      {
        title: 'Encontre profissionais',
        description: 'Busque por serviço, localização ou avaliação',
      },
      {
        title: 'Agende seu horário',
        description: 'Escolha data e hora disponíveis',
      },
      {
        title: 'Aproveite o serviço',
        description: 'Receba lembretes e confirmações automáticas',
      },
    ]);

    const testimonials = ref([
      {
        rating: 5,
        text: 'Finalmente posso marcar meus horários de manicure sem ter que ficar mandando mensagem para o salão!',
        name: 'Ana Claudia',
        role: 'Cliente',
        avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      },
      {
        rating: 5,
        text: 'Como profissional, o BeautyTime me ajudou a organizar melhor minha agenda e atrair novos clientes.',
        name: 'Carlos Silva',
        role: 'Cabeleireiro',
        avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      },
      {
        rating: 4,
        text: 'Adoro a facilidade de poder escolher o horário e ver as avaliações dos profissionais antes de agendar.',
        name: 'Mariana Oliveira',
        role: 'Cliente',
        avatar: 'https://randomuser.me/api/portraits/women/63.jpg',
      },
    ]);

    const popularServices = ref<Service[]>([
      {
        name: 'Corte de Cabelo',
        description: 'Corte moderno e personalizado com os melhores profissionais',
        price: '150 MZN',
        icon: 'content_cut',
        image: 'https://images.unsplash.com/photo-1562322140-8baeececf3df',
      },
      {
        name: 'Manicure & Pedicure',
        description: 'Cuidados completos para suas mãos e pés',
        price: '200 MZN',
        icon: 'spa',
        image: 'https://images.unsplash.com/photo-1607778833979-9732446c1d31',
      },
      {
        name: 'Maquiagem Profissional',
        description: 'Maquiagem para ocasiões especiais e dia a dia',
        price: '500 MZN',
        icon: 'brush',
        image: 'https://images.unsplash.com/photo-1512496015859-ea53a8c17bb3',
      },
      {
        name: 'Tratamento Facial',
        description: 'Limpeza de pele e tratamentos revitalizantes',
        price: '800 MZN',
        icon: 'face',
        image: 'https://images.unsplash.com/photo-1540555700478-4be2890c43a0',
      },
      {
        name: 'Depilação',
        description: 'Técnicas modernas para uma pele suave',
        price: '300 MZN',
        icon: 'flash_on',
        image: 'https://images.unsplash.com/photo-1596704013708-f8db3c132d08',
      },
      {
        name: 'Massagem Relaxante',
        description: 'Alívio do stress e relaxamento muscular',
        price: '600 MZN',
        icon: 'hotel',
        image: 'https://images.unsplash.com/photo-1544161515-4ab6ce6db874',
      },
    ]);

    const faqs = ref([
      {
        question: 'Como faço para agendar um serviço?',
        answer:
          'É simples! Basta criar sua conta, escolher o serviço desejado, selecionar um profissional disponível e confirmar o agendamento. Você receberá uma confirmação por email e SMS.',
      },
      {
        question: 'Posso cancelar ou remarcar um agendamento?',
        answer:
          'Sim, você pode cancelar ou remarcar seu agendamento até 24 horas antes do horário marcado sem nenhuma taxa. Após esse período, pode haver uma taxa de cancelamento.',
      },
      {
        question: 'Os profissionais são verificados?',
        answer:
          'Todos os profissionais da nossa plataforma passam por um rigoroso processo de verificação que inclui análise de documentos, certificações e avaliações de outros clientes.',
      },
      {
        question: 'Quais são as formas de pagamento?',
        answer:
          'Aceitamos múltiplas formas de pagamento incluindo M-Pesa, E-Mola, cartões de crédito/débito e transferências bancárias. Todas as transações são seguras e criptografadas.',
      },
      {
        question: 'E se eu não gostar do serviço?',
        answer:
          'Sua satisfação é nossa prioridade. Se não ficar satisfeito com o serviço, entre em contato com nosso suporte em até 48 horas e resolveremos a situação.',
      },
    ]);

    return {
      benefits,
      appSteps,
      testimonials,
      popularServices,
      faqs,
      particleStyle,
      scrollToHowItWorks,
      redirectToAuth,
      mobileParticles,
    };
  },
});
</script>

<style lang="scss" scoped>
// Variáveis para breakpoints
$mobile: 768px;
$tablet: 1024px;
$small-mobile: 480px;
$large-mobile: 600px;

// Mixins para responsividade
@mixin mobile {
  @media (max-width: #{$mobile - 1px}) {
    @content;
  }
}

@mixin tablet {
  @media (min-width: #{$mobile}) and (max-width: #{$tablet - 1px}) {
    @content;
  }
}

@mixin small-mobile {
  @media (max-width: #{$small-mobile}) {
    @content;
  }
}

@mixin large-mobile {
  @media (max-width: #{$large-mobile}) {
    @content;
  }
}

// Animations
@keyframes fadeInUp {
  from {
    opacity: 0;
    transform: translateY(30px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes slideInRight {
  from {
    opacity: 0;
    transform: translateX(30px);
  }
  to {
    opacity: 1;
    transform: translateX(0);
  }
}

@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

@keyframes float {
  0%,
  100% {
    transform: translateY(0px);
  }
  50% {
    transform: translateY(-20px);
  }
}

@keyframes pulse {
  0%,
  100% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.05);
  }
}

@keyframes glow {
  0%,
  100% {
    box-shadow: 0 0 20px rgba(0, 150, 255, 0.5);
  }
  50% {
    box-shadow: 0 0 30px rgba(0, 150, 255, 0.8);
  }
}

@keyframes floatParticle {
  0% {
    transform: translateY(100vh) rotate(0deg);
    opacity: 0;
  }
  10% {
    opacity: 1;
  }
  90% {
    opacity: 1;
  }
  100% {
    transform: translateY(-100px) rotate(360deg);
    opacity: 0;
  }
}

@keyframes bounce {
  0%,
  20%,
  50%,
  80%,
  100% {
    transform: translateY(0);
  }
  40% {
    transform: translateY(-10px);
  }
  60% {
    transform: translateY(-5px);
  }
}

@keyframes gradientShift {
  0% {
    background-position: 0% 50%;
  }
  50% {
    background-position: 100% 50%;
  }
  100% {
    background-position: 0% 50%;
  }
}

// Animation Classes
.animated-fade-in {
  opacity: 0;
  animation: fadeIn 0.8s ease forwards;
}

.animated-slide-up {
  opacity: 0;
  animation: fadeInUp 0.8s ease forwards;
}

.animated-slide-right {
  opacity: 0;
  animation: slideInRight 0.8s ease forwards;
}

.animated-card {
  opacity: 0;
  transform: translateY(30px);
  transition: all 0.6s ease;
}

.animated-stagger {
  opacity: 0;
  transform: translateX(-20px);
  animation: slideInRight 0.6s ease forwards;
}

.animated-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.animated-visible {
  opacity: 1;
  transform: translate(0);
}

// Delay Utilities
.delay-1 {
  animation-delay: 0.2s;
}
.delay-2 {
  animation-delay: 0.4s;
}
.delay-3 {
  animation-delay: 0.6s;
}

// Container
.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;

  @include mobile {
    padding: 0 12px;
  }
}

// Section Base
.section {
  padding: 80px 0;

  @include mobile {
    padding: 60px 0;
  }

  @include small-mobile {
    padding: 40px 0;
  }
}

.section-header {
  margin-bottom: 60px;

  @include mobile {
    margin-bottom: 40px;
  }
}

.section-title {
  font-size: 2rem;
  margin-bottom: 16px;

  @include mobile {
    font-size: 1.75rem;
    margin-bottom: 12px;
  }

  @include small-mobile {
    font-size: 1.5rem;
  }
}

.section-subtitle {
  font-size: 1.25rem;

  @include mobile {
    font-size: 1.1rem;
  }
}

// Hero Section - MODIFICADO PARA DIREITA
.hero-section {
  position: relative;
  min-height: 100vh;
  overflow: hidden;

  @include mobile {
    min-height: 80vh;
  }
}

.hero-background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .hero-bg-image {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  .hero-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: linear-gradient(
      to right,
      rgba(0, 0, 0, 0) 0%,
      rgba(0, 0, 0, 0.1) 60%,
      rgba(0, 0, 0, 0.8) 100%
    );

    @include mobile {
      background: rgba(0, 0, 0, 0.6);
    }
  }
}

.floating-particles {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;

  .particle {
    position: absolute;
    background: rgba(255, 255, 255, 0.6);
    border-radius: 50%;
    animation: floatParticle linear infinite;

    @include mobile {
      display: none;
    }
  }
}

.hero-content {
  position: relative;
  z-index: 1;
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: flex-end; // FORÇA para a DIREITA

  @include mobile {
    padding: 100px 0 60px;
    justify-content: center;
  }
}

// Conteúdo à DIREITA
.content-right {
  text-align: right; // Texto alinhado à DIREITA
  margin-left: auto; // Empurra para a DIREITA
  padding-right: 0;

  @include mobile {
    text-align: center;
    margin-left: 0;
  }
}

.hero-badge {
  display: inline-block;
  background: rgba(255, 255, 255, 0.1);
  backdrop-filter: blur(10px);
  border: 1px solid rgba(255, 255, 255, 0.2);
  border-radius: 50px;
  padding: 8px 20px;
  margin-bottom: 30px;

  @include mobile {
    margin-bottom: 20px;
    padding: 6px 16px;
  }

  .badge-text {
    color: white;
    font-size: 0.9rem;
    font-weight: 600;

    @include mobile {
      font-size: 0.8rem;
    }
  }
}

.hero-title {
  font-size: 3.5rem;
  margin-bottom: 24px;
  line-height: 1.1;

  @include tablet {
    font-size: 3rem;
  }

  @include mobile {
    font-size: 2.5rem;
    margin-bottom: 20px;
  }

  @include small-mobile {
    font-size: 2rem;
  }
}

.hero-subtitle {
  font-size: 1.5rem;
  line-height: 1.6;
  margin-bottom: 40px;

  @include tablet {
    font-size: 1.3rem;
  }

  @include mobile {
    font-size: 1.2rem;
    margin-bottom: 30px;
  }

  @include small-mobile {
    font-size: 1.1rem;
  }
}

.gradient-text {
  background: linear-gradient(45deg, #ffd89b, #19547b);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 200%;
  animation: gradientShift 3s ease infinite;
}

.stats-row {
  display: flex;
  gap: 40px;
  margin: 30px 0;
  justify-content: flex-end; // Estatísticas à DIREITA

  @include tablet {
    gap: 30px;
  }

  @include mobile {
    justify-content: center;
    gap: 20px;
    margin: 20px 0;
  }

  @include small-mobile {
    gap: 15px;
  }

  .stat-item {
    text-align: center;

    .stat-number {
      font-size: 2rem;
      font-weight: 800;
      color: white;
      margin-bottom: 4px;

      @include mobile {
        font-size: 1.5rem;
      }

      @include small-mobile {
        font-size: 1.25rem;
      }
    }

    .stat-label {
      font-size: 0.9rem;
      color: rgba(255, 255, 255, 0.8);

      @include small-mobile {
        font-size: 0.8rem;
      }
    }
  }
}

.cta-container {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: flex-end; // Botões à DIREITA

  @include mobile {
    justify-content: center;
    gap: 12px;
  }

  @include small-mobile {
    flex-direction: column;
    align-items: center;
  }
}

.cta-button,
.secondary-button {
  border-radius: 50px;
  padding: 12px 32px;
  font-weight: 600;

  @include mobile {
    padding: 10px 24px;
    font-size: 0.9rem;
  }

  @include small-mobile {
    width: 100%;
    max-width: 280px;
  }
}

.cta-pulse {
  animation: pulse 2s ease-in-out infinite;
}

.cta-glow {
  animation: glow 2s ease-in-out infinite;
}

// Container para os cards flutuantes - AGORA CENTRALIZADO
.floating-cards-container {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 200px;
  pointer-events: none;

  // OCULTAR NO MOBILE
  @include mobile {
    display: none;
  }

  @include tablet {
    height: 150px;
  }
}

// Cards flutuantes - AGORA CENTRALIZADOS
.floating-card {
  position: absolute;
  background: rgba(255, 255, 255, 0.95);
  backdrop-filter: blur(10px);
  border-radius: 12px;
  padding: 12px 16px;
  display: flex;
  align-items: center;
  gap: 8px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.3);
  animation: float 4s ease-in-out infinite;
  font-weight: 600;
  z-index: 10;
  pointer-events: auto;

  @include tablet {
    padding: 10px 14px;
    font-size: 0.85rem;
  }

  // Cards CENTRALIZADOS na tela
  &.card-1 {
    top: 20%;
    left: 20%;
    animation-delay: 0s;

    @include tablet {
      top: 15%;
      left: 10%;
    }
  }

  &.card-2 {
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation-delay: 2s;

    @include tablet {
      top: 45%;
      left: 45%;
    }
  }

  &.card-3 {
    top: 80%;
    left: 80%;
    animation-delay: 1s;

    @include tablet {
      top: 75%;
      left: 70%;
    }
  }
}

.scroll-indicator {
  position: absolute;
  bottom: 30px;
  left: 50%;
  transform: translateX(-50%);

  @include mobile {
    bottom: 20px;
  }

  .scroll-arrow {
    width: 2px;
    height: 30px;
    background: rgba(255, 255, 255, 0.6);
    margin: 0 auto;
    position: relative;
    animation: bounce 2s infinite;

    &::after {
      content: '';
      position: absolute;
      bottom: -4px;
      left: -3px;
      width: 8px;
      height: 8px;
      border-right: 2px solid rgba(255, 255, 255, 0.6);
      border-bottom: 2px solid rgba(255, 255, 255, 0.6);
      transform: rotate(45deg);
    }
  }
}

// Benefits Section
.benefits-grid {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 24px;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @include mobile {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.benefit-card {
  padding: 32px 24px;
  text-align: center;
  transition: all 0.3s ease;
  height: 100%;
  border: 1px solid rgba(0, 0, 0, 0.05);

  @include mobile {
    padding: 24px 16px;
  }

  .icon-container {
    margin-bottom: 20px;
    transition: transform 0.3s ease;

    @include mobile {
      margin-bottom: 16px;
    }
  }

  .benefit-icon {
    font-size: 3rem;

    @include mobile {
      font-size: 2.5rem;
    }
  }

  .benefit-title {
    font-size: 1.25rem;
    margin-bottom: 12px;

    @include mobile {
      font-size: 1.1rem;
    }
  }

  .benefit-description {
    font-size: 0.95rem;
    line-height: 1.5;

    @include mobile {
      font-size: 0.9rem;
    }
  }

  &:hover {
    transform: translateY(-10px);
    box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

    .icon-container {
      transform: scale(1.1);
    }

    @include mobile {
      transform: translateY(-5px);
    }
  }
}

// App Demo Section
.app-demo-section {
  .app-demo-content {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 60px;
    align-items: center;

    @include tablet {
      gap: 40px;
    }

    @include mobile {
      grid-template-columns: 1fr;
      gap: 40px;
    }
  }

  .demo-text {
    order: 2;

    @include mobile {
      order: 2;
    }
  }

  .demo-visual {
    order: 1;

    @include mobile {
      order: 1;
    }
  }
}

.steps-container {
  .step-item {
    display: flex;
    align-items: flex-start;
    margin-bottom: 40px;

    @include mobile {
      margin-bottom: 30px;
    }

    &:last-child {
      margin-bottom: 0;
    }
  }

  .step-number {
    display: flex;
    align-items: center;
    justify-content: center;
    min-width: 50px;
    height: 50px;
    background-color: #f0f4ff;
    color: #4f46e5;
    font-weight: 700;
    border-radius: 50%;
    margin-right: 20px;
    transition: all 0.3s ease;
    flex-shrink: 0;

    @include mobile {
      min-width: 40px;
      height: 40px;
      margin-right: 16px;
      font-size: 0.9rem;
    }
  }

  .step-content {
    flex: 1;
  }

  .step-title {
    font-size: 1.25rem;
    margin-bottom: 8px;

    @include mobile {
      font-size: 1.1rem;
    }
  }

  .step-description {
    font-size: 1rem;
    line-height: 1.5;

    @include mobile {
      font-size: 0.9rem;
    }
  }
}

.pulse-animation {
  animation: pulse 2s ease-in-out infinite;
}

.demo-image {
  border-radius: 16px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.1);

  @include mobile {
    border-radius: 12px;
  }
}

// Testimonials Section
.testimonials-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @include mobile {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.testimonial-card {
  height: 100%;
  transition: all 0.3s ease;

  .testimonial-content {
    padding: 24px;

    @include mobile {
      padding: 20px;
    }
  }

  .testimonial-text {
    font-size: 0.95rem;
    line-height: 1.6;
    margin-bottom: 20px;

    @include mobile {
      font-size: 0.9rem;
    }
  }

  .testimonial-author {
    display: flex;
    align-items: center;
  }

  .author-info {
    margin-left: 12px;
  }

  .author-name {
    font-size: 0.95rem;

    @include mobile {
      font-size: 0.9rem;
    }
  }

  .author-role {
    font-size: 0.8rem;
  }

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.1);
  }
}

.avatar-glow {
  transition: all 0.3s ease;

  &:hover {
    box-shadow: 0 0 20px rgba(0, 150, 255, 0.5);
  }
}

// Services Section
.services-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 24px;

  @include tablet {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @include mobile {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}

.service-card {
  transition: all 0.3s ease;
  height: 100%;
  overflow: hidden;

  .service-image {
    height: 200px;

    @include mobile {
      height: 180px;
    }
  }

  .service-content {
    padding: 20px;

    @include mobile {
      padding: 16px;
    }
  }

  .service-header {
    display: flex;
    justify-content: space-between;
    align-items: flex-start;
    margin-bottom: 12px;
  }

  .service-title {
    font-size: 1.1rem;
    margin: 0;
    flex: 1;

    @include mobile {
      font-size: 1rem;
    }
  }

  .service-description {
    font-size: 0.9rem;
    line-height: 1.5;
    margin-bottom: 16px;

    @include mobile {
      font-size: 0.85rem;
    }
  }

  .service-footer {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  .service-price {
    font-size: 1.1rem;

    @include mobile {
      font-size: 1rem;
    }
  }

  .service-button {
    border-radius: 20px;
  }

  &:hover {
    transform: translateY(-8px);
    box-shadow: 0 15px 30px rgba(0, 0, 0, 0.15);

    @include mobile {
      transform: translateY(-5px);
    }
  }
}

// FAQ Section
.faq-container {
  max-width: 800px;
  margin: 0 auto;
}

.faq-item {
  margin-bottom: 16px;
  transition: all 0.3s ease;

  &:last-child {
    margin-bottom: 0;
  }

  .faq-header {
    background-color: #f8f9fa;
    border-radius: 8px;
    padding: 16px 20px;
    transition: all 0.3s ease;

    &:hover {
      background-color: #e9ecef;
    }
  }

  .faq-question {
    font-size: 1rem;

    @include mobile {
      font-size: 0.95rem;
    }
  }

  .faq-answer {
    font-size: 0.95rem;
    line-height: 1.6;
    padding: 20px;

    @include mobile {
      font-size: 0.9rem;
      padding: 16px;
    }
  }
}

// CTA Section
.cta-section {
  .cta-title {
    font-size: 2.5rem;
    margin-bottom: 16px;

    @include tablet {
      font-size: 2.25rem;
    }

    @include mobile {
      font-size: 2rem;
    }

    @include small-mobile {
      font-size: 1.75rem;
    }
  }

  .cta-subtitle {
    font-size: 1.25rem;
    margin-bottom: 40px;

    @include mobile {
      font-size: 1.1rem;
      margin-bottom: 30px;
    }
  }
}

.cta-buttons {
  display: flex;
  gap: 16px;
  justify-content: center;
  flex-wrap: wrap;

  @include mobile {
    gap: 12px;
  }

  @include small-mobile {
    flex-direction: column;
    align-items: center;
  }
}

.cta-main-button,
.cta-secondary-button {
  border-radius: 50px;
  padding: 12px 32px;
  font-weight: 600;

  @include mobile {
    padding: 10px 24px;
  }

  @include small-mobile {
    width: 100%;
    max-width: 280px;
  }
}

// Ajustes de performance para mobile
@include mobile {
  .floating-particles .particle {
    display: none;
  }

  .floating-image {
    animation-duration: 8s;
  }
}

// Ajustes específicos para mobile muito pequeno
@include small-mobile {
  .hero-title {
    line-height: 1.2;
  }

  .hero-subtitle {
    line-height: 1.4;
  }

  .stats-row {
    flex-wrap: wrap;
    justify-content: space-around;
  }

  .stat-item {
    flex: 0 0 calc(33.333% - 10px);
  }

  .benefit-card,
  .testimonial-card,
  .service-card {
    margin: 0 auto;
    max-width: 100%;
  }
}
</style>
