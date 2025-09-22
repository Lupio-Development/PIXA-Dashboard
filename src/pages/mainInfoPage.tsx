import RootLayout from "../component/layout/Layout";
import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import { RootStore, useAppSelector } from "../store/store";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import SellerInfo from "./SellerInfo";
import SellerWiseProduct from "@/component/seller/SellerWiseProduct";
import SellerWiseOrder from "@/component/seller/SellerWiseOrder";
import SellerWiseTransaction from "@/component/seller/SellerWiseTransaction";
import { useRouter } from "next/router";

const MainInfo = () => {
    const { dialogue, dialogueType, dialogueData } = useAppSelector(
        (state: RootStore) => state.dialogue
    );
        const router = useRouter();
        const type = router?.query?.type

    const [multiButtonSelect, setMultiButtonSelect] = useState<string>("Profile");
    
    const [startDate, setStartDate] = useState<string | Date>("All"); // Updated type
    const [endDate, setEndDate] = useState<string | Date>("All"); // Updated type
    useClearSessionStorageOnPopState("multiButton");

    useEffect(() => {
        setMultiButtonSelect("Profile")
    },[startDate , endDate])

    
    useEffect(() => {
        const storageKey = type === "fakeSeller" ? "multiButton4" : "multiButton5";
        const allowedTabs = type === "fakeSeller"
          ? ["Profile", "Product"]
          : ["Profile", "Product", "Order", "Transaction"];
      
        const stored = localStorage.getItem(storageKey);
        try {
          const parsed = stored ? JSON.parse(stored) : "Profile";
          if (allowedTabs.includes(parsed)) {
            setMultiButtonSelect(parsed);
          } else {
            setMultiButtonSelect("Profile");
          }
        } catch (e) {
          setMultiButtonSelect("Profile");
        }
      }, [type]);
      



    return (
        <>
            <div className="userPage pt-0">
                <div
                    style={{
                        display: `${dialogueType === "hostSettleMent"
                                ? "none"
                                : dialogueType === "hostHistory"
                                    ? "none"
                                    : dialogueType === "fakeUserAdd"
                                        ? "none"
                                        : dialogueType === "fakeUser"
                                            ? "none"
                                            : dialogueType === "hostReport"
                                                ? "none"
                                                : "block"
                            }`,
                    }}
                >
                    {
                        type !== "fakeSeller" &&
                        <div className="dashboardHeader primeHeader mb-3 p-0">
                        <NewTitle
                            dayAnalyticsShow={multiButtonSelect == "Profile" ? false :true}
                            setEndDate={setEndDate}
                            setStartDate={setStartDate}
                            startDate={startDate}
                            endDate={endDate}
                            titleShow={false}
                            setMultiButtonSelect={setMultiButtonSelect}
                            multiButtonSelect={multiButtonSelect}
                            name={`Profile`}
                            labelData={["Profile", "Product", "Order" , "Transaction"]}
                        />
                    </div>
                    }

                    {
                        type === "fakeSeller" && 
                        <div className="dashboardHeader primeHeader mb-3 p-0">
                        <NewTitle
                            dayAnalyticsShow={multiButtonSelect == "Profile" ? false :true}
                            setEndDate={setEndDate}
                            setStartDate={setStartDate}
                            startDate={startDate}
                            endDate={endDate}
                            titleShow={false}
                            setMultiButtonSelect={setMultiButtonSelect}
                            multiButtonSelect={multiButtonSelect}
                            name={`Profile`}
                            labelData={["Profile", "Product"]}
                        />
                    </div>
                    }
                 
                    {multiButtonSelect === "Profile" && (
                        <SellerInfo
                        //   endDate={endDate}
                        //   startDate={startDate}
                        //   multiButtonSelectNavigate={setMultiButtonSelect}
                        />
                    )}
                    {multiButtonSelect === "Product" && (
                        <SellerWiseProduct
                            endDate={endDate}
                            startDate={startDate}
                            multiButtonSelectNavigate={setMultiButtonSelect}
                        />
                    )}

                    {multiButtonSelect === "Order" && (
                        <SellerWiseOrder
                            endDate={endDate}
                            startDate={startDate}
                            multiButtonSelectNavigate={setMultiButtonSelect}
                            type = "SellerWiseOrder"
                        />
                    )}
                    {multiButtonSelect === "Transaction" && (
                        <SellerWiseTransaction
                            endDate={endDate}
                            startDate={startDate}
                            multiButtonSelectNavigate={setMultiButtonSelect}
                        />
                    )}


                </div>
            </div>
        </>
    );
};

MainInfo.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};

export default MainInfo;
