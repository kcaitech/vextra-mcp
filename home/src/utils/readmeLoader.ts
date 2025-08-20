import type { Language } from '../types'

/**
 * 加载README文件内容
 * @param language 语言类型
 * @returns README内容
 */
export async function loadReadmeContent(language: Language): Promise<string> {
  const filename = language === 'en-US' ? 'README-en.md' : 'README-zh.md'
  
  try {
    const baseUrl = import.meta.env.VITE_BASE_URL ?? ''
    // 从服务器根目录加载README文件
    const response = await fetch(`${baseUrl}/${filename}`)
    if (!response.ok) {
      throw new Error(`Failed to load ${filename}: ${response.status}`)
    }
    
    const content = await response.text()
    return content
  } catch (error) {
    console.error('Error loading README:', error)
    // 返回默认错误内容
    return language === 'zh-CN' 
      ? '## 错误\n\n无法加载README文件内容。'
      : '## Error\n\nFailed to load README content.'
  }
} 