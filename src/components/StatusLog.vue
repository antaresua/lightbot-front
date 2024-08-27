<template>
    <div class="table-container">
        <h2 class="table-title" style="font-weight: bold;">Лог подій</h2>
        <table class="status-table">
            <thead>
                <tr>
                    <th @click="sortTable('createdAt')">Дата</th>
                    <th @click="sortTable('status')">Статус</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="(status, index) in paginatedStatuses" :key="status.id" :class="{'highlight-row': index === 0}">
                    <td>{{ status.createdAt }}</td>
                    <td>{{ getStatusLabel(status.status) }}</td>
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
            itemsPerPage: 10,
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
            return status === 'on' ? '🟢 Ввімкнено' : '🔴 Вимкнено ';
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
.table-title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.table-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.status-table {
    width: 100%;
    border-collapse: collapse;
}

.status-table th,
.status-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: center;
    font-size: 14px;
}

.status-table th {
    background-color: #f2f2f2;
    cursor: pointer;
    font-weight: bold;
}

.status-table th:hover {
    background-color: #e0e0e0;
}

.status-table tr:nth-child(even) {
    background-color: #fafafa;
}

.status-table tr:hover {
    background-color: #e2e2e2;
}

.highlight-row {
    border: 2px solid #ffbb00;
}

.btn {
    padding: 8px 16px;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    margin: 5px;
    font-size: 14px;
    transition: background-color 0.3s ease;
}

.btn-red {
    background-color: #ff5722;
    color: white;
}

.btn-red:hover {
    background-color: #e64a19;
}

.pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    margin-top: 20px;
}

.pagination button {
    margin: 0 8px;
    padding: 6px 12px;
    font-size: 16px;
    background-color: #ffffff;
    color: #007bff;
    border: 1px solid #007bff;
    border-radius: 4px;
    cursor: pointer;
    transition: background-color 0.3s ease;
}

.pagination button:hover {
    background-color: #007bff;
    color: white;
}

.pagination button:disabled {
    background-color: #e0e0e0;
    color: #aaa;
    cursor: not-allowed;
}
</style>
