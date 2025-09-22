"use-client";
import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import RootLayout from "@/component/layout/Layout";
import AppSetting from "@/component/setting/AppSetting";
import PaymentSetting from "@/component/setting/PaymentSetting";
import WithdrawSetting from "@/component/setting/WithdrawSetting";
import ReportReasonSetting from "@/component/setting/ReportReasonSetting";
import AdSetting from "@/component/setting/AdSetting";
import EcommerceSetting from "@/component/setting/EcommerceSetting";
import DocumentTypeSetting from "@/component/setting/DocumentTypeSetting";

const SettingPage = () => {
  const [multiButtonSelect, setMultiButtonSelect] = useState("Setting");


    useEffect(() => {
      if (typeof window !== "undefined") {
        const storedSubTab = localStorage.getItem("multiButton");
        try {
          const parsed = storedSubTab ? JSON.parse(storedSubTab) : "Setting";
          setMultiButtonSelect(parsed);
        } catch (e) {
          console.error("Error parsing sub-tab from localStorage:", e);
          setMultiButtonSelect("Setting");
        }
      }
    }, []);

  return (
    <>
      <div className="userPage">
        <div>
          <div className="dashboardHeader primeHeader mb-3 p-0">
            <NewTitle
              dayAnalyticsShow={false}
              titleShow={false}
              setMultiButtonSelect={setMultiButtonSelect}
              multiButtonSelect={multiButtonSelect}
              name={`Setting`}
              labelData={[
                "Setting",
                "Ads Setting",
                "Payment Setting",
                "Withdraw Setting",
                "E-commerce Setting",
                "Document Type",
                "Report Reason",
              ]}
            />
          </div>

          {multiButtonSelect == "Setting" && <AppSetting />}
          {multiButtonSelect == "Ads Setting" && <AdSetting />}
          {multiButtonSelect == "Payment Setting" && <PaymentSetting />}

          {multiButtonSelect == "Withdraw Setting" && <WithdrawSetting />}
          {multiButtonSelect == "Report Reason" && <ReportReasonSetting />}
          {multiButtonSelect == "Document Type" && <DocumentTypeSetting />}

          {multiButtonSelect == "E-commerce Setting" && <EcommerceSetting />}
        </div>
      </div>
    </>
  );
};

SettingPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};

export default SettingPage;
