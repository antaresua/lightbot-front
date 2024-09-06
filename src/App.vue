<template>
    <div id="app">
        <nav class="navbar navbar-expand-lg navbar-light bg-light">
            <div class="container-fluid">
                <a class="navbar-brand" href="#" style="font-weight: bolder;">СвітлоБот</a>
                <button class="navbar-toggler custom-toggler" type="button" data-bs-toggle="collapse"
                    data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false"
                    aria-label="Toggle navigation">
                    <span class="navbar-toggler-icon">
                        <span></span>
                        <span></span>
                        <span></span>
                    </span>
                </button>
                <div class="collapse navbar-collapse" id="navbarNav">
                    <ul class="navbar-nav">
                        <li class="nav-item">
                            <router-link class="nav-link" to="/schedule" @click="closeNav">Графік</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/statuses" @click="closeNav">Лог подій</router-link>
                        </li>
                        <!-- Додайте інші посилання на сторінки, якщо потрібно -->
                        <li class="nav-item dropdown disabled">
                            <a class="nav-link dropdown-toggle disabled" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false" aria-disabled="true">
                                Управління графіком
                            </a>
                            <ul class="dropdown-menu">
                                <li>
                                    <router-link to="/days" class="dropdown-item" @click="closeNav">Дні
                                        тижня</router-link>
                                </li>
                                <li>
                                    <router-link to="/timeslots" class="dropdown-item"
                                        @click="closeNav">Тайм-слоти</router-link>
                                </li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <router-view />
        <footer>
            <p>&copy; 2024. Developed by <a href="https://t.me/bondarenkoid" target="_blank">@bondarenkoid</a>. Всі права захищено.</p>
        </footer>
    </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.min.css';
import * as bootstrap from 'bootstrap';

export default {
    name: 'App',
    methods: {
        closeNav() {
            const navBar = document.getElementById('navbarNav');
            if (navBar) {
                const bsCollapse = new bootstrap.Collapse(navBar, {
                    toggle: false
                });
                bsCollapse.hide();
            }
        }
    },
    mounted() {
        // Додайте будь-які додаткові налаштування або ініціалізацію тут, якщо потрібно
    }
};
</script>

<style>
body {
    font-family: 'Roboto', sans-serif;
}

.navbar {
    margin-bottom: 1rem;
    background-image: none;
}

.nav-link.router-link-exact-active {
    font-weight: bold;
}

.navbar-toggler.custom-toggler {
    border: none;
    background: transparent;
    padding: 0;
    outline: none;
}

.navbar-toggler.custom-toggler:focus {
    box-shadow: none;
    outline: none;
}

.navbar-toggler.custom-toggler .navbar-toggler-icon {
    background-image: none;
}

.navbar-toggler.custom-toggler .navbar-toggler-icon span {
    display: block;
    width: 30px;
    height: 3px;
    background-color: #4ab441;
    margin: 5px 0;
}

.disabled {
    color: rgba(158, 158, 158, 0.3) !important;
}

footer {
    margin-top: 20px;
    padding: 10px;
    background-color: #f8f9fa;
    text-align: center;
    font-size: 12px;
    text-size-adjust: 100%;
}
</style>