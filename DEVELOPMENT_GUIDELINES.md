# 开发规范文档

## 1. 命名规则

### 1.1 变量与函数命名
- **变量名**: 使用小驼峰命名法 (`camelCase`)
- **函数名**: 使用小驼峰命名法 (`camelCase`)
- **常量**: 使用大驼峰命名法 (`PascalCase`) 或全大写加下划线 (`SNAKE_CASE`)

### 1.2 组件命名
- **组件名**: 使用大驼峰命名法 (`PascalCase`)
- **组件文件**: 与组件名保持一致，使用大驼峰命名
- **组件前缀**: 公共组件建议使用 `App` 前缀（如 `AppHeader`）

### 1.3 CSS 命名
- **类名**: 使用小写字母，单词间用 `-` 连接（如 `site-header`）
- **BEM 风格**: 采用类似 BEM 的命名方式，如 `navigation__item--active`

### 1.4 文件与目录命名
- **目录名**: 使用小写字母，单词间用 `-` 连接
- **文件名**: 组件文件使用大驼峰，其他文件使用小驼峰或短横线连接
- **类型文件**: 类型定义统一放在 `types.ts` 中

## 2. 禁止使用的反模式

### 2.1 代码结构反模式
- **禁止在 UI 组件中写业务逻辑**: 业务逻辑应放在 composables 或 stores 中
- **禁止直接操作 DOM**: 使用 Vue 的响应式系统，避免手动操作 DOM
- **禁止硬编码**: 常量和配置应集中管理，避免硬编码

### 2.2 类型使用反模式
- **禁止使用 `any` 类型**: 所有类型必须明确定义，使用 TypeScript 接口
- **禁止类型断言**: 尽量避免使用 `as` 进行类型断言，确保类型安全
- **禁止隐式类型转换**: 明确类型转换，避免隐式转换带来的问题

### 2.3 状态管理反模式
- **禁止组件间直接通信**: 使用 Pinia store 进行状态管理
- **禁止在组件中管理全局状态**: 全局状态应放在 store 中
- **禁止状态重复**: 避免在多个地方维护相同的状态

### 2.4 API 调用反模式
- **禁止直接在组件中发起 API 请求**: 使用 `useAPI` composable
- **禁止重复 API 调用**: 使用 `dedupe` 选项避免重复请求
- **禁止缺少错误处理**: 所有 API 调用必须有错误处理

## 3. 文件生成模板

### 3.1 页面组件模板 (Page)
```vue
<script setup lang="ts">
// 导入类型和依赖
import type { TypeName } from '~/types'

// 组件逻辑
const { data, pending, error } = await useAPI<TypeName>('api/endpoint', {
  params: {},
  lazy: false,
  dedupe: 'defer',
})

// 其他逻辑
</script>

<template>
  <div class="page-name">
    <!-- 加载状态 -->
    <div v-if="pending" class="loading-state">
      <!-- 加载指示器 -->
    </div>
    
    <!-- 错误状态 -->
    <div v-else-if="error" class="error-state">
      {{ error.message }}
    </div>
    
    <!-- 内容 -->
    <div v-else class="content">
      <!-- 页面内容 -->
    </div>
  </div>
</template>

<style lang="scss" scoped>
.page-name {
  // 页面样式
}
</style>
```

### 3.2 组件模板 (Component)
```vue
<script setup lang="ts">
// 导入类型
import type { TypeName } from '~/types'

// 定义 Props
const props = defineProps<{
  data: TypeName
  // 其他 props
}>()

// 定义 Emits
const emit = defineEmits<{
  (e: 'eventName', data: TypeName): void
  // 其他事件
}>()

// 组件逻辑
</script>

<template>
  <div class="component-name">
    <!-- 组件内容 -->
  </div>
</template>

<style lang="scss" scoped>
.component-name {
  // 组件样式
}
</style>
```

### 3.3 Store 模板
```typescript
import { defineStore } from 'pinia'

export const useStoreName = defineStore('StoreName', {
  state: () => {
    return {
      // 状态定义
    }
  },
  
  getters: {
    // 计算属性
  },
  
  actions: {
    // 方法
  },
})
```

### 3.4 Composable 模板
```typescript
import { ref, computed } from 'vue'

export function useComposableName() {
  // 状态
  const state = ref(initialValue)
  
  // 计算属性
  const computedValue = computed(() => {
    // 计算逻辑
  })
  
  // 方法
  function methodName() {
    // 方法逻辑
  }
  
  return {
    state,
    computedValue,
    methodName,
  }
}
```

## 4. 代码风格规范

### 4.1 缩进与格式
- **缩进**: 使用 2 个空格
- **分号**: 不使用分号
- **引号**: 使用单引号
- **大括号**: 与语句同一行

### 4.2 注释规范
- **JSDoc**: 为接口和函数添加 JSDoc 注释
- **代码注释**: 关键逻辑添加注释说明
- **注释风格**: 使用 `//` 进行单行注释，`/* */` 进行多行注释

### 4.3 导入规范
- **导入顺序**: 先导入第三方库，再导入项目内部模块
- **导入路径**: 使用 `~` 作为项目根目录的别名
- **类型导入**: 使用 `import type` 导入类型

## 5. 开发流程规范

### 5.1 新增功能流程
1. 分析需求，确定涉及的模块
2. 创建或修改相关文件
3. 编写代码，遵循命名规则和代码风格
4. 测试功能是否正常
5. 运行 lint 检查代码质量

### 5.2 修复 bug 流程
1. 定位问题所在的文件和代码
2. 分析问题原因
3. 编写修复代码
4. 测试修复效果
5. 运行 lint 检查代码质量

## 6. 特别提醒

- **严格遵循 TypeScript 类型定义**: 所有数据结构必须通过接口定义
- **优先使用组合式 API**: 使用 `<script setup>` 和 Composition API
- **状态管理集中化**: 全局状态必须放在 Pinia store 中
- **API 调用统一化**: 使用 `useAPI` composable 发起请求
- **响应式布局**: 确保新代码支持 PC、平板和移动设备

在后续开发中，所有团队成员必须严格遵循本规范，确保代码质量和一致性。