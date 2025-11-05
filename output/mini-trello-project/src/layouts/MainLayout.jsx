import Header from "../components/ui/Header";

import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div
      className="min-h-[100vh]
    bg-gradient-to-br from-[rgba(42,123,155,1)] via-[rgba(87,199,133,1)] to-[rgba(237,221,83,1)]
    dark:bg-[linear-gradient(344deg,rgba(20,25,64,1)_0%,rgba(18,87,41,1)_52%,rgba(97,49,40,1)_100%)]
  "
    >
      <Header />
      <Outlet />
    </div>
  );
}

export default MainLayout;
