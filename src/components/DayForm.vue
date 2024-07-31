<template>
  <div class="form-container">
    <h1>Додати дні тижня</h1>
    <form @submit.prevent="handleSubmit">
      <div v-for="(day, index) in days" :key="index" class="day-form">
        <div class="form-group">
          <label for="dayOfWeek">Номер дня тижня:</label>
          <input type="number" v-model="day.dayOfWeek" required>
        </div>
        <div class="form-group">
          <label for="name">Ім'я дня тижня:</label>
          <input type="text" v-model="day.name" required>
        </div>
        <button type="button" @click="removeDay(index)" class="btn btn-danger">Видалити цей день</button>
      </div>
      <div class="form-buttons">
        <button type="button" @click="addDay" class="btn btn-primary">Додати ще один день</button>
        <button type="submit" class="btn btn-success">Зберегти</button>
      </div>
    </form>
  </div>
</template>

<script>
import apiService from '../services/api'; // Імпортуйте ваш API сервіс

export default {
  props: {
    id: {
      type: Number,
      required: false
    }
  },
  data() {
    return {
      days: [{ name: '', dayOfWeek: '' }], // Початкове поле для одного дня
      formTitle: 'Add New Days'
    };
  },
  created() {
    if (this.id) {
      this.formTitle = 'Edit Days';
      apiService.getDay(this.id)
        .then(response => {
          this.days = [response.data]; // Якщо редагуємо один день, створюємо масив з одного елемента
        })
        .catch(error => {
          console.error('There was an error fetching the day!', error);
        });
    }
  },
  methods: {
    addDay() {
      this.days.push({ name: '', dayOfWeek: '' });
    },
    removeDay(index) {
      if (this.days.length > 1) {
        this.days.splice(index, 1);
      }
    },
    handleSubmit() {
      if (this.id) {
        // Оновлення одного дня
        apiService.updateDay(this.id, this.days[0])
          .then(() => {
            this.$router.push('/days');
          })
          .catch(error => {
            console.error('There was an error updating the day!', error);
          });
      } else {
        // Додавання кількох днів
        apiService.createDays(this.days)
          .then(() => {
            this.$router.push('/days');
          })
          .catch(error => {
            console.error('There was an error adding the days!', error);
          });
      }
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

.form-group input {
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
</style>
