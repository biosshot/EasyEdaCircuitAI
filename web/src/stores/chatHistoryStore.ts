import { defineStore } from 'pinia';
import { ref, computed } from 'vue';
import { defaultStorage, IStorage } from './storage';

export interface ChatMessage {
    role: 'human' | 'ai';
    content: string;
    options?: Record<string, any>;
}

export interface ChatSession {
    id: string;
    title: string;
    messages: ChatMessage[];
    createdAt: number;
    updatedAt: number;
}

export const useChatHistoryStore = defineStore('chatHistory', () => {
    const storage = defaultStorage;
    const STORAGE_KEY = 'chat_history';
    const CURRENT_CHAT_KEY = 'current_chat_id';

    const chatSessions = ref<Map<string, ChatSession>>(new Map());
    const currentChatId = ref<string | null>(null);

    // Load from storage on initialization
    function loadFromStorage() {
        try {
            const data = storage.getItem(STORAGE_KEY);
            if (data) {
                const sessions: ChatSession[] = JSON.parse(data);
                chatSessions.value = new Map(sessions.map(s => [s.id, s]));
            }

            const savedCurrentId = storage.getItem(CURRENT_CHAT_KEY);
            if (savedCurrentId && chatSessions.value.has(savedCurrentId)) {
                currentChatId.value = savedCurrentId;
            } else if (chatSessions.value.size > 0) {
                // If saved ID doesn't exist, use the first available
                currentChatId.value = Array.from(chatSessions.value.keys())[0];
            }
        } catch (e) {
            console.error('Failed to load chat history from storage:', e);
            chatSessions.value = new Map();
            currentChatId.value = null;
        }
    }

    // Save to storage
    function saveToStorage() {
        try {
            const sessions = Array.from(chatSessions.value.values());
            storage.setItem(STORAGE_KEY, JSON.stringify(sessions));
            if (currentChatId.value) {
                storage.setItem(CURRENT_CHAT_KEY, currentChatId.value);
            }
        } catch (e) {
            console.error('Failed to save chat history to storage:', e);
        }
    }

    // Create new chat session
    function createNewChat(initialMessages: ChatMessage[] = []): string {
        let id = `chat_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`;
        const title = generateChatTitle(initialMessages);

        let emptyChat: string | undefined = undefined;

        chatSessions.value.forEach((chat) => {
            if (chat.messages.length === 0) {
                emptyChat = chat.id;
            }
        });

        if (emptyChat) {
            id = emptyChat;
        }

        const session: ChatSession = {
            id,
            title,
            messages: initialMessages,
            createdAt: Date.now(),
            updatedAt: Date.now(),
        };

        chatSessions.value.set(id, session);
        currentChatId.value = id;
        saveToStorage();

        return id;
    }

    // Get current chat session
    function getCurrentChat(): ChatSession | null {
        if (!currentChatId.value) {
            createNewChat();
        }

        return chatSessions.value.get(currentChatId.value ?? '') || null;
    }

    // Get all chat sessions (sorted by most recent first)
    function getAllChats(): ChatSession[] {
        return Array.from(chatSessions.value.values()).sort(
            (a, b) => b.updatedAt - a.updatedAt
        );
    }

    // Switch to a specific chat
    function switchToChat(id: string): boolean {
        if (!chatSessions.value.has(id)) {
            return false;
        }
        currentChatId.value = id;
        saveToStorage();
        return true;
    }

    // Delete a chat session
    function deleteChat(id: string): boolean {
        const deleted = chatSessions.value.delete(id);

        if (deleted) {
            // If deleted chat was current, switch to another or clear
            if (currentChatId.value === id) {
                const remaining = Array.from(chatSessions.value.keys());
                currentChatId.value = remaining.length > 0 ? remaining[0] : null;
            }
            saveToStorage();
        }

        return deleted;
    }

    // Add message to current chat
    function addMessageToCurrentChat(message: ChatMessage): boolean {
        const chat = getCurrentChat();
        if (!chat) return false;

        if (chat.title === 'New Chat') {
            chat.title = generateChatTitle(chat.messages);
        }

        chat.messages.push(message);
        chat.updatedAt = Date.now();
        saveToStorage();

        return true;
    }

    // Update chat title
    function updateChatTitle(id: string, title: string): boolean {
        const chat = chatSessions.value.get(id);
        if (!chat) return false;

        chat.title = title;
        chat.updatedAt = Date.now();
        saveToStorage();

        return true;
    }

    // Clear all chat history
    function clearAllChats(): void {
        chatSessions.value.clear();
        currentChatId.value = null;
        storage.removeItem(STORAGE_KEY);
        storage.removeItem(CURRENT_CHAT_KEY);
    }

    // Check if current chat is empty
    function isCurrentChatEmpty(): boolean {
        const chat = getCurrentChat();
        return !chat || chat.messages.length === 0;
    }

    // Generate chat title from messages
    function generateChatTitle(messages: ChatMessage[]): string {
        if (messages.length === 0) return 'New Chat';

        // Find first human message and extract first words
        const firstHuman = messages.find(m => m.role === 'human');
        if (firstHuman && firstHuman.content) {
            const words = firstHuman.content.split(/\s+/).slice(0, 5).join(' ');
            return words.length > 30 ? words.slice(0, 30) + '...' : words || 'New Chat';
        }

        return 'New Chat';
    }

    // Initialize on store creation
    loadFromStorage();

    return {
        chatSessions: computed(() => chatSessions.value),
        currentChatId: computed(() => currentChatId.value),
        getCurrentChat,
        getAllChats,
        createNewChat,
        switchToChat,
        deleteChat,
        addMessageToCurrentChat,
        updateChatTitle,
        clearAllChats,
        isCurrentChatEmpty,
        loadFromStorage,
        saveToStorage,
    };
});
