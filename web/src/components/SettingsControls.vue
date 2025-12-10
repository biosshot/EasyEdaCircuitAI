<template>
    <div class="controls-wrapper">
        <button class="control-btn" :disabled="newChatDisabled" @click="resetSettings"
            title="Reset settings to default">
            <Icon name="ListRestart" size="14" />
        </button>
    </div>
</template>

<script setup>

import Icon from './Icon.vue';
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore();

const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        settingsStore.resetSettings();
    }
};

</script>

<style scoped>
.controls-wrapper {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    position: relative;
}

.control-btn {
    /* padding: 0.35rem 0.4rem; */
    background-color: transparent;
    border: none;
    color: var(--color-text-on-surface);
    border-radius: 0.3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    min-width: 25px;
    /* max-width: 22px; */
    height: 25px;
}

.control-btn:hover:not(:disabled) {
    background-color: var(--color-surface-active);
    border-color: var(--color-text-tertiary);
}

.control-btn:disabled {
    opacity: 0.4;
    /* cursor: not-allowed; */
}

.chat-history-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: var(--color-background-secondary);
    border: 1px solid var(--color-border);
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    width: 280px;
    max-height: calc(100vh - 150px);
    display: flex;
    flex-direction: column;
    margin-top: 0.25rem;
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid var(--color-border);
}

.history-header h3 {
    margin: 0;
    font-size: 0.9rem;
    color: var(--color-text);
}

.close-btn {
    background: none;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
}

.close-btn:hover {
    color: var(--color-text);
}

.history-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.empty-history {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: var(--color-text-muted);
    font-size: 0.85rem;
}

.history-item {
    display: flex;
    gap: 0.25rem;
    align-items: center;
}

.history-item-content {
    flex: 1;
    padding: 0.4rem 0.5rem;
    background-color: var(--color-background);
    border: 1px solid var(--color-border);
    border-radius: 0.3rem;
    color: var(--color-text);
    cursor: pointer;
    text-align: left;
    font-size: 0.8rem;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.4rem;
    min-width: 0;
}

.history-item-content:hover {
    background-color: var(--color-background-secondary);
    border-color: var(--color-surface-active);
}

.history-item-content.active {
    background-color: var(--color-primary);
    border-color: var(--color-primary);
    color: var(--color-text-on-primary);
}

.history-item-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
}

.history-item-count {
    font-size: 0.7rem;
    color: inherit;
    opacity: 0.7;
    flex-shrink: 0;
}

.delete-btn {
    padding: 0.2rem;
    background-color: transparent;
    border: none;
    color: var(--color-text-tertiary);
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.delete-btn:hover:not(:disabled) {
    background-color: var(--color-error);
    color: var(--color-text-on-primary);
}

.delete-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.history-footer {
    padding: 0.5rem;
    border-top: 1px solid var(--color-border);
}

.clear-all-btn {
    width: 100%;
    padding: 0.4rem;
    background-color: var(--color-error);
    border: 1px solid var(--color-error);
    color: var(--color-text-on-primary);
    border-radius: 0.3rem;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s ease;
}

.clear-all-btn:hover {
    background-color: #ff6b6b;
    border-color: var(--color-error);
    color: var(--color-text-on-primary);
}
</style>
