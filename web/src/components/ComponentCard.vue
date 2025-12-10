<!-- ComponentCard.vue -->
<template>
  <div class="component-card">
    <h4>{{ component.name }}</h4>
    <p><strong>Производитель:</strong> {{ component.manufacturer }}</p>
    <p><strong>Цена:</strong> {{ component.price.toFixed(2) }} $</p>
    <p>{{ component.description }}</p>

    <div v-if="component.datasheet" class="datasheet-link">
      <a :href="component.datasheet" target="_blank" rel="noopener">Документация (datasheet)</a>
    </div>

    <details class="pins-details">
      <summary>Выводы ({{ component.pins.length }})</summary>
      <ul class="pins-list">
        <li v-for="(pin, i) in component.pins" :key="i" class="pin-item">
          <strong>{{ pin.pin_number }} ({{ pin.name }})</strong> — {{ pin.type }}<br />
          <em>{{ pin.description }}</em>
        </li>
      </ul>
    </details>

    <button v-if="isEasyEdaActive" @click="placeComponent" class="place-button">Place</button>
  </div>
</template>

<script setup>
import { defineProps, computed } from 'vue'
import { isEasyEda } from '../utils'

const props = defineProps({
  component: {
    type: Object,
    required: true,
    validator: (obj) => {
      return ['name', 'manufacturer', 'price', 'description', 'pins', 'partUuid'].every(k => k in obj)
    }
  }
})

const isEasyEdaActive = computed(() => isEasyEda())

const placeComponent = async () => {
  try {
    await eda.sch_PrimitiveComponent.placeComponentWithMouse({
      libraryUuid: 'lcsc',
      uuid: props.component.partUuid
    })
  } catch (error) {
    console.error('Error placing component:', error)
  }
}
</script>

<style scoped>
.component-card {
  background-color: #161b22;
  border: 1px solid #30363d;
  border-radius: 8px;
  padding: 16px;
  color: #ececf1;
  transition: border-color 0.2s ease;
}

.component-card:hover {
  border-color: #10a37f;
}

.component-card h4 {
  margin-top: 0;
  margin-bottom: 8px;
  color: #ececf1;
  font-weight: 600;
}

.component-card p {
  margin: 4px 0;
  line-height: 1.4;
}

.datasheet-link {
  margin-top: 12px;
}

.datasheet-link a {
  color: #10a37f;
  text-decoration: none;
  font-weight: 500;
}

.datasheet-link a:hover {
  text-decoration: underline;
}

.pins-details summary {
  cursor: pointer;
  margin-top: 12px;
  padding: 8px;
  background-color: #30363d;
  border-radius: 4px;
  color: #ececf1;
  font-weight: 500;
  transition: background-color 0.2s;
}

.pins-details summary:hover {
  background-color: #40454f;
}

.pins-list {
  list-style: none;
  padding-left: 0;
  margin-top: 8px;
  background-color: #161b22;
  border-radius: 4px;
  padding: 8px;
}

.pin-item {
  margin-bottom: 8px;
  padding: 8px;
  border-left: 3px solid #10a37f;
  background-color: #30363d;
  border-radius: 4px;
}

.pin-item strong {
  color: #ececf1;
}

.pin-item em {
  display: block;
  margin-top: 4px;
  font-size: 0.9em;
  color: #a1a7b8;
}

.place-button {
  margin-top: 12px;
  width: 100%;
  padding: 10px;
  background-color: #4caf50;
  color: #ffffff;
  border: none;
  border-radius: 4px;
  font-weight: 600;
  cursor: pointer;
  transition: background-color 0.2s;
}

.place-button:hover {
  background-color: #45a049;
}

.place-button:active {
  background-color: #3d8b40;
}
</style>