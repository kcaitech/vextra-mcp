import fs from 'fs';
import path from 'path';

// 异步初始化 marked
async function initMarked() {
    const { marked } = await import('marked');
    
    // 配置 marked 选项
    marked.setOptions({
        gfm: true, // GitHub Flavored Markdown
        breaks: true, // 允许换行
    });
    
    return marked;
}

// 生成完整的 HTML 页面
export async function generateHTMLFromMarkdown(markdown: string, language: string): Promise<string> {
    const marked = await initMarked();
    const htmlContent = marked(markdown);
    
    return `<!DOCTYPE html>
<html lang="${language}">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Vextra MCP Server</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif;
            line-height: 1.6;
            color: #333;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            min-height: 100vh;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 2rem;
        }

        .header {
            text-align: center;
            margin-bottom: 3rem;
            color: white;
        }

        .header h1 {
            font-size: 3rem;
            margin-bottom: 1rem;
            text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
        }

        .header p {
            font-size: 1.2rem;
            opacity: 0.9;
        }

        .content {
            background: white;
            border-radius: 15px;
            padding: 2rem;
            box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            margin-bottom: 2rem;
        }

        .content h1 {
            color: #667eea;
            margin-bottom: 1rem;
            font-size: 2.5rem;
            border-bottom: 3px solid #667eea;
            padding-bottom: 0.5rem;
        }

        .content h2 {
            color: #667eea;
            margin: 2rem 0 1rem 0;
            font-size: 1.8rem;
            border-bottom: 2px solid #667eea;
            padding-bottom: 0.5rem;
        }

        .content h3 {
            color: #764ba2;
            margin: 1.5rem 0 0.5rem 0;
            font-size: 1.3rem;
        }

        .content p {
            margin-bottom: 1rem;
        }

        .content ul, .content ol {
            margin: 1rem 0;
            padding-left: 2rem;
        }

        .content li {
            margin-bottom: 0.5rem;
        }

        .content strong {
            color: #667eea;
        }

        .content em {
            color: #764ba2;
        }

        .content blockquote {
            background: #f8f9fa;
            border-left: 4px solid #667eea;
            padding: 1rem;
            margin: 1rem 0;
            border-radius: 4px;
        }

        .content pre {
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

        .content code {
            background: #f1f3f4;
            padding: 0.2rem 0.4rem;
            border-radius: 3px;
            font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
            font-size: 0.9rem;
        }

        .content pre code {
            background: none;
            padding: 0;
        }

        .language-switcher {
            position: fixed;
            top: 20px;
            right: 20px;
            z-index: 1000;
        }

        .language-switcher a {
            display: inline-block;
            padding: 0.5rem 1rem;
            background: rgba(255, 255, 255, 0.2);
            color: white;
            text-decoration: none;
            border-radius: 20px;
            margin-left: 0.5rem;
            transition: background 0.3s;
        }

        .language-switcher a:hover {
            background: rgba(255, 255, 255, 0.3);
        }

        .language-switcher a.active {
            background: rgba(255, 255, 255, 0.4);
            font-weight: bold;
        }

        /* 语法高亮样式 */
        .language-json {
            color: #d63384;
        }

        .language-bash {
            color: #0d6efd;
        }

        /* 响应式设计 */
        @media (max-width: 768px) {
            .container {
                padding: 1rem;
            }
            
            .header h1 {
                font-size: 2rem;
            }
            
            .content {
                padding: 1rem;
            }
            
            .language-switcher {
                position: static;
                text-align: center;
                margin-bottom: 1rem;
            }
        }
    </style>
</head>
<body>
    <div class="language-switcher">
        <a href="/?lang=zh-CN" ${language === 'zh-CN' ? 'class="active"' : ''}>中文</a>
        <a href="/?lang=en-US" ${language === 'en-US' ? 'class="active"' : ''}>English</a>
    </div>

    <div class="container">
        <div class="header">
            <h1>🚀 Vextra MCP Server</h1>
            <p>Model Context Protocol File Server</p>
        </div>

        <div class="content">
            ${htmlContent}
        </div>
    </div>
</body>
</html>`;
}

// 读取 Markdown 文件并渲染为 HTML
export async function renderMarkdownFile(filename: string, language: string): Promise<string> {
    try {
        const filePath = path.join(process.cwd(), filename);
        const markdown = fs.readFileSync(filePath, 'utf-8');
        return await generateHTMLFromMarkdown(markdown, language);
    } catch (error) {
        console.error(`Error reading markdown file ${filename}:`, error);
        return await generateHTMLFromMarkdown('# Error\n\nFailed to load content.', language);
    }
} 