$(".nbt-close-btn").on("click", function () {
  if (!$(this).hasClass("b-hidden")) {
    $(".close-module").addClass("b-hidden");
    $(this).addClass("b-hidden");
    $("#bjd_bottom_detail").css("width", "94px");
    $(".right-info").css("display", "none");
  } else {
    $(".close-module").removeClass("b-hidden");
    $(this).removeClass("b-hidden");
    $("#bjd_bottom_detail").css("width", "auto");
    $(".right-info").css("display", "flex");
  }
});

var time1 = undefined;
$("#bjd_logo").on("mouseenter", function () {
  $("#nbt_setting").show();
});
$("#bjd_logo").on("mouseleave", function () {
  time1 = setTimeout(function () {
    $("#nbt_setting").hide();
  }, 200);
});
$("#nbt_setting").on("mouseenter", function () {
  clearTimeout(time1);
});
$("#nbt_setting").on("mouseleave", function () {
  $("#nbt_setting").hide();
});

// $("#nbt_setting .setting-item").on("mouseenter", function () {
//   $(this).addClass("setting_hover");
// });
// $("#nbt_setting .setting-item").on("mouseleave", function () {
//   $(this).removeClass("setting_hover");
// });
