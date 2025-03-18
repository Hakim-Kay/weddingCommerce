<script setup lang="ts">
// We'll use the SignIn component without middleware for now
</script>

<template>
    <div class="auth-container">
        <SignIn />
    </div>
</template>

<style scoped>
.auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    padding: 2rem;
}
</style>
