<template>
    <div class="table-container">
        <h2 class="table-title" style="font-weight: bold;">Графік відключень</h2>
        <div class="table-wrapper">
            <table class="time-slots-table">
                <thead>
                    <tr>
                        <th colspan="2" class="time-slots-header">Часові<br>проміжки</th>
                        <th v-for="hour in hours" :key="hour" class="rotate-text" :data-hour="hour"></th>
                    </tr>
                </thead>
                <tbody v-if="days.length">
                    <tr v-for="day in sortedDays" :key="day.dayOfWeek" @mouseover="highlightRow" @mouseout="removeHighlight">
                        <td colspan="2" class="day-name">{{ day.name }}</td>
                        <td v-for="hour in hours" :key="hour" :class="getClassForHour(day.dayOfWeek, hour)"
                            @mouseover="highlightCell" @mouseout="removeCellHighlight">
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr>
                        <td colspan="2">Loading...</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="legend-container">
            <div class="legend">
                <div class="legend-item">
                    <span class="legend-color cell-off"></span> - Відключення світла
                </div>
                <div class="legend-item">
                    <span class="legend-color cell-possible-on"></span> - Можливе включення
                </div>
                <div class="legend-item">
                    <span class="legend-color cell-on"></span> - Світло є
                </div>
            </div>
        </div>
        <div class="subscribe-button-container">
            <button class="subscribe-button" @click="subscribeToTelegram">Підписатись на Telegram</button>
            <p class="note">* підписуйтесь, щоб отримувати сповіщення про відключення/включення світла в реальному часі</p>
        </div>
    </div>
</template>

<script>
import apiService from '../services/api';

export default {
    data() {
        return {
            timeSlots: [],
            days: [],
            hours: ['00-01', '01-02', '02-03', '03-04', '04-05', '05-06', '06-07', '07-08', '08-09', '09-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'],
        };
    },
    computed: {
        sortedDays() {
            const sorted = [...this.days].sort((a, b) => a.dayOfWeek - b.dayOfWeek);
            const sunday = sorted.find(day => day.dayOfWeek === 0);
            const otherDays = sorted.filter(day => day.dayOfWeek !== 0);
            return [...otherDays, sunday];
        }
    },
    methods: {
        async fetchDays() {
            try {
                const response = await apiService.getDays();
                this.days = response.data;
            } catch (error) {
                console.error('Error fetching days:', error);
            }
        },
        async fetchTimeSlots() {
            try {
                const response = await apiService.getTimeSlots();
                this.timeSlots = response.data;
            } catch (error) {
                console.error('Error fetching time slots:', error);
            }
        },
        isHourInTimeSlot(hour, timeSlot) {
            const [hourStart] = hour.split('-').map(Number);
            const [slotStartHour, slotStartMinute] = timeSlot.startTime.split(':').map(Number);
            const [slotEndHour, slotEndMinute] = timeSlot.endTime.split(':').map(Number);

            const slotStart = slotStartHour + slotStartMinute / 60;
            const slotEnd = slotEndHour + slotEndMinute / 60;
            const hourFloat = hourStart;

            return (
                (slotStart <= slotEnd && hourFloat >= slotStart && hourFloat < slotEnd) ||
                (slotStart > slotEnd && (hourFloat >= slotStart || hourFloat < slotEnd))
            );
        },
        getClassForHour(dayOfWeek, hour) {
            const timeSlot = this.timeSlots.find(
                slot => slot.startDay.dayOfWeek === dayOfWeek && this.isHourInTimeSlot(hour, slot)
            );
            return timeSlot ? this.getClassForTimeSlot(timeSlot.type) : '';
        },
        getClassForTimeSlot(type) {
            switch (type) {
                case 'on':
                    return 'cell-on';
                case 'off':
                    return 'cell-off';
                case 'possible_on':
                    return 'cell-possible-on';
                default:
                    return '';
            }
        },
        highlightRow(event) {
            const row = event.currentTarget;
            row.classList.add('highlight-row');
        },
        removeHighlight(event) {
            const row = event.currentTarget;
            row.classList.remove('highlight-row');
        },
        highlightCell(event) {
            const cell = event.currentTarget;
            cell.classList.add('highlight-cell');
        },
        removeCellHighlight(event) {
            const cell = event.currentTarget;
            cell.classList.remove('highlight-cell');
        },
        subscribeToTelegram() {
            window.location.href = 'https://t.me/svitlobot_em_e2a';
        },
        highlightCurrentTime() {
            const now = new Date();
            const currentDayOfWeek = now.getDay();
            const dayRowIndex = (currentDayOfWeek === 0 ? 6 : currentDayOfWeek - 1) + 1;
            const dayRow = this.$el.querySelector(`tbody tr:nth-child(${dayRowIndex})`);
            if (dayRow) {
                this.highlightRow({ currentTarget: dayRow });
            }
        }
    },
    mounted() {
        this.fetchDays().then(() => {
            this.fetchTimeSlots().then(() => {
                this.highlightCurrentTime();
            });
        });
    }
}
</script>

<style scoped>
.table-container {
    max-width: 1200px;
    margin: 20px auto;
    padding: 20px;
    background-color: #f9f9f9;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
}

.table-title {
    text-align: center;
    font-size: 24px;
    margin-bottom: 20px;
    color: #333;
}

.table-wrapper {
    overflow-x: auto;
    width: 100%;
}

.time-slots-table {
    width: 100%;
    border-collapse: collapse;
}

.time-slots-table th,
.time-slots-table td {
    border: 1px solid #ddd;
    padding: 13px;
    text-align: center;
    font-size: 16px;
    min-width: 40px;
    width: 40px;
}

.time-slots-table th {
    background-color: #f2f2f2;
    font-weight: bold;
}

.time-slots-table tr:nth-child(even) {
    background-color: #fafafa;
}

.highlight-row {
    background-color: #e2e2e2;
    border: 2px solid #ffbb00;
}

.highlight-cell {
    background-color: #8ff376 !important;
}

.cell-on {
    background-color: #e8f5e9;
    color: #388e3c;
}

.cell-off {
    background-color: #fce4ec;
    color: #d32f2f;
    background-image: url('../assets/no-electricity.png');
    background-size: 20px 20px;
    background-repeat: no-repeat;
    background-position: center;
}

.cell-possible-on {
    background-color: #e3f2fd;
    color: #0288d1;
    background-image: url('../assets/maybe-electricity.png');
    background-size: 20px 20px;
    background-repeat: no-repeat;
    background-position: center;
}

.time-slots-header {
    white-space: nowrap;
    text-align: center;
}

.time-slots-table th.rotate-text {
    position: relative;
    text-align: center;
    vertical-align: middle;
    padding: 10px;
    white-space: nowrap;
}

.time-slots-table th.rotate-text::before {
    content: attr(data-hour);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
    transform-origin: center;
    white-space: nowrap;
}

.legend-container {
    display: flex;
    justify-content: center;
    margin-top: 20px;
    margin-bottom: 20px;
}

.legend {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
}

.legend-item {
    margin-right: 20px;
    font-size: 14px;
    display: flex;
    align-items: center;
}

.legend-color {
    display: inline-block;
    width: 20px;
    height: 20px;
    border-radius: 50%;
    margin-right: 8px;
}

.cell-off.legend-color {
    background-color: #fce4ec;
}

.cell-possible-on.legend-color {
    background-color: #e3f2fd;
}

.cell-on.legend-color {
    background-color: #e8f5e9;
}

.subscribe-button-container {
    text-align: center;
}

.subscribe-button {
    background-color: #4ab441;
    color: white;
    border: none;
    border-radius: 5px;
    padding: 10px 20px;
    font-size: 16px;
    cursor: pointer;
}

.subscribe-button:hover {
    background-color: #398831;
}

.note {
    font-size: 12px;
    color: #666;
    margin-top: 10px;
}

/* Media Queries */
@media (max-width: 768px) {
    .time-slots-table th,
    .time-slots-table td {
        font-size: 14px;
        padding: 8px;
    }

    .time-slots-table th.rotate-text::before {
        font-size: 12px;
    }

    .cell-off,
    .cell-possible-on {
        background-size: 12px 12px;
    }

    .day-name {
        font-size: 12px;
    }

    .legend-item {
        font-size: 12px;
    }

    .subscribe-button {
        font-size: 14px;
        padding: 8px 16px;
    }
}

@media (max-width: 480px) {
    .table-title {
        font-size: 20px;
    }

    .time-slots-table th,
    .time-slots-table td {
        font-size: 12px;
        padding: 6px;
    }

    .cell-off,
    .cell-possible-on {
        background-size: 12px 12px;
    }

    .day-name {
        font-size: 10px;
    }

    .legend-item {
        font-size: 10px;
    }

    .subscribe-button {
        font-size: 12px;
        padding: 8px 16px;
    }
}
</style>
