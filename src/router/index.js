import { createRouter, createWebHistory } from 'vue-router';
import DayList from '../components/DayList.vue';
import DayForm from '../components/DayForm.vue';
import DayEdit from '../components/DayEdit.vue';
import TimeSlotList from '../components/TimeSlotList.vue';
import TimeSlotForm from '../components/TimeSlotForm.vue';
import TimeSlotEdit from '../components/TimeSlotEdit.vue';
import TimeSlotsForDay from '../components/TimeSlotsForDay.vue';
import ScheduleTable from '../components/ScheduleTable.vue';
// Імпортуйте інші компоненти

const routes = [
    {
        path: '/',
        redirect: '/schedule' // Редірект з головної сторінки на /schedule
    },
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
        component: DayEdit,
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
        component: TimeSlotEdit,
        props: true
    },
    {
        path: '/timeslots/by-day/:dayOfWeek',
        name: 'TimeSlotsForDay',
        component: TimeSlotsForDay,
        props: route => ({ dayOfWeek: parseInt(route.params.dayOfWeek, 10) })
    },
    {
        path: '/schedule',
        name: 'Schedule',
        component: ScheduleTable
    }
];

const router = createRouter({
    history: createWebHistory(process.env.BASE_URL),
    routes
});

export default router;