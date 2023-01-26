import { createApp } from 'https://cdnjs.cloudflare.com/ajax/libs/vue/3.2.45/vue.esm-browser.min.js'

let productModal = null;
let delProductModal = null;

const vm = {
  data() {
    return {
      domain: 'https://vue3-course-api.hexschool.io/v2',
      api_path: 'sakimotorin-vue2022',
      products: [],
      tempProduct: {
        imagesUrl: [],
      },
      isNew: false, // 用作迿別新增或確認
    }
  },
  methods: {
    checkUser() {
      axios
        .post(`${this.domain}/api/user/check`)
        .then((res) => {
          // console.log(res)
          this.getProducts()
        })
        .catch((err) => {
          alert(err.data.message)
          window.location = './login.html'
        })
    },
    getProducts() {
      axios
        .get(`${this.domain}/api/${this.api_path}/admin/products/all`)
        .then((res) => {
          // console.log(res.data)
          this.products = res.data.products
        })
        .catch((err) => {
          alert(err.data.message)
        })
    },
    updateProduct() {
      // 由於create / edit都使用同一個model, 用let定義,url/method會根據不用而改變
      let url = `${this.domain}/api/${this.api_path}/admin/product`
      let method = 'post'

      // isNew = 新增 / !isNew = 編輯
      if (!this.isNew) {
        url = `${this.domain}/api/${this.api_path}/admin/product/${this.tempProduct.id}`
        method = 'put'
      }

      axios[method](url, { data: this.tempProduct })
        .then((res) => {
          alert(res.data.message)
          productModal.hide()
          this.getProducts()
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    openModal(status, product) {
      if (status === 'new') {
        this.tempProduct = {
          imagesUrl: [],
        }
        this.isNew = true
        productModal.show()
      } else if (status === 'edit') {
        this.tempProduct = { ...product }
        this.isNew = false
        productModal.show()
      } else if (status === 'delete') {
        this.tempProduct = { ...product }
        delProductModal.show()
      }
    },
    deleteProduct() {
      axios
        .delete(
          `${this.domain}/api/${this.api_path}/admin/product/${this.tempProduct.id}`,
        )
        .then((res) => {
          this.getProducts()
          delProductModal.hide()
        })
        .catch((err) => {
          alert(err.response.data.message);
        })
    },
    createImage() {
      // 新增空Array, 並
      this.tempProduct.imagesUrl = [];
      this.tempProduct.imagesUrl.push('');
    }
  },
  mounted() {
    // checkuser前先取cookie
    const cookieValue = document.cookie
      .split('; ')
      .find((row) => row.startsWith('vue2022Ex='))
      ?.split('=')[1]
    axios.defaults.headers.common['Authorization'] = cookieValue
    this.checkUser()

    productModal = new bootstrap.Modal(document.getElementById('productModal'))
    delProductModal = new bootstrap.Modal(document.getElementById('delProductModal'))
  },
}

createApp(vm).mount('#app')
