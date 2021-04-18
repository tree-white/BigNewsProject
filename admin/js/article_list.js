// 入口函数
$(function () {
  // 功能：文字列表下拉框渲染
  $.ajax({
    type: "get",
    url: bigNews.category_list,
    dataType: "json",
    success: function (response) {
      console.log(response);
      if (response.code == 200) {
        const htmlStr = template('cateOption', response)
        $('#selCategory').html(htmlStr)
      }
    }
  });
  
})