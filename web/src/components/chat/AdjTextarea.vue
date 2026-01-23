<template>
    <textarea ref="textarea" v-model="model" :placeholder="props.placeholder" @keydown="onTextareaKeydown"></textarea>
</template>

<script setup lang="ts">
import { nextTick, ref, watch } from 'vue';

const model = defineModel<string>();

const props = defineProps<{ placeholder: string }>();
const textarea = ref<HTMLInputElement | null>(null);
const emit = defineEmits(['enter'])

function adjustTextareaHeight() {
    const textarea_ = textarea.value;
    if (!textarea_) return;

    textarea_.style.height = 'auto';
    const newHeight = Math.min(textarea_.scrollHeight, 300);
    textarea_.style.height = `${newHeight}px`;
}

function onTextareaKeydown(e: KeyboardEvent) {
    if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault();
        emit('enter');
    }
}

watch(model, () => {
    nextTick(() => adjustTextareaHeight())
});

</script>

<style scoped>
textarea {
    flex: 1;
    padding: 0.1rem;
    background-color: transparent;
    border: none;
    color: var(--color-text);
    font-size: 16px;
    max-height: 240px;
    resize: none;
    overflow: auto;
    outline: none;
    line-height: 1.2;
}

textarea:focus {
    border-color: var(--color-primary);
}

textarea[disabled] {
    background-color: var(--color-background);
    opacity: 0.9;
}
</style>