<template>
  <component style="margin: 6px;" :is="iconComponent" :size="props.size ?? 24" :color="props.color" />
</template>

<script setup lang="ts">
import { computed, FunctionalComponent } from 'vue';
import { CircleAlert, RotateCw, Play, Zap, Cpu, CircleStop, User, Send, FileText, Search, MessageSquare, BoxSelect, AudioWaveform, Settings, PauseCircle, Plus, History, X, Trash2, SendHorizonal, ListRestart, ChevronUp, ChevronDown, Check, Replace, CircleCheckBig, Pencil } from 'lucide-vue-next';

const icons: Record<string, FunctionalComponent> = {
  Zap, Cpu, User, Send, FileText, Search, MessageSquare,
  BoxSelect, AudioWaveform, Settings, PauseCircle, Plus,
  History, X, Trash2, SendHorizonal, CircleStop, ListRestart,
  ChevronUp, ChevronDown, Check, Play, CircleAlert, RotateCw, Replace,
  CircleCheckBig, Pencil
};

const props = defineProps<{ name: string, color?: string, size?: number | string }>();

const iconComponent = computed(() => {
  if (icons[props.name]) return icons[props.name];
  console.warn("Not found Icon", props.name, icons);
  return icons.Zap;
});
</script>
