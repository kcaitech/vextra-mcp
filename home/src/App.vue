<template>
  <div class="app">
    <LanguageSwitcher 
      :current-language="currentLanguage"
      @switch-language="switchLanguage"
    />
    
    <Header 
      :language="currentLanguage"
    />
    
    <main class="main-content">
      <ReadmeContent 
        :language="currentLanguage"
        :readme-content="readmeContent"
        :loading="isLoading"
      />
    </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useI18n } from 'vue-i18n'
import LanguageSwitcher from './components/LanguageSwitcher.vue'
import Header from './components/Header.vue'
import ReadmeContent from './components/ReadmeContent.vue'
import { loadReadmeContent } from './utils/readmeLoader'
import type { Language } from './types'

const { locale, t } = useI18n()
const currentLanguage = ref<Language>((() => {
    const currentLanguage = navigator.language
    if (currentLanguage.includes('zh')) {
        return 'zh-CN'
    } else {
        return 'en-US'
    }
})())
const readmeContent = ref<string>('')
const isLoading = ref<boolean>(true)

// 切换语言
const switchLanguage = () => {
  currentLanguage.value = currentLanguage.value === 'zh-CN' ? 'en-US' : 'zh-CN'
  locale.value = currentLanguage.value
  loadReadme()
}

// 加载README内容
const loadReadme = async () => {
  isLoading.value = true
  try {
    const content = await loadReadmeContent(currentLanguage.value)
    readmeContent.value = content
  } catch (error) {
    console.error('Failed to load README:', error)
    readmeContent.value = `## ${t('common.error')}\n\n${t('readme.loadError')}`
  } finally {
    isLoading.value = false
  }
}

// 组件挂载时初始化
onMounted(() => {
  // 初始化i18n语言
  locale.value = currentLanguage.value
  loadReadme()
})
</script>

<style scoped>
.app {
  min-height: 100vh;
}

.main-content {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 2rem 2rem;
}

@media (max-width: 768px) {
  .main-content {
    padding: 0 1rem 1rem;
  }
}
</style> 