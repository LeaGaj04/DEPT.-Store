export default function InstagramMarquee() {
  const images = [
    "https://i.pinimg.com/1200x/53/a7/64/53a764d81d448ccfc3f0c4cf4b826341.jpg",
    "https://i.pinimg.com/1200x/fa/ba/9f/faba9f487ee5c0d90450658a75d9671a.jpg",
    "https://i.pinimg.com/736x/83/6c/47/836c475e53aff4fbfba7be929651624b.jpg",
    "https://i.pinimg.com/736x/22/79/0f/22790f8ad40d0c77bd80e023bf5de14d.jpg",
    "https://i.pinimg.com/1200x/cd/fc/60/cdfc6090d76279124478afe011a2f9f4.jpg",
    "https://i.pinimg.com/736x/62/c7/b3/62c7b3987f950bb7e614522577f400af.jpg",
    "https://i.pinimg.com/736x/d1/3b/5e/d13b5e177573869ac09e1efbc0eef11e.jpg",
    "https://i.pinimg.com/1200x/5a/d8/04/5ad804019bff3382356371293ea1a713.jpg"
  ];

  return (
    <div className="bg-white text-black w-full overflow-hidden py-16">
      <div className="max-w-7xl mx-auto px-4">
        <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-8 uppercase">
          @Dept.
        </h2>
      </div>
      
      <div className="relative flex overflow-x-hidden group">
        <div className="flex animate-marquee group-hover:[animation-play-state:paused]">
          
          {/* Primera tanda */}
          {images.map((src, index) => (
            <div key={`first-${index}`} className="flex-none w-48 md:w-64 aspect-[3/4] mx-2 bg-zinc-100 overflow-hidden cursor-pointer">
              <img 
                src={src} 
                alt={`Feed ${index + 1}`} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </div>
          ))}
          
          {/* Segunda tanda */}
          {images.map((src, index) => (
            <div key={`second-${index}`} className="flex-none w-48 md:w-64 aspect-[3/4] mx-2 bg-zinc-100 overflow-hidden cursor-pointer">
              <img 
                src={src} 
                alt={`Feed ${index + 1} clone`} 
                className="w-full h-full object-cover hover:scale-110 transition-transform duration-700" 
              />
            </div>
          ))}
          
        </div>
      </div>
    </div>
  );
}