export type Language = 'zh-CN' | 'en-US'

export type HealthStatus = 'online' | 'offline' | 'checking'

export interface LanguageData {
  title: string
  subtitle: string
  status: string
  switchLanguage: string
}

export interface ConfigExample {
  mcpServers: {
    [key: string]: {
      url: string
      messageUrl: string
      type: string
      headers: {
        [key: string]: string
      }
    }
  }
} 