function Loader() {
    return (
        <div className="flex flex-col justify-center items-center py-2">
            <div className="animate-spin inline-block w-10 h-10 border-[5px] border-current border-t-transparent text-green-600 rounded-full"></div>
            <div>Loading Model...</div>
        </div>
    )
}

export default Loader;