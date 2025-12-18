export const isEasyEda = () => !!(window as any).eda;
import { marked } from 'marked'

import hljs from 'highlight.js';

(window as any).hljs = hljs;

marked.use({
    renderer: {
        code({ text, lang }) {
            const code = text;
            const header = `
            <div class="code-header">
                <span>${lang ?? 'plaintext'}</span>
            </div>`;

            if (lang) {
                try {
                    if ((window as any).hljs.getLanguage(lang)) {
                        return `<div class="code-block">${header}<pre><code class="language-${lang} hljs">${(window as any).hljs.highlight(code, { language: lang }).value}</code></pre></div>`;
                    }
                } catch (err) {
                    console.error('Highlight error:', err);
                }
            }

            return `<div class="code-block">${header}<pre><code class="hljs">${(window as any).hljs.highlightAuto(code).value}</code></pre></div>`;
        },
    },
    gfm: true,
    pedantic: false
});

export { marked };

export const showToastMessage = (mes: string, type: "error" | "warn" | "info" | "success" | "question") => isEasyEda() ? eda.sys_Message.showToastMessage(mes, type as ESYS_ToastMessageType) : null