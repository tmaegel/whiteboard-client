<template>
    <div v-if="share.state.app.filterMenu" class="dropdown-menu" id="filter-menu">
        <span v-on:click="toggleSortOrder" id="menu-item" href="#">
            <svg class="icon icon-sort">
                <use xlink:href="#icon-sort"></use>
            </svg>
            <span id="menu-label">sort: {{ getSortOrder }}</span>
        </span>
        <span v-on:click="toggleSortedBy" id="menu-item" href="#">
            <svg class="icon icon-menu2">
                <use xlink:href="#icon-menu2"></use>
            </svg>
            <span id="menu-label">sorty by: {{ getSortedBy }}</span>
        </span>
        <span v-on:click="toggleShowType" id="menu-item" href="#">
            <svg class="icon icon-eye">
                <use xlink:href="#icon-eye"></use>
            </svg>
            <span id="menu-label">show: {{ getShowType }}</span>
        </span>
    </div>
</template>

<script>
import store from '../store.js';

export default {
    name: 'FilterMenu',
    data: function () {
        return {
            sortType: ["alphabetical", "last updated"], // sorted by ...
            showType: ["all workouts", "completed workouts", "non-completed workouts"], // show types
            share: store
        }
    },
    computed: {
        getSortOrder: function() {
            if(this.share.state.app.sortAsc) {
                return "ascending";
            } else {
                return "descending";
            }
        },
        getSortedBy: function() {
            if(this.sortType[this.share.state.app.sortTypeIndex]) {
                return this.sortType[this.share.state.app.sortTypeIndex];
            } else {
                return "unkown"
            }
        },
        getShowType: function() {
            if(this.showType[this.share.state.app.showTypeIndex]) {
                return this.showType[this.share.state.app.showTypeIndex];
            } else {
                return "unkown"
            }
        }
    },
    methods: {
        toggleSortOrder: function(event) {
            this.share.state.app.sortAsc = !this.share.state.app.sortAsc;
            event.stopPropagation();
        },
        toggleSortedBy: function(event) {
            if(this.share.state.app.sortTypeIndex >= this.sortType.length-1) {
                this.share.state.app.sortTypeIndex = 0;
            } else {
                this.share.state.app.sortTypeIndex++;
            }
            event.stopPropagation();
        },
        toggleShowType: function(event) {
            if(this.share.state.app.showTypeIndex >= this.showType.length-1) {
                this.share.state.app.showTypeIndex = 0;
            } else {
                this.share.state.app.showTypeIndex++;
            }
            event.stopPropagation();
        }
    }
}
</script>

<style lang="css" scoped>
.icon-sort,.icon-menu2,.icon-eye {
    font-size: 18px;
    color: gray;
}
#filter-menu {
    top: 50px;
    right: 20px;
    width: 350px;
}
#menu-item > span {
    display: inline-block;
    line-height: 1em; /*set line height back to normal*/
    padding: 0 0 0 5px; /* left padding only */
}
#menu-item > svg {
    vertical-align: middle;
}
</style>
