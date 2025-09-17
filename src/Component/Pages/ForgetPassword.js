import { useEffect, useState } from "react";
import Button from "../extra/Button";
import Input from "../extra/Input";
import { useNavigate } from "react-router-dom";
import { forgotPassword, loginAdmin } from "../store/admin/admin.action";
import { connect, useDispatch, useSelector } from "react-redux";
import EraShop from "../../assets/images/EraShopImage.png"
import loginLogo from "../../assets/images/loginLogo.png"

const Login = (props) => {
  let navigate = useNavigate();
  const dispatch = useDispatch();

  const isAuth = useSelector((state) => state.admin.isAuth);

  useEffect(() => {
    isAuth && navigate("/admin");
  }, [isAuth]);

  // const [email, setEmail] = useState("");
  // const [password, setPassword] = useState("");
  const [email, setEmail] = useState("");

  const [error, setError] = useState({
    email: "",
    password: "",
  });


  const handleSubmit = () => {
    if (!email) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      return setError({ ...error });
    } else {
      let login = {
        email: email,
      };

      dispatch(forgotPassword(login));
    }
  };

  return (
    <>
      <div className="mainLoginPage">
        <div className="loginDiv">
          <div className="row">
            <div
              className="col-xl-6 d-xxl-block d-xl-block d-none boxCenter p-5"
            style={{ background: "#DEF213" }}
            >
              {/* <div
                className="p-5"
                style={{
                  // background: "#DEF213",
                }}
              > */}
                <img
                  className="img-fluid"
                  src={EraShop}
                  alt="text logo"
                  srcset=""
                />
                <img className="img-fluid"
                src={loginLogo}
                alt="login logo" />
              {/* </div> */}
            </div>
            <div className="col-xl-6 col-md-12 boxCenter"
              style={{
                background: "#181A31"
              }}
            >
              <div className="loginDiv2">
                <div className="loginPage pt-3">
                  <div className="my-4">
                    <div className="loginLogo  me-3 pt-1 pe-1">
                      <img
                        src={require("../../assets/images/Frame 162747.png")}
                        alt=""
                        width={"80px"}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      color: "rgba(255, 255, 255)",
                      fontSize: "16px",
                      fontWeight: "400",
                      lineHeight: "22px",
                      letterSpacing: "0.48px",
                    }}
                    className=""
                  >
                    <p>Welcome back !!!</p>
                  </div>
                  <div className=" mb-3">
                    <h3
                      className="fw-bold text-light"
                      style={{ fontSize: "56px", fontWeight: "600" }}
                    >
                      Log In
                    </h3>
                  </div>
                  <div className="loginInput">
                    <Input
                      label={`Email`}
                      id={`loginEmail`}
                      type={`email`}
                      value={email}
                      style={{ background: "rgba(185, 49, 96, 0.11)" }}
                      errorMessage={error.email && error.email}
                      onChange={(e) => {
                        setEmail(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            email: `Email Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            email: "",
                          });
                        }
                      }}
                    />

                   
                  </div>

                  <div className="loginButton d-flex justify-content-center mt-5">
                    <Button
                      newClass={`whiteFont ms-3`}
                      btnColor={`btnBlackPrime`}
                      style={{
                        borderRadius: "20px",
                        width: "170px",
                        height: "46px",
                        color : "#000",
                      }}
                      btnName={`Send`}
                      onClick={handleSubmit}
                    />
                  </div>
                  <div className="d-flex align-items-center justify-content-center fw-bold my-3">
                    <a href="/" style={{ color: "#DEF213" }}>
                      Take me back to login!
                    </a>
                  </div>
                   
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </>
  );
};

export default connect(null, { loginAdmin })(Login);

{
  /*  */
}
