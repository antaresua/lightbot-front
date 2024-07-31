<template>
  <div class="page-container">
    <!-- Кнопка Назад -->
    <router-link to="/days" class="back-button">
      <button class="btn btn-back">
        <i class="fas fa-arrow-left"></i> <!-- Або 'fa-solid fa-arrow-left' -->
      </button>
    </router-link>

    <div class="table-container">
      <h2>Список таймслотів на {{ dayNameInGenitive.toLowerCase() }}</h2>
      <table class="time-slots-table">
        <thead>
          <tr>
            <th @click="sortTable('startTime')">Час початку</th>
            <th @click="sortTable('endTime')">Час закінчення</th>
            <th @click="sortTable('type')">Тип</th>
            <th>Дії</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="timeSlot in sortedTimeSlots" :key="timeSlot.id">
            <td>{{ timeSlot.startTime }}</td>
            <td>{{ timeSlot.endTime }}</td>
            <td>{{ getTypeName(timeSlot.type) }}</td>
            <td>
              <button @click="editTimeSlot(timeSlot.id)" class="btn btn-primary">Редагувати</button>
              <button @click="deleteTimeSlot(timeSlot.id)" class="btn btn-danger">Видалити</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="add-button-container">
        <router-link to="/timeslots/add">
          <button class="btn btn-success">Додати новий таймслот</button>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script>
import apiService from '../services/api';

export default {
  props: {
    dayOfWeek: {
      type: Number,
      required: true
    }
  },
  data() {
    return {
      timeSlots: [],
      sortKey: '',
      sortOrder: 'asc'
    };
  },
  computed: {
    sortedTimeSlots() {
      return this.timeSlots.slice().sort((a, b) => {
        let result = 0;
        if (a[this.sortKey] < b[this.sortKey]) {
          result = -1;
        } else if (a[this.sortKey] > b[this.sortKey]) {
          result = 1;
        }
        return this.sortOrder === 'asc' ? result : -result;
      });
    },
    dayName() {
      const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П’ятниця', 'Субота'];
      return days[this.dayOfWeek] || 'Невідомий день';
    },
    dayNameInGenitive() {
      const daysInGenitive = ['Неділю', 'Понеділок', 'Вівторок', 'Середу', 'Четверг', 'П’ятницю', 'Суботу'];
      return daysInGenitive[this.dayOfWeek] || 'Невідомий день';
    }
  },
  created() {
    this.fetchTimeSlots();
  },
  methods: {
    fetchTimeSlots() {
      apiService.getTimeSlotsByDayOfWeek(this.dayOfWeek)
        .then(response => {
          if (Array.isArray(response.data)) {
            this.timeSlots = response.data;
          } else {
            console.error('Expected response.data to be an array.');
          }
        })
        .catch(error => {
          console.error('Error fetching time slots:', error);
        });
    },
    deleteTimeSlot(id) {
      if (confirm('Ви впевнені, що хочете видалити цей таймслот?')) {
        apiService.deleteTimeSlot(id)
          .then(() => {
            this.fetchTimeSlots(); // Оновити список таймслотів після видалення
          })
          .catch(error => {
            console.error('Error deleting time slot:', error);
          });
      }
    },
    editTimeSlot(id) {
      this.$router.push(`/timeslots/${id}/edit`);
    },
    sortTable(key) {
      this.sortOrder = this.sortKey === key && this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortKey = key;
    },
    getTypeName(type) {
      switch (type) {
        case 'on':
          return 'Ввімкнення';
        case 'off':
          return 'Вимкнення';
        case 'possible_on':
          return 'Можливе ввімкнення';
        default:
          return '';
      }
    }
  }
};
</script>

<style scoped>
.page-container {
  position: relative; /* Додаємо відносне позиціонування для кнопки Назад */
  padding: 20px;
}

.back-button {
  position: absolute;
  top: 20px;
  left: 20px;
}

.btn-back {
  background-color: #343a40;
  color: white;
  border: none;
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 50%;
}

.btn-back i {
  font-size: 18px; /* Розмір іконки */
}

.btn-back:hover {
  background-color: #495057;
}

.table-container {
  max-width: 1000px; /* Обмежити ширину контейнера */
  margin: 0 auto;
  padding: 20px;
}

.time-slots-table {
  width: 100%;
  border-collapse: collapse;
}

.time-slots-table th, .time-slots-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center; /* Центрування тексту у ячейках */
}

.time-slots-table th {
  background-color: #f2f2f2;
  cursor: pointer;
}

.time-slots-table th:hover {
  background-color: #ddd;
}

.time-slots-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.time-slots-table tr:hover {
  background-color: #e2e2e2;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  margin: 5px;
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

.add-button-container {
  margin-top: 20px;
  padding: 0; /* Видалення відступів */
}

.add-button-container .btn {
  margin-left: 0; /* Щоб кнопка не мала відступів зліва */
}
</style>
