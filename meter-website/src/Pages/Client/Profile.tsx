import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import Breadcrumbs from "../../Components/Common/Breadcrumbs";
import PageTitle from "../../Components/Common/PageTitle";
import ProfileSideBar from "../../Components/Client/ProfilePage/ProfileSideBar";

function Profile() {
  const location = useLocation();

  const breadcrumbItems = [
    { label: "Home", path: "/" },
    { label: "Profile", path: "/profile" },
  ];

  // Set page title and breadcrumb based on current path
  const titleMap = {
    "/profile": "My Account",
    "/profile/address": "My Address",
    "/profile/orders": "My Orders",
    "/profile/settings": "Account Settings",
  };

  const title = titleMap[location.pathname] || "My Account";

  return (
    <>
      <Breadcrumbs items={breadcrumbItems} />
      {/* <PageTitle
        Header={title}
        Discription="Explore our range of high-quality digital and analog meter services and parts."
      /> */}

      <section className="flex flex-col  md:flex-row px-4 gap-6 my-10">
        <ProfileSideBar />
        <div className='w-full md:w-3/4 p-4 bg-white rounded-lg shadow-md min-h-[400px]'>
  <Outlet />
</div>

      </section>
    </>
  );
}

export default Profile;
