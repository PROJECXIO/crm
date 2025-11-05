<script setup lang="ts">
import { LoadingIndicator } from 'frappe-ui';



</script>

<template>
    <div class="flex flex-col justify-center items-center gap-3">
        <LoadingIndicator class="h-6 w-6 text-bg-green" />
    <span class="text-bg-green text-lg">{{ __('Loading') }}</span>
    </div>
</template>