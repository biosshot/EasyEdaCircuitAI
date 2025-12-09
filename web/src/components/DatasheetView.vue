<template>
  <div class="datasheet-view">
    <div class="search-section">
      <label>Component Name or Part Number</label>
      <div class="input-group">
        <input
          v-model="datasheetComponent"
          type="text"
          placeholder="Enter component name..."
        />
        <button class="generate-btn">Generate</button>
      </div>
    </div>

    <div class="circuit-card">
      <div class="header">
        <Icon name="FileText" size="24" />
        <div>
          <h2>Typical Application Circuit</h2>
          <p>Component: {{ datasheetComponent }}</p>
        </div>
      </div>

      <div class="section">
        <h3>Description</h3>
        <p>{{ datasheetCircuit.description }}</p>
      </div>

      <div class="section">
        <h3>Components Required</h3>
        <div class="components-list">
          <div
            v-for="(comp, index) in datasheetCircuit.components"
            :key="index"
            class="component-item"
          >
            {{ comp }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useAppStore } from '../stores/appStore';
import Icon from '@/components/Icon.vue';

const store = useAppStore();

const datasheetComponent = computed(() => store.datasheetComponent);
const datasheetCircuit = computed(() => store.datasheetCircuit);
</script>

<style scoped>
.datasheet-view {
  padding: 1.5rem;
  background-color: #111827;
  color: white;
}

.search-section {
  margin-bottom: 1.5rem;
}

.search-section label {
  display: block;
  margin-bottom: 0.5rem;
  color: #e2e8f0;
}

.input-group {
  display: flex;
  gap: 0.5rem;
}

.input-group input {
  flex: 1;
  padding: 0.75rem;
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  color: white;
  font-family: inherit;
}

.generate-btn {
  padding: 0.75rem 1.5rem;
  background-color: #16a34a;
  color: white;
  border: none;
  border-radius: 0.5rem;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
}

.generate-btn:hover {
  background-color: #15803d;
}

.circuit-card {
  background-color: #1e293b;
  border-radius: 0.5rem;
  padding: 1.5rem;
  border: 1px solid #334155;
}

.header {
  display: flex;
  align-items: center;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

.header h2 {
  margin: 0;
  color: #e2e8f0;
}

.header p {
  margin: 0;
  color: #94a3b8;
  font-size: 0.9rem;
}

.section {
  margin-bottom: 1.5rem;
}

.section h3 {
  margin-bottom: 0.5rem;
  color: #e2e8f0;
  font-size: 1.1rem;
}

.section p {
  color: #94a3b8;
  line-height: 1.5;
}

.components-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.component-item {
  padding: 0.5rem;
  background-color: #334155;
  border-radius: 0.375rem;
  color: #e2e8f0;
  font-family: monospace;
}
</style>