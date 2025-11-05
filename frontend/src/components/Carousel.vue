<template>
	<Carousel v-bind="config">
		<Slide
			v-for="(image, index) in images"
			:key="index"
			class="border-1 rounded overflow-hidden"
		>
			<img :src="image.url" alt="image" />
		</Slide>

		<template #addons>
			<Navigation />
			<Pagination />
		</template>
	</Carousel>
</template>

<script setup>
import 'vue3-carousel/carousel.css'
import { Carousel, Slide, Navigation, Pagination } from 'vue3-carousel'

const props = defineProps({
	images: {
		type: Array,
		required: true,
	},
	config: {
		type: Object,
		default: () => ({
			height: 354,
			itemsToShow: 3.5,
			gap: '20px',
			autoplay: 4000,
			wrapAround: true,
			pauseAutoplayOnHover: true,
		}),
	},
})
</script>

<style>
:root {
	background-color: #242424;
}

.carousel {
	--vc-nav-background: rgba(255, 255, 255, 0.7);
	--vc-nav-border-radius: 100%;
	--vc-pgn-background-color: #55ddbb59;
	--vc-pgn-active-color: #55ddbb;
	--vc-pgn-height: 10px;
	--vc-pgn-width: 10px;
	--vc-pgn-border-radius: 50%;
}
.carousel__pagination-button {
	margin-top: 20px;
}
img {
	border-radius: 8px;
	width: 100%;
	height: 100%;
	object-fit: cover;
}
</style>
