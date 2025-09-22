import Button from "@/extra/Button";
import Input from "@/extra/Input";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getDefaultCurrency } from "@/store/currencySlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { deleteSupportRequest, getSupportRequest, supportRequestAccept } from "@/store/supportSlice";
import {
    getwithdrawRequest,
    withdrawRequestAccept,
    withdrawRequestDecline,
} from "@/store/withdrawRequestSlice";
import { warning, warningForAccept, warningForText } from "@/util/Alert";
import { baseURL } from "@/util/config";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import CustomButton from "@/extra/Button";
import Image from "next/image";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import noImage from "../../assets/images/noImage.png";
import infoImage from "@/assets/images/info.svg";
import accept from "@/assets/images/accept.svg";

const style: React.CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 600,
    backgroundColor: "background.paper",
    borderRadius: "13px",
    border: "1px solid #C9C9C9",
    boxShadow: "24px",
    padding: "19px",
};
interface ErrorState {
    reason: string;
}
const PendingSupportRequest = (props: any) => {
    const { pendingData, totalPendingData } = useSelector(
        (state: RootStore) => state.support
    );

    const { currency } = useSelector((state: RootStore) => state.currency);

    const dispatch = useAppDispatch();

    const { startDate, endDate } = props;

    const [page, setPage] = useState(1);
    const [openReason, setOpenReason] = useState(false);
    const [openInfo, setOpenInfo] = useState(false);
    const [infoData, setInfodata] = useState<any>();
    const [size, setSize] = useState(20);
    const [data, setData] = useState([]);

    useEffect(() => {
        let payload: any = {
            status: 1,
            startDate,
            endDate
        };
        dispatch(getSupportRequest(payload));
    }, [dispatch, startDate, endDate]);

    useEffect(() => {
        setData(pendingData);
    }, [pendingData, currency]);

    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value) => {
        setPage(1);
        setSize(value);
    };

    const handleOpenInfo = (row) => {
        setOpenInfo(true);
        setInfodata(row);
    };

    const handleDeleteSupportRequest = (id: any) => {
        const data = warning();
        data
            .then((res) => {
                if (res) {
                    dispatch(deleteSupportRequest(id));
                }
            })
            .catch((err) => console.log(err));
    };

    const ManageUserData = [
        {
            Header: "No",
            body: "no",
            Cell: ({ index }) => (
                <span className="  text-nowrap">
                    {(page - 1) * size + parseInt(index) + 1}
                </span>
            ),
        },

        {
            Header: "UniqueId",
            body: "uniqueId",
            Cell: ({ row }) => <span>{row?.uniqueId}</span>,
        },

        {
            Header: "Name",
            body: "name",
            Cell: ({ row, index }) => (
                <div
                    className=""
                    style={{ cursor: "pointer" }}
                >
                    <img src={row?.userImage} width="40px" height="40px" />
                    <span className="text-capitalize ms-3  cursorPointer text-nowrap">
                        {row?.name}
                    </span>
                </div>
            ),
        },
        {
            Header: "Date",
            body: "createdAt",
            Cell: ({ row }) => <span>{row?.date.split(",")[0]}</span>,

        },

        {
            Header: "Time",
            body: "time",
            Cell: ({ row }) => <span>{row?.date.split(",")[1]}</span>,

        },

        {
            Header: "Info",
            body: "",
            Cell: ({ row }) => (
                // <Button
                //     btnName={`Info`}
                //     newClass={`fw-bolder text-white`}
                //     style={{ backgroundColor: "blue", borderRadius: "7px" }}
                //     onClick={() => handleOpenInfo(row)}
                // />

                <img src={infoImage.src} alt="Info"
                    onClick={() => handleOpenInfo(row)}
                />
            ),
        },

        {
            Header: "Action",
            body: "action",
            Cell: ({ row }) => (
                <div className="action-button">
                    {/* <Button
                        btnName={`✓`}
                        newClass={`fw-bolder text-white`}
                        style={{ backgroundColor: "#0fb515" }}
                        onClick={() => handleEdit(row, "pay")}
                    /> */}
                    <button className="accepted-button">

                        <img
                            src={accept.src}
                            alt=""
                            height={30}
                            width={30}
                            onClick={() => handleEdit(row, "pay")}
                        />
                    </button>
                    <CustomButton
                        btnIcon={
                            <Image src={TrashIcon} alt="Trash Icon" width={25} height={25} />
                        }
                        onClick={() => handleDeleteSupportRequest(row?._id)}
                    />
                </div>
            ),
        },


    ];

    const handleEdit = (row: any, type: any) => {
        const data = warningForAccept("support");
        data
            .then((res) => {
                if (res) {
                    dispatch(supportRequestAccept(row?._id));
                }
            })
            .catch((err) => console.log(err));
    };

    const handleCloseReason = () => {
        setOpenReason(false);
    };



    const handleCloseInfo = () => {
        setOpenInfo(false);
    };

    return (
        <>
            { }
            <div className="user-table real-user mb-3 border-0">
                <div className="user-table-top pt-0">
                    {/* <h5
                        style={{
                            fontWeight: "500",
                            fontSize: "20px",
                            marginBottom: "5px",
                            marginTop: "5px",
                        }}
                    >
                        Support Request Table
                    </h5> */}
                </div>
                <Table
                    data={data}
                    mapData={ManageUserData}
                    serverPerPage={size}
                    serverPage={page}
                    type={"server"}
                />
                <Pagination
                    type={"server"}
                    activePage={page}
                    rowsPerPage={size}
                    userTotal={totalPendingData}
                    setPage={setPage}
                    handleRowsPerPage={handleRowsPerPage}
                    handlePageChange={handlePageChange}
                />
            </div>

            {/* For a Info Dialog :- */}

            <Modal
                open={openInfo}
                onClose={handleCloseReason}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="create-channel-model">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Support Info
                    </Typography>
                    <form style={{ padding: "15px", paddingTop: "0px" }}>
                        <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
                            {
                                pendingData?.length > 0 && pendingData?.map((info, index) => {
                                    return (
                                        <div className="col-12 mt-2">
                                            <div className="col-12 mt-3 text-about">
                                                <Input
                                                    type={"text"}
                                                    label={"Description"}
                                                    name={"description"}
                                                    value={info?.complaint}
                                                    newClass={`mt-3`}
                                                    readOnly
                                                />
                                            </div>


                                            <div className="col-12 mt-1 text-about">
                                                <Input
                                                    type={"text"}
                                                    label={"Contact number"}
                                                    name={"Contact number"}
                                                    value={info?.contact}
                                                    newClass={`mt-3`}
                                                    readOnly
                                                />
                                            </div>

                                            <div className="col-12 mt-3 text-about">
                                                <label>Image</label>
                                                <img src={info?.image ? info?.image : noImage.src} style={{
                                                    opacity: info?.isComplaintImageRestricted === true ? 0.5 : 1
                                                }} width="80px" height="80px" />
                                            </div>


                                        </div>
                                    )
                                })
                            }

                            <div className="mt-3 d-flex justify-content-end">
                                <Button
                                    onClick={handleCloseInfo}
                                    btnName={"Close"}
                                    newClass={"close-model-btn"}
                                />
                            </div>
                        </div>
                    </form>
                </Box>
            </Modal>
        </>
    );
};

export default PendingSupportRequest;
