
const Not = () =>{
    setInterval(() => {
        window.location.href = "/api/auth/signin";
    },3000)
    return(
        <div className="w-[100%] h-[100vh] bg-green-400 flex flex-col items-center justify-center">
            <div className="flex justify-center space-y-2 flex-col items-center bg-white px-8 py-4 rounded-md shadow-lg">
                <h1 className="text-3xl font-bold">Not Autherized!</h1>
                <h2 className="text-xl">You are not autherized to access this page</h2>
                <h3 className="text-lg">Redirecting...</h3>
            </div>
        </div>
    )
}

export default Not