<template>
  <el-row :gutter="20" style="height: 100%; width: 100%;">
    <el-col :xs="26" :sm="26" :md="10" :lg="8" :xl="7" style="margin-bottom: 10px">
      <el-card class="box-card" style="height: 80vh">
        <div slot="header" class="clearfix">
          <span>个人信息</span>
        </div>
        <div>
          <div style="text-align: center">
            <el-avatar :src="PersonalForm.Icon.String"/>
          </div>
          <br/>
          <br/>
          <br/>
          <el-form label-width="90px" size="default">
            <el-row>
              <el-col :span="24">
                <el-form-item label="用户账号：" size="small" prop="UserName">{{ PersonalForm.UserName }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户昵称：" size="small" prop="NickName.String">{{ PersonalForm.NickName.String }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户邮箱：" size="small" prop="Email.String">{{ PersonalForm.Email.String }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="用户电话：" size="small" prop="Phone.String">{{ PersonalForm.Phone.String }}</el-form-item>
              </el-col>
              <el-col :span="24">
                <el-form-item label="创建时间：" size="small" prop="CreateTime.String">{{ PersonalForm.CreateTime.String }}</el-form-item>
              </el-col>
              <el-form-item label="备注：" prop="Note.String" size="small">
                <el-input type="textarea" :rows="5" v-model="PersonalForm.Note.String" style="width: 25vh;" disabled/>
              </el-form-item>
            </el-row>
          </el-form>
        </div>
      </el-card>
    </el-col>
    <el-col :xs="22" :sm="22" :md="14" :lg="16" :xl="17">
      <el-card class="box-card" style="height: 80vh ">
        <div slot="header" class="clearfix">
          <span>基本资料</span>
        </div>
        <el-tabs v-model="activeName" v-loading="Loading">
          <el-tab-pane label="基本资料" name="first">
            <el-form size="small" :model="UpdateInfoForm" ref="editFormRefForm" label-width="80px">
              <el-form-item label="用户头像" prop="icon.String">
                <el-upload class="avatar-uploader" :show-file-list="false" :on-change="handleChange" :before-upload="()=>false">
                  <!--                           :on-success="handleAvatarSuccess"-->
                  <img v-if="UpdateInfoForm.Icon.length" :src="UpdateInfoForm.Icon" style="width: 50px; height: 50px;" alt=""/>
                  <img v-else style="width: 50px; height: 50px;" alt="">
                </el-upload>
              </el-form-item>
              <el-form-item label="用户账号" prop="UserName" size="small">
                <el-input v-model="UpdateInfoForm.UserName" disabled size="small"/>
              </el-form-item>
              <el-form-item label="用户昵称" prop="NickName.String" size="small">
                <el-input v-model="UpdateInfoForm.NickName" size="small"/>
              </el-form-item>
              <el-form-item label="手机号码" prop="Phone.String" size="small">
                <el-input v-model="UpdateInfoForm.Phone" maxlength="11" size="small"/>
              </el-form-item>
              <el-form-item label="用户邮箱" prop="Email.String" size="small">
                <el-input v-model="UpdateInfoForm.Email" maxlength="50" size="small"/>
              </el-form-item>
              <el-form-item label="备注" prop="Note.String" size="small">
                <el-input type="textarea" :rows="5" placeholder="可选" v-model="UpdateInfoForm.Note" size="small"/>
              </el-form-item>


              <el-form-item>
                <el-button type="primary" size="small" v-loading="BaseLoading" @click="SaveEditPersonal">保存</el-button>
                <!--                <el-button type="danger" size="default" @click="closeSecond">关闭</el-button>-->
              </el-form-item>
            </el-form>
          </el-tab-pane>
          <el-tab-pane label="修改密码" name="second">
            <el-form :model="PasswordForm" :rules="updateFormRules" ref="updateFormRefForm" label-width="80px" size="small">
              <el-form-item label="旧密码" prop="OldPassWord" size="small">
                <el-input v-model="PasswordForm.OldPassWord" placeholder="请输入旧密码" size="small"/>
              </el-form-item>
              <el-form-item label="新密码" prop="NewPassWord" size="small">
                <el-input v-model="PasswordForm.NewPassWord" type="password" placeholder="请输入新密码" size="small"/>
              </el-form-item>
              <el-form-item label="确认密码" prop="ResetPassWord" size="small">
                <el-input v-model="PasswordForm.ResetPassWord" type="password" placeholder="请确认密码" size="small"/>
              </el-form-item>
            </el-form>

            <el-form-item>
              <el-button type="primary" size="small" @click="resetPassWord(updateFormRefForm)" v-loading="PassLoading">保存</el-button>
              <!--              <el-button type="danger" size="default" @click="closeSecond">关闭</el-button>-->
            </el-form-item>

          </el-tab-pane>
        </el-tabs>
      </el-card>
    </el-col>
  </el-row>
</template>

<script lang="ts" setup>
import {onBeforeMount, reactive, ref,} from "vue";
import {ElMessage, FormInstance, FormRules} from "element-plus";
import {useRouter} from "vue-router"
import storage from '@/utils/storage'
import api from "@/api";

const updateFormRefForm = ref<FormInstance>();
const router = useRouter();
const fileInput = ref()
let activeName = ref<string>('first')
let Loading = ref<boolean>(false);
let BaseLoading = ref<boolean>(false);
let PassLoading = ref<boolean>(false);

const updateFormRules: FormRules = {
  OldPassWord: [{required: true, message: '请输入旧密码', trigger: 'blur', min: 5, max: 30}],
  NewPassWord: [
    {required: true, message: '请输入新密码', trigger: 'blur', min: 5, max: 30},
    {required: true, message: '请输入重复密码', trigger: 'blur', min: 5, max: 30},
    {
      validator: (rule, value, callback) => {
        if (value === PasswordForm.OldPassWord) {
          callback(new Error('新密码与旧密码不得相同'));
        } else {
          callback();
        }
      },
    },
  ],
  ResetPassWord: [
    {required: true, message: '请输入重复密码', trigger: 'blur', min: 5, max: 30},
    {
      validator: (rule, value, callback) => {
        if (value !== PasswordForm.NewPassWord) {
          callback(new Error('两次输入的密码不一致'));
        } else {
          callback();
        }
      },
    }
  ],
};


/*const editFormRules: FormRules = {
  username: [{required: true, message: '请输入用户账号', trigger: 'blur'}],
  /!* email: [{required: true, message: '请输入用户邮箱', trigger: 'blur'}],
   nickname: [{required: true, message: '请输入用户昵称', trigger: 'blur'}],
   phone: [{required: true, message: '请输入用户手机', trigger: 'blur'}],
   note: [{required: true, message: '请输入用户备注', trigger: 'blur'}],*!/
}*/

const initialValue: ValueStruct = {
  String: "",
  Valid: false
}

interface ValueStruct {
  String: string,
  Valid: boolean,
}

interface PersonalInfoStruct {
  Id: string
  UserName: string
  NickName: ValueStruct
  Icon: ValueStruct
  Email: ValueStruct
  Phone: ValueStruct
  Note: ValueStruct
  CreateTime: ValueStruct;
}

interface UpdateInfoFormStruct {
  Id: string
  UserName: string
  NickName: string
  Icon: string
  Email: string
  Phone: string
  Note: string
  CreateTime: string;
}


let UpdateInfoForm = reactive<UpdateInfoFormStruct>({CreateTime: "", Email: "", Icon: "", Id: "", NickName: "", Note: "", Phone: "", UserName: ""})
let PersonalForm = reactive<PersonalInfoStruct>({
  CreateTime: {...initialValue},
  Email: {...initialValue},
  Icon: {...initialValue},
  Id: "",
  NickName: {...initialValue},
  Note: {...initialValue},
  Phone: {...initialValue},
  UserName: ""
});


interface PasswordStruct {
  Id: string,
  UserName: string,
  OldPassWord: string,
  NewPassWord: string,
  ResetPassWord: string,
}


const PasswordForm = reactive<PasswordStruct>({
  Id: "",
  UserName: "",
  OldPassWord: "",
  NewPassWord: "",
  ResetPassWord: "",
});


const handleChange = (file) => {
  if (file && file.raw) {
    if (file.raw.type !== 'image/jpeg' && file.raw.type !== 'image/png') {
      ElMessage.error('图片格式必须是JPEG或PNG格式')
      return false
    }

    if (file.size / 1024 > 300) {
      ElMessage.error({center: true, message: "文件不得大约300kb"})
      return
    }

    // 使用 FileReader 将文件转换成 Data URL
    const reader = new FileReader();
    reader.onload = (e) => {
      UpdateInfoForm.Icon = e.target.result.toString();
    };
    reader.readAsDataURL(file.raw);
  } else {
    //this.tempAvatar = '';
    UpdateInfoForm.Icon = ""
  }
}


const closeSecond = () => {
  router.go(-1);
}

const SaveEditPersonal = (async () => {
  BaseLoading.value = true
  if (PersonalForm.Icon.String === UpdateInfoForm.Icon &&
      PersonalForm.NickName.String === UpdateInfoForm.NickName &&
      PersonalForm.Phone.String === UpdateInfoForm.Phone &&
      PersonalForm.Email.String === UpdateInfoForm.Email &&
      PersonalForm.Note.String === UpdateInfoForm.Note) {
    ElMessage.error({center: true, message: "无法保存未变化的数据"})
    BaseLoading.value = false
    return
  }


  const {data: res} = await api.editPersonal(UpdateInfoForm)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    BaseLoading.value = false
    return
  }
  storage.setItem('icon', {String: UpdateInfoForm.Icon, Valid: true});
  PersonalForm.Icon.String = UpdateInfoForm.Icon
  PersonalForm.NickName.String = UpdateInfoForm.NickName
  PersonalForm.Phone.String = UpdateInfoForm.Phone
  PersonalForm.Email.String = UpdateInfoForm.Email
  PersonalForm.Note.String = UpdateInfoForm.Note
  ElMessage.success("保存成功")
  BaseLoading.value = false
  //router.go(0)
})

const resetPassWord = (async (formEl: FormInstance | undefined) => {
  PassLoading.value = true
  const {data: res} = await api.resetPersonal(PasswordForm)
  if (res.code !== 200) {
    ElMessage.error(res.message)
    PassLoading.value = false
    return
  }
  PassLoading.value = false
  storage.deleteVCookie('token')
  storage.clearAll();
  ElMessage.success({center: true, message: "修改完成, 跳转到重新登陆..."})
  setTimeout(() => {
    router.push({path: "/login"})
  }, 200)
  formEl.resetFields()
})

const getPersonalInfo = (async () => {
  Loading.value = true
  const {data: res} = await api.getPersonalInfo()
  if (res.code !== 200) {
    ElMessage.error(res.message)
    Loading.value = false
    return
  }

  PersonalForm.Id = res.data.list.Id
  PersonalForm.UserName = res.data.list.UserName
  PersonalForm.NickName = res.data.list.NickName
  PersonalForm.Icon = res.data.list.Icon
  PersonalForm.Email = res.data.list.Email
  PersonalForm.Phone = res.data.list.Phone
  PersonalForm.Note = res.data.list.Note
  PersonalForm.CreateTime = res.data.list.CreateTime


  UpdateInfoForm.Id = PersonalForm.Id
  UpdateInfoForm.UserName = PersonalForm.UserName
  UpdateInfoForm.NickName = PersonalForm.NickName.String
  UpdateInfoForm.Icon = PersonalForm.Icon.String
  UpdateInfoForm.Email = PersonalForm.Email.String
  UpdateInfoForm.Phone = PersonalForm.Phone.String
  UpdateInfoForm.Note = PersonalForm.Note.String
  UpdateInfoForm.CreateTime = PersonalForm.CreateTime.String

  PasswordForm.Id = PersonalForm.Id
  PasswordForm.UserName = PersonalForm.UserName

  Loading.value = false
})

onBeforeMount(() => {
  getPersonalInfo()
})


</script>

<style lang="less" scoped>
.el-avatar {
  height: 130px;
  width: 130px;
}

.avatar-uploader {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  width: 50px;
  height: 50px;
  position: relative;
  overflow: hidden;

  .avatar {
    width: 50px;
    height: 50px;
    display: block;
  }
}


.button-container {
  display: flex;
  justify-content: flex-end;
}


</style>