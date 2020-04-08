<template>
  <div id="app">
    <div class="page">
      <div class="header">
        <router-link to="/">Home</router-link>
      </div>
      <router-view />
    </div>
  </div>
</template>

<style lang="less">
html,body{
  padding: 0;
  margin: 0;
    width: 100vw;
  height: 100vh;
}
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
  width: 100%;
  height: 100%;
}
.page {
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  .header {
    height: 50px;
  }
  .container {
    border: 1px solid #aaa;
    flex-grow: 1;
  }
}
</style>
