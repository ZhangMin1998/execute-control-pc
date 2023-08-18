<template>
  <div class="login_wrap">
    <div
      v-if="!loading"
      class="login_box"
    >
      <img
        class="img"
        src="@/assets/images/logo.png"
        alt=""
      />
      <div class="title">多维大数据平台</div>
      <div class="sub_title">荣成公安</div>
      <el-input
        v-model="loginFrom.username"
        class="account"
        :spellcheck="false"
        :prefix-icon="User"
        placeholder="请输入账号"
        @input="accoutChangeEvent"
        @keyup.enter="login"
      />
      <el-input
        v-model="loginFrom.password"
        class="w-50 m-2 password"
        :type="inputType"
        placeholder="请输入密码"
        @keyup.enter="login"
      >
        <template #prefix>
          <el-icon @click="showPassword">
            <Hide />
          </el-icon>
        </template>
      </el-input>
      <div
        v-if="showErrorTip"
        class="error_tips"
      >
        <el-icon> <WarningFilled /> </el-icon>{{ tipsInfo }}
      </div>
      <el-button
        class="login_button"
        type="primary"
        @click="login"
      >
        登录
      </el-button>
    </div>
    <div 
      v-else
      class="login_ing"
    >
      <img
        class="img"
        src="@/assets/images/logo.png"
        alt=""
      />
      <div class="login_txt">
        正在登录
      </div>
      <div class="login_progress">
        <el-progress
          :percentage="20"
          status="success"
          :indeterminate="true"
          :duration="2"
          :show-text="false"
        />
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { userStore } from '../../store/userInfo'
import { useRouter } from 'vue-router'
import { Hide, User, WarningFilled } from '@element-plus/icons-vue'
import { setLocal, getLocal } from '@/utils/local'
import { enByDES, deByDES } from '@/utils/encryp'

import { loginsys } from '@/api/login'
import { getFeatureOptionsApi, configurableSrcDataAll } from '@/api/warn'
import { ElProgress } from 'element-plus'
import { reactive, ref, onMounted } from 'vue'
import md5 from 'js-md5'

const router = useRouter()
const userInfoStore = userStore()
const inputType = ref('password')
const showErrorTip = ref(false)
const loading = ref(false)
const loginFrom = reactive({
  username: '',
  password: '',
  type: 'client'
})

const tipsInfo = ref('')
// let accountInfo:any
const showPassword = () => {
  inputType.value = inputType.value === 'password' ? 'password' : 'password'
}
onMounted(() => {
  userInfoStore.changIsLogin(false)
  userInfoStore.handleUserInfo({})
  const accountInfo = getLocal('account')
  if (accountInfo) {
    const userinfo: any = JSON.parse(deByDES(accountInfo, userInfoStore.infostring))
    loginFrom.username = userinfo?.username
    loginFrom.password = userinfo?.password
  }
})

// 账号改变就清除密码
const accoutChangeEvent = () => {
  loginFrom.password = ''
}

const queryBaseInfo = async () => {
  const traceLabelList = await getFeatureOptionsApi('') // 登录后查询预警对象对照表
  const dataTypeList = await configurableSrcDataAll() // 登录后查询数据类型对照表
  userInfoStore.setTraceLabelList(traceLabelList)
  userInfoStore.setDataTypeList(dataTypeList)
}

const login = async() => {
  loading.value = true
  const password = md5(loginFrom.password)
  loginsys({ ...loginFrom, password })
  .then(async (res: any) => {
    if (res) {
      setLocal(res.token)
      // 存储登录的账号密码，下次登录还是该账号密码
      const account = enByDES(JSON.stringify(loginFrom), userInfoStore.infostring)
      setLocal(account, 'account')
      const result = res || {}
      if (+res.id === 1) {
        res.roleStr = '超级管理员'
      } else {
        const arr = res.userRoleList?.map((item: any) => item.roleName) || []
        res.roleStr = arr.join('；')
      }
      userInfoStore.changIsLogin(true)
      userInfoStore.handleUserInfo(result)
      router.push({ path: '/home' })
      window.app.windowSetOpacity(0)
      loading.value = false

      // eslint-disable-next-line
      const path:string = userInfoStore.userBaseInfo.username + '.windowLastBounds'
      const obj = await window.app.windowGetData(path)
      if (obj) {
        if (obj.isMax) {
          window.app.changeWindowSize(858, 529, true)
          window.app.windowMax()
        } else {
          window.app.changeWindowSize(obj.width, obj.height, true)
        }
      } else {
        window.app.changeWindowSize(858, 529, true)
      }
      // 登录成功之后去查询一些必须的信息
      queryBaseInfo()
    }
  })
  .catch((err: any) => {
    tipsInfo.value = err.toString().split(':')[1]
    loading.value = false
    showErrorTip.value = true
  }).finally(async() => {
   
  })
}
</script>

<style lang="less" scoped>
.login_wrap {
  height: 100%;
  // background: pink;
  -webkit-app-region: drag; //允许用户进行窗口拖动
  display: flex;
  justify-content: center;

  .login_button {
    -webkit-app-region: no-drag;
  }

  .login_box {
    width: 228px;
    display: flex;
    flex-direction: column;
    align-items: center;

    .img {
      width: 40px;
      height: 40px;
      margin-top: 33px;
    }

    .title {
      margin-top: 12px;
      font-size: 16px;
      color: #020202;
      font-weight: bold;
    }

    .sub_title {
      font-size: 10px;
      margin-top: 5px;
    }

    :deep(.el-input) {
      -webkit-app-region: no-drag;
      height: 36px;

      .el-input__wrapper {
        background-color: #ebebeb;
      }
    }

    .account {
      margin-top: 28px;
    }

    .password {
      margin: 8px 0 10px 0;

      .el-icon {
        cursor: pointer;
      }
    }

    .error_tips {
      width: 228px;
      display: flex;
      justify-content: left;
      align-items: center;
      margin-bottom: 10px;

      .el-icon {
        margin-right: 3px;
      }
    }

    .login_button {
      height: 36px;
      width: 100% !important;
    }
  }
  .login_ing{
    width: 228px;
    display: flex;
    flex-direction: column;
    align-items: center;
    img{
      margin-top: 63px;
      width: 60px;
      height: 60px;
    }
    .login_txt{
      margin: 10px 0 24px 0;
      font-size: 14px;
      font-weight: 700;
    }
    .el-progress--line {
    width: 138px;
    }
  }
}
</style>
