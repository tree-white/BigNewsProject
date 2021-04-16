/* 
  目标：用户信息功能，进入首页后直接通过 ajax 发请求获取用户信息（头像和名称）
  接口：获取用户信息
    请求地址：/admin/user/info
    请求方式：get
    请求参数：无
    返回数据：
    |   名称   |  类型  | 说明         |
    | :------: | :----: | ------------ |
    | nickname | string | 用户昵称     |
    | userPic  | string | 用户图片地址 |
*/

$(function () {
  // 1. 进入后台直接判断token是否正常
  $.ajax({
    type: "get",
    url: bigNews.user_info,
    dataType: 'json',
    // 已设置全局token请求头，此处可以取消
    // headers: {
    //   Authorization: localStorage.getItem('token')
    // },
    success: function (response) {
      console.log(response);
      // 1.1 获取成功 - token正常则显示姓名头像
      if (response.code === 200) {
        const userPic = response.data.userPic;
        const nickname = response.data.nickname;
        $('.user_info strong').text(nickname);
        $('[alt="person"]').prop('src',userPic);
      }
    },
    // 1.2 获取失败 - token 不正常则登录失败，让联系管理员
    // 已布置全局
    // error: function (error) {
    //     alert(error.responseJSON.msg)
    //     location.href = './login.html'
    // }
  })

  // 点击退出弹出提示，确定退出则清空 token 且退出页面，取消则不操作
  $('.logout').click(function (e) { 
    if (confirm('您确定要退出后台管理系统吗？')) {
      localStorage.removeItem('token')
      location.href = './login.html';
    }
  });




})