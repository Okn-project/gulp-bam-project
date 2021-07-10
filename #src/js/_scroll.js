$(document).ready(function () {
  $(".slider__wrapper").slick({
    speed: 1200,
    // adaptiveHeight: true,
    prevArrow:
      '<button type="button" class="slick-prev"><img src="../img/icons/left.svg"></button>',
    nextArrow:
      '<button type="button" class="slick-next"><img src="../img/icons/right.svg"></button>',
    responsive: [
      {
        breakpoint: 575,
        settings: {
          dots: true,
          arrows: false,
          
        },
      },
    ],
  });
});
