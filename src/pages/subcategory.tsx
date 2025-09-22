import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
import Pagination from "@/extra/Pagination";
import TrashIcon from "../assets/icons/trashIcon.svg";
import EditIcon from "../assets/icons/EditBtn.svg";
import Table from "@/extra/Table";
import Title from "@/extra/Title";
import ToggleSwitch from "@/extra/ToggleSwitch";
import { openDialog } from "@/store/dialogSlice";
import { RootStore, useAppDispatch } from "@/store/store";
import {  warning } from "@/util/Alert";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { useRouter } from 'next/router';
import { activeSubCategory, deleteSubCategory, getSubCategories } from '@/store/subcategorySlice';
import SubCategoryDialogue from '@/component/category/SubCategoryDialogue';
import { setToast } from "@/util/toastServices";

interface SubCategoryData {
  _id: string;
  name: string;
  category: { name: string };
  isActive: false;
  categoryName : string;
  totalProduct : number
}

const SubCategory = () => {
  const { dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const router = useRouter();
  const hasPermission = useSelector(
    (state: RootStore) => state.admin.admin.flag
  );
  const { subcategory, total } = useSelector((state: RootStore) => state.subcategory);

  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<any>(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    let payload: any = {
      start: page,
      limit: size,
    }
    dispatch(getSubCategories(payload));
  }, [page, size]);

  useEffect(() => {
    setData(subcategory);
  }, [subcategory]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleDeleteSubCategory = (row: any) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(deleteSubCategory(row?._id));
          setToast("success" , "SubCategory deleted succesfully")
        }
      })
      .catch((err) => console.log(err));
  };

  const categoryTable = [
    {
      Header: 'No',
      Cell: ({ index }: { index: number }) => <span>{index + 1}</span>,
    },
    {
      Header: "Category",
      Cell: ({ row }: { row: SubCategoryData }) => (
        <span>{row?.categoryName || "-"}</span>
      ),
    },
    {
      Header: "Sub Category",
      Cell: ({ row }: { row: SubCategoryData }) => (
        <span>{row?.name || "-"}</span>
      ),
    },

    {
      Header: "Total Product",
      Cell: ({ row }: { row: SubCategoryData }) => (
        <span>{row?.totalProduct || "0"}</span>
      ),
    },

    {
      Header: "Is Active",
      body: "isActive",
      sorting: { type: "client" },
      Cell: ({ row }: { row: SubCategoryData }) => (
        <ToggleSwitch
          value={row?.isActive}
          onClick={() => {
            const id: any = row?._id;
        
            dispatch(activeSubCategory(id));
          }}
        />
      ),
    },

    {
      Header: "Action",
      Cell: ({ row }: { row: SubCategoryData }) => (
        <>
          <div className="action-button">
            <Button
              btnIcon={
                <Image src={EditIcon} alt="EditIcon" height={25} width={25} />
              }
              onClick={() => {
                dispatch(openDialog({ type: "editSubCategory", data: row }));
              }}
            />

            <Button
              btnIcon={
                <Image src={TrashIcon} alt="TrashIcon" height={27} width={27} />
              }
              onClick={() => handleDeleteSubCategory(row)}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {dialogueType === "subCategory" && <SubCategoryDialogue />}
      {dialogueType === "editSubCategory" && <SubCategoryDialogue />}

      <div className={`userTable pt-0`} style={{ padding: "20px" }}>

        <div className="betBox d-flex justify-content-between align-items-center">
        <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginTop: "5px",
                  marginBottom: "4px",
                  paddingLeft : "10px"
                }}
              >
                Sub Category
              </h5>
          <div className="mt-2 m-sm-0 new-fake-btn px-3">
            <Button
              btnIcon={<AddIcon />}
              btnName={"New"}
              onClick={() => {
                dispatch(openDialog({ type: "subCategory" }));
              }}
            />
          </div>
        </div>
        <div className="mt-3">
          <Table
            data={data}
            mapData={categoryTable}
            serverPerPage={size}
            serverPage={page}
            type={"server"}
          />
          <div className="mt-3">

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
        </div>
      </div>
    </>
  );
};
SubCategory.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default SubCategory;
