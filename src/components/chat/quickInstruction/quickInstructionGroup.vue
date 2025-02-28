<template>
    <div
        class="las-quick-instruction-group"
        :class="[{dark: theme === 'dark', extend: show.extend}]"
        @mouseenter="extend(true)"
        @mouseleave="extend(false)"
        @touchend="extend(false)"
        @click="show.extend = true"
    >
        <div class="group-title-block">
            <div class="left-block">
                <i class="ms-Icon ms-Icon--DialShape1"></i>
                <p style="margin-left: 5px;">{{group.tag}}</p>
            </div>
            <fv-button
                theme="dark"
                :border-radius="50"
                :background="'transparent'"
                :foreground="theme === 'dark' ? 'rgba(120, 120, 120, 1)' : 'rgba(0, 0, 0, 1)'"
                style="width: 35px; height: 30px;"
                @mouseenter.native="$event.stopPropagation(); extend(false)"
                @mouseleave.native="$event.stopPropagation();"
                @touchend.native="$event.stopPropagation();"
                @click="$event.stopPropagation(); show.extend ^= true"
            >
                <i
                    class="ms-Icon"
                    :class="[`ms-Icon--${show.extend ? 'ChevronUp' : 'ChevronDown'}`]"
                ></i>
            </fv-button>
        </div>
        <transition :name="show.extend ? 'move-top-to-bottom' : 'move-bottom-to-top'">
            <div
                v-show="show.extend"
                class="group-content"
            >
                <slot></slot>
            </div>
        </transition>
    </div>
</template>

<script>
import { mapGetters } from 'vuex';

export default {
    props: {
        group: {
            default: () => ({})
        }
    },
    data() {
        return {
            show: {
                extend: this.group.show || false
            },
            timer: {
                extend: null
            }
        };
    },
    watch: {
        'group.show'(val) {
            this.show.extend = val;
        },
        'show.extend'(val) {
            this.group.show = val;
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'gradient01', 'theme'])
    },
    methods: {
        extend(status) {
            clearTimeout(this.timer.extend);
            if (status)
                this.timer.extend = setTimeout(() => {
                    this.show.extend = true;
                }, 300);
            else
                this.timer.extend = setTimeout(() => {
                    this.show.extend = false;
                }, 500);
        }
    }
};
</script>

<style lang="scss">
.las-quick-instruction-group {
    position: relative;
    width: 100%;
    height: 50px;
    margin-top: 5px;
    flex-shrink: 0;
    background: white;
    border: rgba(120, 120, 120, 0.1) solid thin;
    border-radius: 6px;
    transition: all 0.3s;
    display: flex;
    flex-direction: column;
    box-shadow: 0px 0px 5px 0px rgba(0, 0, 0, 0.1);
    overflow: hidden;

    &:hover {
        background: rgba(252, 252, 252, 1);
    }

    &.extend {
        height: auto;
        box-shadow: none;
    }

    &.dark {
        background: rgba(38, 45, 67, 0.3);
        color: whitesmoke;
    }

    .group-title-block {
        @include Vcenter;

        position: relative;
        width: 100%;
        padding: 10px;
        font-size: 13.8px;
        font-weight: bold;
        z-index: 2;

        .left-block {
            @include Vcenter;

            position: relative;
            width: 10px;
            height: 30px;
            flex: 1;
        }
    }

    .group-content {
        position: relative;
        width: 100%;
        height: auto;
        padding: 10px;
        flex-shrink: 0;
        display: flex;
        flex-wrap: wrap;
        gap: 5px;
        justify-content: flex-start;
        align-content: flex-start;
        transition: all 0.3s;
        overflow: hidden;
        z-index: 1;
    }
}
</style>