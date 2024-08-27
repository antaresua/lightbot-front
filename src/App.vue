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
                            <router-link class="nav-link" to="/schedule">Графік</router-link>
                        </li>
                        <li class="nav-item">
                            <router-link class="nav-link" to="/statuses">Лог подій</router-link>
                        </li>
                        <!-- Додайте інші посилання на сторінки, якщо потрібно -->
                        <li class="nav-item dropdown">
                            <a class="nav-link dropdown-toggle disabled" href="#" role="button"
                                data-bs-toggle="dropdown" aria-expanded="false" aria-disabled="true">
                                Управління графіком
                            </a>
                            <ul class="dropdown-menu">
                                <li><router-link to="/days" class="dropdown-item">Дні тижня</router-link></li>
                                <li><router-link to="/timeslots" class="dropdown-item">Тайм-слоти</router-link></li>
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
        <router-view />
    </div>
</template>

<script>
export default {
    name: 'App',
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

.nav-link {
    color: #42b983 !important;
}

.nav-link.router-link-exact-active {
    font-weight: bold;
}

/* Видалення стандартних стилів Bootstrap для бургер-меню */
.navbar-toggler.custom-toggler {
    border: none;
    background: transparent;
    padding: 0;
    outline: none;
}

/* Прибираємо фокусний ефект для кнопки бургер-меню */
.navbar-toggler.custom-toggler:focus {
    box-shadow: none;
    outline: none;
}

.navbar-toggler.custom-toggler .navbar-toggler-icon {
    background-image: none;
    /* Прибирає стандартну іконку Bootstrap */
}

.navbar-toggler.custom-toggler .navbar-toggler-icon span {
    display: block;
    width: 30px;
    height: 3px;
    background-color: #42b983;
    /* Зелений колір ліній */
    margin: 5px 0;
    /* Відстань між лініями */
}
</style>
