<template>
    <section class="list-box">
        <ul>
            <li class="list-item" v-for="(item, key) in list" :key="key">
                <div class="list-inner">
                    <span>{{item}}</span>
                </div>
            </li>
        </ul>
        <paging v-if="completedLoad" :setCount="6" :maxPaging="maxPaging" :setPaging="setPaging" @movePaging="getList"></paging>
    </section>
</template>

<script>
import paging from './paging.vue';
export default {
  name : 'list',
  components: {
    paging
  },
  data() {
    return {
      list : [],
      setPaging : 1,
      maxPaging : 1,
      completedLoad : false
    }
  },
  created() {
    this.list = this.getList();
  },
  methods: {
    getApi(url, params, callback) {
      const xhr = new XMLHttpRequest();
      xhr.onreadystatechange = () => {
        if(xhr.readyState === xhr.DONE) {
          if(xhr.status === 200 || xhr.status == 201) {
            if(typeof callback == 'function') {
              callback(JSON.parse(xhr.responseText));
            }
          }else {
            console.error(xhr.responseText);
          }
        }
      }
      xhr.open('post','http://localhost:3000'+url);
      xhr.setRequestHeader("Content-Type", "application/x-www-form-urlencoded");
      xhr.send(JSON.stringify(params));
    },
    getList(clickPaging) {
      const _this = this;
      this.getApi('/list', {
        count : 8,  //리스트 개수
        paging: clickPaging ? clickPaging : _this.setPaging
      },
      function(data) {
          _this.setPaging = data.currentPaging;
          _this.list = data.list;
          _this.maxPaging = data.maxPaging;
          _this.completedLoad = true;
      });
    }
  },
}
</script>

<style lang="">
    body {
      margin:0;
    }
    .list-box ul{
        overflow:hidden;
        list-style: none;
        padding:0;
    }
    .list-item {
        float:left;
        width:calc(25% - 12px);
        margin:5px;
        border:1px solid #000;
    }
    .list-inner {
        position:relative;
        padding-top:100%;
    }
    .list-box span {
        position:absolute;
        top:50%;
        left:50%;
        transform:translate(-50%, -50%);
        font-size:40px;
        font-weight:600;
    }
</style>