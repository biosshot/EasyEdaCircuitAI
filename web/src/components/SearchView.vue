<template>
  <div class="search-view">
    <div class="search-bar">
      <Icon name="Search" size="20" />
      <input v-model="searchQuery" type="text" placeholder="Search components..." />
    </div>

    <div class="results">
      <div v-for="item in searchResults" :key="item.partNumber" class="result-card">
        <div class="left">
          <div class="part-number">{{ item.partNumber }}</div>
          <div class="package">{{ item.package }}</div>
          <div class="description">{{ item.description }}</div>
          <div class="manufacturer">{{ item.manufacturer }}</div>
        </div>
        <div class="right">
          <div class="price">{{ item.price }}</div>
          <div class="stock">Stock: {{ item.stock }}</div>
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

const searchQuery = computed(() => store.searchQuery);
const searchResults = computed(() => store.searchResults);
</script>

<style scoped>
.search-view {
  padding: 1.5rem;
  background-color: #111827;
  color: white;
}

.search-bar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.75rem;
  background-color: #1e293b;
  border: 1px solid #334155;
  border-radius: 0.5rem;
  margin-bottom: 1.5rem;
}

.search-bar input {
  flex: 1;
  background: transparent;
  border: none;
  color: white;
  font-family: inherit;
}

.search-bar input:focus {
  outline: none;
}

.results {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.result-card {
  display: flex;
  justify-content: space-between;
  padding: 1rem;
  background-color: #1e293b;
  border-radius: 0.5rem;
  border: 1px solid #334155;
}

.left {
  flex: 1;
}

.part-number {
  font-weight: 600;
  font-size: 1.1rem;
  color: #e2e8f0;
}

.package {
  background-color: #334155;
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.8rem;
  display: inline-block;
  margin-right: 0.5rem;
}

.description {
  margin-top: 0.5rem;
  color: #94a3b8;
  font-size: 0.9rem;
}

.manufacturer {
  margin-top: 0.25rem;
  color: #64748b;
  font-size: 0.8rem;
}

.right {
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  justify-content: space-between;
}

.price {
  font-weight: 600;
  color: #16a34a;
  font-size: 1.1rem;
}

.stock {
  color: #64748b;
  font-size: 0.8rem;
}
</style>