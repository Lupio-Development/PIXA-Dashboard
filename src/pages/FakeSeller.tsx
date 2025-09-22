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
import LiveImage from "@/assets/images/live.png";
import { useRouter } from "next/router"; // Import useRouter
import infoImage from "@/assets/images/info.svg"


const FakeSeller = (props) => {
  const { dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );

  const { startDate, endDate } = props;
  const { fakeSeller , totalFakeSeller } = useSelector((state: RootStore) => state.seller);
  const [data, setData] = useState([]);
  const router = useRouter(); // Initialize router


  const [page, setPage] = useState<any>(1);
  const [size, setSize] = useState(20);


  const dispatch = useDispatch();

  useEffect(() => {
    setData(fakeSeller)
  },[fakeSeller])

  useEffect(() => {
    const payload = {
      type: "fake",
      start: page,
      limit: size,
      startDate: startDate,
      endDate: endDate
    }
    dispatch(getFakeSeller(payload));
  }, [page, size, startDate, endDate]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleDeleteFakeSeller = (row: any) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(deleteFakeSeller(row?._id));
        }
      })
      .catch((err) => console.log(err));
  };

  
  const handleRedirect = (data) => {
    try {
      router.push({
        pathname: "/mainInfoPage",
        query: { type: "fakeSeller" }
    });
        localStorage.setItem("sellerInfo", JSON.stringify(data))
    } catch (error) {
        console.log("error", error.message)
    }
}


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
      Header: "Total Product",
      body: "earning",
      Cell: ({ row }) => <span>{row?.totalProduct || 0}</span>,
    },

  


    {
      Header: "Date",
      body: "createdAt",
      Cell: ({ row }) => <span>{row?.date || "-"}</span>,
    },


    
    {
      Header: "Action",
      Cell: ({ row }: { row }) => (
        <>
          <div className="action-button">
            <Button
              btnIcon={
                <Image src={EditIcon} alt="EditIcon" height={25} width={25} />
              }
              onClick={() => {
                dispatch(openDialog({ type: "fakeseller", data: row }));
              }}
            />

            <Button
              btnIcon={
                <Image src={TrashIcon} alt="TrashIcon" height={27} width={27} />
              }
              onClick={() => handleDeleteFakeSeller(row)}
            />
          </div>
        </>
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



    // {
    //     Header: "Block",
    //     body: "block",
    //     sorting: { type: "client" },
    //     Cell: ({ row }) => (
    //         <ToggleSwitch
    //             value={row?.isBlock}
    //             onClick={() => {
    //                 const id: any = row?._id;
    //                 dispatch(blockUnblock(id));
    //             }}
    //         />
    //     ),
    // },

    //   {
    //     Header: "Notification",
    //     body: "",
    //     Cell: ({ row }) => (
    //       <Button
    //         newClass={`themeFont boxCenter userBtn fs-5`}
    //         btnIcon={`fa-regular fa-bell`}
    //         style={{
    //           borderRadius: "5px",
    //           margin: "auto",
    //           width: "40px",
    //           backgroundColor: "#FFF",
    //           color: "#3C3D51",
    //         }}
    //         // onClick={() => {
    //         //   dispatch({
    //         //     type: OPEN_DIALOGUE,
    //         //     payload: { data: row, type: "SellerNotification" },
    //         //   });
    //         // }}
    //       />
    //     ),
    //   },



    // {
    //     Header: "View",
    //     body: "view",
    //     Cell: ({ row }) =>
    //         <Button
    //             btnName={`Info`}
    //             newClass={`fw-bolder text-white`}
    //             style={{ backgroundColor: "blue", borderRadius: "7px" }}
    //             onClick={() => handleRedirect(row)}
    //         />
    // },







    // {
    //   Header: "Info",
    //   body: "",
    //   Cell: ({ row }) => (
    //     <Button
    //       btnName={`Info`}
    //       newClass={`fw-bolder text-white`}
    //       style={{ backgroundColor: "blue", borderRadius: "7px" }}
    //       onClick={() => handleOpenInfo(row)}
    //     />
    //   ),
    // },


  ];

  return (
    <>
      {dialogueType === "fakeseller" && <FakeSellerDialogue />}
      {dialogueType === "isLive" && <ProductLiveDialogue />}

      <div className={`userTable`} style={{ padding: "20px" }}>

        {
          dialogueType !== "fakeseller" &&
          <div className="col-12 col-sm-6 col-md-6 col-lg-6 mt-2 m-sm-0 new-fake-btn px-3">
            <Button
              btnIcon={<AddIcon />}
              btnName={"New"}
              onClick={() => {
                dispatch(openDialog({ type: "fakeseller" }));
              }}
            />
          </div>
        }

        {dialogueType !== "fakeseller" &&

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
              userTotal={totalFakeSeller}
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

FakeSeller.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default FakeSeller;