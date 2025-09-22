import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import React, { useEffect, useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import { RootStore, useAppDispatch } from "@/store/store";
import { openDialog } from "@/store/dialogSlice";
import { useSelector } from "react-redux";
import Table from "@/extra/Table";
import Pagination from "@/extra/Pagination";
import VideoDialogue from "@/component/video/VideoDialogue";
import EditIcon from "../assets/icons/EditBtn.svg";
import Image from "next/image";
import ToggleSwitch from "@/extra/ToggleSwitch";
import { warning } from "@/util/Alert";
import TrashIcon from "@/assets/icons/trashIcon.svg";
import ProductLiveDialogue from "@/component/seller/ProductLiveDialogue";
import { deleteLiveSeller, getLiveSeller, isLiveProduct } from "@/store/sellerSlice";
import infoImage from "@/assets/images/info.svg"
import { useRouter } from "next/router";

export default function LiveSellerPage() {
  const router = useRouter();
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(10);
  const [data, setData] = useState([]);
  const dispatch = useAppDispatch();
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);
  const [startDate, setStartDate] = useState<string>("All");
  const [endDate, setEndDate] = useState<string>("All");
  const { liveSeller , totalLiveSeller } = useSelector(
    (state: RootStore) => state.seller
  );

  useEffect(() => {
    const payload: any = {
      start: page,
      limit: size,
      startDate: startDate,
      endDate: endDate,
    };
    dispatch(getLiveSeller(payload));
  }, [dispatch, page, size, startDate, endDate]);

  useEffect(() => {
    setData(liveSeller)
  }, [liveSeller])

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
          dispatch(deleteLiveSeller(row?._id));
        }
      })
      .catch((err) => console.log(err));
  };

  const liveVideoTable = [
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
      Header: "Seller",
      body: "seller",
      Cell: ({ row }) => (
        <div
          style={{ cursor: "pointer" }}
        // onClick={() => handleEdit(row, "manageUser")}
        >
          <img src={row?.videoImage} width="50px" height="50px" style={{
            objectFit: "cover",
            borderRadius: "5px"
          }} />
          <span className="text-capitalize fw-normal ms-3 cursorPointer text-nowrap">
            {row?.sellerId?.sellerFullName ? row?.sellerId?.sellerFullName : row?.sellerFullName}
          </span>
        </div>
      ),
    },

    {
      Header: "User name",
      body: "name",
      Cell: ({ row }) => (
        <div
          style={{ cursor: "pointer" }}
        >

          <span className="text-capitalize fw-normal ms-3 cursorPointer text-nowrap">
            {row?.sellerId?.sellerUsername || row?.sellerUsername}
          </span>
        </div>
      ),
    },

    {
      Header: "Business name",
      body: "name",
      Cell: ({ row }) => (
        <div
          style={{ cursor: "pointer" }}
        >

          <span className="text-capitalize fw-normal ms-3 cursorPointer text-nowrap">
            {row?.businessName ? row?.businessName : row?.sellerId?.businessName ? row?.sellerId?.businessName : "-"}
          </span>
        </div>
      ),
    },

    {
      Header: "Is Live",
      body: "isActive",
      sorting: { type: "client" },
      Cell: ({ row }: { row: any }) => (
        <ToggleSwitch
          value={row?.isLive}
          onClick={() => {
            const id: any = row?._id;

            dispatch(isLiveProduct(id));
          }}
        />
      ),
    },

    {
      Header: "Info",
      body: "info",
      sorting: { type: "client" },
      Cell: ({ row }: { row: any }) => (
        <img src={infoImage.src} alt="Info"
        style={{
          cursor : "pointer"
        }}
        onClick={() => {
          router.push('/ProductInfo')
          localStorage.setItem("productInfo", JSON.stringify(row))
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
              <Image src={EditIcon} alt="EditIcon" width={25} height={25} />
            }
            onClick={() => {
              dispatch(openDialog({ type: "liveVideo", data: row }));
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

  return (
    <>
      {dialogueType == "liveVideo" && <ProductLiveDialogue />}
      {dialogueType == "viewVideo" && <VideoDialogue />}
      <div className="row">
        <div className="col-6 mt-2">
          <div className="new-fake-btn"
          style={{
            paddingLeft : "20px"
          }}
          >
            <Button
              btnIcon={<AddIcon />}
              btnName={"New"}
              onClick={() => {

                dispatch(openDialog({ type: "liveVideo" }));
              }}
            />
          </div>
        </div>
        
      </div>

      <div className="user-table-top user-table"
        style={{
          border: "none"
        }}
      >
        <Table
          data={data}
          mapData={liveVideoTable}
          serverPerPage={size}
          serverPage={page}
          type={"server"}
        />

        <Pagination
          type={"server"}
          activePage={page}
          rowsPerPage={size}
          userTotal={totalLiveSeller}
          setPage={setPage}
          handleRowsPerPage={handleRowsPerPage}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  );
}

LiveSellerPage.getLayout = function getLayout(page) {
  return <RootLayout>{page}</RootLayout>;
};
