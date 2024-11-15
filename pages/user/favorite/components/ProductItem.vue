<script setup>
const emit = defineEmits('cancel')
const data = defineModel('data', { default: () => ({}) })
const router = useRouter()
function onClick() {
	router.push($path(`/product/${data.value.spuId}`))
}

const appStore = useAppStore()
</script>

<template>
	<li class="mi-product__item-wrapper">
		<div
			class="flex bg-white w-full items-center"
			:class="[appStore.isPC ? 'flex-col p-3 rounded' : '']"
		>
			<app-image
				class="shrink-0 cursor-pointer"
				:class="[appStore.isPC ? 'w-60 h-60' : 'w-28 h-28']"
				:src="data.picUrl"
				@click="onClick"
			/>
			<div
				class="w-full flex flex-col"
				:class="[
					appStore.isPC ? '' : 'h-20 pl-2 justify-between h-full p-3',
				]"
			>
				<div
					class="overflow-hidden flex h-10"
					:class="[appStore.isPC ? 'my-3' : '']"
				>
					<span
						class="overflow-hidden text-ellipsis cursor-pointer"
						style="
							display: box;
							display: -webkit-box;
							-webkit-box-orient: vertical;
							-webkit-line-clamp: 2;
						"
						@click="onClick"
					>
						{{ data.spuName }}
					</span>
				</div>
				<div class="flex justify-between">
					<product-price class="font-medium" :data="data.price" />
					<button @click.stop="emit('cancel')">
						<el-icon class="ml-2" style="color: #ff6900">
							<el-icon-star />
						</el-icon>
					</button>
				</div>
			</div>
		</div>
	</li>
</template>

<style lang="scss" scoped>
.mi-product__item {
	.item__info__translate {
		position: relative;
		button {
			background: #191919;
			border-radius: 10.5px;
			color: #fff;
			font-weight: 700;
			opacity: 0;
			position: absolute;
			white-space: nowrap;
			padding: 6px 12px;
			transition: 0.3s;
			font-size: var(--item-font-size);
			@media screen and (max-width: 720px) {
				display: none;
			}
		}
	}
	.price {
		transition: all 0.3s;
	}
	&:hover {
		button {
			opacity: 1;
			top: 50%;
			transform: translateY(-50%);
			transition-delay: 0.2s;
		}
		.price {
			opacity: 0;
			transform: translateY(-20%);
		}
	}
}
</style>
