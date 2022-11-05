import store from '@/store'

export default {
  inserted(el, binding) {
    // console.log(el, binding)
    const points = store.state.user.userInfo.roles.points
    if (!points.includes(binding.value)) {
      el.parentNode.removeChild(el)
    }
  }
}
