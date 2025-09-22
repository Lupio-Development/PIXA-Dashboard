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
import RealProduct from "./RealProduct";
import FakeProduct from "./FakeProduct";
import AdminEarnings from "./adminEarnings";
import AdminEarningsHistory from "@/component/AdminEarningHistory";

const MainAdminEarningTable = () => {
    const { dialogue, dialogueType, dialogueData } = useAppSelector(
        (state: RootStore) => state.dialogue
    );

    const router = useRouter();
    const [multiButtonSelect, setMultiButtonSelect] = useState<string>("Coin Plan Earning");
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
            const storedSubTab = JSON.parse(localStorage.getItem("multiButton"));
            if (storedSubTab) {
                setMultiButtonSelect(storedSubTab);
            } else {
                setMultiButtonSelect("Coin Plan Earning");
                localStorage.setItem("multiButton1", "Coin Plan Earning");
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
                    {
                        dialogueType !== "fakeProduct" &&
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
                                labelData={["Coin Plan Earning", "Admin Earning"]}
                            />
                        </div>
                    }

                    {multiButtonSelect === "Coin Plan Earning" && (
                        <AdminEarnings
                        endDate={endDate}
                        startDate={startDate}
                        />
                    )}
                    {multiButtonSelect === "Admin Earning" && (
                        <AdminEarningsHistory
                            endDate={endDate}
                            startDate={startDate}
                        
                        />
                    )}
                </div>
            </div>
        </>
    );
};

MainAdminEarningTable.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};

export default MainAdminEarningTable;
