<template>
  <q-page class="about-page">
    <!-- Header Hero Section -->
    <div class="hero-section bg-primary text-white">
      <div class="container">
        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <h1 class="hero-title text-h2 text-weight-bold">Sobre o BeautyTime</h1>
            <p class="hero-subtitle text-h6 q-mt-md">
              Revolucionando a forma como você cuida da sua beleza e bem-estar
            </p>
            <div class="hero-stats row q-mt-xl">
              <div class="col-4 text-center">
                <div class="stat-number text-h4 text-weight-bold">10K+</div>
                <div class="stat-label">Clientes Satisfeitos</div>
              </div>
              <div class="col-4 text-center">
                <div class="stat-number text-h4 text-weight-bold">500+</div>
                <div class="stat-label">Profissionais</div>
              </div>
              <div class="col-4 text-center">
                <div class="stat-number text-h4 text-weight-bold">50+</div>
                <div class="stat-label">Cidades</div>
              </div>
            </div>
          </div>
          <div class="col-12 col-md-6">
            <q-img
              src="https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&h=400&fit=crop"
              alt="Sobre o BeautyTime"
              class="hero-image"
              :style="imageStyle"
            >
              <template v-slot:error>
                <div class="flex flex-center column text-white">
                  <q-icon name="spa" size="xl" />
                  <div class="text-h6 q-mt-md">BeautyTime</div>
                </div>
              </template>
            </q-img>
          </div>
        </div>
      </div>
    </div>

    <!-- Mission Section -->
    <section class="mission-section q-pa-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title text-h3 text-weight-bold text-primary">Nossa Missão</h2>
          <q-separator
            class="q-mx-auto"
            style="max-width: 100px; height: 3px; background: #ef4444"
          />
        </div>

        <div class="row q-col-gutter-xl">
          <div class="col-12 col-md-4" v-for="(item, index) in missionItems" :key="index">
            <q-card class="mission-card text-center" flat bordered>
              <q-card-section>
                <q-icon :name="item.icon" size="xl" :color="item.color" />
                <h3 class="text-h6 q-mt-md text-weight-bold">{{ item.title }}</h3>
                <p class="q-mt-sm">{{ item.description }}</p>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Team Section -->
    <section class="team-section bg-grey-2 q-pa-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title text-h3 text-weight-bold text-primary">Nossa Equipe</h2>
          <p class="text-h6 text-grey-7">Conheça os profissionais por trás do BeautyTime</p>
        </div>

        <div class="row q-col-gutter-xl justify-center">
          <div class="col-12 col-sm-6 col-md-3" v-for="(member, index) in teamMembers" :key="index">
            <q-card class="team-card text-center">
              <q-card-section>
                <q-avatar size="100px" class="q-mb-md">
                  <q-icon name="account_circle" size="xl" />
                </q-avatar>
                <h3 class="text-h6 text-weight-bold">{{ member.name }}</h3>
                <p class="text-caption text-blue-8">{{ member.role }}</p>
                <p class="text-caption text-grey-7">{{ member.bio }}</p>
                <div class="q-mt-md">
                  <q-btn
                    v-for="(social, socialIndex) in member.socials"
                    :key="socialIndex"
                    round
                    size="sm"
                    :color="social.color"
                    :icon="social.icon"
                    class="q-mx-xs"
                  >
                    <q-tooltip>{{ social.name }}</q-tooltip>
                  </q-btn>
                </div>
              </q-card-section>
            </q-card>
          </div>
        </div>
      </div>
    </section>

    <!-- Values Section -->
    <section class="values-section q-pa-xl">
      <div class="container">
        <div class="text-center q-mb-xl">
          <h2 class="section-title text-h3 text-weight-bold text-primary">Nossos Valores</h2>
        </div>

        <div class="row items-center q-col-gutter-xl">
          <div class="col-12 col-md-6">
            <q-img 
              src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=500&h=400&fit=crop" 
              alt="Nossos Valores" 
              class="values-image" 
            />
          </div>
          <div class="col-12 col-md-6">
            <div class="value-item q-mb-xl" v-for="(value, index) in values" :key="index">
              <div class="row items-center">
                <div class="col-auto">
                  <q-icon :name="value.icon" size="md" color="primary" />
                </div>
                <div class="col">
                  <h3 class="text-h6 text-weight-bold q-mb-xs">{{ value.title }}</h3>
                  <p class="text-grey-7">{{ value.description }}</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="cta-section bg-primary text-white text-center q-pa-xl">
      <div class="container">
        <h2 class="text-h3 text-weight-bold q-mb-md">
          Pronto para transformar sua experiência de beleza?
        </h2>
        <p class="text-h6 q-mb-xl">
          Junte-se a milhares de clientes satisfeitos e descubra a melhor versão de você
        </p>
        <div class="q-gutter-md">
          <q-btn
            color="white"
            text-color="primary"
            label="Começar Agora"
            to="/auth"
            size="lg"
            no-caps
          />
          <q-btn outline color="white" label="Saber Mais" to="/services" size="lg" no-caps />
        </div>
      </div>
    </section>
  </q-page>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const imageStyle = computed(() => ({
  maxWidth: '100%',
  height: 'auto',
  borderRadius: '16px',
}));

const missionItems = [
  {
    icon: 'accessibility',
    color: 'green',
    title: 'Acessibilidade',
    description:
      'Tornar os serviços de beleza acessíveis para todos, com preços justos e opções variadas.',
  },
  {
    icon: 'auto_awesome',
    color: 'pink',
    title: 'Qualidade',
    description:
      'Garantir os mais altos padrões de qualidade em todos os serviços e profissionais.',
  },
  {
    icon: 'diversity_3',
    color: 'blue',
    title: 'Comunidade',
    description: 'Construir uma comunidade onde beleza e bem-estar andam de mãos dadas.',
  },
];

const teamMembers = [
  {
    name: 'Ana Silva',
    role: 'CEO & Fundadora',
    bio: 'Especialista em empreendedorismo com paixão por beleza e tecnologia.',
    socials: [
      { icon: 'fab fa-linkedin', color: 'blue', name: 'LinkedIn' },
      { icon: 'fab fa-twitter', color: 'light-blue', name: 'Twitter' },
    ],
  },
  {
    name: 'Carlos Santos',
    role: 'CTO',
    bio: 'Desenvolvedor experiente focado em criar soluções inovadoras.',
    socials: [
      { icon: 'fab fa-github', color: 'dark', name: 'GitHub' },
      { icon: 'fab fa-linkedin', color: 'blue', name: 'LinkedIn' },
    ],
  },
  {
    name: 'Marina Oliveira',
    role: 'Head de Marketing',
    bio: 'Estrategista digital com expertise em branding e growth.',
    socials: [
      { icon: 'fab fa-instagram', color: 'pink', name: 'Instagram' },
      { icon: 'fab fa-twitter', color: 'light-blue', name: 'Twitter' },
    ],
  },
  {
    name: 'João Pereira',
    role: 'Lead Designer',
    bio: 'Designer UX/UI com foco em experiências memoráveis.',
    socials: [
      { icon: 'fab fa-behance', color: 'blue-9', name: 'Behance' },
      { icon: 'fab fa-dribbble', color: 'pink', name: 'Dribbble' },
    ],
  },
];

const values = [
  {
    icon: 'verified',
    title: 'Transparência',
    description: 'Acreditamos na honestidade e clareza em todas as nossas relações.',
  },
  {
    icon: 'innovation',
    title: 'Inovação',
    description: 'Buscamos constantemente novas formas de melhorar a experiência dos usuários.',
  },
  {
    icon: 'diversity',
    title: 'Diversidade',
    description: 'Celebramos a diversidade e promovemos um ambiente inclusivo para todos.',
  },
  {
    icon: 'eco',
    title: 'Sustentabilidade',
    description: 'Comprometidos com práticas sustentáveis e responsabilidade ambiental.',
  },
];
</script>

<style lang="scss" scoped>
.about-page {
  padding: 0;
}

.hero-section {
  padding: 80px 0;
  background: linear-gradient(135deg, #1976d2 0%, #0d47a1 100%);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 16px;
}

.hero-title {
  font-size: clamp(2rem, 5vw, 3.5rem);
  line-height: 1.2;
}

.hero-subtitle {
  opacity: 0.9;
  font-weight: 400;
}

.hero-stats {
  .stat-number {
    color: #ffd700;
  }

  .stat-label {
    font-size: 0.9rem;
    opacity: 0.8;
    margin-top: 8px;
  }
}

.hero-image {
  border-radius: 20px;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
}

.section-title {
  margin-bottom: 16px;
}

.mission-card {
  transition:
    transform 0.3s ease,
    box-shadow 0.3s ease;
  height: 100%;

  &:hover {
    transform: translateY(-5px);
    box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
  }
}

.team-card {
  transition: transform 0.3s ease;

  &:hover {
    transform: translateY(-8px);
  }
}

.values-image {
  border-radius: 16px;
  box-shadow: 0 15px 35px rgba(0, 0, 0, 0.1);
  height: 400px;
  object-fit: cover;
}

.cta-section {
  padding: 80px 0;
}

.value-item {
  padding: 20px;
  border-left: 4px solid #1976d2;
  background: rgba(25, 118, 210, 0.05);
  border-radius: 8px;
}

// Responsividade
@media (max-width: 768px) {
  .hero-section {
    padding: 60px 0;
    text-align: center;
  }

  .hero-stats {
    .col-4 {
      margin-bottom: 20px;
    }
  }

  .mission-section,
  .team-section,
  .values-section {
    padding: 40px 0;
  }

  .cta-section {
    padding: 60px 0;
  }

  .values-image {
    height: 300px;
  }
}

@media (max-width: 480px) {
  .container {
    padding: 0 12px;
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1.1rem;
  }

  .team-card {
    margin-bottom: 20px;
  }

  .values-image {
    height: 250px;
  }
}

// Animações
.hero-image {
  animation: float 6s ease-in-out infinite;
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

// Modo escuro
.body--dark {
  .mission-card,
  .team-card {
    background: #1e1e1e;
    border-color: #333;
  }

  .value-item {
    background: rgba(25, 118, 210, 0.1);
    border-left-color: #1976d2;
  }
}
</style>