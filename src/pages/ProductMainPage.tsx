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

const ProductMainPage = () => {
    const { dialogue, dialogueType, dialogueData } = useAppSelector(
        (state: RootStore) => state.dialogue
    );

    const router = useRouter();
    const [multiButtonSelect, setMultiButtonSelect] = useState<string>("Real Product");
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
                  const parsed = storedSubTab ? JSON.parse(storedSubTab) : "Real Product";
                  setMultiButtonSelect(parsed);
                } catch (e) {
                  console.error("Error parsing sub-tab from localStorage:", e);
                  setMultiButtonSelect("Real Product");
                }
              }
            }, []);


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
                        (dialogueType !== "fakeProduct" && dialogueType !== "realProduct") && (
                            <div className="dashboardHeader primeHeader mb-3 p-0">
                                <NewTitle
                                    dayAnalyticsShow={dialogueType !== "realProduct"}
                                    setEndDate={setEndDate}
                                    setStartDate={setStartDate}
                                    startDate={startDate}
                                    endDate={endDate}
                                    titleShow={false}
                                    setMultiButtonSelect={setMultiButtonSelect}
                                    multiButtonSelect={multiButtonSelect}
                                    name="Profile"
                                    labelData={["Real Product", "Fake Product"]}
                                />
                            </div>
                        )
                    }

                    {multiButtonSelect === "Real Product" && (
                        <RealProduct
                            endDate={endDate}
                            startDate={startDate}
                            multiButtonSelectNavigate={setMultiButtonSelect}
                        />
                    )}
                    {multiButtonSelect === "Fake Product" && (
                        <FakeProduct
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

ProductMainPage.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};

export default ProductMainPage;
