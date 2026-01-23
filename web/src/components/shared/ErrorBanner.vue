<template>
    <div class="error-banner" :key="props.message">
        <div class="error-content">
            <Icon style="color: red;" name="CircleAlert" size="20" />
            <div class="error-text">{{ props.message }}</div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import Icon from './Icon.vue';

const props = defineProps<{ message: string }>();
</script>

<style scoped>
.error-banner {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    border: 1px solid var(--color-border);
    color: var(--color-text-on-surface);
    padding: 0.5rem 0.75rem;
    border-radius: 6px;
    font-size: 0.95rem;
    width: 95%;
    max-width: 600px;
    gap: 0.5rem;

    /* Анимация появления с дрожанием */
    animation: wiggle-in 0.6s cubic-bezier(0.36, 0.07, 0.19, 0.97) both;
}

@keyframes wiggle-in {
    0% {
        opacity: 0;
        transform: translateX(0);
    }

    10%,
    30%,
    50%,
    70%,
    90% {
        transform: translateX(-2px);
    }

    20%,
    40%,
    60%,
    80% {
        transform: translateX(2px);
    }

    100% {
        opacity: 1;
        transform: translateX(0);
    }
}

.error-content {
    display: flex;
    align-items: center;
    justify-content: start;
    max-width: 100%;
}

.error-text {
    margin-left: 0.5rem;
    max-width: 90%;
    word-wrap: break-word;
}
</style>