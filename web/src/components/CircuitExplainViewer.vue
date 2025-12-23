<!-- ComponentViewer.vue -->
<template>
    <div v-html="html"></div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { marked } from '../utils.ts'
import DOMPurify from 'dompurify'

const props = defineProps({
    result: {
        type: String,
        required: true
    }
})

// Fallback, если парсинг JSON провалился — отображаем как plain text или markdown
const html = computed(() => {
    let content = props.result.replace(/\[(.*?)\]/gms, (match, formula) => {
        // Если формула содержит LaTeX символы (например, \), считаем её формулой
        if (formula.includes('\\')) {
            return `\n$$${formula}$$\n`;
        }
        return match; // Иначе оставляем как есть
    });
    const html = marked.parse(content, { async: false })
    return DOMPurify.sanitize(html, {
        ADD_ATTR: ['target'],
        FORBID_TAGS: ['script', 'style', 'iframe'],
        FORBID_ATTR: ['onerror', 'onload', 'onclick']
    })
})

</script>