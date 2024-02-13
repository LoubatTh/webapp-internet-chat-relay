const StartPage = () => {
 // split the page into two columns
  // the right column will have a login form and possibility to connext as a guest
  // the left column will have a images in background
  return (
    <div className="flex flex-row h-screen w-screen">
      <div className="w-2/3 h-full bg-primary">
        <img
          className="h-full w-full object-cover"
          src="https://images.unsplash.com/photo-1632830834476-3a5d1e8f2c9b?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=MnwyNTI2NzV8MHwxfGFsbHwxfHx8fHx8fHx8fHwxNjMyNzQ0NjAw&ixlib=rb-1.2.1&q=80&w=400"
          alt="background"
        />
      </div>
      <div className=" w-1/3 h-full bg-black">
        <div className="flex flex-col justify-center items-center h-full">
          <h1 className="text-5xl text-primary-foreground">Welcome to Epichat</h1>
          <div className="flex flex-col justify-center items-center">
            <button className="bg-primary-foreground text-primary p-2 m-2 rounded-md">
              Login
            </button>
            <button className="bg-primary-foreground text-primary p-2 m-2 rounded-md">
              Connect as a guest
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StartPage;