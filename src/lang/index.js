// 导入 Vue
import Vue from 'vue'

// 导入 vue-i18n 插件
import VueI18n from 'vue-i18n'
import locale from 'element-ui/lib/locale' // 导入 Element 语言配置插件
import enLocale from 'element-ui/lib/locale/lang/en' // 导入 Element 英文包
import zhLocale from 'element-ui/lib/locale/lang/zh-CN' // 导入 Element 中文包

Vue.use(VueI18n)

// 创建国际化插件的实例
const i18n = new VueI18n({
  locale: 'en', // 设置地区，zh 表示中国地区
  // 设置地区信息
  messages: {
    en: {
      navbar: {
        companyName: 'xxx Technology Co., Ltd'
      },
      sidebar: {
        dashboard: 'Dashboard',
        approvals: 'Approvals',
        departments: 'Departements',
        employees: ' Employees',
        permissions: 'Permission',
        attendances: 'Attendances',
        salarys: 'Salarys',
        settings: 'Company-Settings',
        social_securitys: 'Social'
      },
      ...enLocale
    },
    zh: {
      navbar: {
        companyName: 'xxx科技股份有限公司'
      },
      sidebar: {
        dashboard: '首页',
        approvals: '审批',
        departments: '组织架构',
        employees: ' 员工',
        permissions: '权限',
        attendances: '考勤',
        salarys: '工资',
        settings: '公司设置',
        social_securitys: '社保'
      },
      ...zhLocale
    }
  }
})

// 配置 Element 语言转换关系
locale.i18n((key, value) => i18n.t(key, value))

export default i18n
