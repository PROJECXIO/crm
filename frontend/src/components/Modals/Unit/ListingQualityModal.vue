<template>
	<Dialog v-model="show" :options="{ size: 'xl' }">
		<template #body-title>
			<h3 class="text-2xl text-subheading font-semibold">{{ __('Listing Quality') }}</h3>
		</template>
		<template #body-content>
			<div class="flex flex-col gap-4">
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<FeatherIcon name="type" class="w-5 h-5" />
						<h3 class="text-lg font-semibold text-subheading">{{ __('Title') }}</h3>
					</div>
					<div class="flex items-center gap-2 bg-green-100/90 p-2 rounded">
						<FeatherIcon name="check" class="h-5 w-5" />
						<div>
							<p class="text-subheading font-semibold text-base">
								{{ __('Title Provided') }}
							</p>
							<p class="text-sm text-ink-gray-6 mt-2">
								{{ __('A non-empty title is present (recommended 20–70 chars for portal display).') }}
							</p>
						</div>
					</div>

				</div>
				<!-- Basics  -->
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<FeatherIcon name="file-text" class="w-5 h-5" />
						<h3 class="text-lg font-semibold text-subheading">
							{{ __('Basics') }}
						</h3>
					</div>
					<div class="flex items-center gap-2 bg-green-100/90 p-2 rounded">
						<FeatherIcon name="check" class="h-5 w-5" />
						<div>
							<p class="text-subheading font-semibold text-base">
								{{ __('Category & Property Type Set') }}
							</p>
							<p class="text-sm text-ink-gray-6 mt-2">
								{{
									__(
										'Both category (e.g., Residential/Commercial) and property_type (e.g., Apartment, Villa, Land) are selected.',
									)
								}}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2 bg-green-100/90 p-2 rounded">
						<FeatherIcon name="check" class="h-5 w-5" />
						<div>
							<p class="text-subheading font-semibold text-base">
								{{ __('Furniture Set') }}
							</p>
							<p class="text-sm text-ink-gray-6 mt-2">
								{{
									__(
										'furniture is specified as Furnished, Unfurnished, or Partly Furnished.',
									)
								}}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2 bg-green-100/90 p-2 rounded">
						<FeatherIcon name="check" class="h-5 w-5" />
						<div>
							<p class="text-subheading font-semibold text-base">
								{{ __('Property Purpose Set') }}
							</p>
							<p class="text-sm text-ink-gray-6 mt-2">
								{{
									__(
										'property_purpose is selected as Sale or Rent; this controls other required fields.',
									)
								}}
							</p>
						</div>
					</div>
				</div>
				<!-- images  -->
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<FeatherIcon name="image" class="w-5 h-5" />
						<h3 class="text-lg font-semibold text-subheading">{{ __('Images') }}</h3>
					</div>
					<div class="flex items-center gap-2 bg-green-100/90 p-2 rounded">
						<FeatherIcon name="check" class="h-5 w-5" />
						<div>
							<p class="text-subheading font-semibold text-base">
								{{ __('Image Count: ≥ 1 (Required to Publish)') }}
							</p>
							<p class="text-sm text-ink-gray-6 mt-2">
								{{
									__(
										'At least one image is attached to the listing.',
									)
								}}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2 bg-green-100/90 p-2 rounded">
						<FeatherIcon name="check" class="h-5 w-5" />
						<div>
							<p class="text-subheading font-semibold text-base">
								{{ __('Image Count: ≥ 5 (Highest Score)') }}
							</p>
							<p class="text-sm text-ink-gray-6 mt-2">
								{{
									__(
										'Five or more images attached; earns the top media score.',
									)
								}}
							</p>
						</div>
					</div>

				</div>
				<!-- Pricing & Terms  -->
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<FeatherIcon name="image" class="w-5 h-5" />
						<h3 class="text-lg font-semibold text-subheading">{{ __('Pricing & Terms') }}</h3>
					</div>
					<div class="flex items-center gap-2 bg-green-100/90 p-2 rounded">
						<FeatherIcon name="check" class="h-5 w-5" />
						<div>
							<p class="text-subheading font-semibold text-base">
								{{ __('Deposit Amount (Sale only)') }}
							</p>
							<p class="text-sm text-ink-gray-6 mt-2">
								{{
									__(
										'When property_purpose = Sale, a numeric deposit_in_amount is provided; not required for Rent.',
									)
								}}
							</p>
						</div>
					</div>
				</div>
				<!-- Location  -->
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<FeatherIcon name="image" class="w-5 h-5" />
						<h3 class="text-lg font-semibold text-subheading">{{ __('Location') }}</h3>
					</div>
					<div class="flex items-center gap-2 bg-green-100/90 p-2 rounded">
						<FeatherIcon name="check" class="h-5 w-5" />
						<div>
							<p class="text-subheading font-semibold text-base">
								{{ __('City') }}
							</p>
							<p class="text-sm text-ink-gray-6 mt-2">
								{{
									__(
										'City is selected from the supported locations list.',
									)
								}}
							</p>
						</div>
					</div>
					<div class="flex items-center gap-2 bg-green-100/90 p-2 rounded">
						<FeatherIcon name="check" class="h-5 w-5" />
						<div>
							<p class="text-subheading font-semibold text-base">
								{{ __('Community or Sub-community') }}
							</p>
							<p class="text-sm text-ink-gray-6 mt-2">
								{{
									__(
										'At least one of community or sub_community is selected (either is sufficient).',
									)
								}}
							</p>
						</div>
					</div>
				</div>
				<!-- Attributes  -->
				<div class="flex flex-col gap-3">
					<div class="flex items-center gap-2">
						<FeatherIcon name="image" class="w-5 h-5" />
						<h3 class="text-lg font-semibold text-subheading">{{ __('Attributes') }}</h3>
					</div>
					<div class="flex items-center gap-2 bg-green-100/90 p-2 rounded">
						<FeatherIcon name="check" class="h-5 w-5" />
						<div>
							<p class="text-subheading font-semibold text-base">
								{{ __('Beds & Baths (Required unless Land/Farm)') }}
							</p>
							<p class="text-sm text-ink-gray-6 mt-2">
								{{
									__(
										'beds and baths are provided for all property types except Land or Farm.',
									)
								}}
							</p>
						</div>
					</div>
				</div>
			</div>
		</template>
	</Dialog>
</template>

<script setup>
const show = defineModel()
</script>
