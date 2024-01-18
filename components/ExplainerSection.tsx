import blur from "/public/blur.png";
import example from "/public/example.png";
import result from "/public/result.png";

export default function ExplainerSection() {
  return (
    <div className="w-full max-w-6xl p-8 mt-16 space-y-8 bg-gray-100 rounded-lg dark:bg-gray-800">
      <h2 className="mb-8 text-3xl font-bold text-center">How It Works</h2>

      {/* Step 1: Upload your images */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 text-3xl font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-full">
            1
          </div>
          <h3 className="text-2xl font-semibold">Upload your images</h3>
        </div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Upload 4+ high-quality selfies: front facing, 1 person in frame, no
          glasses or hats.
        </p>
        <img
          src={example.src}
          alt="AI Headshot example"
          className="object-cover w-full mx-auto rounded-lg md:w-3/4 lg:w-1/2"
        />
      </div>

      {/* Step 2: Train your model */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 text-3xl font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-full">
            2
          </div>
          <h3 className="text-2xl font-semibold">Our AI gets to work</h3>
        </div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          The AI magic takes ~20 minutes. You'll get an email when its ready!
        </p>
        <img
          src={blur.src}
          alt="AI Headshot blur"
          className="object-cover w-full mx-auto rounded-lg md:w-3/4 lg:w-1/2"
        />
      </div>

      {/* Step 3: Generate images */}
      <div className="space-y-4">
        <div className="flex items-center justify-center space-x-4">
          <div className="flex items-center justify-center w-10 h-10 text-3xl font-bold text-blue-600 bg-white border-2 border-blue-600 rounded-full">
            3
          </div>
          <h3 className="text-2xl font-semibold">Get amazing headshots</h3>
        </div>
        <p className="text-sm text-center text-gray-600 dark:text-gray-400">
          Once your model is trained, we'll give you amazing headshots!
        </p>
        <img
          src={result.src}
          alt="AI Headshot result"
          className="object-cover w-full mx-auto rounded-lg md:w-3/4 lg:w-1/2"
        />
      </div>
    </div>
  );
}
