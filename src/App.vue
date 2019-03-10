<template>
  <div id="app">
    <div class="page-header">
      <div class="container">
        <div class="row">
          <div class="col-xs-24">
            <h3 class="p-xxs">Catlog</h3>
            <ul id="nav" class="nav nav-tabs" role="tablist">
              <li role="presentation" class="active"><router-link to="/">Home</router-link></li>
              <li role="presentation" class="active"><router-link to="/about">About</router-link></li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <!--
    <div id="nav2">
      <router-link to="/">Home</router-link> |
      <router-link to="/about">About</router-link>
    </div>
    -->
    <div>
      <router-view/>
    </div>
  </div>
</template>

<style lang="scss">
  #app {
    font-family: 'Verdana', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
  }
  .page-header h3 {
  }
  #nav {
    a {
      font-weight: bold;
      color: #2c3e50;
      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
