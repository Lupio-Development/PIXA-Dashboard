import Button from "@/extra/Button";
import Input from "@/extra/Input";
import Pagination from "@/extra/Pagination";
import Table from "@/extra/Table";
import { getDefaultCurrency } from "@/store/currencySlice";
import { getSellerRequest, sellerRequestAcceptorDecline, sellerRequestDecline } from "@/store/sellerRequestSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { Box, Modal, Typography } from "@mui/material";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import male from "@/assets/images/male.png"
import { useRouter } from "next/router";
import { getProductRequest, productRequestAcceptorDecline, productRequestDecline } from "@/store/productRequestSlice";
import accept from "@/assets/images/accept.svg";
import { warningForAccept } from "@/util/Alert";
import decline from "@/assets/images/decline.svg"


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
export const AddItem = (props: any) => {

    const router = useRouter()
    const { productAddItemData, totalPendingData } = useSelector(
        (state: RootStore) => state.productRequest
    );
    const hasPermission = useSelector(
        (state: RootStore) => state.admin.admin.flag
    );
    const { currency } = useSelector((state: RootStore) => state.currency);

    const dispatch = useAppDispatch();

    const { startDate, endDate } = props;
    const [page, setPage] = useState(1);
    const [showURLs, setShowURLs] = useState([]);
    const [reasonData, setReasonData] = useState("");
    const [openReason, setOpenReason] = useState(false);
    const [isAccept, setIsAccept] = useState(false);
    const [declinedId, setDeclinedId] = useState<string>();
    const [acceptId, setAcceptId] = useState<any>();
    const [openInfo, setOpenInfo] = useState(false);
    const [infoData, setInfodata] = useState<any>();


    const [error, setError] = useState<ErrorState>({
        reason: "",
    });

    const [size, setSize] = useState(20);
    const [data, setData] = useState([]);
    const [defaultCurrency, setDefaultCurrency] = useState<any>({});

    useEffect(() => {
        let payload: any = {
            status: 1,
            start: page,
            limit: size,
            requestType: "create"
        };
        dispatch(getProductRequest(payload));
    }, [dispatch, page, size, startDate, endDate]);

    useEffect(() => {
        setData(productAddItemData);
        setDefaultCurrency(currency);
        setReasonData("")
    }, [productAddItemData, currency]);


    const handlePageChange = (pageNumber) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value) => {
        setPage(1);
        setSize(value);
    };

    const ManageSellerRequestData = [
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
            Header: "Product Code",
            body: "businessname",
            Cell: ({ row }) => <span>{row?.productCode || "-"}</span>,
        },

        {
            Header: "Seller Name",
            body: "sellerName",
            Cell: ({ row, index }) => (
                <div className="d-flex justify-content-center align-items-center">
                    {/* Image Section */}
                    <div

                        style={{ width: "50px", textAlign: "end" }}
                    >
                        <img
                            src={row?.seller?.image || male.src}
                            alt={row.productName || "Product Image"}
                            width="40"
                            height="40"
                            style={{ borderRadius: "5px", objectFit: "cover" }}
                        />
                    </div>

                    {/* Product Name */}
                    <div style={{ width: "100px", textAlign: "start" }}>
                        <span className="text-capitalize ms-3  cursorPointer text-nowrap">
                            {row?.seller?.sellerFullName}
                        </span>
                    </div>
                </div>
            ),
        },

        {
            Header: "User name",
            body: "username",
            Cell: ({ row }) => <span>{row?.seller?.sellerUsername || "-"}</span>,
        },


        {
            Header: "Category",
            body: "category",
            Cell: ({ row }) => <span>{row?.category?.name || "-"}</span>,

        },

        {
            Header: "Sub Category",
            body: "subcategory",
            Cell: ({ row }) => <span>{row?.subCategory?.name || "-"}</span>,

        },



        {
            Header: "Product",
            accessor: "mainImage",
            Cell: ({ row }) => (
                <div className="d-flex justify-content-end align-items-center">
                    {/* Image Section */}
                    <div

                        style={{ width: "50px", textAlign: "center" }}
                    >
                        <img
                            src={row.mainImage || male.src}
                            alt={row.productName || "Product Image"}
                            width="40"
                            height="40"
                            style={{ borderRadius: "5px", objectFit: "cover" }}
                        />
                    </div>

                    {/* Product Name */}
                    <div style={{ width: "200px", marginLeft: "20px", textAlign: "start" }}>
                        <span className="text-capitalize">
                            {row.productName || "-"}
                        </span>
                    </div>
                </div>
            ),
        },

        {
            Header: "Status",
            body: "createStatus",
            Cell: ({ row }) => {


                return (
                    <div
                        className="boxCenter"
                        style={{ display: "flex", justifyContent: "center" }}
                    >
                        {
                            row?.productCreateStage === 1 ?
                                <button className="btnproduct">
                                    Pending
                                </button> : row?.productCreateStage === 2 ?
                                    <button className="btn1">
                                        Accepted
                                    </button> :
                                    <button className="btn4">
                                        Declined
                                    </button>
                        }
                    </div>
                );
            },
        },



        {
            Header: "Date",
            body: "createdAt",
            Cell: ({ row }) => <span>{row?.date?.split(",")[0] || "-"}</span>,
        },

        {
            Header: "Action",
            body: "action",
            Cell: ({ row }) => (
                <div className="d-flex justify-content-center gap-2">
                    <button className="accepted-button">
                        <img
                            src={accept.src}
                            alt=""
                            height={30}
                            width={30}
                            onClick={() => handleEdit(row, "pay")}
                        />
                    </button>

                    <button className="declined-button">
                        <img
                            src={decline.src}
                            alt=""
                            height={30}
                            width={30}
                            onClick={() => handleDecline(row?._id)}
                        />
                    </button>
                </div>
            ),
        },
    ];

    const handleEdit = (row: any, type: any) => {
        const data = warningForAccept("product");
        data
            .then((res) => {
                if (res) {

                    const payload: any = {
                        status: 2,
                        requestType: "create",
                        productId: row?._id
                    };

                    dispatch(productRequestAcceptorDecline(payload));
                }
            })
            .catch((err) => console.log(err));
    };

    const handleCloseReason = () => {
        setOpenReason(false);
        setReasonData("")
    };

    const handleDecline = (id: any) => {
        setOpenReason(true);
        setDeclinedId(id);
    };


    const handleSubmit = () => {
        if (!reasonData) {
            let error = {} as ErrorState;
            if (!reasonData) error.reason = "Reason is required";
            return setError({ ...error });
        } else {
            const reason = {
                reason: reasonData,
            };
            const payload: any = {
                status: 3,
                productId: declinedId,
                requestType: "create",
                reason: reasonData,
            };
            dispatch(productRequestDecline(payload));
            setReasonData("")
            handleCloseReason();
        }
    };

    const handleAcceptRequest = () => {
        const payload = {
            status: 2,
            requestType: "create",
            productId: acceptId
        }
        dispatch(productRequestAcceptorDecline(payload));
        handleIsAccept();
    };

    const handleIsAccept = () => {
        setIsAccept(false);
    };

    const handleCloseInfo = () => {
        setOpenInfo(false);
    };




    return (
        <>
            { }
            <div className="user-table real-user border-0 !mt-0">
                <div className="user-table-top pt-0 !mt-0">
                    {/* <h5
                        style={{
                            fontWeight: "500",
                            fontSize: "20px",
                            marginBottom: "5px",
                            marginTop: "5px",
                        }}
                    >
                        Pending Product Request
                    </h5> */}
                </div>
                <Table
                    data={data}
                    mapData={ManageSellerRequestData}
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

            {/* For a Pending Decline a Withdraw request :-  */}
            <Modal
                open={openReason}
                onClose={handleCloseReason}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="create-channel-model">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Reason
                    </Typography>
                    <form style={{ padding: "15px", paddingTop: "0px" }}>
                        <div className="row sound-add-box" style={{ overflowX: "hidden" }}>
                            <div className="col-12 mt-2">
                                <div className="col-12 mt-3 text-about">
                                    <label className="label-form">Reason</label>
                                    <textarea
                                        cols={6}
                                        rows={4}
                                        value={reasonData}
                                        placeholder="Enter reason..."
                                        onChange={(e) => {
                                            setReasonData(e.target.value);
                                            if (!e.target.value) {
                                                return setError({
                                                    ...error,
                                                    reason: `Reason Is Required`,
                                                });
                                            } else {
                                                return setError({
                                                    ...error,
                                                    reason: "",
                                                });
                                            }
                                        }}
                                    ></textarea>
                                    {error.reason && (
                                        <p className="errorMessage">
                                            {error.reason && error.reason}
                                        </p>
                                    )}
                                </div>
                            </div>
                            <div className="mt-3 d-flex justify-content-end">
                                <Button
                                    onClick={handleCloseReason}
                                    btnName={"Close"}
                                    newClass={"close-model-btn"}
                                />
                                <Button
                                    onClick={handleSubmit}
                                    btnName={"Submit"}
                                    type={"button"}
                                    newClass={"submit-btn"}
                                    style={{
                                        borderRadius: "0.5rem",
                                        width: "88px",
                                        marginLeft: "10px",
                                    }}
                                />
                            </div>
                        </div>
                    </form>
                </Box>
            </Modal>

            {/* For a accepted a Withdraw request :-  */}

            <Modal
                open={isAccept}
                onClose={handleIsAccept}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style} className="create-channel-model">
                    <Typography id="modal-modal-title" variant="h6" component="h2">
                        Would you like to approve the add product request?
                    </Typography>

                    <div className="mt-3 d-flex justify-content-end">
                        <Button
                            onClick={handleIsAccept}
                            btnName={"Close"}
                            newClass={"close-model-btn"}
                        />
                        <Button
                            onClick={handleAcceptRequest}
                            btnName={"Accept"}
                            type={"button"}
                            newClass={"submit-btn"}
                            style={{
                                borderRadius: "0.5rem",
                                width: "88px",
                                marginLeft: "10px",
                            }}
                        />
                    </div>
                </Box>
            </Modal>
        </>
    );
};


