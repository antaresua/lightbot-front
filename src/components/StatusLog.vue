<template>
    <div class="parent-container">
        <div class="table-container">
            <h2 class="table-title" style="font-weight: bold;">Лог подій</h2>

            <div class="current-status">
                <h3>Поточний статус: <span v-html="currentStatusLabel"></span></h3>
                <p>{{ duration }}</p>
            </div>

            <table class="status-table">
                <thead>
                    <tr>
                        <th @click="sortTable('createdAt')">Дата</th>
                        <th @click="sortTable('status')">Статус</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="(status, index) in paginatedStatuses" :key="status.id"
                        :class="{ 'highlight-row': index === 0 }">
                        <td>{{ formatDate(status.createdAt) }}</td>
                        <td v-html="getStatusLabel(status.status)"></td>
                    </tr>
                </tbody>
            </table>
            <div class="pagination">
                <button @click="prevPage" :disabled="currentPage === 1" class="btn pagination-btn">❮</button>
                <span>Сторінка {{ currentPage }} з {{ totalPages }}</span>
                <button @click="nextPage" :disabled="currentPage === totalPages" class="btn pagination-btn">❯</button>
            </div>
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
            currentStatus: null,
            currentStatusChangeTime: null,
            timer: null,
        };
    },
    created() {
        this.fetchStatuses();
        this.calculateCurrentStatus();
        this.startTimer();
    },
    computed: {
        sortedStatuses() {
            return this.statuses.slice().sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        },
        paginatedStatuses() {
            const start = (this.currentPage - 1) * this.itemsPerPage;
            const end = start + this.itemsPerPage;
            return this.sortedStatuses.slice(start, end);
        },
        totalPages() {
            return Math.ceil(this.statuses.length / this.itemsPerPage);
        },
        currentStatusLabel() {
            if (this.currentStatus) {
                return this.currentStatus === 'on' ? '🟢 Ввімкнено' : '🔴 Вимкнено';
            }
            return 'Немає даних';
        },
        duration() {
            if (this.currentStatusChangeTime) {
                const now = new Date();
                const durationInMs = now - this.currentStatusChangeTime;
                const days = Math.floor(durationInMs / (24 * 60 * 60 * 1000));
                const hours = Math.floor((durationInMs % (24 * 60 * 60 * 1000)) / (60 * 60 * 1000));
                const minutes = Math.floor((durationInMs % (60 * 60 * 1000)) / (60 * 1000));
                const seconds = Math.floor((durationInMs % (60 * 1000)) / 1000);

                let durationString = '';
                if (days > 0) {
                    durationString += `${days} днів `;
                }
                if (hours > 0 || days > 0) {
                    durationString += `${hours} год `;
                }
                if (minutes > 0 || hours > 0 || days > 0) {
                    durationString += `${minutes} хв `;
                }
                durationString += `${seconds} сек`;

                return durationString;
            }
            return '0 сек';
        }
    },
    methods: {
        fetchStatuses() {
            apiService.getStatuses()
                .then(response => {
                    this.statuses = response.data;
                    this.calculateCurrentStatus();
                })
                .catch(error => {
                    console.error('There was an error fetching the statuses!', error);
                });
        },
        getStatusLabel(status) {
            return status === 'on'
                ? '<span class="status-icon">🟢</span> <span class="status-text">Ввімкнено</span>'
                : '<span class="status-icon">🔴</span> <span class="status-text">Вимкнено</span>';
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
        },
        calculateCurrentStatus() {
            if (this.statuses.length) {
                const latestStatus = this.statuses[0]; // Найновіший статус
                this.currentStatus = latestStatus.status;
                this.currentStatusChangeTime = new Date(latestStatus.createdAt);
            }
        },
        formatDate(dateString) {
            const date = new Date(dateString);
            return date.toLocaleDateString() + ' ' + date.toLocaleTimeString(); // Форматування дати для відображення
        },
        startTimer() {
            this.timer = setInterval(() => {
                this.calculateCurrentStatus(); // Оновлюємо статус
            }, 1000); // Оновлюємо кожну секунду
        }
    },
    beforeUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
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

.parent-container {
    display: flex;
    justify-content: center;
    padding-top: 10px;
}

.table-container {
    display: inline-block;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
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

.status-table {
    border-collapse: collapse;
    display: inline-table;
    margin: auto;
    max-width: 100%;
}

.status-table th,
.status-table td {
    border: 1px solid #ddd;
    padding: 12px;
    text-align: left;
    padding: 10px 100px;
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

.status-icon {
    display: inline-block;
    width: 24px;
    text-align: center;
    vertical-align: middle;
}

.status-text {
    vertical-align: middle;
    font-size: 16px;
}

.current-status {
    margin-bottom: 20px;
    padding: 10px;
    background-color: #f1f1f1;
    border-radius: 8px;
    text-align: center;
    font-size: 18px;
    display: block;
}

.current-status h3 {
    margin: 0;
    color: #333;
    font-size: 18px;
    display: block;
    align-items: center;
}

.current-status p {
    margin: 0;
    font-size: 16px;
    color: #666;
}

@media (max-width: 768px) {
    .status-table th,
    .status-table td {
        padding: 10px 40px;
    }
}

@media (max-width: 480px) {
    .status-table th,
    .status-table td {
        padding: 10px 20px;
    }
}
</style>
