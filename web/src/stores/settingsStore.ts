import { defineStore } from 'pinia';
import { defaultStorage } from './storage';

export type SettingType = 'text' | 'password' | 'select' | 'number' | 'checkbox';

export interface SettingOption {
    label: string;
    value: string | number | boolean;
}

export interface SettingDefinition {
    key: string;
    label: string;
    type: SettingType;
    placeholder?: string;
    hint?: string;
    options?: SettingOption[];
    required?: boolean;
    defaultValue: string | number | boolean;
}

export interface SettingsSection {
    title: string;
    description?: string;
    settings: SettingDefinition[];
}

export interface AllSettings {
    [key: string]: string | number | boolean;
}

const SETTINGS_STORAGE_KEY = 'app_settings';

export const settingsSections: SettingsSection[] = [
    {
        title: 'LLM API Configuration',
        description: 'Configure your LLM API provider and credentials',
        settings: [
            {
                key: 'apiProvider',
                label: 'API Provider',
                type: 'select',
                hint: 'Select your preferred LLM provider',
                options: [
                    { label: 'OpenAI', value: 'openai' },
                ],
                required: true,
                defaultValue: 'openai',
            },
            {
                key: 'apiKey',
                label: 'API Key',
                type: 'password',
                placeholder: 'Enter your API key',
                hint: 'Your API key will be saved locally in browser storage',
                required: true,
                defaultValue: '',
            },
        ],
    },
    {
        title: 'Theme',
        description: 'Customize the appearance',
        settings: [
            {
                key: 'theme',
                label: 'Theme',
                type: 'select',
                hint: 'Select your preferred theme',
                options: [
                    { label: 'Dark', value: 'dark' },
                    { label: 'Light', value: 'light' },
                ],
                defaultValue: 'dark',
            },
        ],
    },
];

const defaultSettings: AllSettings = settingsSections.reduce((acc, section) => {
    section.settings.forEach((setting) => {
        acc[setting.key] = setting.defaultValue;
    });
    return acc;
}, {} as AllSettings);

export const useSettingsStore = defineStore('settings', {
    state: () => ({
        settings: { ...defaultSettings } as AllSettings,
    }),

    getters: {
        getAllSettings: (state) => state.settings,
        getSetting: (state) => (key: string) => state.settings[key],
        getSettingsSections: () => settingsSections,
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

        updateSettings(newSettings: Partial<AllSettings>) {
            this.settings = { ...this.settings, ...(newSettings as AllSettings) };
            this.saveSettings();
        },

        setSetting(key: string, value: string | number | boolean) {
            this.settings[key] = value;
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
