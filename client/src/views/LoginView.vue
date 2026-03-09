<script setup lang="ts"></script>

<template>
  <div class="box">
    <h1 class="title">Login</h1>
    <div class="columns is-centered">
      <div class="column is-5">
        <div class="field">
          <label class="label">Username</label>
          <div class="control has-icons-left">
            <input class="input" type="text" placeholder="Enter username" />
            <span class="icon is-left"><i class="fas fa-user"></i></span>
          </div>
        </div>
        <div class="field">
          <label class="label">Password</label>
          <div class="control has-icons-left">
            <input class="input" type="password" placeholder="Enter password" />
            <span class="icon is-left"><i class="fas fa-lock"></i></span>
          </div>
        </div>
        <div class="field is-grouped">
          <div class="control">
            <button class="button is-primary">Login</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
