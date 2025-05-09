  import Slider from "react-slick";
  import "slick-carousel/slick/slick.css";
  import "slick-carousel/slick/slick-theme.css";
  const CustomPrevArrow = (props: any) => (
    <button
      {...props}
      className="slick-arrow slick-prev text-4xl text-gray-800 hover:text-black"
    >
      &#9664;
    </button>
  );
  
  const CustomNextArrow = (props: any) => (
    <button
      {...props}
      className="slick-arrow slick-next text-4xl text-gray-800 hover:text-black"
    >
      &#9654;
    </button>
  );
  
  const ProductSlider = () => {
    const settings = {
      dots: true,           // Shows navigation dots
      infinite: true,       // Loops infinitely
      speed: 500,           // Transition speed
      slidesToShow: 1,      // Show one image at a time
      slidesToScroll: 1,    // Scroll one at a time
      autoplay: true,       // Auto-slide images
      autoplaySpeed: 3000,  // Time per slide (3 sec)
      arrows: true         
      ,
  prevArrow: <CustomPrevArrow />,
  nextArrow: <CustomNextArrow />
    };
    

    return (
      <div className="w-screen">

        <Slider {...settings}>
          <div>
            <img 
              src="https://melcom.com/media/slidebanner/m/i/milkana-widget-1.jpg" 
              alt="Milkana Product 1" 
              className="w-full h-auto rounded-lg"
            />
          </div>
          <div>
            <img 
              src="https://melcom.com/media/slidebanner/s/u/supermarket_1.jpg" 
              alt="supermarket" 
              className="w-full h-auto rounded-lg"
            />https://melcom.com/seara-products.html
          </div>
          <div>
            <img 
              src="https://melcom.com/media/slidebanner/k/e/kerry-gold-widget-1.jpg" 
              alt="kerry gold" 
              className="w-full h-auto rounded-lg"
              
            />
      
            </div>
            <div>
            <img 
              src="https://melcom.com/media/slidebanner/w/i/widget_1_11.jpg"
              alt="laptop" 
              className="w-full h-auto rounded-lg"
              
            />
          </div>
          <div>
            <img 
              src="https://melcom.com/media/slidebanner/h/o/houseware_and_kitchenware.jpg"
              alt="Houseware and kitchenware" 
              className="w-full h-auto rounded-lg"
              
            />
            
          </div>
        {/* <div>
            <img 
              src=""
              alt="Laptop" 
              className="w-full h-auto rounded-lg"
              
            />
            </div>
          <div>
            <img 
              src=""
              alt="" 
              className="w-full h-auto rounded-lg"
              
            /> 
            </div>  */}
        </Slider>
      </div>
    );
  };

  export default ProductSlider;
