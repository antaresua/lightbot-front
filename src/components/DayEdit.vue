<template>
    <div class="form-container">
        <h1>Редагувати день тижня</h1>
        <form @submit.prevent="handleSubmit">
            <div class="day-form">
                <div class="form-group">
                    <label for="dayOfWeek">Номер дня тижня:</label>
                    <input type="number" id="dayOfWeek" v-model="day.dayOfWeek" required autocomplete="off">
                </div>
                <div class="form-group">
                    <label for="name">Ім'я дня тижня:</label>
                    <input type="text" id="name" v-model="day.name" required autocomplete="off">
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
import apiService from '../services/api';

export default {
    props: {
        id: {
            type: [Number, String],
            required: true
        }
    },
    data() {
        return {
            day: { name: '', dayOfWeek: '' },
        };
    },
    created() {
        apiService.getDay(this.id)
            .then(response => {
                this.day = response.data;
            })
            .catch(error => {
                console.error('There was an error fetching the day!', error);
            });
    },
    methods: {
        handleSubmit() {
            apiService.updateDay(this.id, this.day)
                .then(() => {
                    this.$router.push('/days');
                })
                .catch(error => {
                    console.error('There was an error updating the day!', error);
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
    box-sizing: border-box;
}

.form-buttons {
    display: flex;
    justify-content: space-between;
    margin-top: 20px;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    box-sizing: border-box;
}

.btn-left {
    margin-right: auto;
}

.btn-right {
    margin-left: auto;
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
    background-color: #4ab441;
    color: white;
}

.btn-success:hover {
    background-color: #398831;
}

.btn-secondary {
    background-color: #6c757d;
    color: white;
}

.btn-secondary:hover {
    background-color: #5a6268;
}
</style>