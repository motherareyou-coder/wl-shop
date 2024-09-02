import antfu from '@antfu/eslint-config'

export default antfu({
	typescript: true,
	vue: true,
	stylistic: {
		indent: 'tab',
		quotes: 'single',
	},
}, {
	files: ['**/*.vue'],
	rules: {
		'vue/html-self-closing': ['error', {
			html: {
				void: 'never',
				normal: 'never',
				component: 'always',
			},
			svg: 'always',
			math: 'always',
		}],
	},
})
