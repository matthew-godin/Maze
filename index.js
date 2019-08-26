var width = window.innerWidth
|| document.documentElement.clientWidth
|| document.body.clientWidth;

var height = window.innerHeight
|| document.documentElement.clientHeight
|| document.body.clientHeight;

var list = document.getElementsByTagName("TITLE")[0];
list.innerHTML = "width: " + width + " height: " + height