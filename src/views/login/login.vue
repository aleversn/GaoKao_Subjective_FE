<template>
    <div
        class="login-block"
        :class="[{dark: theme === 'dark'}]"
    >
        <transition name="scale-up-to-up">
            <fv-progress-bar
                v-show="!lock.login"
                :loading="true"
                :foreground="color"
                style="position: absolute; left: 0px; top: 0px; width: 100%;"
            ></fv-progress-bar>
        </transition>
        <div class="main-block">
            <span
                class="border-top"
                :style="{background: gradient}"
            ></span>
            <div class="s1">
                <img
                    draggable="false"
                    class="logo-text"
                    src="@/assets/logo_text.svg"
                    alt=""
                >
                <p
                    v-show="step === 0"
                    class="main-title"
                >
                    {{local(`Login`)}}
                </p>
                <fv-text-box
                    v-show="step === 0"
                    v-model="user.id"
                    :placeholder="local(`Email`)"
                    borderWidth="2"
                    :revealBorder="true"
                    background="whitesmoke"
                    :border-radius="6"
                    style="width: 100%; max-width: 375px; height: 40px; margin-top: 45px;"
                    @keyup="handleEnter"
                ></fv-text-box>
                <fv-text-box
                    v-show="step === 0"
                    v-model="user.password"
                    :placeholder="local(`Password`)"
                    type="password"
                    borderWidth="2"
                    :revealBorder="true"
                    background="whitesmoke"
                    :border-radius="6"
                    style="width: 100%; max-width: 375px; height: 40px; margin-top: 15px;"
                    @keyup="handleEnter"
                ></fv-text-box>
                <fv-button
                    v-show="step === 0"
                    :background="color"
                    theme="dark"
                    borderRadius="6"
                    fontSize="12"
                    fontWeight="600"
                    :is-box-shadow="true"
                    style="width: 180px; height: 30px; margin-top: 20px;"
                    :disabled="!lock.login || !user.id || !user.password"
                    @click="handleLogin()"
                >{{local(`Continue`)}}</fv-button>
                <p
                    v-show="step === 1"
                    class="main-title"
                >
                    {{local(`Verify`)}}
                </p>
                <div
                    v-show="step === 1"
                    class="verify-id-block"
                >
                    <i
                        class="block-btn ms-Icon ms-Icon--ChevronLeft20"
                        @click="step = 0"
                    ></i>
                    <p class="verify-id-span">{{user.id}}</p>
                </div>
                <fv-VerifyBox
                    v-show="step === 1"
                    v-model="verifyCode"
                    :length="6"
                    :disabled="!lock.login"
                    style="width: 100%;"
                    @confirm="handleLogin"
                ></fv-VerifyBox>
                <fv-button
                    v-show="step === 1"
                    :background="color"
                    theme="dark"
                    borderRadius="6"
                    fontSize="12"
                    fontWeight="600"
                    :is-box-shadow="true"
                    style="width: 180px; height: 30px; margin-top: 20px;"
                    :disabled="!lock.sendCode || counter > 0"
                    @click="sendCode"
                >{{local(`Resend Code`)}}{{counter > 0 ? ` ${counter}s`: ''}}</fv-button>
                <div class="s2">
                    <p
                        class="to-apply"
                        @click="$Go('/login/forgot')"
                    >{{local('Forget Password')}}</p>
                    <p
                        class="to-apply"
                        style="margin: 0px 8px;"
                    >·</p>
                    <p
                        class="to-apply"
                        @click="$Go('/login/apply')"
                    >{{local('No account yet?')}}</p>
                </div>
            </div>
        </div>
        <div class="s3">
            <p>{{local('Terms and Conditions')}} · {{local('Privacy Policy')}}</p>
        </div>
    </div>
</template>
  

<script>
import { mapGetters, mapMutations } from 'vuex';

export default {
    name: 'Login',
    data() {
        return {
            step: 0,
            user: {
                id: '',
                password: ''
            },
            verifyCode: '',
            counter: 0,
            lock: {
                login: true,
                sendCode: true
            },
            timer: {
                sendCode: null
            }
        };
    },
    watch: {
        step() {
            this.verifyCode = '';
        }
    },
    computed: {
        ...mapGetters(['local']),
        ...mapGetters('Theme', ['color', 'gradient', 'theme'])
    },
    mounted() {},
    methods: {
        ...mapMutations('User', {
            clearInfo: 'clearInfo'
        }),
        async handleLogin(code = null) {
            if (!this.lock.login) return;
            if (code && code.length < 6) return;
            this.lock.login = false;
            let user = {
                id: this.user.id,
                password: this.user.password,
                code
            };
            this.$api.UserController.login(user)
                .then((res) => {
                    if (res.code === 200) {
                        let { accessToken, schema, expiredAt } = res.data;
                        localStorage.setItem(
                            'ApiToken',
                            [schema, accessToken].join(' ')
                        );
                        localStorage.setItem('ApiTokenExpiredAt', expiredAt);
                        this.clearInfo();
                        this.$barWarning(this.local('Login Success'), {
                            status: 'correct'
                        });
                        let return_url = this.$route.query.return_url
                            ? this.$route.query.return_url
                            : '/';
                        this.$Go(`${return_url}`);
                    }
                    this.lock.login = true;
                })
                .catch((err) => {
                    if (err.code === 40001) {
                        this.$barWarning(this.local(`User Not Exists`), {
                            status: 'warning'
                        });
                    } else if (err.code === 40006) {
                        this.$barWarning(this.local(`Password Error`), {
                            status: 'warning'
                        });
                    } else if (err.code === 40007) {
                        this.sendCode();
                        this.step++;
                    } else if (err.code === 40008) {
                        this.$barWarning(this.local(`Verify Code Error`), {
                            status: 'warning'
                        });
                        this.verifyCode = '';
                    } else if (err.message)
                        this.$barWarning(err.message, {
                            status: 'warning'
                        });
                    this.lock.login = true;
                });
        },
        async sendCode() {
            if (!this.lock.sendCode) return;
            this.lock.sendCode = false;
            this.$api.UserController.sendVerifiedEmail(this.user.id)
                .then((data) => {
                    if (data.code === 200) {
                        this.$barWarning(
                            this.local(`Email code has been sent.`),
                            {
                                status: 'correct'
                            }
                        );
                        this.counter = 60;
                        this.timer.sendCode = setInterval(() => {
                            this.counter--;
                            if (this.counter <= 0)
                                clearInterval(this.timer.sendCode);
                        }, 1000);
                    }
                    this.lock.sendCode = true;
                })
                .catch((err) => {
                    this.lock.sendCode = true;
                    if (err.code === 40012) {
                        this.$barWarning(
                            this.local(`Code Exists, Please wait for a while.`),
                            {
                                status: 'warning'
                            }
                        );
                    } else if (err.message)
                        this.$barWarning(err.message, {
                            status: 'warning'
                        });
                });
        },
        handleEnter(event) {
            if (event.keyCode == 13) this.handleLogin();
        }
    }
};
</script>

<style lang="scss">
.login-block {
    @include FullRelative;
    @include HcenterVcenterC;

    flex: 1;

    &.dark {
        color: whitesmoke;

        .main-block {
            background: rgba(43, 50, 76, 1);
            box-shadow: 0 5px 5px 0 rgba(36, 36, 36, 0.05),
                0 5px 30px 0 rgba(36, 36, 36, 0.22);
        }
    }

    .main-block {
        @include HcenterVcenterC;

        position: relative;
        width: 450px;
        height: 450px;
        background: white;
        border-radius: 8px;
        box-shadow: 0 5px 5px 0 rgba(154, 160, 185, 0.05),
            0 5px 30px 0 rgba(166, 173, 201, 0.22);
        overflow: hidden;

        .border-top {
            position: relative;
            width: 100%;
            height: 6px;
            background: linear-gradient(
                to right,
                rgba(149, 141, 241, 1),
                rgba(149, 141, 241, 1)
            );
        }

        .s1 {
            @include FullRelative;
            @include HcenterC;

            flex: 1;
            padding: 25px;

            .logo-text {
                width: 80px;
                height: auto;
                margin: 5px;
                cursor: pointer;
            }

            .main-title {
                @include ms-fontSize-16;
                @include color-pink-blue;
            }

            .id-field {
                width: 90%;
                height: 60px;
                margin-top: 45px;
                display: flex;
            }

            .verify-id-block {
                @include Vcenter;

                width: 100%;
                margin: 10px 0px;
                font-size: 12px;

                .block-btn {
                    padding: 3px;
                    border-radius: 6px;

                    &:hover {
                        background: rgba(200, 200, 200, 0.1);
                    }

                    &:active {
                        background: rgba(200, 200, 200, 0.2);
                    }
                }

                .verify-id-span {
                    margin-left: 5px;
                    font-size: 12px;
                    color: rgba(36, 36, 36, 1);
                    user-select: none;
                }
            }

            .s2 {
                @include HcenterVcenter;

                margin-top: 25px;

                .to-apply {
                    @include a-link;
                }
            }
        }
    }

    .s3 {
        @include a-link;

        margin-top: 35px;
        font-size: 12px;
    }
}

.swipe-left-enter-active {
    animation: swipe-left 0.5s linear;
}

.swipe-left-leave-active {
    animation: swipe-left 0.5s linear reverse;
}

.swipe-right-enter-active {
    animation: swipe-left 0.5s linear;
}

.swipe-right-leave-active {
    animation: swipe-left 0.5s linear reverse;
}

@keyframes swipe-left {
    0% {
        width: 0;
    }
    100% {
        width: 100%;
    }
}
@media screen and (max-width: 768px) {
    .login-block {
        .main-block {
            width: 100%;
            overflow: inherit;
            height: 100%;
            box-shadow: none;

            .s1 {
                padding: 0 15px;
                padding-top: 20px;
            }
        }
    }
}
</style>
  