<script setup lang="ts">
import { ref, computed } from 'vue'
import type { ComputedRef } from 'vue'
import { useUserStore } from '@/stores/user'
import { getAuth, signOut } from 'firebase/auth'
import { useRouter } from 'vue-router'

const router = useRouter()
const userStore = useUserStore()

const signOutMethod = async (): Promise<void> => {
  try {
    await signOut(getAuth())
    router.push('/auth')
  } catch (error) {
    console.log('Error:', error)
  }
}

interface IMenuItem {
  label: string
  icon: string
  path: string
  show: ComputedRef<boolean>
}

const items = ref<IMenuItem[]>([
  {
    label: 'Авторизация',
    icon: 'pi pi-user',
    path: '/auth',
    show: computed((): boolean => !userStore.userId),
  },
  {
    label: 'Добавить',
    icon: 'pi pi-plus',
    path: '/',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    label: 'Список собеседований',
    icon: 'pi pi-list',
    path: '/list',
    show: computed((): boolean => !!userStore.userId),
  },
  {
    label: 'Статистика',
    icon: 'pi pi-chart-pie',
    path: '/statistic',
    show: computed((): boolean => !!userStore.userId),
  },
])
</script>

<template>
  <app-menubar :model="items" class="menu">
    <template #item="{ item, props }">
      <template v-if="item.show">
        <router-link
          :to="item.path"
          v-bind="props.action"
          class="flex align-items-center"
        >
          <span
            :class="item.icon"
            class="p-menuitem-icon"
          ></span>
          <span class="ml-2"> {{ item.label }}</span>
        </router-link>
      </template>
    </template>
    <template #end>
      <span
        v-if="userStore.userId"
        @click="signOutMethod"
        class="flex align-items-center menu-exit"
      >
        <span
          class="pi pi-sign-out p-p-menuitem-icon"
        ></span>
        <span>Выход</span>
      </span>
    </template>
  </app-menubar>
</template>

<style scoped>
.menu {
  margin: 30px 0;
}
.menu-exit {
  cursor: pointer;
}
</style>
