<template>
    <div class="table-container">
        <h2>Список таймслотів</h2>
        <table class="time-slots-table">
            <thead>
                <tr>
                    <th @click="sortTable('startTime')">Час початку</th>
                    <th @click="sortTable('endTime')">Час закінчення</th>
                    <th @click="sortTable('startDay')">Початковий день</th>
                    <th @click="sortTable('endDay')">Кінцевий день</th>
                    <th @click="sortTable('type')">Тип</th>
                    <th>Дії</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="timeSlot in paginatedTimeSlots" :key="timeSlot.id">
                    <td>{{ timeSlot.startTime }}</td>
                    <td>{{ timeSlot.endTime }}</td>
                    <td>{{ timeSlot.startDay.name }}</td>
                    <td>{{ timeSlot.endDay.name }}</td>
                    <td>{{ getTypeName(timeSlot.type) }}</td>
                    <td>
                        <button @click="editTimeSlot(timeSlot.id)" class="btn btn-primary">Редагувати</button>
                        <button @click="deleteTimeSlot(timeSlot.id)" class="btn btn-danger">Видалити</button>
                    </td>
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1" class="btn pagination-btn">❮</button>
            <span>Сторінка {{ currentPage }} з {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="btn pagination-btn">❯</button>
        </div>
        <div class="add-button-container">
            <router-link to="/timeslots/add">
                <button class="btn btn-success">Додати новий таймслот</button>
            </router-link>
        </div>
    </div>
</template>

<script>
import apiService from '../services/api'; // імпортуйте ваш API сервіс

export default {
    data() {
        return {
            timeSlots: [],
            sortKey: '',
            sortOrder: 'asc',
            currentPage: 1,
            pageSize: 10,
        };
    },
    created() {
        this.fetchTimeSlots();
    },
    computed: {
        sortedTimeSlots() {
            if (!Array.isArray(this.timeSlots)) {
                console.error('Expected timeSlots to be an array.');
                return [];
            }
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
        paginatedTimeSlots() {
            const start = (this.currentPage - 1) * this.pageSize;
            const end = start + this.pageSize;
            return this.sortedTimeSlots.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.timeSlots.length / this.pageSize);
        }
    },
    methods: {
        fetchTimeSlots() {
            apiService.getTimeSlots()
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
                        this.fetchTimeSlots();
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
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
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

.time-slots-table {
    width: 100%;
    border-collapse: collapse;
}

.time-slots-table th,
.time-slots-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
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
    background-color: #4ab441;
    color: white;
}

.btn-success:hover {
    background-color: #398831;
}

.add-button-container {
    margin-top: 20px;
    padding: 0;
}

.add-button-container .btn {
    margin-left: 0;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.pagination button {
    margin: 0 10px;
    padding: 5px 10px;
    font-size: 16px;
    background-color: white;
    color: #007bff;
    border: 1px solid #007bff;
    border-radius: 4px;
    cursor: pointer;
}

.pagination button:hover {
    background-color: #007bff;
    color: white;
}

.pagination button:disabled {
    background-color: #eee;
    color: #aaa;
    cursor: not-allowed;
}

.time-slots-table td button {
    display: inline-block;
}
</style>
