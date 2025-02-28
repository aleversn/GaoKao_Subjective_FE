<template>
    <div
        class="personal-info-container"
        :class="[{dark: theme === 'dark'}]"
    >
        <div class="block-1">
            <div style="width: 100%; display: flex; flex-direction: column">
                <fv-persona
                    :src="userInfo.avatar ? userInfo.avatar : ''"
                    size="60"
                    :name="userInfo.nickname"
                    :showInfo="true"
                    @click.native="showAvatar = true"
                >
                    <template v-slot:name>
                        <p>{{obj.nickname}}</p>
                    </template>
                    <template v-slot:secondary>
                        <span class="email-info">
                            <i class="ms-Icon ms-Icon--Mail"></i>
                            <p style="margin-left: 5px;">{{obj.email}}</p>
                        </span>
                    </template>
                </fv-persona>
            </div>
            <div style="width: 100%; margin-top: 15px; display: flex; flex-direction: column">
                <div class="personal-info-block">
                    <div
                        v-show="isAdmin"
                        class="row"
                    >
                        <p class="s1">{{local('Admin')}}</p>
                        <fv-button
                            theme="dark"
                            :background="gradient"
                            :is-box-shadow="true"
                            style="width: 200px;"
                            @click="$Go('/m')"
                        >{{local('Admin Console')}}</fv-button>
                    </div>
                    <div
                        v-show="false"
                        class="row"
                    >
                        <p class="s1">{{local('Email')}}</p>
                        <input
                            class="info-unit-edit"
                            :disabled="true"
                            ref="nameinput"
                            v-model="obj.email"
                        />
                    </div>
                    <div
                        v-show="isedit"
                        class="row"
                    >
                        <p class="s1">{{local('Nick Name')}}</p>
                        <input
                            class="info-unit-edit"
                            :disabled="!isedit"
                            v-model="obj.nickname"
                        />
                    </div>
                    <div class="row">
                        <p class="s1">{{local('name')}}</p>
                        <input
                            class="info-unit-edit"
                            :disabled="!isedit"
                            v-model="obj.name"
                        />
                    </div>
                    <div class="row">
                        <p class="s1">{{local('Theme')}}</p>
                        <fv-toggle-switch
                            v-model="userConfig.theme"
                            :width="70"
                            :height="30"
                            :switch-on-background="color"
                            :on="local('Dark')"
                            :off="local('Light')"
                            :inside-content="true"
                            @toggle="() => {
                                $nextTick(() => {
                                    setInformation()
                                })
                            }"
                        ></fv-toggle-switch>
                    </div>
                    <div class="row">
                        <p class="s1">{{local('Balance')}}</p>
                        <div class="row-block">
                            <input
                                class="info-unit-edit"
                                :disabled="true"
                                :value="`￥ ${balance}`"
                                style="max-width: 150px;"
                            />
                            <fv-button
                                theme="dark"
                                :background="gradient"
                                @click="show.order ^= true"
                            >{{local('Top Up')}}</fv-button>
                        </div>
                    </div>
                    <transition name="show-top-to-bottom">
                        <div
                            v-show="show.order"
                            class="row"
                        >
                            <p class="s1">{{local('Top-up denomination')}}</p>
                            <div
                                v-show="!show.orderConfirm"
                                v-for="(row, index) in topUpList"
                                :key="index"
                                class="row-block"
                            >
                                <fv-button
                                    v-for="(item, j) in row"
                                    :key="`${index}-${j}`"
                                    class="top-up-btn"
                                    :reveal-border-color="color"
                                    :is-box-shadow="true"
                                    @click="createOrder(item.key)"
                                >{{item.text}} {{local('CNY')}}</fv-button>
                            </div>
                            <fv-button
                                v-show="show.orderConfirm"
                                icon="ChevronLeft"
                                @click="show.orderConfirm = false"
                            >{{local('Cancel')}}</fv-button>
                            <div
                                v-show="show.orderConfirm"
                                class="Ali-pay-block"
                                ref="ali"
                            ></div>
                        </div>
                    </transition>
                    <div class="row">
                        <p class="s1">{{local('Usage')}}
                            <fv-button
                                theme="dark"
                                :background="gradient"
                                style="width: 120px; height: 25px; margin-left: 15px;"
                                @click="show.usage ^= true"
                            >{{local('Check Usage')}}</fv-button>
                        </p>
                        <transition name="show-top-to-bottom">
                            <usage-block v-if="show.usage"></usage-block>
                        </transition>
                    </div>
                    <div class="row">
                        <p class="s1">{{local('Apply Time')}}</p>
                        <input
                            class="info-unit-edit"
                            disabled="true"
                            :value="$SDate.Format('YYYY-mm-dd HH:MM', new Date(obj.createdAt * 1000))"
                        />
                    </div>
                </div>
            </div>
            <div style="width: 100%; display: flex; justify-content: space-around; margin-top: 25px">
                <fv-button
                    v-show="!isedit"
                    theme="dark"
                    :background="gradient"
                    :border-radius="6"
                    :is-box-shadow="true"
                    style="width: 250px;"
                    @click="isedit = true"
                >{{local('Edit')}}</fv-button>
                <fv-button
                    v-show="isedit"
                    theme="dark"
                    :background="color"
                    :border-radius="6"
                    :is-box-shadow="true"
                    style="width: 250px;"
                    @click="setInformation()"
                >{{local('Accept Changes')}}</fv-button>
            </div>
            <fv-panel
                v-model="showAvatar"
                :title="local('Revise Avatar')"
                width="350px"
                height="auto"
                background="rgba(255, 255, 255, 0.6)"
                title-size="13.8"
                :is-central-side="true"
                :is-acrylic="true"
                :is-footer="true"
            >
                <template v-slot:container>
                    <div class="panel-container">
                        <choose-avatar
                            ref="avatar"
                            @update-base64="cuttingAvatar = $event"
                        >
                        </choose-avatar>
                    </div>
                </template>
                <template v-slot:footer>
                    <fv-button
                        theme="dark"
                        :background="color"
                        :disabled="!lock.avatar || !cuttingAvatar"
                        style="width: 120px;"
                        @click="UploadAvatar"
                    >{{local('Confirm')}}</fv-button>
                    <fv-button
                        style="width: 120px; margin-left: 5px"
                        @click="showAvatar = false"
                    >{{local('Cancel')}}</fv-button>
                </template>
            </fv-panel>
        </div>
    </div>
</template>

<script>
import chooseAvatar from '@/components/general/profile/chooseAvatar.vue';
import usageBlock from '@/components/general/profile/usage';

import { mapGetters, mapState, mapMutations } from 'vuex';

export default {
    name: 'u_info',
    components: {
        chooseAvatar,
        usageBlock
    },
    props: {
        refresh: {
            default: false
        }
    },
    data() {
        return {
            obj: {
                id: '',
                username: '',
                nickName: ''
            },
            userConfig: {
                theme: false
            },
            balance: '0',
            order: {
                id: null,
                order_html: ''
            },
            topUpList: [
                [
                    {
                        key: 5000000,
                        text: '5'
                    },
                    {
                        key: 10000000,
                        text: '10'
                    },
                    {
                        key: 20000000,
                        text: '20'
                    }
                ],
                [
                    {
                        key: 30000000,
                        text: '30'
                    },
                    {
                        key: 50000000,
                        text: '50'
                    },
                    {
                        key: 100000000,
                        text: '100'
                    }
                ],
                [
                    {
                        key: 200000000,
                        text: '200'
                    },
                    {
                        key: 300000000,
                        text: '300'
                    },
                    {
                        key: 500000000,
                        text: '500'
                    }
                ]
            ],
            isedit: false,
            cuttingAvatar: null,
            showAvatar: false,
            eventSource: null,
            show: {
                order: false,
                orderConfirm: false,
                usage: false
            },
            lock: {
                avatar: true
            }
        };
    },
    watch: {
        refresh() {
            this.getInformation();
            this.getBalance();
        },
        'userConfig.theme'() {
            this.reviseTheme(this.userConfig.theme ? 'dark' : 'light');
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme']),
        ...mapState({
            userInfo: (state) => state.User.info
        }),
        isAdmin() {
            if (!this.userInfo || !this.userInfo.roles) return;
            let index = this.userInfo.roles.findIndex(
                (it) => it.name === 'ROLE_admin'
            );
            return index >= 0;
        }
    },
    mounted() {
        this.getInformation();
        this.getBalance();
    },
    methods: {
        ...mapMutations('Theme', {
            reviseTheme: 'reviseTheme'
        }),
        getdate(date) {
            this.obj.birthday =
                date.year.toString() +
                '/' +
                date.month.toString() +
                '/' +
                date.date.toString();
        },
        DatePickerFormat(date) {
            this.$refs.datePicker.day.year = date.getFullYear();
            this.$refs.datePicker.day.month = date.getMonth() + 1;
            this.$refs.datePicker.day.date = date.getDate();
            this.$refs.datePicker.dateFormat();
        },
        getInformation() {
            this.$api.UserController.getMyUserInfo()
                .then((response) => {
                    this.obj = response.data;
                    try {
                        let config = JSON.parse(response.data.config);
                        config.theme = config.theme === 'dark';
                        this.userConfig = config;
                    } catch (e) {
                        this.userConfig = {
                            theme: false
                        };
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        setInformation() {
            let userConfig = Object.assign({}, this.userConfig);
            userConfig.theme = this.userConfig.theme ? 'dark' : 'light';
            this.$api.UserController.updateMyUserInfo({
                name: this.obj.name,
                nickName: this.obj.nickName,
                birth: this.obj.birth,
                gender: this.obj.gender,
                email: this.obj.email,
                phone: this.obj.phone,
                config: JSON.stringify(userConfig)
            })
                .then((res) => {
                    if (res.code === 200) {
                        this.isedit = false;
                    }
                })
                .catch((err) => {
                    this.$barWarning(this.local('Update Failed') + err, {
                        status: 'error'
                    });
                });
        },
        getBalance() {
            this.$api.PayController.getMyWallet()
                .then((res) => {
                    if (res.data) {
                        this.balance = (res.data.topUpBalance / 1e6).toFixed(3);
                    }
                })
                .catch((err) => {
                    console.log(err);
                });
        },
        createOrder(amount) {
            this.$api.PayController.createAlipayOnlinePayOrder(amount, 150)
                .then((res) => {
                    if (res.code === 200) {
                        this.order.id = res.data.id;
                        this.order.order_html = res.data.order_html;
                        if (this.eventSource) this.eventSource.close();
                        let aliBlock = this.$refs.ali;
                        aliBlock.innerHTML = '';
                        const iframe = document.createElement('iframe');
                        aliBlock.appendChild(iframe);
                        const iframeDoc = iframe.contentWindow.document;
                        iframe.style.width = '150px';
                        iframe.style.maxWidth = '300px';
                        iframe.style.height = '155px';
                        iframe.style.border = 'none';
                        iframe.style.background = 'transparent';

                        // Write the HTML content into the iframe
                        iframeDoc.open();
                        iframeDoc.write(this.order.order_html);
                        iframeDoc.close();
                        this.show.orderConfirm = true;
                        this.addReceiveOrder();
                    }
                })
                .catch((err) => {
                    if (err.message)
                        this.$barWarning(err.message, {
                            status: 'warning'
                        });
                });
        },
        addReceiveOrder() {
            if (!this.order.id) return;
            let token = localStorage.getItem('ApiToken');
            if (!token) return;
            token = token.replace('Bearer ', '');
            if (this.eventSource) this.eventSource.close();
            this.eventSource = new EventSource(
                `${this.$server}/orders/${this.order.id}/result?Authorization=${token}`
            );
            this.eventSource.addEventListener('message', (event) => {
                let data = JSON.parse(event.data);
                if (data.code) {
                    if (data.code === 200) {
                        this.$barWarning(this.local('Top Up Success'), {
                            status: 'correct'
                        });
                        this.getBalance();
                        this.order.id = null;
                        this.order.order_html = '';
                        this.show.order = false;
                        this.show.orderConfirm = false;
                    } else {
                        this.$barWarning(data.message, {
                            status: 'warning'
                        });
                    }
                }
            });
            this.eventSource.addEventListener('error', (error) => {
                // console.log(error);
                this.eventSource.close();
            });
        },
        UploadAvatar() {
            if (!this.lock.avatar) {
                this.$barWarning(this.local('Uploading'), {
                    status: 'warning'
                });
                return;
            }
            if (!this.cuttingAvatar)
                this.$barWarning(this.local('No Picture Selected'), {
                    status: 'warning'
                });
            else {
                this.lock.avatar = false;
                this.$api.UserController.updateMyAvatar({
                    avatar: this.cuttingAvatar
                })
                    .then((data) => {
                        if (data.code == 200) {
                            this.$barWarning(
                                this.local('Successfully Revised Avatar'),
                                {
                                    status: 'correct'
                                }
                            );
                            this.showAvatar = false;
                        }
                        this.lock.avatar = true;
                    })
                    .catch((res) => {
                        if (res.message) {
                            this.$barWarning(res.message, {
                                status: 'warning'
                            });
                        }
                        this.lock.avatar = true;
                    });
            }
        }
    }
};
</script>

<style lang="scss">
.personal-info-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 0px calc(50% - 640px);
    box-sizing: border-box;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    &.dark {
        .personal-info-block {
            div {
                &.row {
                    .s1 {
                        color: whitesmoke;
                    }

                    &:hover {
                        background: rgba(90, 90, 90, 0.1);
                        box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);
                    }
                }
            }
        }

        input.info-unit-edit,
        textarea.info-unit-edit {
            background: rgba(36, 36, 36, 1);
            color: rgba(245, 245, 245, 0.79);
        }
    }

    .block-1 {
        position: relative;
        width: 100%;
        height: 100%;
        padding: 18px;
        box-sizing: border-box;
        overflow: auto;

        .control-banner {
            @include Vcenter;

            font-size: 24px;
        }

        .email-info {
            @include Vcenter;

            margin-top: 5px;
        }
    }

    .personal-info-block {
        position: relative;
        width: 100%;
        line-height: 2.5;
        div {
            &.row {
                position: relative;
                width: 100%;
                height: auto;
                flex: 1;
                padding: 8px;
                border-radius: 6px;
                box-sizing: border-box;
                transition: all 0.3s;

                &:hover {
                    background: white;
                    box-shadow: 0px 0px 2px rgba(0, 0, 0, 0.1);
                }
                .s1 {
                    width: 100%;
                    font-size: 15px;
                    font-weight: bold;
                    color: rgba(75, 75, 75, 1);
                    display: flex;
                    align-items: center;
                }

                .row-block {
                    @include Vcenter;

                    .top-up-btn {
                        height: 45px;
                        margin: 5px 5px 5px 0px;
                    }
                }

                .Ali-pay-block {
                    @include HcenterVcenter;

                    position: relative;
                    width: 100%;
                    height: 200px;
                    margin-top: 5px;
                }
            }
        }
        .info-gender {
            margin: 0px 5px;
            font-size: 24px;
            display: flex;
            align-items: center;
            transition: all 0.3s;
            &.choose {
                font-weight: bold;
            }
        }
    }

    input.info-unit-edit,
    textarea.info-unit-edit {
        width: 100%;
        height: 45px;
        padding: 5px;
        background: white;
        border: rgba(0, 0, 0, 0.05) solid thin;
        border-bottom: rgba(0, 98, 158, 0.6) solid thin;
        border-width: 2px;
        color: rgba(36, 36, 36, 1);
        border-radius: 3px;
        outline: none;
        box-sizing: border-box;
        box-shadow: 0px 1px 1px rgba(0, 0, 0, 0.1);
        transition: all 0.3s;
    }
    input.info-unit-edit:disabled:hover,
    textarea.info-unit-edit:disabled:hover {
        color: rgba(0, 90, 158, 1);
    }
    input.info-unit-edit:disabled,
    textarea.info-unit-edit:disabled {
        padding: 0px;
        background: transparent;
        border: thin;
        border-bottom: rgba(0, 98, 158, 0) solid thin;
        box-sizing: border-box;
        box-shadow: none;
        cursor: pointer;
    }
}

.panel-container {
    position: relative;
    width: 100%;
    height: 100%;
    padding: 15px 15px 55px 15px;
    color: rgba(28, 30, 41, 1);
    font-family: Akkurat Std, -apple-system, BlinkMacSystemFont, Segoe UI,
        Roboto, Oxygen, Ubuntu, Cantarell, Helvetica Neue, sans-serif;
    font-weight: 400;

    .panel-title {
        font-size: 12px;
    }
}

.show-top-to-bottom-enter-active,
.show-top-to-bottom-leave-active {
    transform-origin: 50% 0%;
    transition: all 0.3s;
}

.show-top-to-bottom-enter, .show-top-to-bottom-leave-to
/* .show-enter-active, .show-leave-active */ {
    opacity: 0;
    max-height: 0px;
    transform: scaleY(0);
}

.show-top-to-bottom-enter-to, .show-top-to-bottom-leave
/* .show-enter-to, .show-leave */ {
    opacity: 1;
    max-height: auto;
    transform: scaleY(1);
}
</style>
