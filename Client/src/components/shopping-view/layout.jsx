import ShoppingHeader from "./header";




function ShoppigLayout () {
    return(
        <div className="flex flex-col bg-white overflow-hidden">
            {/*common header*/}
            <ShoppingHeader/>
            <main className="flex flex-col w-full">
            <Outlet/>
            </main>
        </div>
    );

    
}
export default ShoppigLayout;
