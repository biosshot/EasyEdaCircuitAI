<template>
    <div class="settings-view">
        <h1>Settings</h1>

        <div class="settings-section">
            <h2>LLM API Configuration</h2>

            <!-- API Provider -->
            <div class="setting-group">
                <label for="provider">API Provider</label>
                <select id="provider" v-model="settings.apiProvider" @change="onProviderChange">
                    <option value="openai">openai</option>
                    <!-- <option value="anthropic">anthropic</option> -->
                    <!-- <option value="custom">Custom</option> -->
                </select>
                <p class="hint">Select your preferred LLM provider</p>
            </div>

            <!-- API Key -->
            <div class="setting-group">
                <label for="apiKey">API Key</label>
                <input id="apiKey" v-model="settings.apiKey" type="password" placeholder="Enter your API key"
                    @input="onApiKeyChange" />
                <p class="hint">Your API key will be saved locally in browser storage</p>
            </div>

            <!-- Buttons -->
            <div class="button-group">
                <button class="btn-primary" @click="saveSettings">Save Settings</button>
                <button class="btn-secondary" @click="resetSettings">Reset to Default</button>
            </div>

            <!-- Status message -->
            <div v-if="statusMessage" :class="['status-message', statusType]">
                {{ statusMessage }}
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useSettingsStore } from '../stores/settingsStore';

const settingsStore = useSettingsStore();

const settings = reactive({
    apiProvider: '',
    apiKey: '',
    apiUrl: '',
    model: '',
});

const statusMessage = ref('');
const statusType = ref('');

onMounted(() => {
    settingsStore.initSettings();
    Object.assign(settings, settingsStore.getLLMSettings);
});

const onProviderChange = () => {
    settingsStore.setApiProvider(settings.apiProvider);
    Object.assign(settings, settingsStore.getLLMSettings);
    showStatus('Provider updated', 'success');
};

const onApiKeyChange = () => {
    settingsStore.setApiKey(settings.apiKey);
};

const saveSettings = () => {
    settingsStore.updateSettings(settings);
    showStatus('Settings saved successfully!', 'success');
};

const resetSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default?')) {
        settingsStore.resetSettings();
        Object.assign(settings, settingsStore.getLLMSettings);
        showStatus('Settings reset to default', 'info');
    }
};

const showStatus = (message, type) => {
    statusMessage.value = message;
    statusType.value = type;
    setTimeout(() => {
        statusMessage.value = '';
    }, 3000);
};
</script>

<style scoped>
.settings-view {
    /* width: 100%;
    max-width: 600px; */
    /* background: #1e293b; */
    /* border-radius: 12px; */
    padding: 2rem;
    /* box-shadow: 0 10px 40px rgba(0, 0, 0, 0.3); */
}

h1 {
    margin: 0 0 2rem 0;
    font-size: 1.8rem;
    color: #f1f5f9;
    text-align: center;
}

h2 {
    margin: 0 0 1.5rem 0;
    font-size: 1.2rem;
    color: #cbd5e1;
    border-bottom: 2px solid #334155;
    padding-bottom: 0.75rem;
}

h3 {
    margin: 0 0 1rem 0;
    font-size: 1rem;
    color: #cbd5e1;
}

.settings-section {
    margin-bottom: 2rem;
}

.info-section {
    background: #0f172a;
    padding: 1.5rem;
    border-radius: 8px;
    border-left: 4px solid #3b82f6;
}

.setting-group {
    margin-bottom: 1.5rem;
}

.setting-group label {
    display: block;
    margin-bottom: 0.5rem;
    font-weight: 600;
    color: #e2e8f0;
    font-size: 0.95rem;
}

.setting-group input,
.setting-group select {
    width: 100%;
    padding: 0.75rem;
    background: #0f172a;
    border: 1px solid #334155;
    border-radius: 6px;
    color: #f1f5f9;
    font-size: 0.9rem;
    transition: border-color 0.2s;
    box-sizing: border-box;
}

.setting-group input:focus,
.setting-group select:focus {
    outline: none;
    border-color: #3b82f6;
    box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
}

.setting-group input::placeholder {
    color: #64748b;
}

.hint {
    margin: 0.5rem 0 0 0;
    font-size: 0.8rem;
    color: #94a3b8;
}

.button-group {
    display: flex;
    gap: 1rem;
    margin-top: 2rem;
    margin-bottom: 1rem;
}

.btn-primary,
.btn-secondary {
    flex: 1;
    padding: 0.75rem 1.5rem;
    border: none;
    border-radius: 6px;
    font-size: 0.95rem;
    font-weight: 600;
    cursor: pointer;
    transition: all 0.2s;
}

.btn-primary {
    background: #3b82f6;
    color: white;
}

.btn-primary:hover {
    background: #2563eb;
    transform: translateY(-2px);
    box-shadow: 0 4px 12px rgba(59, 130, 246, 0.4);
}

.btn-primary:active {
    transform: translateY(0);
}

.btn-secondary {
    background: #475569;
    color: #e2e8f0;
}

.btn-secondary:hover {
    background: #334155;
}

.status-message {
    padding: 1rem;
    border-radius: 6px;
    text-align: center;
    font-weight: 600;
    margin-bottom: 1rem;
    animation: slideIn 0.3s ease-out;
}

.status-message.success {
    background: #10b981;
    color: white;
}

.status-message.info {
    background: #3b82f6;
    color: white;
}

.status-message.error {
    background: #ef4444;
    color: white;
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }

    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.config-display {
    display: flex;
    flex-direction: column;
    gap: 0.75rem;
}

.config-item {
    display: flex;
    justify-content: space-between;
    padding: 0.75rem;
    background: #1e293b;
    border-radius: 6px;
    border-left: 3px solid #64748b;
}

.config-item .label {
    font-weight: 600;
    color: #cbd5e1;
}

.config-item .value {
    color: #94a3b8;
    font-family: 'Courier New', monospace;
    word-break: break-all;
}

.config-item .value.has-key {
    color: #10b981;
}
</style>
