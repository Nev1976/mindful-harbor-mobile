export default function Images() {
  const images = [
    { name: "Lighthouse Calm", src: "/logo-options/lighthouse-calm.svg", description: "Classic lighthouse with gentle light beams" },
    { name: "Harbor Sunset", src: "/logo-options/harbor-sunset.svg", description: "Warm sunset colors with harbor pier" },
    { name: "Mindful Anchor", src: "/logo-options/mindful-anchor.svg", description: "Glowing anchor with meditation elements" },
    { name: "Peaceful Dock", src: "/logo-options/peaceful-dock.svg", description: "Person meditating on wooden dock" },
    { name: "Zen Harbor", src: "/logo-options/zen-harbor.svg", description: "Minimalist design with zen stones" }
  ];

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-8 text-teal-800">
        Mindful Harbor Logo Options
      </h1>
      
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {images.map((image, index) => (
          <div key={index} className="bg-white rounded-lg shadow-lg p-4 border border-gray-200">
            <div className="bg-gray-50 rounded-lg p-4 mb-4 flex justify-center items-center h-48">
              <img 
                src={image.src} 
                alt={image.name}
                className="max-h-full max-w-full object-contain"
              />
            </div>
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {image.name}
            </h3>
            <p className="text-sm text-gray-600">
              {image.description}
            </p>
          </div>
        ))}
      </div>
      
      <div className="text-center mt-8">
        <p className="text-gray-600">
          Which style do you prefer for Mindful Harbor?
        </p>
      </div>
    </div>
  );
}