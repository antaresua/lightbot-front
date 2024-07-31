import { createRouter, createWebHistory } from 'vue-router';
import DayList from '../components/DayList.vue';
import DayForm from '../components/DayForm.vue';
import TimeSlotList from '../components/TimeSlotList.vue';
import TimeSlotForm from '../components/TimeSlotForm.vue';
// Імпортуйте інші компоненти

const routes = [
  {
    path: '/days',
    name: 'DayList',
    component: DayList
  },
  {
    path: '/days/add',
    name: 'DayForm',
    component: DayForm
  },
  {
    path: '/days/:id/edit',
    name: 'DayEdit',
    component: DayForm,
    props: true
  },
  {
    path: '/timeslots',
    name: 'TimeSlotList',
    component: TimeSlotList
  },
  {
    path: '/timeslots/add',
    name: 'TimeSlotForm',
    component: TimeSlotForm
  },
  {
    path: '/timeslots/:id/edit',
    name: 'TimeSlotEdit',
    component: TimeSlotForm,
    props: true
  }
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;