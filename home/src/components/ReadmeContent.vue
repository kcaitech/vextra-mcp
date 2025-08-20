<template>
  <div class="readme-content">
    <div v-if="loading" class="loading">
      {{ $t('readme.loading') }}
    </div>
    <div v-else class="content-container">
      <div class="markdown-content" v-html="renderedContent"></div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { marked } from 'marked'
import type { Language } from '../types'

const props = defineProps<{
  language: Language
  readmeContent: string
  loading: boolean
}>()

// 配置marked选项
marked.setOptions({
  gfm: true,
  breaks: true,
})

// 渲染Markdown内容
const renderedContent = computed(() => {
  if (!props.readmeContent) return ''
  return marked(props.readmeContent)
})
</script>

<style scoped>
.readme-content {
  min-height: 400px;
}

.loading {
  text-align: center;
  color: white;
  font-size: 1.2rem;
  padding: 2rem;
}

.content-container {
  background: white;
  border-radius: 15px;
  padding: 2rem;
  box-shadow: 0 20px 40px rgba(0,0,0,0.1);
  animation: slideInUp 0.6s ease-out;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.content-container:hover {
  transform: translateY(-5px);
  box-shadow: 0 30px 60px rgba(0,0,0,0.15);
}

.markdown-content :deep(h1) {
  color: #667eea;
  margin-bottom: 1rem;
  font-size: 2.5rem;
  border-bottom: 3px solid #667eea;
  padding-bottom: 0.5rem;
}

.markdown-content :deep(h2) {
  color: #667eea;
  margin: 2rem 0 1rem 0;
  font-size: 1.8rem;
  border-bottom: 2px solid #667eea;
  padding-bottom: 0.5rem;
}

.markdown-content :deep(h3) {
  color: #764ba2;
  margin: 1.5rem 0 0.5rem 0;
  font-size: 1.3rem;
}

.markdown-content :deep(p) {
  margin-bottom: 1rem;
  line-height: 1.6;
  color: #555;
}

.markdown-content :deep(ul),
.markdown-content :deep(ol) {
  margin: 1rem 0;
  padding-left: 2rem;
}

.markdown-content :deep(li) {
  margin-bottom: 0.5rem;
}

.markdown-content :deep(strong) {
  color: #667eea;
}

.markdown-content :deep(em) {
  color: #764ba2;
}

.markdown-content :deep(blockquote) {
  background: #f8f9fa;
  border-left: 4px solid #667eea;
  padding: 1rem;
  margin: 1rem 0;
  border-radius: 4px;
}

.markdown-content :deep(pre) {
  background: #f8f9fa;
  border: 1px solid #e9ecef;
  border-radius: 8px;
  padding: 1rem;
  margin: 1rem 0;
  overflow-x: auto;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
  line-height: 1.4;
}

.markdown-content :deep(code) {
  background: #f1f3f4;
  padding: 0.2rem 0.4rem;
  border-radius: 3px;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  font-size: 0.9rem;
}

.markdown-content :deep(pre code) {
  background: none;
  padding: 0;
}

.markdown-content :deep(table) {
  width: 100%;
  border-collapse: collapse;
  margin: 1rem 0;
}

.markdown-content :deep(th),
.markdown-content :deep(td) {
  padding: 0.5rem;
  border: 1px solid #e9ecef;
  text-align: left;
}

.markdown-content :deep(th) {
  background: #f8f9fa;
  font-weight: bold;
}

@keyframes slideInUp {
  from {
    opacity: 0;
    transform: translateY(50px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 768px) {
  .content-container {
    padding: 1rem;
  }
  
  .markdown-content :deep(h1) {
    font-size: 2rem;
  }
  
  .markdown-content :deep(h2) {
    font-size: 1.5rem;
  }
  
  .markdown-content :deep(h3) {
    font-size: 1.2rem;
  }
  
  .markdown-content :deep(pre) {
    font-size: 0.8rem;
  }
}
</style> 