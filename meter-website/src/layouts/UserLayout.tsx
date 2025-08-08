import { Outlet } from "react-router-dom";
import Header from "../Components/Common/Header";
import Footer from "../Components/Common/Footer";

const UsersLayout = () => {

    return (
        <div >
            <Header />
            <main className="px-9 py-3">
                <Outlet />
            </main>
            <Footer/>
        </div>
    );
};

export default UsersLayout;
