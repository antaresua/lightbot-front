<template>
    <div class="table-container">
        <h2 style="text-align: center; font-weight: bold;">Лог подій</h2>
        <table class="status-table">
            <thead>
                <tr>
                    <!-- <th @click="sortTable('id')" class="narrow-col">ID</th> -->
                    <th @click="sortTable('createdAt')">Дата</th>
                    <th @click="sortTable('status')">Статус</th>
                    <!-- <th class="narrow-col">Дії</th> -->
                </tr>
            </thead>
            <tbody>
                <tr v-for="status in paginatedStatuses" :key="status.id">
                    <!-- <td class="narrow-col">{{ status.id }}</td> -->
                    <td>{{ status.createdAt }}</td>
                    <td>{{ getStatusLabel(status.status) }}</td>
                    <!-- <td class="narrow-col">
                        <button @click="deleteStatus(status.id)" class="btn btn-red">Видалити</button>
                    </td> -->
                </tr>
            </tbody>
        </table>
        <div class="pagination">
            <button @click="prevPage" :disabled="currentPage === 1" class="btn pagination-btn">❮</button>
            <span>Сторінка {{ currentPage }} з {{ totalPages }}</span>
            <button @click="nextPage" :disabled="currentPage === totalPages" class="btn pagination-btn">❯</button>
        </div>
    </div>
</template>

<script>
import apiService from '../services/api';

export default {
    data() {
        return {
            statuses: [],
            sortKey: '',
            sortOrder: 'asc',
            currentPage: 1,
            itemsPerPage: 5 // Кількість елементів на сторінку
        };
    },
    created() {
        this.fetchStatuses();
    },
    computed: {
        sortedStatuses() {
            return this.statuses.slice().sort((a, b) => {
                let result = 0;
                if (a[this.sortKey] < b[this.sortKey]) {
                    result = -1;
                } else if (a[this.sortKey] > b[this.sortKey]) {
                    result = 1;
                }
                return this.sortOrder === 'asc' ? result : -result;
            });
        },
        paginatedStatuses() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.sortedStatuses.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.statuses.length / this.itemsPerPage);
        }
    },
    methods: {
        fetchStatuses() {
            apiService.getStatuses()
                .then(response => {
                    this.statuses = response.data;
                })
                .catch(error => {
                    console.error('There was an error fetching the statuses!', error);
                });
        },
        getStatusLabel(status) {
            return status === 'on' ? 'Ввімкнення' : 'Вимкнення';
        },
        sortTable(key) {
            this.sortOrder = this.sortKey === key && this.sortOrder === 'asc' ? 'desc' : 'asc';
            this.sortKey = key;
        },
        nextPage() {
            if (this.currentPage < this.totalPages) {
                this.currentPage++;
            }
        },
        prevPage() {
            if (this.currentPage > 1) {
                this.currentPage--;
            }
        },
        deleteStatus(id) {
            if (confirm('Ви впевнені, що хочете видалити цей запис?')) {
                apiService.deleteStatus(id)
                    .then(() => {
                        this.statuses = this.statuses.filter(status => status.id !== id);
                    })
                    .catch(error => {
                        console.error('There was an error deleting the status!', error);
                    });
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

.status-table {
    width: 100%;
    border-collapse: collapse;
}

.status-table th,
.status-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
}

.status-table th {
    background-color: #f2f2f2;
    cursor: pointer;
}

.status-table th:hover {
    background-color: #ddd;
}

.status-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.status-table tr:hover {
    background-color: #e2e2e2;
}

.btn {
    padding: 10px 20px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
}

.btn-red {
    background-color: #ff0000;
    color: white;
}

.btn-red:hover {
    background-color: #cc0000;
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
</style>
