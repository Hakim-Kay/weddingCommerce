<template>
    <div class="wedding-photo-grid">
        <h2 class="grid-title">Wedding Photo Gallery</h2>

        <div class="photo-grid">
            <!-- Landscape format photos -->
            <div class="photo-card landscape">
                <TwicImg src="football.jpg" focus="auto" transition="fade" />
                <div class="photo-info">
                    <p class="photo-title">Wedding Ceremony</p>
                    <p class="photo-tag">Nikah</p>
                </div>
            </div>

            <div class="photo-card landscape">
                <TwicImg src="cat.jpg" focus="auto" transition="zoom" />
                <div class="photo-info">
                    <p class="photo-title">Reception Entrance</p>
                    <p class="photo-tag">Reception</p>
                </div>
            </div>

            <!-- Square format photos with different transformations -->
            <div class="photo-card square">
                <TwicImg
                    src="woman-dress.jpg"
                    placeholder="preview"
                    transition="fade"
                    :modifiers="{ focus: 'auto', zoom: 1.2 }"
                />
                <div class="photo-info">
                    <p class="photo-title">Bride Portrait</p>
                    <p class="photo-tag">Studio</p>
                </div>
            </div>

            <div class="photo-card square">
                <TwicImg
                    src="team/tennis.jpg"
                    placeholder="preview"
                    transition="zoom"
                    :modifiers="{ flip: 'x' }"
                />
                <div class="photo-info">
                    <p class="photo-title">Groom Portrait</p>
                    <p class="photo-tag">Studio</p>
                </div>
            </div>

            <!-- Portrait format photos with more transformations -->
            <div class="photo-card portrait">
                <TwicImg
                    src="components/couple.jpg"
                    focus="auto"
                    placeholder="preview"
                    transition="fade"
                    :modifiers="{ turn: 'right' }"
                />
                <div class="photo-info">
                    <p class="photo-title">Couple Portrait</p>
                    <p class="photo-tag">Magazine</p>
                </div>
            </div>

            <div class="photo-card portrait">
                <TwicImg
                    src="jellyfish.jpg"
                    focus="auto"
                    placeholder="preview"
                    transition="zoom"
                    :modifiers="{ focus: 'auto', crop: '500x500' }"
                    @stateChange="handleStateChange"
                />
                <div class="photo-info">
                    <p class="photo-title">Pre-Wedding</p>
                    <p class="photo-tag">Kasiki</p>
                    <p v-if="loadingState" class="loading-state">State: {{ loadingState }}</p>
                </div>
            </div>
        </div>

        <!-- Additional row with more transformation examples -->
        <h3 class="section-title">More Transformation Examples</h3>
        <div class="photo-grid">
            <div class="photo-card landscape">
                <TwicImg
                    src="coffee.jpg"
                    placeholder="preview"
                    transition="fade"
                    :modifiers="{ truecolor: true }"
                />
                <div class="photo-info">
                    <p class="photo-title">True Color Example</p>
                    <p class="photo-tag">Reception</p>
                </div>
            </div>

            <div class="photo-card landscape">
                <TwicImg
                    src="peacock.jpg"
                    placeholder="preview"
                    transition="fade"
                    :modifiers="{ focus: 'auto', cover: '16:9' }"
                />
                <div class="photo-info">
                    <p class="photo-title">Cover Ratio Example</p>
                    <p class="photo-tag">Nikah</p>
                </div>
            </div>

            <div class="photo-card square">
                <TwicImg
                    src="fox.jpg"
                    placeholder="preview"
                    transition="fade"
                    mode="contain"
                    position="left"
                    background="lightblue"
                />
                <div class="photo-info">
                    <p class="photo-title">Contain Mode Example</p>
                    <p class="photo-tag">Studio</p>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'WeddingPhotoGrid',
    data() {
        return {
            loadingState: null,
        }
    },
    methods: {
        handleStateChange(stateEvent) {
            this.loadingState = stateEvent.state
            console.log(`Image loading state changed:`, this.loadingState)
        },
    },
}
</script>

<style>
.wedding-photo-grid {
    max-width: 1200px;
    margin: 0 auto;
    padding: 20px;
}

.grid-title {
    text-align: center;
    margin-bottom: 30px;
    font-size: 2rem;
}

.section-title {
    text-align: center;
    margin: 40px 0 20px;
    font-size: 1.5rem;
}

.photo-grid {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
    gap: 20px;
}

/* Responsive grid adjustments */
@media (min-width: 640px) {
    .photo-grid {
        grid-template-columns: repeat(2, 1fr);
    }
}

@media (min-width: 1024px) {
    .photo-grid {
        grid-template-columns: repeat(3, 1fr);
    }
}

.photo-card {
    overflow: hidden;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    transition: transform 0.3s ease;
    background-color: white;
}

.photo-card:hover {
    transform: translateY(-5px);
}

.photo-info {
    padding: 12px;
}

.photo-title {
    font-weight: bold;
    margin-bottom: 4px;
}

.photo-tag {
    font-size: 0.875rem;
    color: #666;
}

.loading-state {
    font-size: 0.75rem;
    margin-top: 4px;
    color: #0066cc;
}

/* TwicPics aspect ratio settings */
.landscape {
    --twic-ratio: calc(4 / 3);
}

.square {
    --twic-ratio: calc(1);
}

.portrait {
    --twic-ratio: calc(3 / 4);
}
</style>
