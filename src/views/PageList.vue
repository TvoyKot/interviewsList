<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  getFirestore,
  collection,
  query,
  orderBy,
  getDocs,
  deleteDoc,
  doc,
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview } from '@/interfaces'
import { useConfirm } from 'primevue/useconfirm'
import { useToast } from 'primevue/usetoast'

const toast = useToast()
const confirm = useConfirm()
const db = getFirestore()
const userStore = useUserStore()

const interviews = ref<IInterview[]>([])
const isLoading = ref<boolean>(false)

const getAllInterviews = async <
  T extends IInterview,
>(): Promise<T[]> => {
  const getData = query(
    collection(db, `users/${userStore.userId}/interviews`),
    orderBy('createdAt', 'desc'),
  )
  const listDocs = await getDocs(getData)
  return listDocs.docs.map((doc) => doc.data() as T)
}

const confirmRemoveInterview = async (
  id: string,
): Promise<void> => {
  confirm.require({
    header: 'Удаление собеседования',
    icon: 'pi pi-trash',
    message:
      'Вы действительно хотите удалить собеседование?',
    acceptProps: {
      label: 'Да',
      severity: 'danger',
      outlined: false,
    },
    rejectProps: {
      label: 'Нет',
      severity: 'info',
      outlined: false,
    },
    acceptClass: 'p-button-danger',
    rejectClass: 'p-button-secondary p-button-outlined',
    accept: async () => {
      isLoading.value = true
      await deleteDoc(
        doc(db, `users/${userStore.userId}/interviews`, id),
      )
      const listInterviews: Array<IInterview> =
        await getAllInterviews()
      interviews.value = [...listInterviews]
      isLoading.value = false
      toast.add({
        severity: 'success',
        summary: 'Интервью удалено',
        life: 1500,
      })
    },
    reject: () => {
      toast.add({
        severity: 'info',
        summary: 'Интервью не удалено',
        life: 1500,
      })
    },
  })
}

onMounted(async () => {
  const listInterviews: Array<IInterview> =
    await getAllInterviews()
  interviews.value = [...listInterviews]
})
</script>
<template>
  <app-dialog />
  <app-progress-spinner
    v-if="isLoading"
    class="flex justify-content-center"
  />
  <app-message
    v-else-if="!interviews.length && !isLoading"
    severity="info"
  >
    <template #icon>
      <div class="text-center m-auto">
        <i class="pi pi-ban" style="font-size: 15rem"></i>
        <p>Нет собеседований</p>
      </div>
    </template>
  </app-message>
  <div v-else>
    <h1>Список собеседований</h1>
    <div>
      <app-datatable :value="interviews">
        <app-column field="company" header="Компания" />
        <app-column field="hrName" header="Имя HR" />
        <app-column field="vacancyLink" header="Вакансия">
          <template #body="slotProps">
            <a
              :href="`https://${slotProps.data.vacancyLink}`"
              target="_blank"
              class="vacancy__link"
            >
              Ссылка на вакансию
            </a>
          </template>
        </app-column>
        <app-column
          field="contactTelegram"
          header="Контакт Telegram"
        >
          <template #body="slotProps">
            <div class="contacts">
              <a
                v-if="slotProps.data.contactTelegram"
                :href="`https://t.me/${slotProps.data.contactTelegram}`"
                target="_blank"
                class="contacts__telegram"
                ><span
                  class="contacts__icon pi pi-telegram"
                ></span
              ></a>
              <a
                v-if="slotProps.data.contactWhatsApp"
                :href="`https://wa.me/${slotProps.data.contactWhatsApp}`"
                target="_blank"
                class="contacts__whatsapp"
                ><span
                  class="contacts__icon pi pi-whatsapp"
                ></span
              ></a>
              <a
                v-if="slotProps.data.contactPhone"
                :href="`https://tel:${slotProps.data.contactPhone}`"
                target="_blank"
                class="contacts__phone"
                ><span
                  class="contacts__icon pi pi-phone"
                ></span
              ></a>
            </div>
          </template>
        </app-column>
        <app-column
          field="salaryFrom"
          header="Зарплатная вилка"
        >
          <template #body="slotProps">
            <span v-if="!slotProps.data.salaryFrom"
              >Данные не указаны</span
            >
            <span v-else
              >{{ slotProps.data.salaryFrom }} -
              {{ slotProps.data.salaryTo }}</span
            >
          </template>
        </app-column>
        <app-column
          field="stages"
          header="Пройденные этапы"
        >
          <template #body="slotProps">
            <span v-if="!slotProps.data.stages"
              >Данные не указаны</span
            >
            <div v-else class="interview-stages">
              <app-badge
                v-for="(stage, i) in slotProps.data.stages"
                :key="i"
                :value="i + 1"
                rounded
                severity="info"
                v-tooltip.top="stage.name"
              ></app-badge>
            </div>
          </template>
        </app-column>
        <app-column>
          <template #body="slotProps">
            <div class="buttons">
              <router-link
                :to="`/interview/${slotProps.data.id}`"
              >
                <app-button
                  icon="pi pi-pencil"
                  severity="info"
                  label="Редактировать"
                />
              </router-link>
              <app-button
                @click="
                  confirmRemoveInterview(slotProps.data.id)
                "
                icon="pi pi-trash"
                severity="danger"
                label="Удалить"
              />
            </div>
          </template>
        </app-column>
      </app-datatable>
    </div>
  </div>
</template>
<style scoped>
.vacancy__link {
  text-decoration: none;
  color: #0088cc;
}
.contacts {
  display: flex;
  gap: 10px;
}
.contacts__telegram {
  color: #0088cc;
}
.contacts__whatsapp {
  color: #25d366;
}
.contacts__phone {
  color: #371777;
}
.contacts__icon {
  font-size: 20px;
}
.buttons {
  display: flex;
  gap: 10px;
}
.interview-stages {
  display: flex;
  gap: 5px;
}
</style>
