<template>
  <div id="app">
    <nav>
      <router-link to="/days">Days</router-link>
      <router-link to="/timeslots" >Time Slots</router-link>
      <!-- Додайте інші посилання на сторінки, якщо потрібно -->
    </nav>
    <router-view/>
  </div>
</template>

<script>
export default {
  name: 'App',
};
</script>

<style>
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
