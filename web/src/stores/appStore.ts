import { defineStore } from 'pinia';

export const useAppStore = defineStore('app', {
    state: () => ({
        activeTab: 'generate',
    }),
    actions: {
        setActiveTab(tab: string) {
            this.activeTab = tab;
        },
    }
});