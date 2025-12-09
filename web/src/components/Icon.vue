<template>
  <component style="margin: 6px;" :is="iconComponent" :size="size" :color="color" />
</template>

<script setup>
import { defineAsyncComponent, computed } from 'vue';
import { Zap, Cpu, User, Send, FileText, Search, MessageSquare, BoxSelect, AudioWaveform, Settings, PauseCircle, Plus, History, X, Trash2 } from 'lucide-vue-next';
const icons = { Zap, Cpu, User, Send, FileText, Search, MessageSquare, BoxSelect, AudioWaveform, Settings, PauseCircle, Plus, History, X, Trash2 };

const props = defineProps({
  name: {
    type: String,
    required: true
  },
  size: {
    type: [String, Number],
    default: 24
  },
  color: {
    type: String,
    default: 'currentColor'
  }
});

const iconComponent = computed(() => {
  if (icons[props.name]) return icons[props.name];
  console.warn("Not found Icon", props.name, icons);
  return icons.Zap; // fallback
});
</script>