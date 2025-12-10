<template>
  <div class="navbar">
    <div class="tabs">
      <!-- <button :class="['tab', { active: activeTab === 'generate' }]" @click="setActiveTab('generate')">
        <Icon name="Zap" size="20" />
        <span>Generate</span>
      </button> -->
      <!-- <button
        :class="['tab', { active: activeTab === 'search' }]"
        @click="setActiveTab('search')"
      >
        <Icon name="Search" size="20" />
        <span>Search</span>
      </button> -->
      <!-- <button
        :class="['tab', { active: activeTab === 'datasheet' }]"
        @click="setActiveTab('datasheet')"
      >
        <Icon name="FileText" size="20" />
        <span>Datasheet</span>
      </button> -->
      <button :class="['tab', { active: activeTab === 'chat' }]" @click="setActiveTab('chat')">
        <Icon name="MessageSquare" size="14" />
        <span>Chat</span>
      </button>
      <button :class="['tab', { active: activeTab === 'settings' }]" @click="setActiveTab('settings')">
        <Icon name="Settings" size="14" />
        <span>Settings</span>
      </button>
    </div>

    <!-- Chat controls in navbar when chat is active -->
    <div class="nav-controls" @click.stop>
      <slot name="controls"></slot>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '../stores/appStore';
import Icon from '@/components/Icon.vue';

const store = useAppStore();

const activeTab = computed(() => store.activeTab);

const setActiveTab = (tab) => {
  store.setActiveTab(tab);
};
</script>

<style scoped>
.navbar {
  background-color: var(--color-background);
  display: flex;
  /* overflow-x: auto; */
  /* overflow-y: hidden; */
  border-bottom: 1px solid var(--color-border);
  min-height: 32px;
  max-height: 32px;

  align-items: center;
}

.nav-controls {
  display: flex;
  align-items: center;
  /* width: 100%; */
  margin-left: auto;
  padding: 0.5rem;
  gap: 0.5rem;
}

.tabs {
  display: flex;
  gap: 1.5rem;
}

.tab {
  display: flex;
  align-items: center;
  padding: 2px 10px;
  background: transparent;
  border: none;
  color: var(--color-text-tertiary);
  cursor: pointer;
  font-weight: 500;
}

.tab:hover {
  color: var(--color-text);
}

.tab.active {
  color: var(--color-primary);
  border-bottom: 2px solid var(--color-primary);
}
</style>