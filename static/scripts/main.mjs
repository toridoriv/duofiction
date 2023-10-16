/// <reference lib="dom" />
import $ from "https://esm.sh/jquery@3.7.1";

$("#login-form").on("submit", function handleSubmitLogin() {
  $("#redirect-to").attr("value", window.location.pathname);
});

$("#logout-form").on("submit", function handleClickLogout() {
  $("#logout-redirect-to").attr("value", window.location.pathname);
});
