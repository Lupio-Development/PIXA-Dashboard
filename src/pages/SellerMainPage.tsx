import RootLayout from "../component/layout/Layout";
import React, { useEffect, useState } from "react";
import NewTitle from "../extra/Title";
import dayjs from "dayjs";
import { RootStore, useAppSelector } from "../store/store";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import { useRouter } from "next/router";

import { AddItem } from "@/component/productRequest/PendingRequest/AddItem";
import { UpdateItem } from "@/component/productRequest/PendingRequest/UpdateItem";
import RealSeller from "./RealSeller";
import FakeSeller from "./FakeSeller";

const SellerMainPage = () => {
    const { dialogue, dialogueType, dialogueData } = useAppSelector(
        (state: RootStore) => state.dialogue
    );


    const router = useRouter();

    const currentPath = router.pathname; // This will return the current path
    const [multiButtonSelect, setMultiButtonSelect] = useState<string>("Real Seller");
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
            const storedSubTab = localStorage.getItem("multiButton");
            try {
              const parsed = storedSubTab ? JSON.parse(storedSubTab) : "Real Seller";
              setMultiButtonSelect(parsed);
            } catch (e) {
              console.error("Error parsing sub-tab from localStorage:", e);
              setMultiButtonSelect("Real Seller");
            }
          }
        }, []);

    const startDateData: string = startDateFormat(startDate);
    const endDateData: string = endDateFormat(endDate);

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
                        dialogueType !== "fakeseller" &&


                        <div className="dashboardHeader primeHeader mb-3 p-0">
                            <NewTitle
                                dayAnalyticsShow={true}
                                setEndDate={setEndDate}
                                setStartDate={setStartDate}
                                startDate={startDate}
                                endDate={endDate}
                                titleShow={false}
                                setMultiButtonSelect={setMultiButtonSelect}
                                multiButtonSelect={multiButtonSelect}
                                name={`Profile`}
                                labelData={["Real Seller", "Fake Seller"]}
                            />
                        </div>
                    }
                    {multiButtonSelect === "Real Seller" && (
                        <RealSeller
                            endDate={endDate}
                            startDate={startDate}
                            multiButtonSelectNavigate={setMultiButtonSelect}
                        />
                    )}
                    {multiButtonSelect === "Fake Seller" && (
                        <FakeSeller
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

SellerMainPage.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};

export default SellerMainPage;
