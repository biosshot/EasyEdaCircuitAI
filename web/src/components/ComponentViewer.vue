<!-- ComponentViewer.vue -->
<template>
    <div class="component-viewer">
        <div v-if="!result" class="empty-message">
            Not found.
        </div>

        <template v-else>
            <div class="result-item">
                <div v-for="(result, idx) in result" :key="idx">
                    <!-- Отображаем bestComponent, если он есть -->
                    <div v-if="result.bestComponent" class="best-component">
                        <h3>Best component</h3>
                        <ComponentCard :component="result.bestComponent" />
                    </div>

                    <!-- Отображаем список components, если onlyBest = false и они есть -->
                    <div v-if="result.components && result.components.length > 0" class="other-components">
                        <h3>Other suitable components ({{ result.components.length }})</h3>
                        <div class="components-grid">
                            <ComponentCard v-for="(comp, cIdx) in result.components" :key="cIdx" :component="comp"
                                class="component-card" />
                        </div>
                    </div>
                </div>
            </div>
        </template>
    </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import ComponentCard from './ComponentCard.vue' // Предполагается, что ты создашь этот компонент
import { isEasyEda } from '../utils';

const props = defineProps({
    result: {
        type: Object,
        required: true
    }
})

console.log(props.result)
</script>

<style scoped>
.component-viewer {
    padding: 16px;
    background-color: #121826;
    border-radius: 8px;
    border: 1px solid #2a3447;
    color: #e0e0e0;
}

.empty-message {
    text-align: center;
    padding: 20px;
    color: #999;
    font-style: italic;
    font-size: 0.95em;
}

.result-item {
    margin-bottom: 24px;
}

.best-component h3,
.other-components h3 {
    font-size: 1.1em;
    margin-top: 0;
    margin-bottom: 12px;
    padding-bottom: 6px;
    border-bottom: 1px solid #2a3447;
    color: #ffffff;
}

.best-component h3 {
    color: #4caf50;
}

.other-components h3 {
    color: #64b5f6;
}

.components-grid {
    display: grid;
    grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
    gap: 16px;
}
</style>