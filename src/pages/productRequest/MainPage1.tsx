import RootLayout from "../../component/layout/Layout";
import React, { useEffect, useState } from "react";
import NewTitle from "../../extra/Title";
import dayjs from "dayjs";
import { RootStore, useAppSelector } from "../../store/store";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import SellerInfo from ".././SellerInfo";
import SellerWiseProduct from "@/component/seller/SellerWiseProduct";
import SellerWiseOrder from "@/component/seller/SellerWiseOrder";
import SellerWiseTransaction from "@/component/seller/SellerWiseTransaction";
import Button from "@/extra/Button";
import { useRouter } from "next/router";
import { AddItem } from "@/component/productRequest/AcceptedRequest/AddItem";
import { UpdateItem } from "@/component/productRequest/AcceptedRequest/UpdateItem";


const MainPage1 = (props) => {
    const { dialogue, dialogueType, dialogueData } = useAppSelector(
        (state: RootStore) => state.dialogue
    );


    const router = useRouter();

    const currentPath = router.pathname; // This will return the current path 

    const [multiButtonSelect, setMultiButtonSelect] = useState<string>("Add Items");
    const [startDate, setStartDate] = useState<string | Date>("All"); // Updated type
    const [endDate, setEndDate] = useState<string | Date>("All"); // Updated type
    useClearSessionStorageOnPopState("multiButton");

    const startDateFormat = (startDate: string | Date): string => {
        return startDate && dayjs(startDate).isValid()
            ? dayjs(startDate).format("YYYY-MM-DD")
            : "All";
    };

    const endDateFormat = (endDate: string | Date): string => {
        return endDate && dayjs(endDate).isValid()
            ? dayjs(endDate).format("YYYY-MM-DD")
            : "All";
    };

    
    useEffect(() => {
        if (typeof window !== "undefined") {
          const storedSubTab = localStorage.getItem("multiButton1");
          try {
            const parsed = storedSubTab ? JSON.parse(storedSubTab) : "Add Items";
            setMultiButtonSelect(parsed);
          } catch (e) {
            console.error("Error parsing sub-tab from localStorage:", e);
            setMultiButtonSelect("Add Items");
          }
        }
      }, []);
      
    

    const startDateData: string = startDateFormat(startDate);
    const endDateData: string = endDateFormat(endDate);

    return (
        <>
            <div className="userPage">
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
                    <div className="dashboardHeader primeHeader mb-3 p-0">
                        <NewTitle
                            dayAnalyticsShow={false}
                            setEndDate={setEndDate}
                            setStartDate={setStartDate}
                            startDate={startDate}
                            endDate={endDate}
                            titleShow={false}
                            setMultiButtonSelect={setMultiButtonSelect}
                            multiButtonSelect={multiButtonSelect}
                            name={`Profile`}
                            labelData={["Add Items", "Updated Items"]}
                        />


                    </div>
                    {(multiButtonSelect === "Add Items") && (
                        <AddItem
                          endDate={endDate}
                          startDate={startDate}
                          multiButtonSelectNavigate={setMultiButtonSelect}
                        />
                    )}
                    {(multiButtonSelect === "Updated Items" ) && (
                        <UpdateItem
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

MainPage1.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};

export default MainPage1;
