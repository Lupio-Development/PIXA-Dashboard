import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import Pagination from "@/extra/Pagination";
import TrashIcon from "../assets/icons/trashIcon.svg";
import EditIcon from "../assets/icons/EditBtn.svg";
import Table from "@/extra/Table";
import Title from "@/extra/Title";
import ToggleSwitch from "@/extra/ToggleSwitch";
import { activeBanner, deleteBanner, getBanner } from "@/store/bannerSlice";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import { baseURL } from "@/util/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { activeCategory, deleteCategory, getCategories } from '@/store/categorySlice';
import CategoryDialogue from '@/component/category/CategoryDialogue';
import { useRouter } from 'next/router';
import PromocodeDialogue from '@/component/promoCode/PromocodeDialogue';
import { deletePromocode, getPromocodes } from '@/store/promocodeSlice';
import dayjs from 'dayjs';
import { blockUnblock, getSeller } from "@/store/sellerSlice";
import male from "@/assets/images/male.png";
import notification from "@/assets/images/Notification.svg"
import { setToast } from "@/util/toastServices";
import Notification from "@/component/seller/Notification";
import infoImage from "@/assets/images/info.svg"

interface PromoCodeData {
    _id: string;
    promoCode: any;
    discount: number;
    discountType: number;
    createdAt: any;
    minOrderValue: any;
    conditions: [];
}

const RealSeller = (props) => {
    const { dialogueType } = useSelector(
        (state: RootStore) => state.dialogue
    );

    const { startDate, endDate } = props;


    const hasPermission = useSelector(
        (state: RootStore) => state.admin.admin.flag
    );
    const { promocode } = useSelector((state: RootStore) => state.promocode);
    const { defaultCurrency } = useSelector((state: RootStore) => state.currency);
    const { realOrFakeSeller } = useSelector((state: RootStore) => state.seller);
    const router = useRouter()


    const dispatch = useAppDispatch();

    const [data, setData] = useState<any[]>([]);
    const [page, setPage] = useState<any>(1);
    const [size, setSize] = useState(20);

    useEffect(() => {
        const payload = {
            type: "real",
            start: page,
            limit: size,
            startDate: startDate,
            endDate: endDate
        }
        dispatch(getSeller(payload));
    }, [page, size, startDate, endDate]);

    useEffect(() => {
        setData(realOrFakeSeller);
    }, [realOrFakeSeller]);


    const handleRedirect = (data) => {
        try {
            router.push('/mainInfoPage')
            localStorage.setItem("sellerInfo", JSON.stringify(data))
        } catch (error) {
            console.log("error", error.message)
        }

    }


    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value: number) => {
        setPage(1);
        setSize(value);
    };

    const ManageRealSellerData = [
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
            Header: "Seller name",
            body: "sellerName",
            Cell: ({ row, index }) => (
                <div
                    className="d-flex align-items-center justify-content-center"
                    style={{ cursor: "pointer" }}
                >
                     <div
            
            style={{ width: "60px" , textAlign : "center" }}
          >
                    <img src={row?.image || male.src} width="40px" height="40px" />
                    </div>
                    <div style={{ width: "200px" ,textAlign : "start" }}>
                    <span className="text-capitalize ms-3  cursorPointer text-nowrap">
                        {row?.sellerFullName}
                    </span>
                    </div>
                </div>
            ),
        },


        {
            Header: "User name",
            body: "username",
            Cell: ({ row }) => <span>{row?.sellerUsername || "-"}</span>,
          },

        {
            Header: "Business name",
            body: "businessname",
            Cell: ({ row }) => <span>{row?.businessName || "-"}</span>,
        },

        {
            Header: "Business Tag",
            body: "businesstag",
            Cell: ({ row }) => <span>{row?.businessTag || "-"}</span>,
        },

        {
            Header: "Document Type",
            body: "documenttype",
            Cell: ({ row }) => <span>{row?.documentType || "-"}</span>,
          },

        {
            Header: "Email",
            body: "email",
            Cell: ({ row }) => <span>{row?.email || "-"}</span>,
        },

        {
            Header: "Mobile Number",
            body: "mobilenumber",
            Cell: ({ row }) => <span>{row?.mobileNumber}</span>,
        },

        {
            Header: "Earning",
            body: "earning",
            Cell: ({ row }) => <span>{row?.payoutAmount?.toFixed(2) || 0}</span>,
        },

        {
            Header: "Total Product",
            body: "earning",
            Cell: ({ row }) => <span>{row?.totalProduct || 0}</span>,
        },

        {
            Header: "Total Order",
            body: "earning",
            Cell: ({ row }) => <span>{row?.totalOrder || 0}</span>,
        },

        {
            Header: "Date",
            body: "createdAt",
            Cell: ({ row }) => <span>{row?.date?.split(",")[0] || "-"}</span>,
        },

        {
            Header: "Notification",
            body: "notification",
            Cell: ({ row }) =>
                <img
                    src={notification.src}
                    alt="Notification"
                    height={30}
                    width={30}
                    style={{
                        cursor : "pointer"
                    }}
                    onClick={() => {
                        dispatch(openDialog({ type: "notification", data: row }));
                    }}
                />,
        },

        {
            Header: "Block",
            body: "block",
            sorting: { type: "client" },
            Cell: ({ row }) => (
                <ToggleSwitch
                    value={row?.isBlock}
                    onClick={() => {
                        const id: any = row?._id;
                        dispatch(blockUnblock(id));
                    }}
                />
            ),
        },

        {
            Header: "View",
            body: "view",
            Cell: ({ row }) =>
                <img src={infoImage.src} alt="Info"
            style={{
                cursor : "pointer"
            }}
            onClick={() => handleRedirect(row)}
            />
        },

    ];

    return (
        <>
            {dialogueType === 'notification' && <Notification />}
            <div className={`userTable pt-1`} style={{ padding: "20px" }}>

                <div className="mt-3">
                    <Table
                        data={data}
                        mapData={ManageRealSellerData}
                        serverPerPage={size}
                        serverPage={page}
                        type={"server"}
                    />

                    <Pagination
                        type={"server"}
                        activePage={page}
                        rowsPerPage={size}
                        userTotal={realOrFakeSeller?.length}
                        setPage={setPage}
                        handleRowsPerPage={handleRowsPerPage}
                        handlePageChange={handlePageChange}
                    />
                </div>
            </div>
        </>
    );
};
RealSeller.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
export default RealSeller;
