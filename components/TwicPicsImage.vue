<template>
    <div class="twicpics-image-wrapper">
        <!-- Using TwicImg component with our formatted path -->
        <TwicImg
            :src="formattedSrc"
            :focus="focus"
            :transition="transition"
            :placeholder="placeholder"
            :ratio="ratio"
            :mode="mode"
            :position="position"
            :background="background"
            :modifiers="modifiers"
            @stateChange="$emit('stateChange', $event)"
        />
        <slot></slot>
    </div>
</template>

<script setup>
import { computed } from 'vue'
import { getTwicPicsSrc } from '~/utils/twicpics'

const props = defineProps({
    /**
     * Image source - preferably a relative path, but can also be a full Supabase URL
     * Recommended: "Bachelors/DSC01526.jpg" (relative path)
     * Alternative: "https://pidimnoauortugjylfhw.supabase.co/storage/v1/object/public/Wedding%20Images/Bachelors/DSC01526.jpg"
     */
    src: {
        type: String,
        required: true,
    },

    // TwicPics standard props
    focus: {
        type: String,
        default: 'auto',
    },
    transition: {
        type: String,
        default: 'fade',
    },
    placeholder: {
        type: String,
        default: 'preview',
    },
    ratio: {
        type: [String, Number],
        default: undefined,
    },
    mode: {
        type: String,
        default: 'cover',
    },
    position: {
        type: String,
        default: 'center',
    },
    background: {
        type: String,
        default: undefined,
    },
    modifiers: {
        type: Object,
        default: () => ({}),
    },
})

defineEmits(['stateChange'])

// Format the source path for TwicPics
const formattedSrc = computed(() => {
    return getTwicPicsSrc(props.src)
})
</script>

<style scoped>
.twicpics-image-wrapper {
    position: relative;
    width: 100%;
    height: 100%;
}
</style>
