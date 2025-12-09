import { defineStore } from 'pinia';
import { defaultStorage } from './storage';

export interface LLMSettings {
    apiProvider: 'openai' | 'anthropic' | 'custom';
    apiKey: string;
    apiUrl: string;
    model: string;
}

const SETTINGS_STORAGE_KEY = 'llm_settings';

const defaultSettings: LLMSettings = {
    apiProvider: 'openai',
    apiKey: '',
    apiUrl: 'https://api.openai.com/v1',
    model: 'gpt-4',
};

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        settings: { ...defaultSettings } as LLMSettings,
    }),

    getters: {
        getLLMSettings: (state) => state.settings,
        getApiKey: (state) => state.settings.apiKey,
        getApiProvider: (state) => state.settings.apiProvider,
    },

    actions: {
        initSettings() {
            const stored = defaultStorage.getItem(SETTINGS_STORAGE_KEY);
            if (stored) {
                try {
                    this.settings = JSON.parse(stored);
                } catch (e) {
                    console.error('Failed to parse settings from storage:', e);
                    this.settings = { ...defaultSettings };
                }
            } else {
                this.settings = { ...defaultSettings };
            }
        },

        updateSettings(newSettings: Partial<LLMSettings>) {
            this.settings = { ...this.settings, ...newSettings };
            this.saveSettings();
        },

        setApiProvider(provider: 'openai' | 'anthropic' | 'custom') {
            this.settings.apiProvider = provider;
            // Установить URL по умолчанию для провайдера
            if (provider === 'openai') {
                this.settings.apiUrl = 'https://api.openai.com/v1';
                this.settings.model = 'gpt-4';
            } else if (provider === 'anthropic') {
                this.settings.apiUrl = 'https://api.anthropic.com';
                this.settings.model = 'claude-3-opus-20240229';
            }
            this.saveSettings();
        },

        setApiKey(apiKey: string) {
            this.settings.apiKey = apiKey;
            this.saveSettings();
        },

        saveSettings() {
            try {
                defaultStorage.setItem(SETTINGS_STORAGE_KEY, JSON.stringify(this.settings));
            } catch (e) {
                console.error('Failed to save settings to storage:', e);
            }
        },

        resetSettings() {
            this.settings = { ...defaultSettings };
            this.saveSettings();
        },
    },
});
