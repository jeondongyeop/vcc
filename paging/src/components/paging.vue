<template>
    <div class="paging">
        <button v-if="leftArrowShow" @click="goFirst()"><<</button>
        <button v-if="leftArrowShow" @click="prevGroup()"><</button>
        <button v-for="(idx,key) in pagingGroup" :key="key" :class="idx==setPaging ? 'active':''" @click="movePaging(idx)">{{idx}}</button>
        <button v-if="rightArrowShow" @click="nextGroup()">></button>
        <button v-if="rightArrowShow" @click="goLast()">>></button>
    </div>
</template>

<script>
export default {
    name:"paging",
    props:{
        maxPaging : {
            type : Number,
            default : 1
        },
        setPaging: {
            type : Number,
            default : 1
        },
        setCount : {
            type : Number,
            default : 5
        }
    },

    created() {
        this.updateList();
    },

    data() {
        return {
            pagingGroup : [],
            count : this.setCount,
            max : this.maxPaging,
            current : this.setPaging
        }
    },

    watch: {
        setPaging() {
            this.updateList();
        }
    },
    computed: {
        // 양쪽 화살표 노출
        leftArrowShow() {
            return !(this.current <= this.count);
        },
        rightArrowShow() {
            const temp = this.max % this.count !== 0 ? 0 : -1;
            const startMaxGroupNumber = (this.count * ( parseInt(this.max / this.count) + temp) ) + 1;
            return !(startMaxGroupNumber <= this.current);
        }
    },
    methods : {
        // prop 업데이트
        dataUpdate() {
            this.count = this.setCount;
            this.max = this.maxPaging;
            this.current = this.setPaging;
        },
        //리스트 업데이트
        updateList() {
            this.dataUpdate();
            this.pagingGroup = [];

            const temp = this.current % this.count !== 0 ? 0 : -1;
            const startNumber = (this.count * ( parseInt(this.current / this.count) + temp) ) + 1;
            
            for(let i = startNumber; i < (startNumber+this.count); ++i){
                if(i <= this.max) {
                    this.pagingGroup.push(i);
                }
            }
        },

        //페이지 이동 이벤트 (부모의 비동기 로드와 매칭)
        movePaging(idx) {
            this.$emit('movePaging', idx);
        },
        nextGroup() {
            this.$emit('movePaging', this.pagingGroup[this.pagingGroup.length-1] + 1);
        },
        prevGroup() {
            this.$emit('movePaging', (this.count * ( (this.pagingGroup[0] - 1) / this.count - 1) + 1));
        },
        goFirst() {
            this.$emit('movePaging', 1);
        },
        goLast() {
            this.$emit('movePaging', this.maxPaging);
        }
    }
}
</script>

<style scope>
    .paging button {
        margin:0 3px;
    }
    .paging button.active {
        background:#000;
        color:#fff;
        border-color:#000;
    }
</style>