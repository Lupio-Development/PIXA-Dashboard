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
import { deleteFakeProduct, getProduct } from "@/store/productSlice";
import { warning } from "@/util/Alert";
import FakeProductDialogue from "@/component/FakeProductDialogue";

interface PromoCodeData {
    _id: string;
    promoCode: any;
    discount: number;
    discountType: number;
    createdAt: any;
    minOrderValue: any;
    conditions: [];
}

const RealProduct = (props) => {
  const {startDate , endDate} = props;
    const { dialogueType } = useSelector(
        (state: RootStore) => state.dialogue
    );

    const hasPermission = useSelector(
        (state: RootStore) => state.admin.admin.flag
    );
    const { promocode } = useSelector((state: RootStore) => state.promocode);
    const { defaultCurrency } = useSelector((state: RootStore) => state.currency);
    const { realOrFakeProduct , total } = useSelector((state: RootStore) => state.product);
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
            startDate : startDate,
            endDate : endDate
        }
        dispatch(getProduct(payload));
    }, [page, size , startDate , endDate]);

    useEffect(() => {
        setData(realOrFakeProduct);
    }, [realOrFakeProduct]);



    const handlePageChange = (pageNumber: number) => {
        setPage(pageNumber);
    };

    const handleRowsPerPage = (value: number) => {
        setPage(1);
        setSize(value);
    };

      const handleDeleteProduct = (row: any) => {
    
        const data = warning();
        data
          .then((res) => {
            if (res) {
              dispatch(deleteFakeProduct(row?._id));
            }
          })
          .catch((err) => console.log(err));
      };

    const ManageProductData = [
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
              {row?.seller?.sellerFullName || "-"}
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
          Header: "Product",
          accessor: "mainImage",
          Cell: ({ row }) => (
            <div className="d-flex justify-content-center align-items-center">
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
          Header: "Price (₹)",
          body: "price",
          Cell: ({ row }) => <span>{row?.price || "-"}</span>,
        },
    
        {
          Header: "Shipping Charge (₹)",
          body: "price",
          Cell: ({ row }) => <span>{row?.shippingCharges || "-"}</span>,
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
               </button>  : 
                 <button className="btn4">
                 Declined
               </button> 
               }
              </div>
            );
          },
        },

         {
              Header: "Action",
              body: "action",
              Cell: ({ row }: { row: any }) => (
                <div className="action-button">
                  <Button
                    btnIcon={
                      <Image src={EditIcon} alt="editIcon" width={25} height={25} />
                    }
                    onClick={() => {
                      dispatch(openDialog({ type: "realProduct", data: {...row , type : "real"} }));
                    }}
                  />
                  <Button
                    btnIcon={
                      <Image src={TrashIcon} alt="TrashIcon" width={25} height={25} />
                    }
                    onClick={() => handleDeleteProduct(row)}
                  />
                </div>
              ),
            },
      ];
    return (
        <>
            {dialogueType === 'notification' && <Notification />}
            {dialogueType === "realProduct" && <FakeProductDialogue />}
            <div className={`userTable`} style={{ padding: "20px" }}>
               {
                      dialogueType !== "realProduct" &&
              
                <div className="mt-3">
                    <Table
                        data={data}
                        mapData={ManageProductData}
                        serverPerPage={size}
                        serverPage={page}
                        type={"server"}
                    />
                   

                    <Pagination
                        type={"server"}
                        activePage={page}
                        rowsPerPage={size}
                        userTotal={total}
                        setPage={setPage}
                        handleRowsPerPage={handleRowsPerPage}
                        handlePageChange={handlePageChange}
                    />
                </div>
                  }
            </div>
        </>
    );
};
RealProduct.getLayout = function getLayout(page: React.ReactNode) {
    return <RootLayout>{page}</RootLayout>;
};
export default RealProduct;
