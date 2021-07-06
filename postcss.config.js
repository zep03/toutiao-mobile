/*
* PostCSS的配置文件
* PostCSS 是基于 Node.js 运行的一个处理CSS的工具
* 所以他的配置文件也是运行在Node.js中
* */

// PostCSS 配置文件需要导出一个对象
module.exports = {
  // 配置要使用的相关的插件
  plugins: {
    // 自动添加浏览器厂商声明前缀，用来兼容不同的浏览器
    // VueCli 已经在内部默认配置了 autoprefixer
    // autoprefixer: {
    //   // browsers 用来配置要兼容到的系统（浏览器）环境
    //   browsers: ['Android >= 4.0', 'iOS >= 8']
    // },
    // 把 px 转为 rem
    'postcss-pxtorem': {
      // 转换的根元素基准值
      // 正常情况下按照你的设计稿来
      // 375 宽带设计稿，375/10 = 37.5
      // Vant 组件库是基于375宽写的
      // 移动端页面一般都是以 iPhone6/7/8为原型设计的
      // Vant 组件库是基于逻辑像素375写的
      // 设计稿都是基于物理像素宽750写的
      // 所以如果成设置75，那么我们可以在设计稿中测量多少就写多少
      // 但是Vant的样式就会变得很小，小了一半
      // 所以我们还必须设置成37.5，所以我们在测量设计稿时，必须让你的测量数值/2
      rootValue: 37.5,
      // 需要转换的CSS属性， *就是所有属性都要转换
      propList: ['*']
    }
  }
}