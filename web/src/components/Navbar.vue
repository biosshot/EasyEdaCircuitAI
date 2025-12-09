<template>
  <div class="navbar">
    <div class="tabs">
      <button :class="['tab', { active: activeTab === 'generate' }]" @click="setActiveTab('generate')">
        <Icon name="Zap" size="20" />
        <span>Generate</span>
      </button>
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
        <Icon name="MessageSquare" size="20" />
        <span>Chat</span>
      </button>
      <button :class="['tab', { active: activeTab === 'settings' }]" @click="setActiveTab('settings')">
        <Icon name="Settings" size="20" />
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
  background-color: #1e293b;
  display: flex;
  /* overflow-x: auto; */
  /* overflow-y: hidden; */
  border-bottom: 1px solid #334155;
  min-height: 44px;
  max-height: 44px;

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

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.logo h1 {
  margin: 0;
  font-size: 1.2rem;
  color: white;
}

.logo p {
  margin: 0;
  font-size: 0.8rem;
  color: #94a3b8;
}

.tabs {
  display: flex;
  gap: 1.5rem;
}

.tab {
  display: flex;
  align-items: center;
  padding: 5px 10px;
  background: transparent;
  border: none;
  color: #94a3b8;
  cursor: pointer;
  font-weight: 500;
}

.tab:hover {
  color: #ffffff;
}

.tab.active {
  color: #16a34a;
  border-bottom: 2px solid #16a34a;
}
</style>