<template>
  <div class="language-switcher">
    <button 
      @click="switchLanguage"
      :class="{ animating: isAnimating }"
      class="switch-btn"
    >
      {{ $t('language.switchTo') }}
    </button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
import type { Language } from '../types'

const props = defineProps<{
  currentLanguage: Language
}>()

const emit = defineEmits<{
  'switch-language': []
}>()

const { locale } = useI18n()
const isAnimating = ref(false)

const switchLanguage = () => {
  isAnimating.value = true
  
  // 切换i18n语言
  locale.value = props.currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN'
  
  // 发出切换事件
  emit('switch-language')
  
  setTimeout(() => {
    isAnimating.value = false
  }, 200)
}
</script>

<style scoped>
.language-switcher {
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
}

.switch-btn {
  padding: 0.5rem 1rem;
  background: rgba(255, 255, 255, 0.2);
  color: white;
  border: none;
  border-radius: 20px;
  cursor: pointer;
  transition: all 0.3s ease;
  font-size: 0.9rem;
  backdrop-filter: blur(10px);
}

.switch-btn:hover {
  background: rgba(255, 255, 255, 0.3);
  transform: translateY(-2px);
}

.switch-btn.animating {
  transform: scale(0.9);
}

@media (max-width: 768px) {
  .language-switcher {
    position: static;
    text-align: center;
    margin-bottom: 1rem;
  }
}
</style> 