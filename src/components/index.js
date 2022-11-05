import PageTools from '@/components/PageTools'
import UploadImg from '@/components/UploadImg'
import ImageHolder from '@/components/ImageHolder'
import Lang from '@/components/Lang'
import ScreenFull from './ScreenFull'

export default {
  install(Vue) {
    Vue.component('PageTools', PageTools)
    Vue.component('UploadImg', UploadImg)
    Vue.component('ImageHolder', ImageHolder)
    Vue.component('Lang', Lang)
    Vue.component('ScreenFull', ScreenFull)
  }
}
