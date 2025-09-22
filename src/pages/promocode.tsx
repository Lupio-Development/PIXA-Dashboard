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
import { warning } from "@/util/Alert";
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

interface PromoCodeData {
  _id: string;
  promoCode: any;
  discount: number;
  discountType: number;
  createdAt: any;
  minOrderValue: any;
  conditions: [];
}

const PromoCode = () => {
  const { dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const hasPermission = useSelector(
    (state: RootStore) => state.admin.admin.flag
  );
  const { promocode } = useSelector((state: RootStore) => state.promocode);
  const { defaultCurrency } = useSelector((state: RootStore) => state.currency);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<any>(1);
  const [size, setSize] = useState(20);
  const [expandedRows, setExpandedRows] = useState<Record<string, boolean>>({});

  useEffect(() => {
    dispatch(getPromocodes());
  }, []);

  useEffect(() => {
    setData(promocode);
  }, [promocode]);

  const handleDeletePromocode = (row: any) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(deletePromocode(row?._id));
        }
      })
      .catch((err) => console.log(err));
  };

  const toggleExpand = (id: string) => {
    setExpandedRows((prev) => ({ ...prev, [id]: !prev[id] }));
  };




  const categoryTable = [
    {
      Header: 'No',
      Cell: ({ index }: { index: number }) => <span>{index + 1}</span>,
    },
    {
      Header: "Promo Code",
      Cell: ({ row }: { row: PromoCodeData }) => (
        <span>{row?.promoCode}</span>
      ),
    },
    {
      Header: "Discount",
      Cell: ({ row }: { row: PromoCodeData }) => (
        <span>
          {row?.discountType == 1
            // ? row?.discount + defaultCurrency?.symbol
            ? row?.discount + '$'
            : row?.discountType == 2 ? row?.discount + "%" : "-"}
        </span>
      ),
    },
    {
      Header: "Min. Order Value",
      Cell: ({ row }: { row: PromoCodeData }) => (
        <span>{row?.minOrderValue}</span>
      ),
    },
    // {
    //   Header: "Conditions",
    //   Cell: ({ row }: { row: PromoCodeData }) => {
    //     return (
    //       <span>
    //         {row.conditions.join(", ")}
    //       </span>
    //     );
    //   },
    // },
    {
      Header: "Conditions",
      Cell: ({ row }: { row: PromoCodeData }) => {
        const isExpanded = expandedRows[row._id] || false;
        const conditionsArray = row.conditions || [];
        const hasMoreThanThree = conditionsArray.length > 3;
        const displayedConditions = isExpanded ? conditionsArray : conditionsArray.slice(0, 3);

        return (
          <div>
            {displayedConditions.map((condition, index) => (
              <div key={index} style={{ display: "flex", alignItems: "center", gap: "5px" }}>
                ✅ <span>{condition}</span>
              </div>
            ))}
            {hasMoreThanThree && (
              <button
                onClick={() => toggleExpand(row._id)}
                style={{
                  background: "none",
                  border: "none",
                  color: "blue",
                  cursor: "pointer",
                  marginTop: "5px",
                  fontSize: "12px",
                }}
              >
                {isExpanded ? "Read Less" : "Read More"}
              </button>
            )}
          </div>
        );
      },
    },
    {
      Header: "Created At",
      Cell: ({ row }: { row: PromoCodeData }) => (
        <span>{dayjs(row?.createdAt).format("DD MMMM YYYY")}</span>
      ),
    },
    {
      Header: "Action",
      Cell: ({ row }: { row: PromoCodeData }) => (
        <>
          <div className="action-button">
            <Button
              btnIcon={
                <Image src={EditIcon} alt="EditIcon" height={25} width={25} />
              }
              onClick={() => {
                dispatch(openDialog({ type: "editPromocode", data: row }));
              }}
            />

            <Button
              btnIcon={
                <Image src={TrashIcon} alt="TrashIcon" height={27} width={27} />
              }
              onClick={() => handleDeletePromocode(row)}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {dialogueType === "promocode" && <PromocodeDialogue />}
      {dialogueType === "editPromocode" && <PromocodeDialogue />}

      <div className={`userTable pt-0`} style={{ padding: "20px" }}>

        <div className="betBox d-flex justify-content-between align-items-center">
          <div>
            <h5
              style={{
                fontWeight: "500",
                fontSize: "20px",
                marginTop: "5px",
                marginBottom: "4px",
                paddingLeft: "10px"
              }}
            >
              Promo Code
            </h5>
          </div>
          <div className="mt-2 m-sm-0 new-fake-btn px-3">
            <Button
              btnIcon={<AddIcon />}
              btnName={"New"}
              onClick={() => {
                dispatch(openDialog({ type: "promocode" }));
              }}
            />
          </div>
        </div>
        <div className="mt-3">
          <Table
            data={data}
            mapData={categoryTable}
            PerPage={size}
            Page={page}
            type={"client"}
          />

          <div className="mt-3">
            <Pagination
              type={"client"}
              activePage={page}
              rowsPerPage={size}
              userTotal={data?.length}
              setPage={setPage}
              setData={setData}
              data={data}
              actionShow={false}
            />
          </div>
        </div>
      </div>
    </>
  );
};
PromoCode.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default PromoCode;
