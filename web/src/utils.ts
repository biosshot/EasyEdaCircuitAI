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
                        return `<div class="code-block">${header}<pre><code class="language-${lang} hljs">${window.hljs.highlight(code, { language: lang }).value}</code></pre></div>`;
                    }
                } catch (err) {
                    console.error('Highlight error:', err);
                }
            }

            return `<div class="code-block">${header}<pre><code class="hljs">${window.hljs.highlightAuto(code).value}</code></pre></div>`;
        },
    },
    gfm: true,
    pedantic: false
});

export { marked }