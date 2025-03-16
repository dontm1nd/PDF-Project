export default function dashboard(){
    return( 
        <div className="max-w-md mx-auto rounded-lg overflow-hidden md:max-w-xl flex flex-col min-h-screen items-center justify-center">
            <div className="md:flex">
                <div className="w-full p-3">
                    <div className="relative h-48 rounded-lg border-2 border-blue-500 bg-gray-50 flex justify-center items-center shadow-lg hover:shadow-xl transition-shadow duration-300 ease-in-out">
                        <div className="absolute flex flex-col items-center">
                        <img
                            alt="File Icon"
                            className="mb-3 w-1/2"
                            src="public/img/jpg.png"
                        />
                        <span className="block text-gray-500 font-semibold"
                            >Drag &amp; drop your files here
                        </span>
                        <span className="block text-gray-400 font-normal mt-1"
                            >or click to upload
                        </span>
                        </div>

                        <input
                            name=""
                            className="h-full w-full opacity-0 cursor-pointer"
                            type="file"
                            accept="image/jpg"
                            //onChange={handleFileChange}
                        />
                    </div>
                </div>
            </div>
            
            <button className="w-40 h-16 text-white font-semibold bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-lg shadow-lg hover:scale-105 duration-200 hover:drop-shadow-2xl hover:shadow-[#c6cbcd] hover:cursor-pointer">
                Convert
            </button>

        </div>
    )
}