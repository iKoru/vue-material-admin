<template>
  <v-app id="signin" class="primary">
    <v-content>
      <v-container fluid fill-height>
        <v-layout align-center justify-center>
          <v-flex xs12 sm8 md4 lg4>
            <v-card class="elevation-1 pa-3">
              <v-card-text>
                <div class="layout column align-center">
                  <img src="/static/m.png" alt="Vue Material Admin" width="120" height="120">
                  <h1 class="flex my-4 primary--text">Material Admin Template</h1>
                </div>                
                <v-form>
                  <v-alert :value="true" type="error" v-if="message">{{message}}</v-alert>
                  <v-text-field append-icon="person" ref="userId" name="userId" label="userId" type="text" v-model="userId" @keyup.enter.native="signin" ></v-text-field>
                  <v-text-field append-icon="lock" ref="password" name="password" label="Password" id="password" type="password" v-model="password" @keyup.enter.native="signin" ></v-text-field>
                </v-form>
              </v-card-text>
              <v-card-actions>
                <v-spacer></v-spacer>
                <v-btn block color="primary" @click="signin" :loading="loading">Sign in</v-btn>
              </v-card-actions>
            </v-card>
          </v-flex>
        </v-layout>
      </v-container>
    </v-content>
  </v-app>
</template>

<script>
/* global localStorage */
export default {
  data: () => ({
    loading: false,
    message: null,
    userId: localStorage.getItem('userId') || '',
    password: ''
  }),

  created () {
    const token = localStorage.getItem('accessToken');
    if (token) {
      this.loading = true;
      this.$http({
        method: 'POST',
        url: `${window.config.apiServerHost}/refresh`,
        headers: {'x-auth': token}
      })
      .then(response => {
          console.log(response);
          localStorage.setItem('accessToken', response.data.token);
          this.$http.defaults.headers.common['x-auth'] = response.data.token;
          this.$store.dispatch('signin', {
            accessToken: response.data.token
          })
          this.$router.push('/dashboard');
      })
      .catch((err) => {
          this.loading = false;
          console.log(err.response);
          this.message = err.response.data.message;
          if (err.response.data.target && this.$refs[err.response.data.target]) {
            this.$refs[err.response.data.target].$el.focus();
          }
      });
    }
  },
  
  methods: {
    signin () {
      if (!this.userId || !this.password || this.userId === '' || this.password === '') {
        this.message = '아이디와 비밀번호를 입력해주세요.';
        return false;
      }
      localStorage.setItem('userId', this.userId);
      this.message = null;
      this.loading = true;
      this.$http.post(`${window.config.apiServerHost}/signin`, {userId: this.userId, password: this.password})
      .then(response => {
          console.log(response);
          localStorage.setItem('accessToken', response.data.token);
          this.$http.defaults.headers.common['x-auth'] = response.data.token;
          this.$store.dispatch('signin', {
            accessToken: response.data.token
          })
          this.$router.push('/dashboard');
      })
      .catch((err) => {
          this.loading = false;
          console.log(err.response);
          this.message = err.response.data.message;
          if (err.response.data.target && this.$refs[err.response.data.target]) {
            this.$refs[err.response.data.target].$el.focus();
          }
      });
    }
  }
};
</script>
<style scoped lang="css">
  #signin {
    height: 50%;
    width: 100%;
    position: absolute;
    top: 0;
    left: 0;
    content: "";
    z-index: 0;
  }
</style>
