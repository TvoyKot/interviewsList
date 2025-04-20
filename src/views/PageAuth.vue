<script setup lang="ts">
import { ref, computed } from 'vue'
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
} from 'firebase/auth'
import { useToast } from 'primevue/usetoast'
import { useRouter } from 'vue-router'
const router = useRouter()
const toast = useToast()

const isLogin = ref<boolean>(true)
const isLoading = ref<boolean>(false)
const email = ref<string>('')
const password = ref<string>('')

const toggleAuth = () => {
  isLogin.value = !isLogin.value
}
const subtitleText = computed<string>(() => {
  return isLogin.value
    ? 'Аккаунта ещё нет?'
    : 'Уже есть аккаунт?'
})
const linkAccountText = computed<string>(() => {
  return isLogin.value
    ? 'Создайте прямо сейчас'
    : 'Войдите в него'
})
const submitButtonText = computed<string>(() => {
  return isLogin.value ? 'Войти' : 'Зарегистрироваться'
})

const submitForm = (): void => {
  if (isLogin.value) {
    signIn()
  } else {
    signUp()
  }
}

const signUp = async (): Promise<void> => {
  try {
    isLoading.value = true
    await createUserWithEmailAndPassword(
      getAuth(),
      email.value,
      password.value,
    )
    toast.add({
      severity: 'success',
      summary: 'Успех',
      life: 1500,
    })
    router.push({ name: 'Home' })
    email.value = ''
    password.value = ''
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: error.message,
        life: 3000,
      })
    }
  } finally {
    isLoading.value = false
  }
}
const signIn = async (): Promise<void> => {
  try {
    isLoading.value = true
    await signInWithEmailAndPassword(
      getAuth(),
      email.value,
      password.value,
    )
    toast.add({
      severity: 'success',
      summary: 'Вы успешно вошли в аккаунт',
      life: 1500,
    })
    router.push({ name: 'Home' })
  } catch (error: unknown) {
    if (error instanceof Error) {
      toast.add({
        severity: 'error',
        summary: 'Ошибка',
        detail: error.message,
        life: 3000,
      })
    }
  } finally {
    isLoading.value = false
  }
}
</script>
<template>
  <div>
    <app-toast position="top-right" />
    <div class="flex justify-content-center p-2">
      <div
        class="surface-card p-4 shadow-2 border-round w-full lg:w-6"
      >
        <div class="text-center mb-3">
          <div class="text-900 text-3xl font-medium mb-3">
            Приветствую!
          </div>
          <span
            class="text-600 font-medium line-height-3"
            >{{ subtitleText }}</span
          >
          <a
            @click="toggleAuth"
            class="font-medium no-underline ml-2 text-blue-500 cursor-pointer"
          >
            {{ linkAccountText }}</a
          >
        </div>

        <form type="submit">
          <label
            for="email1"
            class="block text-900 font-medium mb-2"
            >Email</label
          >
          <app-input-text
            v-model="email"
            id="email1"
            type="email"
            class="w-full mb-3"
          />

          <label
            for="password1"
            class="block text-900 font-medium mb-2"
            >Пароль</label
          >
          <app-input-text
            v-model="password"
            id="password1"
            type="password"
            class="w-full mb-3"
          />
          <div>
            <app-button
              type="submit"
              icon="pi pi-user"
              class="w-full"
              :loading="isLoading"
              :label="submitButtonText"
              @click.prevent="submitForm"
            ></app-button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>
