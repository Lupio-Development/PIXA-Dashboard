import React from "react";
import Button from "../../extra/Button";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Table from "../../extra/Table";
import {
  getCategory,
  deleteCategory,
} from "../../store/category/category.action";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import CategoryDialog from "./CategoryDialog";
import {  warning } from "../../../util/Alert";
import { useNavigate } from "react-router-dom";
import Pagination from "../../extra/Pagination";

import Skeleton, { SkeletonTheme } from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { colors } from "../../../util/SkeletonColor";
import { useState } from "react";
import EditInfo from "../../../assets/images/Edit.png";
import Delete from "../../../assets/images/Delete.svg"
import Info from "../../../assets/images/Info.svg"


const Category = (props) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);
  const { category } = useSelector((state) => state.category);
  const { dialogue, dialogueType } = useSelector(
    (state) => state.dialogue
  );


  const dispatch = useDispatch();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getCategory());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setData(category);
  }, [category]);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  // Delete Category
  const handleDelete = (id) => {


    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          dispatch(deleteCategory(id));
        }
      })
      .catch((err) => console.log(err));
  };
  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span className="text-white fw-normal">{index + 1}</span>,
    },
    {
      Header: "Image",
      body: "image",
      Cell: ({ row }) => (
        <>
          {loading ? (
            <>
              <Skeleton
                height={80}
                width={80}
                className="StripeElement "
                baseColor={colors?.baseColor}
                highlightColor={colors?.highlightColor}
              />
            </>
          ) : (
            <>
              <img
                src={row.image}
                style={{ borderRadius: "10px", cursor: "pointer" }}
                height={80}
                width={80}
                alt=""
                onClick={() =>
                  navigate("/admin/category/subCategory", {
                    state: {
                      id: row?._id,
                    },
                  })
                }
              />
            </>
          )}
        </>
      ),
    },
    {
      Header: "Category",
      body: "name",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 text-capitalize text-white fw-normal">{row.name}</p>
        </div>
      ),
    },
    {
      Header: "Product",
      body: "name",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 text-white">
            {row.categoryProduct ? row.categoryProduct : 0}
          </p>
         
        </div>
      ),
    },
    {
      Header: "Sub Category",
      body: "name",
      Cell: ({ row }) => (
        <div
          className=""
          style={{ cursor: "pointer" }}
          onClick={() =>
            navigate("/admin/category/subCategory", {
              state: {
                id: row?._id,
              },
            })
          }
        >
          <p className="mb-0 text-white fw-normal">
            {row?.totalSubcategory ? row?.totalSubcategory : 0}
          </p>
        </div>
      ),
    },
    {
      Header: "Edit",
      body: "",
      Cell: ({ row }) => (
        <Button
        newClass={`themeFont boxCenter userBtn fs-5`}
        btnIcon={EditInfo}
        style={{
          borderRadius: "8px",
          margin: "auto",
          height: "45px",
          width: "45px",
          color: "#160d98",
          background: "#C7E2FF"

        }}
        isImage={true}
        onClick={() => {
          dispatch({
            type: OPEN_DIALOGUE,
            payload: { data: row, type: "Category" },
          });
        }}

      />
      
      ),
    },
    {
      Header: "Delete",
      body: "",
      Cell: ({ row }) => (

        <Button
            newClass={`themeFont boxCenter userBtn fs-5`}
            btnIcon={Delete}
            style={{
              borderRadius: "8px",
              margin: "auto",
              height: "45px",
              width: "45px",
              color: "#160d98",
              background: "#FFDFDF",
              padding : "0px"

            }}
            isImage={true}
            isDeleted={true}
            onClick={() => handleDelete(row?._id)}

          />
     
      ),
    },
    {
      Header: "Info",
      body: "",
      Cell: ({ row }) => (
        <Button
        newClass={`themeFont boxCenter userBtn fs-5`}
        btnIcon={Info}
        style={{
          borderRadius: "8px",
          margin: "auto",
          height: "45px",
          width: "45px",
          color: "#160d98",
          background: "#C4F3FF",
          padding : "0px"
        }}
        isImage={true}
        isDeleted={true}
            onClick={() =>
            navigate("/admin/category/subCategory", {
              state: {
                id: row?._id,
              },
            })
          }

      />
      ),
    },
  ];

  

  return (
    <>
      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="sellerHeader primeHeader">
            <div className="row">
              <div className="col-8">
                <Button
                  newClass={`whiteFont`}
                  btnColor={`btnBlackPrime`}
                  btnIcon={`fa-solid fa-plus`}
                  btnName={`Add`}
                  onClick={() => {
                    dispatch({
                      type: OPEN_DIALOGUE,
                      payload: { type: "Category" },
                    });
                  }}
                  style={{ borderRadius: "10px" }}
                />
                {dialogue && dialogueType === "Category" && <CategoryDialog />}
              </div>
              <div className="col-4 text-end"></div>
            </div>
          </div>
          <div className="sellerMain">
            <div className="tableMain mt-2 categoryTable">
              <Table
                data={data}
                mapData={mapData}
                PerPage={rowsPerPage}
                Page={page}
                type={"client"}
              />
              <Pagination
                component="div"
                count={category?.length}
                serverPage={page}
                type={"client"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={category?.length}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
          <div className="sellerFooter primeFooter"></div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getCategory,
  deleteCategory,
})(Category);
