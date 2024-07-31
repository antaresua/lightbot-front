<template>
  <div class="table-container">
    <h2>Список днів тижня</h2>
    <table class="days-table">
      <thead>
        <tr>
          <th @click="sortTable('id')">ID</th>
          <th @click="sortTable('dayOfWeek')" class="narrow-col">№ дня тижня (ISO)</th>
          <th @click="sortTable('name')">Назва</th>
          <th>Дії</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="day in sortedDays" :key="day.id">
          <td>{{ day.id }}</td>
          <td class="narrow-col">{{ day.dayOfWeek }}</td>
          <td>{{ day.name }}</td>
          <td>
            <button @click="editDay(day.id)" class="btn btn-primary">Редагувати</button>
            <button @click="deleteDay(day.id)" class="btn btn-danger">Видалити</button>
            <button @click="showTimeSlots(day.dayOfWeek)" class="btn btn-black">Показати таймслоти</button>
          </td>
        </tr>
      </tbody>
    </table>
    <div class="add-button-container">
      <button @click="goToAddPage" class="btn btn-success">Додати новий день</button>
    </div>
  </div>
</template>

<script>
import apiService from '../services/api';

export default {
  data() {
    return {
      days: [],
      sortKey: '',
      sortOrder: 'asc'
    };
  },
  created() {
    apiService.getDays()
      .then(response => {
        this.days = response.data;
      })
      .catch(error => {
        console.error('There was an error fetching the days!', error);
      });
  },
  computed: {
    sortedDays() {
      return this.days.slice().sort((a, b) => {
        let result = 0;
        if (a[this.sortKey] < b[this.sortKey]) {
          result = -1;
        } else if (a[this.sortKey] > b[this.sortKey]) {
          result = 1;
        }
        return this.sortOrder === 'asc' ? result : -result;
      });
    }
  },
  methods: {
    editDay(id) {
      this.$router.push(`/days/${id}/edit`);
    },
    goToAddPage() {
      this.$router.push('/days/add');
    },
    deleteDay(id) {
      if (confirm('Ви впевнені, що хочете видалити цей день?')) {
        apiService.deleteDay(id)
          .then(() => {
            this.days = this.days.filter(day => day.id !== id);
          })
          .catch(error => {
            console.error('Error deleting day:', error);
          });
      }
    },
    showTimeSlots(dayOfWeek) {
      this.$router.push(`/timeslots/by-day/${dayOfWeek}`);
    },
    sortTable(key) {
      this.sortOrder = this.sortKey === key && this.sortOrder === 'asc' ? 'desc' : 'asc';
      this.sortKey = key;
    }
  }
};
</script>

<style scoped>
.table-container {
  max-width: 1000px;
  margin: 0 auto;
  padding: 20px;
}

.days-table {
  width: 100%;
  border-collapse: collapse;
}

.days-table th, .days-table td {
  border: 1px solid #ddd;
  padding: 8px;
  text-align: center; /* Центрування тексту у ячейках */
}

.days-table th {
  background-color: #f2f2f2;
  cursor: pointer;
}

.days-table th:hover {
  background-color: #ddd;
}

.days-table tr:nth-child(even) {
  background-color: #f9f9f9;
}

.days-table tr:hover {
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

.btn-success {
  background-color: #28a745;
  color: white;
}

.btn-success:hover {
  background-color: #218838;
}

.btn-danger {
  background-color: #dc3545;
  color: white;
}

.btn-danger:hover {
  background-color: #c82333;
}

.btn-black {
  background-color: #000;
  color: white;
}

.btn-black:hover {
  background-color: #333;
}

.add-button-container {
  margin-top: 20px;
  padding: 0; /* Видалення відступів */
}

.add-button-container .btn {
  margin-left: 0; /* Щоб кнопка не мала відступів зліва */
}
</style>
