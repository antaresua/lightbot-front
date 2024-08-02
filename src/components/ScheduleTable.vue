<template>
    <div class="table-container">
        <h2 class="table-title">Графік відключень</h2>
        <div class="table-wrapper">
            <table class="time-slots-table">
                <thead>
                    <tr>
                        <th colspan="2">Часові<br>проміжки</th>
                        <th v-for="hour in hours" :key="hour" class="rotate-text" :data-hour="hour"></th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="day in sortedDays" :key="day.name" @mouseover="highlightRow($event)" @mouseout="removeHighlight($event)">
                        <td colspan="2" class="day-name">{{ day.name }}</td>
                        <td v-for="hour in hours" :key="hour" :class="getClassForHour(day.originalDayOfWeek, hour)" @mouseover="highlightCell($event)" @mouseout="removeCellHighlight($event)"></td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<script>
import apiService from '../services/api';

export default {
    data() {
        return {
            timeSlots: [],
            days: [
                { name: 'Неділя', dayOfWeek: 0 },
                { name: 'Понеділок', dayOfWeek: 1 },
                { name: 'Вівторок', dayOfWeek: 2 },
                { name: 'Середа', dayOfWeek: 3 },
                { name: 'Четвер', dayOfWeek: 4 },
                { name: 'П’ятниця', dayOfWeek: 5 },
                { name: 'Субота', dayOfWeek: 6 },
            ],
            hours: ['00-01', '01-02', '02-03', '03-04', '04-05', '05-06', '06-07', '07-08', '08-09', '09-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17', '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'],
        };
    },
    computed: {
        sortedDays() {
            return [...this.days].map(day => ({
                ...day,
                originalDayOfWeek: day.dayOfWeek
            })
            ).sort((a, b) => {
                if (a.dayOfWeek === 0) return 1;
                if (b.dayOfWeek === 0) return -1;
                return a.dayOfWeek - b.dayOfWeek;
            });
        }
    },
    methods: {
        async fetchTimeSlots() {
            try {
                const response = await apiService.getTimeSlots();
                this.timeSlots = response.data;
            } catch (error) {
                console.error('Error fetching time slots:', error);
            }
        },
        isHourInTimeSlot(hour, timeSlot) {
            const [hourStart] = hour.split('-').map(h => Number(h.split(':')[0]));
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
        getClassForHour(originalDayOfWeek, hour) {
            const timeSlot = this.timeSlots.find(
                slot => slot.startDay.dayOfWeek === originalDayOfWeek && this.isHourInTimeSlot(hour, slot)
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
        }
    },
    mounted() {
        this.fetchTimeSlots();
    },
}
</script>

<style scoped>
.table-container {
    max-width: 1000px;
    margin: 0 auto;
    padding: 20px;
}

.table-title {
    text-align: center;
}

.table-wrapper {
    overflow-x: auto;
}

.time-slots-table {
    width: 100%;
    border-collapse: collapse;
    table-layout: auto;
}

.time-slots-table th,
.time-slots-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: center;
    word-break: break-word;
}

.time-slots-table th {
    background-color: #f2f2f2;
    font-weight: bold;
    font-size: 16px;
}

.time-slots-table tr:nth-child(even) {
    background-color: #f9f9f9;
}

.highlight-row {
    background-color: #e2e2e2;
    border: 2px solid yellow;
}

.highlight-cell {
    background-color: #696969 !important;
}

.cell-on {
    background-color: white;
    color: black;
}

.cell-off {
    background-color: rgba(204, 206, 207, .67);
    color: black;
    background-image: url('../assets/no-electricity.png');
    background-size: 15.75px 15.75px;
    background-repeat: no-repeat;
    background-position: center;
}

.cell-possible-on {
    background-color: rgba(204, 206, 207, .33);
    color: black;
    background-image: url('../assets/maybe-electricity.png');
    background-size: 15.75px 15.75px;
    background-repeat: no-repeat;
    background-position: center;
}

.time-slots-table th.rotate-text {
    position: relative;
    text-align: center;
    vertical-align: middle;
    padding: 15px;
}

.time-slots-table th.rotate-text::before {
    content: attr(data-hour);
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%) rotate(-90deg);
    transform-origin: center;
    white-space: nowrap;
    font-size: 14px;
    display: block;
}

.day-name {
    font-weight: bold;
    font-size: 14px;
    white-space: nowrap;
}

@media (max-width: 768px) {
    .time-slots-table th,
    .time-slots-table td {
        font-size: 12px;
        padding: 4px;
    }
}

@media (max-width: 480px) {
    .time-slots-table th.rotate-text::before {
        font-size: 10px;
    }

    .day-name {
        font-size: 12px;
    }
}
</style>
