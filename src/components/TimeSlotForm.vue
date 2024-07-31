<template>
  <div class="form-container">
    <h2>Додати таймслоти</h2>
    <form @submit.prevent="submitForm" class="form">
      <div v-for="(slot, index) in timeSlots" :key="index" class="time-slot-form">
        <div class="form-group">
          <label for="startTime">Час початку:</label>
          <input type="time" v-model="slot.startTime" class="fixed-time" required />
        </div>
        <div class="form-group">
          <label for="endTime">Час закінчення:</label>
          <input type="time" v-model="slot.endTime" class="fixed-time" required />
        </div>
        <div class="form-group">
          <label for="startDay">Початковий день:</label>
          <select v-model="slot.startDay" required>
            <option v-for="day in days" :key="day.dayOfWeek" :value="day.dayOfWeek">
              {{ day.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="endDay">Кінцевий день:</label>
          <select v-model="slot.endDay" required>
            <option v-for="day in days" :key="day.dayOfWeek" :value="day.dayOfWeek">
              {{ day.name }}
            </option>
          </select>
        </div>
        <div class="form-group">
          <label for="type">Тип:</label>
          <select v-model="slot.type" required>
            <option value="on">Ввімкнення</option>
            <option value="off">Вимкнення</option>
            <option value="possible_on">Можливе ввімкнення</option>
          </select>
        </div>
        <button type="button" @click="removeTimeSlot(index)" class="btn btn-danger">Видалити цей таймслот</button>
      </div>
      <div class="form-buttons">
        <button type="button" @click="addTimeSlot" class="btn btn-primary btn-left">Додати ще один таймслот</button>
        <div class="button-group">
          <button @click="cancel" type="button" class="btn btn-secondary">Скасувати</button>
          <button type="submit" class="btn btn-success">Зберегти</button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import apiService from '../services/api'; // Імпортуйте ваш API сервіс

export default {
  data() {
    return {
      timeSlots: [{ startTime: '', endTime: '', startDay: '', endDay: '', type: 'on' }],
      days: [],
      formTitle: 'Додати Таймслоти'
    };
  },
  created() {
    this.fetchDays();
  },
  methods: {
    fetchDays() {
      apiService.getDays()
        .then(response => {
          this.days = response.data;
        })
        .catch(error => {
          console.error('There was an error fetching the days!', error);
        });
    },
    addTimeSlot() {
      this.timeSlots.push({ startTime: '', endTime: '', startDay: '', endDay: '', type: 'on' });
    },
    removeTimeSlot(index) {
      if (this.timeSlots.length > 1) {
        this.timeSlots.splice(index, 1);
      }
    },
    submitForm() {
      apiService.createTimeSlots(this.timeSlots)
        .then(() => {
          alert('Таймслоти додані!');
          this.$router.push('/timeslots');
        })
        .catch(error => {
          console.error('There was an error adding the time slots!', error);
        });
    },
    cancel() {
      this.$router.push('/timeslots');
    }
  }
};
</script>

<style scoped>
.form-container {
  max-width: 800px;
  margin: 0 auto;
  padding: 20px;
}

.time-slot-form,
.day-form {
  margin-bottom: 20px;
  padding: 10px;
  border: 1px solid #ddd;
  border-radius: 4px;
}

.form-group {
  margin-bottom: 10px;
}

.form-group label {
  display: block;
  margin-bottom: 5px;
}

.form-group input,
.form-group select {
  width: 100%;
  padding: 8px;
  border: 1px solid #ddd;
  border-radius: 4px;
  box-sizing: border-box;
}

.fixed-time {
  width: 100%;
}

.form-buttons {
  display: flex;
  justify-content: space-between;
  margin-top: 20px;
}

.btn-left {
  margin-right: auto;
}

.button-group,
.btn-group-right {
  display: flex;
  gap: 10px;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
}

.btn-primary {
  background-color: #007bff;
  color: white;
}

.btn-primary:hover {
  background-color: #0056b3;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-secondary {
  background-color: #6c757d;
  color: white;
}

.btn-secondary:hover {
  background-color: #5a6268;
}
</style>
