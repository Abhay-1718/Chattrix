import Logo from "../../../../public/logo.png";

const EmptyChatContainer = () => {
  return (
    <div className="hidden md:flex flex-1 bg-[#121212] flex-col justify-center items-center p-5 transition-all duration-1000">
      <div className="text-opacity-80 text-white flex flex-col gap-5 items-center text-center">
        <h3 className="poppins-medium text-2xl md:text-3xl lg:text-4xl transition-all duration-300">
          Hi<span className="text-purple-500">!</span> Welcome to
          <span className="text-purple-500 flex items-center justify-center">
            <img
              src={Logo}
              className="h-10 md:h-12 lg:h-14 mx-2"
              alt="Chat App Logo"
            />
            Chat App
          </span>
          <span className="text-purple-500">.</span>
        </h3>
      </div>
    </div>
  );
};

export default EmptyChatContainer;
