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
import { warning } from "@/util/Alert";
import { baseURL } from "@/util/config";
import Image from "next/image";
import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import AddIcon from "@mui/icons-material/Add";
import { activeCategory, deleteCategory, getCategories } from '@/store/categorySlice';
import CategoryDialogue from '@/component/category/CategoryDialogue';
import { useRouter } from 'next/router';

interface CategoryData {
  _id: string;
  name: string;
  totalSubcategory: number;
  totalProduct: number;
  isActive: false;
  categoryData: any
}

const Category = () => {
  const { dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const router = useRouter();
  const hasPermission = useSelector(
    (state: RootStore) => state.admin.admin.flag
  );
  const { category, total } = useSelector((state: RootStore) => state.category);

  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<any>(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    let payload: any = {
      start: page,
      limit: size,
    }
    dispatch(getCategories(payload));
  }, [page, size]);

  useEffect(() => {
    setData(category);
  }, [category]);

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleDeleteCategory = (row: any) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(deleteCategory(row?._id));
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
      Cell: ({ row }: { row: CategoryData }) => (
        <span>{row?.name}</span>
      ),
    },

    {
      Header: "Sub Category",
      Cell: ({ row, index }) => (
        <span>{row?.totalSubcategory || 0}</span>
      ),
    },

    {
      Header: "Product",
      Cell: ({ row }) => (
        <span>{row?.totalProduct || 0}</span>
      ),
    },
    {
      Header: "Is Active",
      body: "isActive",
      sorting: { type: "client" },
      Cell: ({ row }: { row: CategoryData }) => (
        <ToggleSwitch
          value={row?.isActive}
          onClick={() => {
            const id: any = row?._id;

            dispatch(activeCategory(id));
          }}
        />
      ),
    },

    {
      Header: "Action",
      Cell: ({ row }: { row: CategoryData }) => (
        <>
          <div className="action-button">
            <Button
              btnIcon={
                <Image src={EditIcon} alt="EditIcon" height={25} width={25} />
              }
              onClick={() => {
                dispatch(openDialog({ type: "editCategory", data: row }));
              }}
            />

            <Button
              btnIcon={
                <Image src={TrashIcon} alt="TrashIcon" height={27} width={27} />
              }
              onClick={() => handleDeleteCategory(row)}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {dialogueType === "category" && <CategoryDialogue />}
      {dialogueType === "editCategory" && <CategoryDialogue />}

      <div className={`userTable pt-0`} style={{ padding: "20px" }}>

        <div className="betBox d-flex justify-content-between align-items-center">

          <h5
            style={{
              fontWeight: "500",
              fontSize: "20px",
              marginTop: "5px",
              marginBottom: "4px",
              paddingLeft: "10px"
            }}
          >
            Category
          </h5>
          <div className=" mt-2 m-sm-0 new-fake-btn px-3">

            <Button
              btnIcon={<AddIcon />}
              btnName={"New"}
              onClick={() => {
                dispatch(openDialog({ type: "category" }));
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
Category.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default Category;
