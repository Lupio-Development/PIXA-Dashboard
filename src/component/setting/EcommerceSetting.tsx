import Button from "@/extra/Button";
import Input, { Textarea } from "@/extra/Input";
import {
  adSettingSwitch,
  getSetting,
  settingSwitch,
  updateSetting,
} from "@/store/settingSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { useTheme } from "@emotion/react";
import { FormControlLabel, Switch, Typography, styled } from "@mui/material";
import React, { useEffect, useState } from "react";
import Multiselect from "multiselect-react-dropdown";
import { useSelector } from "react-redux";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";


const MaterialUISwitch = styled(Switch)<{ theme: ThemeType }>(({ theme }) => ({
  width: "67px",
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    top: "8px",
    transform: "translateX(10px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(40px)",
      top: "8px",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M16.5992 5.06724L16.5992 5.06719C16.396 4.86409 16.1205 4.75 15.8332 4.75C15.546 4.75 15.2705 4.86409 15.0673 5.06719L15.0673 5.06721L7.91657 12.2179L4.93394 9.23531C4.83434 9.13262 4.71537 9.05067 4.58391 8.9942C4.45174 8.93742 4.30959 8.90754 4.16575 8.90629C4.0219 8.90504 3.87925 8.93245 3.74611 8.98692C3.61297 9.04139 3.49202 9.12183 3.3903 9.22355C3.28858 9.32527 3.20814 9.44622 3.15367 9.57936C3.0992 9.7125 3.07179 9.85515 3.07304 9.99899C3.07429 10.1428 3.10417 10.285 3.16095 10.4172C3.21742 10.5486 3.29937 10.6676 3.40205 10.7672L7.15063 14.5158L7.15066 14.5158C7.35381 14.7189 7.62931 14.833 7.91657 14.833C8.20383 14.833 8.47933 14.7189 8.68249 14.5158L8.68251 14.5158L16.5992 6.5991L16.5992 6.59907C16.8023 6.39592 16.9164 6.12042 16.9164 5.83316C16.9164 5.54589 16.8023 5.27039 16.5992 5.06724Z" fill="white" stroke="white" strokeWidth="0.5"/></svg>')`,
      },
    },
    "& + .MuiSwitch-track": {
      opacity: 1,
      backgroundColor: theme === "dark" ? "#8796A5" : "#FCF3F4",
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme === "dark" ? "#0FB515" : "red",
    width: 24,
    height: 24,
    "&:before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 20 20" fill="none"><path d="M14.1665 5.83301L5.83325 14.1663" stroke="white" strokeWidth="2.5" strokeLinecap="round"/><path d="M5.83325 5.83301L14.1665 14.1663" stroke="white" strokeWidth="2.5" strokeLinecap="round"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    borderRadius: "52px",
    border: "0.5px solid rgba(0, 0, 0, 0.14)",
    background: " #FFEDF0",
    boxShadow: "0px 0px 2px 0px rgba(0, 0, 0, 0.08) inset",
    opacity: 1,
    width: "79px",
    height: "28px",
  },
}));

type ThemeType = "dark" | "light";

const EcommerceSetting = () => {
  const { settingData } = useSelector((state: RootStore) => state.setting);
  const dispatch = useAppDispatch();
  const [data, setData] = useState<any>();
  const [cancelOrderRate, setCancelOrderRate] = useState<any>();
  const [adminCommissionRate, setAdminCommissionRate] = useState<any>();
  const [isProductAdditionRequested, setIsProductAdditionRequested] = useState<boolean>();
  const [isProductUpdateRequested, setIsProductUpdateRequested] = useState<boolean>();

  useClearSessionStorageOnPopState("multiButton");

  const theme: any = useTheme() as ThemeType; // Using useTheme hook and type assertion to cast Theme to ThemeType

  useEffect(() => {
    const payload: any = {};
    dispatch(getSetting(payload));
  }, []);

  useEffect(() => {
    setData(settingData);
  }, [settingData]);

  useEffect(() => {
    setCancelOrderRate(settingData?.cancelOrderRate);
    setAdminCommissionRate(settingData?.adminCommissionRate)
    setIsProductAdditionRequested(settingData?.isProductAdditionRequested)
    setIsProductUpdateRequested(settingData?.isProductUpdateRequested)
  }, [data]);

  const handleChange = (type) => {


    const payload: any = {
      settingId: settingData?._id,
      type: type,
    };
    dispatch(settingSwitch(payload));
  };

  const handleSubmit = () => {


    const settingDataAd  = {
        adminCommissionRate : parseInt(adminCommissionRate),
        cancelOrderRate : parseInt(cancelOrderRate)
    };

    const payload: any = {
      data: settingDataAd,
      settingId: settingData?._id,
    };

    dispatch(updateSetting(payload));
  };

  return (
    <>
      <div className="payment-setting-box p-1 p-sm-3 ">
        <div className="row align-items-center mb-2 p-2">
          <div className="col-12 col-sm-12 mt-2 sm-m-0 d-flex justify-content-end">
            <Button
              btnName={"Submit"}
              type={"button"}
              onClick={handleSubmit}
              newClass={"submit-btn"}
              style={{
                borderRadius: "0.5rem",
                width: "88px",
                marginLeft: "10px",
              }}
            />
          </div>
         

          {/* <div className="col-6 col-sm-6 ">
            <h5 className="m-0">Ads Setting</h5>
          </div> */}
        </div>
        <div className="row flex-wrap payment-setting setting p-0">
          <div className="col-6 col-lg-6">
            <div className="mb-4">
         
               
                <div className="withdrawal-box payment-box mt-2">
                  <h6
                    style={{
                      borderBottom: "1px solid #dbdbdb",
                      paddingBottom: "20px"
                    }}
                  >Add Product Request</h6>

                  <div className="row">
                    <div className="col-12 mt-1 d-flex justify-content-between align-items-center">
                      <button className="payment-content-button">
                        <span>
                          Enable/disable New product request for seller
                        </span>
                      </button>
                      <FormControlLabel
                        control={
                          <MaterialUISwitch
                            sx={{ m: 1 }}
                            checked={isProductAdditionRequested === true ? true : false}
                            theme={theme}
                          />
                        }
                        label=""
                        onClick={() => handleChange("isProductAdditionRequested")}
                      />
                    </div>
                  </div>
                </div>
                </div>
             

                <div className="withdrawal-box payment-box mt-4">
                  <h6>Charges Setting</h6>
                  <div className="row">
                    <div className="row">
                      <div className="col-6 withdrawal-input">
                        <div className="row">
                          <div className="col-11">
                            <Input
                              label={"Cancel Order Charges (%)"}
                              name={"cancel order charge"}
                              type={"text"}
                              value={cancelOrderRate}
                              placeholder={""}
                              onChange={(e) => {
                                setCancelOrderRate(e.target.value);
                              }}
                            />
                          </div>


                        </div>
                      </div>

                      <div className="col-6 withdrawal-input">
                        <Input
                          label={"Admin Comission Charges (%)"}
                          name={"Coin"}
                          value={adminCommissionRate}
                          type={"number"}
                          placeholder={""}
                          onChange={(e) => {
                            setAdminCommissionRate(e.target.value);
                          }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
          </div>

          <div className="col-6 col-lg-6">
          <div className="withdrawal-box payment-box mt-2">
                  <h6
                    style={{
                      borderBottom: "1px solid #dbdbdb",
                      paddingBottom: "20px"
                    }}
                  >Update Product Request</h6>

                  <div className="row">
                    <div className="col-12 mt-1 d-flex justify-content-between align-items-center">
                      <button className="payment-content-button">
                        <span>
                          Enable/disable updated product request for seller
                        </span>
                      </button>
                      <FormControlLabel
                        control={
                          <MaterialUISwitch
                            sx={{ m: 1 }}
                            checked={isProductUpdateRequested === true ? true : false}
                            theme={theme}
                          />
                        }
                        label=""
                        onClick={() => handleChange("isProductUpdateRequested")}
                      />
                    </div>
                  </div>
                </div>
          </div>
        </div>

      
      </div>
    </>
  );
};

export default EcommerceSetting;
