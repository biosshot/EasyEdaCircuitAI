<template>
    <div class="mes-content">
        <template v-if="message.role === 'human'">
            <div v-html="safeHtml"></div>
        </template>
        <template v-else-if="message.role === 'ai'">
            <ComponentViewer v-if="parsedMessage?.type === 'component_search_result'" :result="parsedMessage.result" />
            <CircuitExplainViewer v-else-if="parsedMessage?.type === 'circuit_explain_result'"
                :result="parsedMessage.result" />
            <CircuitAgentResultViewer v-else-if="parsedMessage?.type === 'circuit_agent_result'"
                :result="parsedMessage.result" />
            <PdfFileViewer v-else-if="parsedMessage?.type === 'pdf-file'" :result="parsedMessage.result" />
            <div v-else v-html="fallbackHtml"></div>
        </template>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import DOMPurify from 'dompurify'
import { marked } from '../utils.ts'
import ComponentViewer from './ComponentViewer.vue'
import CircuitExplainViewer from './CircuitExplainViewer.vue'
import CircuitAgentResultViewer from './CircuitAgentResultViewer.vue'
import PdfFileViewer from './PdfFileViewer.vue'

const props = defineProps({
    message: {
        type: Object,
        required: true
    }
})

// Парсим сообщение от ассистента один раз
const parsedMessage = computed(() => {
    if (props.message.role !== 'ai') return null;

    try {
        return JSON.parse(props.message.content);
    } catch (error) {
        return props.message.content;
    }
})

// Безопасный HTML для human-сообщений
const safeHtml = computed(() => {
    if (props.message.role !== 'human') return ''

    const content = marked.parse(props.message.content, { async: false })
    return DOMPurify.sanitize(content, {
        ADD_ATTR: ['target'],
        FORBID_TAGS: ['script', 'style', 'iframe'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick']
    })
})

// Fallback, если парсинг JSON провалился — отображаем как plain text или markdown
const fallbackHtml = computed(() => {
    const html = marked.parse(props.message.content, { async: false })
    return DOMPurify.sanitize(html, {
        ADD_ATTR: ['target'],
        FORBID_TAGS: ['script', 'style', 'iframe'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick']
    })
})
</script>
<style>
.mes-content {
    line-height: 1.6;
    font-size: 1rem;
    /* color: var(--color-text-secondary); */
    /* светлый текст на тёмном фоне */
    word-wrap: break-word;
    overflow-wrap: break-word;
    hyphens: auto;

    max-width: 100%;
    overflow-x: auto;

    /* Стили для заголовков */
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
        margin-top: 1.5em;
        margin-bottom: 0.5em;
        font-weight: bold;
        color: var(--color-text-secondary);
    }

    p {
        margin: 0.5em 0;
    }

    ul,
    ol {
        padding-left: 1.5em;
        margin: 0.5em 0;
    }

    li {
        margin: 0.25em 0;
    }

    pre {
        background: var(--color-background-secondary);
        border: 1px solid var(--color-border);
        padding: 1em;
        border-radius: 0.5rem;
        overflow-x: auto;
        white-space: pre-wrap;
        word-wrap: break-word;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
    }

    code {
        background: var(--color-surface-hover);
        padding: 0.2em 0.4em;
        border-radius: 3px;
        font-family: 'Fira Code', monospace;
        font-size: 0.9rem;
        color: #79c0ff;
    }

    img {
        max-width: 100%;
        height: auto;
        border-radius: 0.5rem;
        margin: 0.5em 0;
    }

    blockquote {
        border-left: 4px solid var(--color-primary);
        padding-left: 1em;
        margin: 0.5em 0;
        color: var(--color-text-tertiary);
        font-style: italic;
    }

    a {
        color: var(--color-primary);
        text-decoration: underline;
    }

    .code-header {
        background: #30363d;
        padding: 0.5em 1em;
        border-top-left-radius: 0.5rem;
        border-top-right-radius: 0.5rem;
        font-size: 0.8rem;
        color: #a1a7b8;
        display: flex;
        align-items: center;
        gap: 0.5em;
    }

    .code-block {
        border-radius: 0.5rem;
        overflow: hidden;
        margin: 0.5em 0;
    }
}
</style>