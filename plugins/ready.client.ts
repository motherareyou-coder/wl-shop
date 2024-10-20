export default defineNuxtPlugin(() => {
	onNuxtReady(() => {
		const appStore = useAppStore()
		appStore.listen()
	})
})
