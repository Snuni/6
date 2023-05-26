<template>
  <div id="app">
    <div>Отправка файла</div>
  <form enctype="multipart/form-data" method="post" >
   <p ><input type="file" name="f" >
   <input type="submit" value="Отправить" ></p></form> 
  </div>
</template>

<script>


export default {
  name: 'App',
  components: {
    
  }
}
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}

</style>
