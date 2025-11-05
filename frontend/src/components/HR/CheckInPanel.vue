<template>
	<div class="flex flex-col items-center w-full gap-3 max-w-96 px-3">
		<div class="font-medium text-lg text-subheading" v-if="lastLog && getUser()?.employee?.name">
			<span>{{ __('Last {0} was at {1} on {2}', [__(lastLogType), dayjs(lastLog.time).format('h:mm a'), dayjs(lastLog.time).format('DD MMM')]) }}</span>
		</div>
		<Button
			class="md:w-[330px] px-3 !gap-1 h-8 font-bold"
			variant="solid"
			theme="green"
            :label="nextAction.label"
            :iconLeft="CheckInIcon"
			:disabled="!getUser()?.employee?.name"
			@click="
				() => {
					handleEmployeeCheckin()
					show = true
				}
			"
		/>
	</div>

	<Dialog
		v-model="show"
		:options="{
			title: 'Check in / out',
		}"
		:disable-outside-click-to-close="true"
	>
		<template #body-content>
			<div class="h-120 w-full flex flex-col items-center justify-center gap-5 p-4 mb-5">
				<div class="flex flex-col gap-1.5 mt-2 items-center justify-center">
					<div class="font-bold text-xl">
						{{ dayjs(checkinTimestamp).format('hh:mm:ss a') }}
					</div>
					<div class="font-medium text-gray-500 text-sm">
						{{ dayjs().format('D MMM, YYYY') }}
					</div>
				</div>

				<template v-if="settings.doc?.allow_geolocation_tracking">
					<span v-if="locationStatus" class="font-medium text-gray-500 text-sm">
						{{ locationStatus }}
					</span>

					<div class="rounded border-4 translate-z-0 block overflow-hidden w-full h-170">
						<iframe
							width="100%"
							height="170"
							frameborder="0"
							scrolling="no"
							marginheight="0"
							marginwidth="0"
							style="border: 0"
							:src="`https://maps.google.com/maps?q=${latitude},${longitude}&hl=en&z=15&amp;output=embed`"
						>
						</iframe>
					</div>
				</template>

				<Button
					:loading="checkins.insert.loading"
					:disabled="fetchingLocation"
					variant="solid"
					theme="green"
					class="w-full py-5 text-sm font-bold"
					@click="submitLog(nextAction.action)"
				>
					{{ __('Confirm {0}', [nextAction.label]) }}
				</Button>
			</div>
		</template>
	</Dialog>
</template>

<script setup>
import { createListResource, toast, Dialog, dayjs } from 'frappe-ui'
import { computed, ref } from 'vue'
import { useDocument } from '@/data/document'
import { usersStore } from '@/stores/users'
import CheckInIcon from '@/components/Icons/CheckInIcon.vue'

const DOCTYPE = 'Employee Checkin'

const checkinTimestamp = ref(null)
const latitude = ref(0)
const longitude = ref(0)
const locationStatus = ref('')
const fetchingLocation = ref(true)
const show = defineModel()

const { document: settings } = useDocument('HR Settings', 'HR Settings')
const { getUser } = usersStore()

const checkins = createListResource({
	doctype: DOCTYPE,
	fields: ['name', 'employee', 'employee_name', 'log_type', 'time', 'device_id'],
	filters: {
		employee: getUser()?.employee?.name,
	},
	orderBy: 'time desc',
})

checkins.reload()

const lastLog = computed(() => {
	if (checkins.list.loading || !checkins.data) return {}
	return checkins.data[0]
})

const lastLogType = computed(() => {
	return lastLog?.value?.log_type === 'IN' ? 'check-in' : 'check-out'
})

const nextAction = computed(() => {
	if(dayjs(lastLog.value.time).isToday()){
		return lastLog?.value?.log_type === 'IN'
			? { action: 'OUT', label: __('Check Out') }
			: { action: 'IN', label: __('Check In') }
	}
	return {action: 'IN', label: __('Check In')}
})

function handleLocationSuccess(position) {
	latitude.value = position.coords.latitude
	longitude.value = position.coords.longitude

	locationStatus.value = [
		__('Latitude: {0}°', [Number(latitude.value).toFixed(5)]),
		__('Longitude: {0}°', [Number(longitude.value).toFixed(5)]),
	].join(', ')
	fetchingLocation.value = false
}

function handleLocationError(error) {
	locationStatus.value = 'Unable to retrieve your location'
	if (error) locationStatus.value += `: ERROR(${error.code}): ${error.message}`
	fetchingLocation.value = false
}

const fetchLocation = () => {
	if (!navigator.geolocation) {
		locationStatus.value = __('Geolocation is not supported by your current browser')
	} else {
		locationStatus.value = __('Locating...')
		navigator.geolocation.getCurrentPosition(handleLocationSuccess, handleLocationError)
	}
}

const handleEmployeeCheckin = () => {
	checkinTimestamp.value = dayjs().format('YYYY-MM-DD HH:mm:ss')

	if (settings.doc?.allow_geolocation_tracking) {
		fetchLocation()
	}
    else{
        fetchingLocation.value = false
    }
}

const submitLog = (logType) => {
	const actionLabel = logType === 'IN' ? __('Check-in') : __('Check-out')
	checkins.insert.submit(
		{
			employee: getUser()?.employee?.name,
			log_type: logType,
			time: checkinTimestamp.value,
			latitude: latitude.value,
			longitude: longitude.value,
		},
		{
			onSuccess() {
				show.value = false
				toast.success(__('{0} successful!', [actionLabel]))
			},
			onError(error) {
				let messages = error.messages || []
				for (const message of messages) {
					toast.error(__('{0} failed!,  {1}', [actionLabel, message]))
				}
			},
		},
	)
}
</script>
