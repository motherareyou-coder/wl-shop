<script setup lang="ts">
const props = defineProps<{
	logs: any[]
	loading?: boolean
}>()

const dayjs = useDayjs()

function formatTime(t?: string) {
	return t ? dayjs(t).format('YYYY-MM-DD HH:mm') : ''
}

const typeMap: Record<string, { icon: string; label: string }> = {
	AUTO_EMAIL: { icon: 'micon-email', label: '系统邮件' },
	MANUAL_EMAIL: { icon: 'micon-email', label: '邮件' },
	MANUAL_INPUT: { icon: 'micon-edit', label: '人工录入' },
	SYSTEM: { icon: 'micon-info', label: '系统' },
}
function typeMeta(t: string) {
	return typeMap[t] || { icon: 'micon-info', label: t }
}
</script>

<template>
	<div class="travel-timeline">
		<div v-if="loading" class="travel-timeline__loading">
			<div v-for="n in 2" :key="n" class="timeline-skeleton" />
		</div>

		<div v-else-if="!logs.length" class="travel-timeline__empty">
			暂无沟通记录
		</div>

		<ul v-else class="timeline">
			<li
				v-for="log in logs"
				:key="log.id"
				class="timeline__item"
				:class="{ 'timeline__item--out': log.direction === 'OUTGOING', 'timeline__item--in': log.direction === 'INCOMING' }"
			>
				<div class="timeline__node">
					<i :class="typeMeta(log.type).icon" />
				</div>
				<div class="timeline__bubble">
					<div class="timeline__meta">
						<span class="timeline__type">{{ typeMeta(log.type).label }}</span>
						<span class="timeline__time">{{ formatTime(log.createTime) }}</span>
					</div>
					<p class="timeline__content">
						{{ log.content }}
					</p>
					<span v-if="log.operator" class="timeline__operator">
						操作人：{{ log.operator }}
					</span>
				</div>
			</li>
		</ul>
	</div>
</template>

<style lang="scss" scoped>
.travel-timeline {
	&__loading {
		display: flex;
		flex-direction: column;
		gap: 16px;
	}

	&__empty {
		text-align: center;
		padding: 32px 0;
		color: var(--text-secondary);
		font-size: var(--small-font-size, 14px);
	}
}

.timeline-skeleton {
	height: 80px;
	border-radius: 8px;
	background: var(--background-light-grey);
}

.timeline {
	list-style: none;
	margin: 0;
	padding: 0;
	display: flex;
	flex-direction: column;
	gap: 16px;

	&__item {
		position: relative;
		display: flex;
		gap: 12px;

		&--in {
			flex-direction: row;

			.timeline__bubble {
				background: var(--background-light-grey);
				color: var(--text-base);
				border: 1px solid var(--border-light, #eee);
			}

			.timeline__type {
				color: var(--text-secondary);
			}
		}

		&--out {
			flex-direction: row-reverse;

			.timeline__bubble {
				background: var(--background-primary-light, #FAF2E0);
				color: var(--text-base);
				border: 1px solid var(--brand-orange);
			}

			.timeline__type {
				color: var(--brand-orange);
			}

			.timeline__node {
				background: var(--brand-orange);
				border-color: var(--brand-orange);
				color: var(--text-reverse);
			}

			.timeline__meta {
				justify-content: flex-end;
			}
		}
	}

	&__node {
		flex-shrink: 0;
		width: 32px;
		height: 32px;
		border-radius: 50%;
		background: var(--background-white);
		border: 1px solid var(--text-secondary);
		color: var(--text-secondary);
		display: flex;
		align-items: center;
		justify-content: center;
		font-size: 14px;
	}

	&__bubble {
		max-width: 75%;
		padding: 10px 14px;
		border-radius: 10px;
	}

	&__meta {
		display: flex;
		align-items: center;
		gap: 10px;
		margin-bottom: 6px;
		flex-wrap: wrap;
	}

	&__type {
		font-size: 12px;
		font-weight: 600;
	}

	&__time {
		font-size: 12px;
		color: var(--text-secondary);
	}

	&__content {
		margin: 0;
		font-size: var(--default-font-size, 16px);
		line-height: 1.5;
		white-space: pre-wrap;
		word-break: break-word;
	}

	&__operator {
		display: inline-block;
		margin-top: 6px;
		font-size: 12px;
		color: var(--text-secondary);
	}
}

@media screen and (max-width: 720px) {
	.timeline__bubble {
		max-width: 82%;
	}
}
</style>
