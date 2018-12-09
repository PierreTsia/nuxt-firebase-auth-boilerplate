<template>
    <svg v-bind="$attrs">
        <slot />
    </svg>
</template>
<script>
export default {
  name: "Icon"
};
</script>
<style lang="scss" scoped>
.icon {
  display: inline-block;
}

.icon-default {
  stroke: black;
  fill: black;
}

.icon-normal {
  height: 18px;
  width: 18px;
}

.icon-medium {
  height: 35px;
  width: 35px;
}
.icon-big {
  height: 50px;
  width: 50px;
}
.icon-small {
  height: 15px;
  width: 15px;
  min-width: 15px;
}
.icon-x-small {
  height: 10px;
  width: 10px;
}

.icon-success {
  fill: #26c55b;
  stroke: #26c55b;
}
.icon-info {
  fill: #1695ed;
  stroke: #1695ed;
}
.icon-danger {
  fill: #ff2f57;
  stroke: #ff2f57;
}
.icon-warning {
  fill: #ffda4b;
  stroke: #ffda4b;
}
.icon-white {
  fill: white;
  stroke: white;
}

.icon-grey{
  fill: 	#909090;
}
</style>
