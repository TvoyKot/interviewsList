<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import {
  getFirestore,
  doc,
  getDoc,
  updateDoc,
  Timestamp,
} from 'firebase/firestore'
import { useUserStore } from '@/stores/user'
import type { IInterview, IStage } from '@/interfaces'

const db = getFirestore()
const userStore = useUserStore()
const route = useRoute()
const isLoading = ref<boolean>(true)

const interview = ref<IInterview>()
const docref = doc(
  db,
  `users/${userStore.userId}/interviews`,
  route.params.id as string,
)

const getData = async (): Promise<void> => {
  isLoading.value = true
  const docSnap = await getDoc(docref)
  if (docSnap.exists()) {
    const data = docSnap.data() as IInterview
    if (data.stages && data.stages.length) {
      data.stages = data.stages.map((stage: IStage) => {
        if (stage.date && stage.date instanceof Timestamp) {
          return {
            ...stage,
            date: stage.date.toDate(),
          }
        }
        return stage
      })
    }
    interview.value = data
  }
  isLoading.value = false
}

const addStage = () => {
  if (interview.value) {
    if (!interview.value.stages) {
      interview.value.stages = []
    }
    interview.value.stages.push({
      name: '',
      date: null,
      description: '',
    })
  }
}
const removeStage = (index: number) => {
  if (interview.value) {
    if (interview.value.stages) {
      interview.value.stages.splice(index, 1)
    }
  }
}
const saveInterview = async (): Promise<void> => {
  isLoading.value = true
  await updateDoc(docref, { ...interview.value })
  await getData()
  isLoading.value = false
}

onMounted(async () => {
  await getData()
})
</script>
<template>
  <app-progress-spinner
    v-if="isLoading"
    class="flex justify-content-center"
  />
  <div
    class="content-interview"
    v-else-if="interview?.id && !isLoading"
  >
    <app-card>
      <template #title>
        Собеседование в компанию
        {{ interview.company }}</template
      >
      <template #content>
        <div class="flex flex-column gap-2">
          <div class="flex flex-column gap-2">
            <app-float-label variant="on">
              <label for="company">Компания</label>
              <app-input-text
                class="input mb-3"
                id="company"
                v-model="interview.company"
              />
            </app-float-label>
          </div>
          <div class="flex flex-column gap-2">
            <app-float-label variant="on">
              <label for="vacancyLink"
                >Описание компании (ссылка)</label
              >
              <app-input-text
                class="input mb-3"
                id="vacancyLink"
                v-model="interview.vacancyLink"
              />
            </app-float-label>
          </div>
          <div class="flex flex-column gap-2">
            <app-float-label variant="on">
              <label for="hrName">Контакт (имя)</label>
              <app-input-text
                class="input mb-3"
                id="hrName"
                v-model="interview.hrName"
              />
            </app-float-label>
          </div>
          <div class="flex flex-column gap-2">
            <app-float-label variant="on">
              <label for="contactTelegram"
                >Telegram username HR</label
              >
              <app-input-text
                class="input mb-3"
                id="contactTelegram"
                v-model="interview.contactTelegram"
              />
            </app-float-label>
          </div>
          <div class="flex flex-column gap-2">
            <app-float-label variant="on">
              <label for="contactWhatsApp"
                >WhatsApp username HR</label
              >
              <app-input-text
                class="input mb-3"
                id="contactWhatsApp"
                v-model="interview.contactWhatsApp"
              />
            </app-float-label>
          </div>
          <div class="flex flex-column gap-2">
            <app-float-label variant="on">
              <label for="contactPhone"
                >Phone username HR</label
              >
              <app-input-text
                class="input mb-3"
                id="contactPhone"
                v-model="interview.contactPhone"
              />
            </app-float-label>
          </div>
          <div class="flex flex-wrap gap-3 p-fluid mb-3">
            <app-float-label variant="on">
              <label class="salary" for="from"
                >Зарплатная вилка (от)</label
              >
              <app-input-number
                inputId="salaryFrom"
                id="from"
                v-model="interview.salaryFrom"
              />
            </app-float-label>
            <app-float-label variant="on">
              <label class="salary" for="to"
                >Зарплатная вилка (до)</label
              >
              <app-input-number
                inputId="salaryTo"
                id="to"
                v-model="interview.salaryTo"
              />
            </app-float-label>
          </div>
        </div>
        <app-button
          @click="addStage"
          label="Добавить этап"
          severity="info"
          icon="pi pi-plus"
          class="mb-3 mr-2"
        >
        </app-button>
        <template v-if="interview.stages">
          <div
            v-for="(stage, index) in interview.stages"
            :key="index"
            :stage="stage"
            class="interview-stage"
          >
            <div class="flex flex-column gap-2">
              <app-float-label variant="on">
                <label :for="`stage-name-${index}`"
                  >Название этапа</label
                >
                <app-input-text
                  class="input mb-3"
                  :id="`stage-name-${index}`"
                  v-model="stage.name"
                />
              </app-float-label>
            </div>
            <div class="flex flex-column gap-2">
              <app-float-label variant="on">
                <label :for="`stage-date-${index}`"
                  >Дата этапа</label
                >
                <app-calendar
                  dateFormat="dd/mm/yy"
                  :id="`stage-date-${index}`"
                  class="w-full mb-2"
                  v-model="stage.date"
                >
                  ></app-calendar
                >
              </app-float-label>
              <app-float-label variant="on">
                <label :for="`stage-description-${index}`"
                  >Детали интервью</label
                >
                <app-textarea
                  rows="5"
                  :id="`stage-description-${index}`"
                  class="textarea resize-none w-full mb-2"
                  v-model="stage.description"
                />
              </app-float-label>
            </div>
            <app-button
              @click="removeStage(index)"
              label="Удалить этап"
              severity="danger"
              icon="pi pi-trash"
            ></app-button>
          </div>
        </template>
        <div class="flex flex-wrap gap-3 mb-3">
          <div class="flex align-items-center">
            <label for="interviewResult1">Оффер</label>
            <app-radio-button
              inputId="interviewResult1"
              value="Offer"
              name="result"
              class="ml-1"
              v-model="interview.result"
            />
          </div>
          <div class="flex align-items-center">
            <label for="interviewResult2">Отказ</label>
            <app-radio-button
              inputId="interviewResult2"
              value="Refusal"
              name="result"
              class="ml-1"
              v-model="interview.result"
            />
          </div>
        </div>
        <app-button
          @click="saveInterview"
          label="Сохранить"
          icon="pi pi-save"
        />
      </template>
    </app-card>
  </div>
</template>
<style scoped>
.content-interview {
  max-width: 600px;
  margin: auto;
}
.input {
  width: 100%;
}
.interview-stage {
  border: 1px solid #ccc;
  border-radius: 6px;
  padding: 10px;
  margin-bottom: 10px;
}
.salary {
  z-index: 1;
}
.textarea {
  resize: none;
}
</style>
