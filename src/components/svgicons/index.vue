<template>
  <svg :class="svgClass" aria-haspopup="true">
    <use :xlink:href="iconName"></use>
  </svg>
</template>

<script lang="ts">
import {computed} from 'vue'

export default {
  name: "baseSvgIcon",
  props: {
    iconClass: {type: String},
    className: {type: String},
  },
  setup(props) {
    const iconName = computed(() => {
      return props.iconClass ? `#icon-${props.iconClass}` : '#icon'
    })
    const svgClass = computed(() => {
      return props.className ? `#icon-${props.className}` : 'svg-icon'
    })
    return {iconName, svgClass}
  }
}
</script>

<style scoped>
.svg-icon {
  width: 1em;
  height: 1em;
  vertical-align: -0.15em;
  fill: currentColor;
  overflow: hidden;
}
</style>