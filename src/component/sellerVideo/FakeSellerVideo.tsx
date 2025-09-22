import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import TrashIcon from "@/assets/icons/trashIcon.svg";
import EditIcon from "../../assets/icons/EditBtn.svg";
import Pagination from "../../extra/Pagination";
import Button from "../../extra/Button";
import Table from "../../extra/Table";
import dayjs from "dayjs";
import { openDialog } from "../../store/dialogSlice";
import { warning } from "../../util/Alert";
import { RootStore, useAppDispatch } from "../../store/store";
import NewTitle from "../../extra/Title";
import Image from "next/image";
import { useRouter } from "next/router";
import { baseURL } from "@/util/config";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import userImage from "../../assets/images/8.jpg";
import SellerVideoDialogue from "./SellerVideoDialogue";
import { allVideoOfSeller, deleteVideoOfFakeSeller, deleteVideoOfSeller } from "@/store/sellerVideoSlice";
import male from "@/assets/images/male.png"
import RootLayout from "@/component/layout/Layout";
import AddIcon from "@mui/icons-material/Add";
import CreateSellerVideo from "@/component/sellerVideo/createSellerVideo";


interface VideoProps {
    startDate: string;
    endDate: string;
}

const FakeSellerVideo: any = (props) => {
    const router = useRouter();
    const { fakeSellerVideo, totalFakeVideo } = useSelector(
        (state: RootStore) => state.sellerVideo
    );
    const { dialogueType, dialogueData } = useSelector(
        (state: RootStore) => state.dialogue
    );
    const { startDate, endDate } = props;
    const [selectAllChecked, setSelectAllChecked] = useState<boolean>(false);
    const [selectCheckData, setSelectCheckData] = useState<any[]>([]);
    const dispatch = useAppDispatch();
    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<number>(1);
    const [size, setSize] = useState<number>(20);
    useClearSessionStorageOnPopState("multiButton");

    useEffect(() => {
        const payload: any = {
            type: "fakeVideo",
            start: page,
            limit: size,
            startDate: startDate,
            endDate: endDate,
        };
        dispatch(allVideoOfSeller(payload));
    }, [page, size, startDate, endDate]);

    useEffect(() => {
        setData(fakeSellerVideo);
    }, [fakeSellerVideo]);

    const handleSelectCheckData = (
        e: React.ChangeEvent<HTMLInputElement>,
        row: any
    ) => {

        const checked = e.target.checked;
        if (checked) {
            setSelectCheckData((prevSelectedRows) => [...prevSelectedRows, row]);
        } else {
            setSelectCheckData((prevSelectedRows) =>
                prevSelectedRows.filter((selectedRow) => selectedRow._id !== row._id)
            );
        }
    };

    const handleSelectAll = (event: React.ChangeEvent<HTMLInputElement>) => {
        const checked = event.target.checked;

        setSelectAllChecked(checked);
        if (checked) {
            setSelectCheckData([...data]);
        } else {
            setSelectCheckData([]);
        }
    };

    const handleEdit = (row: any) => {
        router.push({
            pathname: "/viewProfile",
            query: { id: row?.userId },
        });


        localStorage.setItem("postData", JSON.stringify(row));
    };

    const videoTable = [
        {
            Header: "NO",
            body: "name",
            Cell: ({ index }: { index: number }) => (
                <span>{(page - 1) * size + index + 1}</span>
            ),
        },
        {
            Header: "Video",
            body: "video",
            Cell: ({ row }: { row: any }) => (
                <>
                    <button
                        className="viewbutton mx-auto"
                        onClick={() =>
                            dispatch(openDialog({ type: "viewVideo", data: row }))
                        }
                    >
                        <svg
                            width="30"
                            height="30"
                            viewBox="0 0 34 20"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M19.2319 0.012207H3.71991C1.67396 0.012207 0 1.68617 0 3.73212V16.2682C0 18.3142 1.67396 19.9881 3.71991 19.9881H19.2319C21.2779 19.9881 22.9519 18.3142 22.9519 16.2682V3.73212C22.9519 1.64897 21.2779 0.012207 19.2319 0.012207ZM31.2473 2.05816C31.0241 2.09536 30.8009 2.20695 30.6149 2.31855L24.8118 5.66647V14.2967L30.6521 17.6446C31.7309 18.277 33.07 17.905 33.7024 16.8262C33.8884 16.4914 34 16.1194 34 15.7102V4.21571C34 2.83934 32.698 1.72337 31.2473 2.05816Z"
                                fill="white"
                            />
                        </svg>

                        <span>View Video</span>
                    </button>
                </>
            ),
        },
        {
            Header: "Thumbnail Image",
            body: "videoImage",
            Cell: ({ row }: { row: any }) => (
                <img
                    src={row?.videoImage
                        || row?.video?.videoImage
                    }
                    width="50px"
                    height="50px"
                    alt="Video Image"
                />
            ),
        },

        {
            Header: "Product Name",
            body: "productname",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize">{row?.productName || "-"}</span>
            ),
        },

        {
            Header: "Seller Name",
            accessor: "seller name",
            Cell: ({ row }) => (
                <div className="d-flex justify-content-end align-items-center">
                    {/* Image Section */}
                    <div

                        style={{ width: "60px", textAlign: "center" }}
                    >
                        <img
                            src={row.image || male.src}
                            alt={"Image"}
                            width="40"
                            height="40"
                            style={{ borderRadius: "5px", objectFit: "cover" }} // Styling for better appearance
                        />
                    </div>

                    {/* Product Name */}
                    <div style={{ width: "200px", textAlign: "start" }}>
                        <span className="text-capitalize ms-3  cursorPointer text-nowrap">
                            {row?.sellerFullName}
                        </span>
                    </div>
                </div>
            ),
        },

        {
            Header: "User Name",
            body: "Username",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize">{row?.sellerUsername}</span>
            ),
        },

        {
            Header: "Business Name",
            body: "Businessname",
            Cell: ({ row }: { row: any }) => (
                <span className="text-capitalize">{row?.businessName}</span>
            ),
        },

        {
            Header: "Action",
            body: "action",
            Cell: ({ row }: { row: any }) => (
                <div className="action-button">
                    <Button
                        btnIcon={
                            <Image src={EditIcon} alt="EditIcon" width={25} height={25} />
                        }
                        onClick={() => {
                            dispatch(openDialog({ type: "fakeSellerVideo", data: row }));
                        }}
                    />
                    <Button
                        btnIcon={
                            <Image src={TrashIcon} alt="TrashIcon" width={25} height={25} />
                        }
                        onClick={() => handleDeleteVideo(row)}
                    />
                </div>
            ),
        },
    ];

    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value: number) => {
        setPage(1);
        setSize(value);
    };

    const handleDeleteVideo = (row: any) => {
        const data = warning();
        data
            .then((logouts: any) => {
                const yes = logouts;
                if (yes) {
                    dispatch(deleteVideoOfFakeSeller(row?.video?._id ? row?.video?._id : row?._id));
                }
            })
            .catch((err) => console.log(err));
    };

    return (
        <div>
            <div className="user-table mb-3 border-0 pt-0 p-4">
                <div className="d-flex justify-content-between">
                    <div className="new-fake-btn d-flex mt-2">
                        <Button
                            btnIcon={<AddIcon />}
                            btnName={"New"}
                            onClick={() => {
                                dispatch(openDialog({ type: "ecommercevideo" }));
                            }}
                        />
                    </div>

                </div>

                {dialogueType == "ecommercevideo" && <CreateSellerVideo />}
                {dialogueType == "viewVideo" && <SellerVideoDialogue />}
                {dialogueType == "fakeSellerVideo" && <CreateSellerVideo />}
                <Table
                    data={data}
                    mapData={videoTable}
                    serverPerPage={size}
                    serverPage={page}
                    handleSelectAll={handleSelectAll}
                    selectAllChecked={selectAllChecked}
                    type={"server"}
                />
                <div className="mt-3">
                    <Pagination
                        type={"server"}
                        activePage={page}
                        rowsPerPage={size}
                        userTotal={totalFakeVideo}
                        setPage={setPage}
                        handleRowsPerPage={handleRowsPerPage}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </div>
        </div>
    );
};

FakeSellerVideo.getLayout = function getLayout(page) {
    return <RootLayout>{page}</RootLayout>;
};

export default FakeSellerVideo;
