import { createApp } from "https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js";

const app = {
  data() {
    return {
      domain: 'https://vue3-course-api.hexschool.io',
      user: {
        username: '',
        password: ''
      }
    }
  },
  methods:{
    login() {
      axios.post(`${this.domain}/v2/admin/signin`, this.user)
        .then(res=>{
          // console.log(res.data);
          const { token, expired } = res.data;
          this.user.username = '';
          this.user.password = '';
          document.cookie = `vue2022Ex=${token}; expires=${new Date(expired)}`;
          window.location = './products.html'
        })
        .catch(err=>{
          alert(err.data.error.message);
          this.user.username = '';
          this.user.password = '';
        })
    }
  }
}

createApp(app) .mount('#app');