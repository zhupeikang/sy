import { defineComponent, h } from 'vue';

const Render = defineComponent({
  functional: true, // 设置为true表示该组件为函数式组件
  props: {
    render: {
      type: Object, // 声明 render 属性的类型为对象
      required: true, // 声明 render 属性为必须
    },
  },
  render(ctx,a) {
    console.log(ctx);
    return h(ctx.render, ctx.$props, ctx.$slots);
  },
});

export default Render;
