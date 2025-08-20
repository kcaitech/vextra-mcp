<template>
  <header class="header">
    <h1 class="title">
      🚀 {{ $t('header.title') }}
    </h1>
    <p class="subtitle">
      {{ $t('header.subtitle') }}
    </p>
  </header>
</template>

<script setup lang="ts">
import type { Language } from '../types'

const props = defineProps<{
  language: Language
}>()

defineEmits<{
  'check-health': []
}>()

</script>

<style scoped>
.header {
  text-align: center;
  padding: 3rem 2rem;
  color: white;
}

.title {
  font-size: 3rem;
  margin-bottom: 1rem;
  text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
  animation: fadeInUp 0.8s ease-out;
}

.subtitle {
  font-size: 1.2rem;
  opacity: 0.9;
  margin-bottom: 2rem;
  animation: fadeInUp 0.8s ease-out 0.2s both;
}


.refresh-btn {
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 1rem;
  padding: 0.2rem;
  border-radius: 3px;
  transition: background 0.3s ease;
}

.refresh-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

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

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: 0.5;
  }
}

@media (max-width: 768px) {
  .header {
    padding: 2rem 1rem;
  }
  
  .title {
    font-size: 2rem;
  }
  
  .subtitle {
    font-size: 1rem;
  }
}
</style> 