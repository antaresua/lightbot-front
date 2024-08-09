<template>
    <div id="app">
        <nav>
            <router-link to="/schedule">Графік</router-link>
            <router-link to="/statuses">Лог подій</router-link>
            <router-link to="/days">Дні</router-link>
            <router-link to="/timeslots">Години</router-link>
            <!-- Додайте інші посилання на сторінки, якщо потрібно -->
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
    /* Додає шрифт Roboto до всього документа */
}

nav {
    padding: 1rem;
    background-color: #f8f9fa;
}

nav a {
    margin-right: 1rem;
    text-decoration: none;
    color: #42b983;
}

nav a.router-link-exact-active {
    font-weight: bold;
}
</style>
