// 函数封装
// 1. 判断token并获取用户信息和渲染
function upload() {
  $.ajax({
    type: "get",
    url: bigNews.user_info,
    // 已设置全局token请求头，此处可以取消
    // headers: {
    //   Authorization: localStorage.getItem('token')
    // },
    success: function (response) {
      // 1.1 获取成功 - token正常则显示姓名头像
      if (response.code === 200) {
        const userPic = response.data.userPic;
        const nickname = response.data.nickname;
        $('.user_info strong').text(nickname);
        $('[alt="person"]').prop('src', userPic);
      }
    },
    // 1.2 获取失败 - token 不正常则登录失败，让联系管理员
    // 已布置全局
    // error: function (error) {
    //     alert(error.responseJSON.msg)
    //     location.href = './login.html'
    // }
  })
}

// 2. 调用模态框封装
function callModal(objData) {
  $(objData.ele).modal({
    keyboard: objData.keyboard,
    backdrop: objData.backdrop
  })
  $(objData.ele + " .modal-body").text(objData.text)
}

// jQuery 入口函数
$(function () {
  // 1. 进入后台调用upload
  upload();

  // 2. 点击退出弹出提示，确定退出则清空 token 且退出页面，取消则不操作
  $('.logout').click(function () { 
    if (confirm('您确定要退出后台管理系统吗？')) {
      localStorage.removeItem('token')
      location.href = './login.html';
    }
  });

  // 3. 点击tab蓝切换类
  // 3.1 一级菜单排他思想
  $('.level01').click(function () {
    $(this).addClass('active').siblings().removeClass('active')

    // 3.2 文章管理二级菜单
    if ($(this).next().hasClass('level02')) {

      // 展开/收回二级菜单
      $('.level02').slideToggle()

      // 默认文章管理打开第一个高亮
      if (!$('.level02').children().hasClass('active') && $('.level02').css('display') == 'block') {
        $('.level02 li:first-child').addClass('active');
        $('.level02 li:first-child a')[0].click();
      }

      // 小三角旋转90deg
      $(this).find('b').toggleClass('rotate0');
    } else {
      $('.level02 li').removeClass('active');
    }

  })

  // 3.3 三级菜单点击也能排他切换
  $('.level02 li').click(function () {
    $(this).addClass('active').siblings().removeClass('active');
    // 父级亮，其他不亮
    $(this).parent().prev().addClass('active').siblings().removeClass('active')
  })

  // 4. 点击大事件logo刷新页面
  $('.logo').click(function (e) { 
    e.preventDefault();
    window.location.reload();
  });

  // bug 修复
  // 1. 点击右上角个人中心，左侧个人中心高亮，其他不高亮
  $('.user_center_link a:first-child').click(function () {
    $('#user').addClass('active').siblings().removeClass('active');
  })
})