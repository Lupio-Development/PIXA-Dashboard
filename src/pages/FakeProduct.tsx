import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import { deleteFakeSeller, getFakeSeller, getSeller } from "@/store/sellerSlice";
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import Title from "@/extra/Title";
import { openDialog } from "@/store/dialogSlice";
import { RootStore } from "@/store/store";
import FakeSellerDialogue from "@/pages/FakeSellerDialogue";
import Table from "@/extra/Table";
import Pagination from "@/extra/Pagination";
import male from "@/assets/images/male.png";
import { warning } from "@/util/Alert";
import TrashIcon from "../assets/icons/trashIcon.svg";
import EditIcon from "../assets/icons/EditBtn.svg";
import Image from "next/image";
import BannerDialogue from "@/component/banner/BannerDialogue";
import ProductLiveDialogue from "@/component/seller/ProductLiveDialogue";
import LiveImage from "@/assets/images/live.png"
import { deleteFakeProduct, getFakeProduct, isJustLaunched } from "@/store/productSlice";
import FakeProductDialogue from "@/component/FakeProductDialogue";
import { getDefaultCurrency } from "@/store/currencySlice";
import state from "sweetalert/typings/modules/state";
import ToggleSwitch from "@/extra/ToggleSwitch";

const FakeProduct = (props) => {
  const {startDate , endDate} = props;
  const { dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const {currency} = useSelector((state : RootStore) => state.currency)
  const { fakeProduct , total } = useSelector((state: RootStore) => state.product);
  const [data, setData] = useState([]);
  const [page, setPage] = useState<any>(1);
  const [size, setSize] = useState(20);


  const dispatch = useDispatch();


  useEffect(() => {
    setData(fakeProduct)
  },[fakeProduct])

  useEffect(() => {
    const payload = {
      type: "fake",
      start: page,
      limit: size,
      startDate : startDate,
      endDate : endDate
    }
    dispatch(getFakeProduct(payload));
  }, [page, size, startDate , endDate]);

  useEffect(() => {
    dispatch(getDefaultCurrency())

  },[])

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



  const ManageFakeSellerData = [
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
              alt={ "Seller Image"}
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
      Header: "Product",
      accessor: "mainImage",
      Cell: ({ row }) => (
        <div className="d-flex justify-contents-center align-items-center">
          {/* Image Section */}
          <div

            style={{ width: "50px", textAlign: "center" }}
          >
            <img
              src={row.mainImage || male.src}
              alt={ "Product Image"}
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
          Header: "Is Product Launched",
          body: "isActive",
          sorting: { type: "client" },
          Cell: ({ row }: { row }) => (
            <ToggleSwitch
              value={row?.isJustLaunched}
              onClick={() => {
                const id: any = row?._id;
            
                dispatch(isJustLaunched(id));
              }}
            />
          ),
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
              dispatch(openDialog({ type: "fakeProduct", data: row }));
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
      {dialogueType === "fakeProduct" && <FakeProductDialogue />}
      {dialogueType === "isLive" && <ProductLiveDialogue />}

      <div className={`userTable`} style={{ padding: "20px" }}>

        {
          dialogueType !== "fakeProduct" &&
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn px-3">
            <Button
              btnIcon={<AddIcon />}
              btnName={"New"}
              onClick={() => {
                dispatch(openDialog({ type: "fakeProduct" }));
              }}
            />
          </div>
        }

        {dialogueType !== "fakeProduct" &&

          <div className="mt-3">
            <Table
              data={data}
              mapData={ManageFakeSellerData}
              serverPerPage={size}
              serverPage={page}
              type={"server"}
            />

            <Pagination
              type={"server"}
              activePage={page}
              rowsPerPage={size}
              userTotal={data?.length}
              setPage={setPage}
              handleRowsPerPage={handleRowsPerPage}
              handlePageChange={handlePageChange}
            />
          </div>
        }
      </div>
    </>
  )
}

FakeProduct.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default FakeProduct;