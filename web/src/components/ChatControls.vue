<template>
    <div class="chat-controls-wrapper">
        <button class="chat-control-btn" :disabled="newChatDisabled" @click="createNewChat" title="New chat">
            <Icon name="Plus" size="14" />
        </button>
        <button class="chat-control-btn" @click="toggleChatHistory" title="Chat history">
            <Icon name="History" size="14" />
        </button>

        <!-- Context menu for chat history -->
        <div v-if="showChatHistory" class="chat-history-menu">
            <div class="history-header">
                <h3>Chat History</h3>
                <button class="close-btn" @click="showChatHistory = false">
                    <Icon name="X" size="12" />
                </button>
            </div>

            <div class="history-list">
                <div v-if="allChats.length === 0" class="empty-history">
                    <p>No chats yet</p>
                </div>
                <div v-for="chat in allChats" :key="chat.id" class="history-item">
                    <button class="history-item-content" :class="{ active: chat.id === historyStore.currentChatId }"
                        @click="switchToChat(chat.id)">
                        <span class="history-item-title">{{ chat.title }}</span>
                        <span class="history-item-count">{{ chat.messages.length }}</span>
                    </button>
                    <button class="delete-btn" @click="deleteChat(chat.id)" :disabled="isLoading">
                        <Icon name="Trash2" size="11" />
                    </button>
                </div>
            </div>

            <div v-if="allChats.length > 0" class="history-footer">
                <button class="clear-all-btn" @click="clearAllChats">Clear all</button>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useAppStore } from '../stores/appStore';
import { useChatHistoryStore } from '../stores/chatHistoryStore';
import Icon from './Icon.vue';

const store = useAppStore();
const historyStore = useChatHistoryStore();
const allChats = computed(() => historyStore.getAllChats());

const props = defineProps({
    isLoading: {
        type: Boolean,
        default: false
    }
});

const newChatDisabled = computed(() => {
    return props.isLoading || historyStore.isCurrentChatEmpty();
});

const showChatHistory = ref(false);

function toggleChatHistory() {
    showChatHistory.value = !showChatHistory.value;
}

function createNewChat() {
    if (props.isLoading) return;
    // console.log(historyStore.isCurrentChatEmpty());

    if (historyStore.isCurrentChatEmpty() && historyStore.getCurrentChat()) return;

    historyStore.createNewChat();
    // store.setChatMessages([]);
    showChatHistory.value = false;
}

function switchToChat(chatId) {
    if (props.isLoading) return;

    const success = historyStore.switchToChat(chatId);
    if (success) {
        showChatHistory.value = false;
    }
}

function deleteChat(chatId) {
    if (props.isLoading) return;

    historyStore.deleteChat(chatId);
}

function clearAllChats() {
    if (props.isLoading) return;

    if (confirm('Are you sure you want to delete all chats?')) {
        historyStore.clearAllChats();
        // store.setChatMessages([]);
        showChatHistory.value = false;
    }
}

defineExpose({
    toggleChatHistory,
    createNewChat,
    switchToChat,
    deleteChat,
    clearAllChats,
    showChatHistory
});
</script>

<style scoped>
.chat-controls-wrapper {
    display: flex;
    gap: 0.25rem;
    align-items: center;
    position: relative;
}

.chat-control-btn {
    padding: 0.35rem 0.4rem;
    background-color: #334155;
    border: 1px solid #475569;
    color: white;
    border-radius: 0.3rem;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 0.2s ease;
    min-width: 32px;
    height: 32px;
}

.chat-control-btn:hover:not(:disabled) {
    background-color: #475569;
    border-color: #64748b;
}

.chat-control-btn:disabled {
    opacity: 0.4;
    cursor: not-allowed;
}

.chat-history-menu {
    position: absolute;
    top: 100%;
    right: 0;
    background-color: #1e293b;
    border: 1px solid #334155;
    border-radius: 0.5rem;
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
    z-index: 1000;
    width: 280px;
    max-height: calc(100vh - 150px);
    display: flex;
    flex-direction: column;
    margin-top: 0.25rem;
}

.history-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0.75rem;
    border-bottom: 1px solid #334155;
}

.history-header h3 {
    margin: 0;
    font-size: 0.9rem;
    color: white;
}

.close-btn {
    background: none;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    padding: 0.2rem;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.2s ease;
}

.close-btn:hover {
    color: white;
}

.history-list {
    flex: 1;
    overflow-y: auto;
    padding: 0.5rem;
    display: flex;
    flex-direction: column;
    gap: 0.25rem;
}

.empty-history {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100px;
    color: #64748b;
    font-size: 0.85rem;
}

.history-item {
    display: flex;
    gap: 0.25rem;
    align-items: center;
}

.history-item-content {
    flex: 1;
    padding: 0.4rem 0.5rem;
    background-color: #0f172a;
    border: 1px solid #334155;
    border-radius: 0.3rem;
    color: #e2e8f0;
    cursor: pointer;
    text-align: left;
    font-size: 0.8rem;
    transition: all 0.2s ease;
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 0.4rem;
    min-width: 0;
}

.history-item-content:hover {
    background-color: #1e293b;
    border-color: #475569;
}

.history-item-content.active {
    background-color: #16a34a;
    border-color: #16a34a;
    color: white;
}

.history-item-title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    flex: 1;
    min-width: 0;
}

.history-item-count {
    font-size: 0.7rem;
    color: inherit;
    opacity: 0.7;
    flex-shrink: 0;
}

.delete-btn {
    padding: 0.2rem;
    background-color: transparent;
    border: none;
    color: #94a3b8;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 0.25rem;
    transition: all 0.2s ease;
    flex-shrink: 0;
}

.delete-btn:hover:not(:disabled) {
    background-color: #7f1d1d;
    color: #fca5a5;
}

.delete-btn:disabled {
    opacity: 0.3;
    cursor: not-allowed;
}

.history-footer {
    padding: 0.5rem;
    border-top: 1px solid #334155;
}

.clear-all-btn {
    width: 100%;
    padding: 0.4rem;
    background-color: #7f1d1d;
    border: 1px solid #b91c1c;
    color: #fca5a5;
    border-radius: 0.3rem;
    cursor: pointer;
    font-size: 0.8rem;
    transition: all 0.2s ease;
}

.clear-all-btn:hover {
    background-color: #991b1b;
    border-color: #dc2626;
    color: white;
}
</style>
