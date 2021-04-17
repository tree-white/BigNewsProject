$(function () {

  let userDetail = null

  getDetail();
  function getDetail() {
      $.ajax({
    type: "get",
    url: bigNews.user_detail,
    dataType: "json",
    success: function (response) {
      console.log(response);
      userDetail = response.data
      // $('#inputEmail1').val(response.data.nickname);      // 用户名称
      // $('#inputEmail2').val(response.data.username);      // 昵称
      // $('#inputEmail3').val(response.data.email);         // 邮箱
      // $('.user_pic').prop('src', response.data.userPic);  // 用户图标
      // $('#inputEmail4').val(response.data.password);      // 用户密码
      for (let key in response.data) {
        // console.log(key);
        // console.log(`[name=${key}]`);
        $(`input.${key}`).val(response.data[key])
        $('.user_pic').prop('src', response.data.userPic);  // 用户图标
      }
    }
  });
  }

  let flag = false
  let file = null;
  $('#exampleInputFile').on('change',function () {
    console.log('改变了');
    flag = true
    // console.dir(this);
    file = this.files[0];
    let urlPic = URL.createObjectURL(file)
    console.log(urlPic);
    $(this).siblings('label').children('img').prop('src',urlPic)
    
  })

  $('.btn-edit').click(function (e) { 
    e.preventDefault();
    const fd = new FormData();
    // console.log(fd);
    for (let key in userDetail) {
      // console.log(key);
      if (flag && key == 'userPic') {
        fd.append(key, file)
      }
      fd.append(key, $(`input.${key}`).val())
    }

    $.ajax({
      type: "post",
      url: bigNews.user_edit,
      contentType: false,
      processData: false,
      data: fd,
      dataType: "json",
      success: function (response) {
        console.log(response);
        if (response.code == 200) {
          alert(response.msg)
          getDetail();
          $('.user_pic').siblings('label').children('img').prop('src','./images/uploads_icon.jpg')
          // let initPic = './images/uploads_icon.jpg';
          // if (!$uploadPic.prop('src', initPic)) {
          //   $uploadPic.prop('src',initPic)
          // }
          w.upload();
        }

      }
    });
    
  });



})

