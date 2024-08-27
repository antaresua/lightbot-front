import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'https://bot.bondarenkoid.dev/api', // Змініть на URL вашого API
    withCredentials: false,
    headers: {
        Accept: 'application/json',
        'Content-Type': 'application/json',
    },
});

export default {
    getDays() {
        return apiClient.get('/days');
    },
    getDay(id) {
        return apiClient.get(`/days/${id}`);
    },
    createDays(days) {
        return apiClient.post('/days', days);
    },
    updateDay(id, day) {
        return apiClient.put(`/days/${id}`, day);
    },
    deleteDay(id) {
        return apiClient.delete(`/days/${id}`);
    },
    // Аналогічні методи для TimeSlot
    getTimeSlots() {
        return apiClient.get('/timeslots');
    },
    getTimeSlot(id) {
        return apiClient.get(`/timeslots/${id}`);
    },
    createTimeSlots(timeSlots) {
        return apiClient.post('/timeslots', timeSlots);
    },
    updateTimeSlot(id, timeSlot) {
        return apiClient.put(`/timeslots/${id}`, timeSlot);
    },
    deleteTimeSlot(id) {
        return apiClient.delete(`/timeslots/${id}`);
    },
    getTimeSlotsByDayOfWeek(dayOfWeek) {
        return apiClient.get(`/timeslots/day/${dayOfWeek}`);
    },
    getStatuses() {
        return apiClient.get(`/light/statuses`);
    },
    deleteStatus(id) {
        return apiClient.delete(`/light/status/${id}`);
    },
};
