import { useEffect, useState } from "react";
import Logo from "../../assets/images/logo.svg";
import { useSelector } from "react-redux";
import Link from "next/link";
import { adminProfileGet } from "../../store/adminSlice";
import MenuIcon from "@mui/icons-material/Menu";
import { RootStore, useAppDispatch } from "../../store/store";
import { projectName } from "@/util/config";
import userImage from "../../assets/images/8.jpg";

const Navbar = () => {
  const dispatch = useAppDispatch();
  const getAdminData =
    typeof window !== "undefined" &&
    JSON.parse(sessionStorage.getItem("admin_"));
  const { admin } = useSelector((state: RootStore) => state.admin);


  const getAdminIn =
    typeof window !== "undefined" &&
    JSON.parse(sessionStorage.getItem("admin_"));
  const [adminData, setAdminData] = useState<{ name?: string; image?: string }>(
    {}
  );

  useEffect(() => {
    if (getAdminIn) {
      setAdminData(getAdminIn);
    }
  }, []);

  useEffect(() => {
    const payload: any = {
      adminId: getAdminData?._id,
    };
    dispatch(adminProfileGet(payload));
  }, []);

  return (
    <div className="mainNavbar webNav me-4">
      <div className="row">
        <div className="navBox" style={{ paddingTop: "8px" }}>
          <div
            className="navBar boxBetween px-4"
            style={{ padding: "10px 0px" }}
          >
            <div className="navToggle" id={"toggle"}>
              <MenuIcon />
            </div>
            <div className="col-4 logo-show-nav">
              <div className="sideBarLogo boxCenter">
                <Link
                  href={"/admin/dashboard"}
                  className="d-flex align-items-center"
                >
                  <img src={Logo} alt="logo" width={40} />
                  <span className="fs-3 fw-bold">{projectName}</span>
                </Link>
              </div>
            </div>
            <div className="col-7">
              <div className="navIcons d-flex align-items-center justify-content-end">
                <div className="cursor">
                  <Link href="/owner" style={{ backgroundColor: "inherit" }}>
                    {admin?.image && admin?.image !== "" ? (
                      <img
                        src={admin?.image}
                        alt="Image"
                        width={50}
                        height={50}
                        style={{
                          borderRadius: "15px",
                          border: "1px solid white",
                          objectFit: "cover",
                        }}
                        className="cursor"
                      />
                    ) : (
                      <img
                        src={userImage?.src}
                        alt="Image"
                        width={50}
                        height={50}
                        style={{
                          borderRadius: "15px",
                          border: "1px solid white",
                          objectFit: "cover",
                        }}
                        className="cursor"
                      />
                    )}
                  </Link>
                </div>
                <div
                  className="pe-4 ml-1"
                  style={{ backgroundColor: "inherit", marginLeft: "10px" }}
                >
                  <span
                    style={{
                      cursor: "pointer",
                      fontSize: "16px",
                      textTransform: "capitalize",
                    }}
                  >
                    {adminData?.name || "admin"}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Navbar;
