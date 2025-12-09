<template>
  <div id="app">
    <Navbar>
      <template #controls v-if="activeTab === 'chat'">
        <ChatControls ref="chatControlsRef" :is-loading="chatViewRef?.isLoading || false" />
      </template>
    </Navbar>

    <main>
      <GenerateView v-if="activeTab === 'generate'" />
      <SearchView v-else-if="activeTab === 'search'" />
      <DatasheetView v-else-if="activeTab === 'datasheet'" />
      <ChatView v-else-if="activeTab === 'chat'" ref="chatViewRef" />
      <SettingsView v-else-if="activeTab === 'settings'" />
    </main>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue';
import { useAppStore } from './stores/appStore.ts';
import Navbar from './components/Navbar.vue';
import GenerateView from './components/GenerateView.vue';
import SearchView from './components/SearchView.vue';
import DatasheetView from './components/DatasheetView.vue';
import ChatView from './components/ChatView.vue';
import ChatControls from './components/ChatControls.vue';
import SettingsView from './components/SettingsView.vue';

const store = useAppStore();
// window.store = store;

const activeTab = computed(() => store.activeTab);
const chatViewRef = ref(null);
const chatControlsRef = ref(null);
</script>

<style>
body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background-color: #0f172a;
  color: white;
}

html,
body {
  margin: 0;
  padding: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  /* блокируем прокрутку на body/html */
}

#app {
  display: flex;
  flex-direction: column;
  height: 100vh;
  /* или 100%, но vh надёжнее */
}

#app>main {
  flex: 1;
  /* занимает всё оставшееся пространство */
  overflow: auto;
  /* прокрутка только внутри main, если нужно */
}

/* === Стили для скроллбара === */

/* Chrome, Edge, Safari */
::-webkit-scrollbar {
  width: 8px;
  height: 8px;
  background: transparent;

}

::-webkit-scrollbar-track {
  background: transparent;
  border-radius: 10px;
}

::-webkit-scrollbar-thumb {
  background: #334155;
  border-radius: 10px;
  border: 2px solid #1e293b;
}

::-webkit-scrollbar-thumb:hover {
  background: #475569;
}

::-webkit-scrollbar-corner {
  background: transparent;
}

/* Дополнительно: при наведении на область прокрутки — улучшаем вид */
*::-webkit-scrollbar-thumb:active {
  background: #6b7280;
}
</style>