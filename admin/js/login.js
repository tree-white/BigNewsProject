 /* 
    登录页的JS业务代码
    目标：登录页实现
    步骤：
      1. 给登录按钮绑定点击事件（注意阻止默认行为）
      2. 在点击事件内部获取 用户名和密码
      3. 对用户输入的内容进行非空判断
      4. 不为空的情况下才发送 ajax 请求
      5. 打印服务器返回的数据。
      ...
      请求地址：/admin/user/login
      请求方式：post
      请求参数：
      | 名称     | 类型   | 说明            |
      | -------- | ------ | ------------- |
      | username | string | 用户名（admin） |
      | password | string | 密码(123456)   |
  */
  // 入口函数
  $(function () {
    // 1. 给登录按钮绑定点击事件
    $('.input_sub').click(function (e) {
      // 1.1 注意阻止默认行为
      e.preventDefault();
      // 2. 在点击事件内部获取 用户名和密码
      const user = $('.input_txt').val().trim();
      const pwd = $('.input_pass').val().trim();
      // 3. 对用户输入的内容进行非空判断
      if (user === '' && pwd === '') {
        // alert('用户名和密码不能为空！')
        showModal('用户名和密码不能为空！')
      } else if (user === '') {
        // alert('用户名不能为空！');
        showModal('用户名不能为空！')
      } else if (pwd === '') {
        // alert('密码不能为空！');
        showModal('密码不能为空！')
      } else {
        // 4. 不为空的情况下才发送 ajax 请求
        $.ajax({
          type: "post",
          url: "http://localhost:8080/api/v1/admin/user/login",
          data: {
            username: user,
            password: pwd
          },
          success: function (response) {
            console.log(response);
            if (response.code === 200) {
              // 登录成功后，返回的token通过本地存储保存起来
              localStorage.setItem('token', response.token);
              // 跳转到首页
              location.href = './index.html';

            } else {
              // 反之根据返回的内容提示
              // alert(response.msg);
              showModal(response.msg);
            }
          }
        });


      }

    });

    // 封装 bootstrap 模态框
    function showModal(res) {
      $('#myModal').modal()
      $('.modal-body').text(res)
    }

  })