$(document).ready(function(){

	console.log("jquery is ready")

	$("#btn-news-prev").click(function(){
		console.log($('.carousel').carousel('prev'));
	  });

	  $("#btn-news-next").click(function(){
		$('.carousel').carousel('next');
	  });

	  $(".item").click(function(){
		console.log('click')
	  });

	  function alerta() {
		  alert('funcionou');
	  }

});