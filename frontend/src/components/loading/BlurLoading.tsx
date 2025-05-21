
function BlurLoading() {

    return (
        <div className="fixed w-full h-full z-100 backdrop-blur-xs flex justify-center items-center">

            <div className="flex justify-center items-center">
                <div className="loader"></div>
            </div>

        </div>
    );
}

export default BlurLoading;