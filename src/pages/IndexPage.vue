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
        <div class="row items-center justify-end">
          <!-- Conteúdo principal à direita -->
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

          <!-- Espaço vazio à esquerda para os cards -->
          <div class="col-12 col-md-4 col-lg-6 hero-visual">
            <div class="visual-container">
              <div class="floating-image">
                <!-- Cards flutuantes centralizados horizontalmente -->
                <div class="floating-card card-1">
                  <q-icon name="verified" color="positive" size="16px" class="q-mr-xs" />
                  <span class="card-text">Profissionais Verificados</span>
                </div>
                <div class="floating-card card-2">
                  <q-icon name="star" color="amber" size="16px" class="q-mr-xs" />
                  <span class="card-text">Avaliação 5★</span>
                </div>
                <div class="floating-card card-3 mobile-only">
                  <q-icon name="schedule" color="primary" size="16px" class="q-mr-xs" />
                  <span class="card-text">Agendamento Rápido</span>
                </div>
              </div>
            </div>
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

          <div class="demo-visual">
            <div class="floating-image">
              <q-img
                src="https://images.unsplash.com/photo-1556742049-0cfed4f6a45d"
                alt="Demonstração do app"
                class="demo-image"
              />
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
    <!-- Na seção de Serviços Populares -->
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

// ✅ Definir interface para o serviço
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

    // Computed para número de partículas baseado no dispositivo
    const mobileParticles = computed(() => (isMobile.value ? 6 : 12));

    // Função para estilos das partículas
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

    // ✅ CORREÇÃO: Função com tipo específico e tratamento de promise
    const redirectToAuth = (service?: Service): void => {
      // Se um serviço foi passado, salvar no localStorage para usar depois do login
      if (service) {
        localStorage.setItem('selectedService', JSON.stringify(service));
      }

      // ✅ CORREÇÃO: Promise tratada com void
      void router.push('/auth');
    };

    const scrollToHowItWorks = () => {
      const element = document.getElementById('how-it-works');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    };

    // Verificar tamanho da tela
    const checkScreenSize = () => {
      isMobile.value = window.innerWidth < 768;
    };

    // Inicializar animações quando o componente montar
    onMounted(() => {
      checkScreenSize();
      window.addEventListener('resize', checkScreenSize);

      // Adicionar observador de interseção para animações on scroll
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

      // Observar todos os elementos com classes de animação
      document
        .querySelectorAll(
          '.animated-fade-in, .animated-slide-up, .animated-slide-right, .animated-card',
        )
        .forEach((el) => {
          observer.observe(el);
        });
    });

    // Cleanup
    onMounted(() => {
      return () => {
        window.removeEventListener('resize', checkScreenSize);
      };
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
        image: 'https://th.bing.com/th/id/OIP.mM0i8NLynzhcOj82HtWAYAHaE8?w=259&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
      },
      {
        name: 'Maquiagem Profissional',
        description: 'Maquiagem para ocasiões especiais e dia a dia',
        price: '500 MZN',
        icon: 'brush',
        image: 'https://img77.uenicdn.com/image/upload/v1520616808/service_images/shutterstock_517637128.jpg',
      },
      {
        name: 'Tratamento Facial',
        description: 'Limpeza de pele e tratamentos revitalizantes',
        price: '800 MZN',
        icon: 'face',
        image: 'data:image/webp;base64,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',
      },
      {
        name: 'Depilação',
        description: 'Técnicas modernas para uma pele suave',
        price: '300 MZN',
        icon: 'flash_on',
        image: 'https://th.bing.com/th/id/OIP.JGB8q5lW4EHHQyAEV5e16wHaE8?w=251&h=180&c=7&r=0&o=7&dpr=1.3&pid=1.7&rm=3',
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

@mixin desktop {
  @media (min-width: #{$tablet}) {
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

// Hero Section
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
      to left,
      rgba(0, 0, 0, 0.8) 0%,
      rgba(0, 0, 0, 0.4) 50%,
      rgba(0, 0, 0, 0.2) 100%
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
  height: 100%;
  display: flex;
  align-items: center;
  padding: 120px 0 80px;

  @include mobile {
    padding: 100px 0 60px;
  }
}

// Conteúdo à direita
.content-right {
  text-align: left;

  @include mobile {
    text-align: center;
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

// Hero Visual
.hero-visual {
  @include mobile {
    margin-top: 40px;
  }
}

.visual-container {
  position: relative;
  height: 500px;

  @include tablet {
    height: 400px;
  }

  @include mobile {
    height: 300px;
  }
}

.floating-image {
  position: relative;
  animation: float 6s ease-in-out infinite;
}

// Cards flutuantes centralizados horizontalmente
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

  @include tablet {
    padding: 10px 14px;
    font-size: 0.85rem;
  }

  @include mobile {
    padding: 8px 12px;
    font-size: 0.75rem;
    backdrop-filter: blur(5px);
  }

  @include small-mobile {
    padding: 6px 10px;
    font-size: 0.7rem;
    gap: 6px;
  }

  .card-text {
    white-space: nowrap;

    @include small-mobile {
      font-size: 0.65rem;
    }
  }

  // Card 1 - Topo centralizado horizontalmente
  &.card-1 {
    top: 20%;
    left: 90%;
    transform: translateX(-50%);
    animation-delay: 0s;

    @include tablet {
      top: 18%;
    }

    @include mobile {
      top: 15%;
      transform: translateX(-50%) scale(0.9);
    }

    @include small-mobile {
      top: 12%;
      transform: translateX(-50%) scale(0.8);
    }
  }

  // Card 2 - Meio centralizado horizontalmente
  &.card-2 {
    top: 10%;
    left: 60%;
    transform: translateX(-50%);
    animation-delay: 2s;

    @include tablet {
      top: 48%;
    }

    @include mobile {
      top: 45%;
      transform: translateX(-50%) scale(0.9);
    }

    @include small-mobile {
      top: 42%;
      transform: translateX(-50%) scale(0.8);
    }
  }

  // Card 3 - Base centralizada horizontalmente
  &.card-3 {
    top: 80%;
    left: 50%;
    transform: translateX(-50%);
    animation-delay: 1s;

    @include tablet {
      top: 78%;
    }

    @include mobile {
      top: 75%;
      transform: translateX(-50%) scale(0.9);
    }

    @include small-mobile {
      top: 72%;
      transform: translateX(-50%) scale(0.8);
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
    @include mobile {
      order: 2;
    }
  }

  .demo-visual {
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

// Utility Classes
.mobile-only {
  display: none !important;

  @include mobile {
    display: flex !important;
  }
}

.desktop-only {
  @include mobile {
    display: none !important;
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

  .floating-card {
    animation-duration: 6s;
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

  // Ajuste final para os cards flutuantes em telas muito pequenas
  .floating-card {
    max-width: 140px;

    .card-text {
      white-space: normal;
      line-height: 1.2;
    }
  }
}

// Ajustes para tablets em modo paisagem
@media (max-height: 600px) and (min-width: #{$mobile}) {
  .floating-card {
    padding: 8px 12px;
    font-size: 0.8rem;
  }
}
</style>
