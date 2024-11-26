

const Loader = () => {
  return (
    <div className="flex items-center justify-center w-full h-screen bg-gray-100 dark:bg-gray-950 text-gray-900 dark:text-gray-100">
      <div className="flex flex-col items-center space-y-2">
        <div className="flex items-center space-x-3">
          <div className="text-2xl md:text-4xl font-bold">L</div>
          <div className="relative flex items-center">
            <div className="w-16 h-16 flex items-center justify-center">
              <div className="w-8 h-8 bg-blue-500 dark:bg-blue-400 rounded-full animate-bounce"></div>
            </div>
            <div className="text-xl md:text-2xl font-bold ml-2">ading . . .</div>
          </div>
        </div>
      
      </div>
    </div>
  );
};

export default Loader;
