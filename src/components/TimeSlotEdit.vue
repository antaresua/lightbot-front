<template>
    <div class="form-container">
      <h1>Редагувати таймслот</h1>
      <form @submit.prevent="handleSubmit">
        <div class="time-slot-form">
          <div class="form-group">
            <label for="startTime">Час початку:</label>
            <input type="time" id="startTime" v-model="timeSlot.startTime" required autocomplete="off" />
          </div>
          <div class="form-group">
            <label for="endTime">Час закінчення:</label>
            <input type="time" id="endTime" v-model="timeSlot.endTime" required autocomplete="off" />
          </div>
          <div class="form-group">
            <label for="startDay">Початковий день:</label>
            <select id="startDay" v-model="timeSlot.startDay.id" required>
              <option v-for="day in days" :key="day.id" :value="day.id">
                {{ day.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="endDay">Кінцевий день:</label>
            <select id="endDay" v-model="timeSlot.endDay.id" required>
              <option v-for="day in days" :key="day.id" :value="day.id">
                {{ day.name }}
              </option>
            </select>
          </div>
          <div class="form-group">
            <label for="type">Тип:</label>
            <select id="type" v-model="timeSlot.type" required>
              <option value="on">Ввімкнення</option>
              <option value="off">Вимкнення</option>
              <option value="possible_on">Можливе ввімкнення</option>
            </select>
          </div>
          <div class="form-buttons">
            <button type="button" @click="cancel" class="btn btn-secondary btn-left">Скасувати</button>
            <button type="submit" class="btn btn-success btn-right">Зберегти</button>
          </div>
        </div>
      </form>
    </div>
  </template>
  
  <script>
  import apiService from '../services/api'; // Імпортуйте ваш API сервіс
  
  export default {
    props: {
      id: {
        type: [Number, String],
        required: true
      }
    },
    data() {
      return {
        timeSlot: { startTime: '', endTime: '', startDay: '', endDay: '', type: 'on' }, // Початкове поле для таймслота
        days: []
      };
    },
    created() {
      this.fetchDays();
      this.fetchTimeSlot();
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
      fetchTimeSlot() {
        apiService.getTimeSlot(this.id)
          .then(response => {
            this.timeSlot = response.data; // Завантаження даних для редагування
          })
          .catch(error => {
            console.error('There was an error fetching the time slot!', error);
          });
      },
      handleSubmit() {
        apiService.updateTimeSlot(this.id, this.timeSlot)
          .then(() => {
            this.$router.push('/timeslots');
          })
          .catch(error => {
            console.error('There was an error updating the time slot!', error);
          });
      },
      cancel() {
        this.$router.go(-1);
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
  
  .time-slot-form {
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
    box-sizing: border-box; /* Додано для забезпечення, що паддінги і бордери враховуються в ширині */
  }
  
  .form-buttons {
    display: flex;
    justify-content: space-between; /* Розміщує кнопки по краях контейнера */
    margin-top: 20px; /* Додає відступ зверху */
  }
  
  .btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box; /* Додає паддінги і бордери в ширину */
  }
  
  .btn-left {
    margin-right: auto; /* Виштовхує кнопку на ліву сторону */
  }
  
  .btn-right {
    margin-left: auto; /* Виштовхує кнопку на праву сторону */
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
  