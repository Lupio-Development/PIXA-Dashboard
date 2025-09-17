import React from "react";
import Button from "../../extra/Button";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getCategoryWiseSubCategory,
  deleteSubCategory,
} from "../../store/subCategory/subCategory.action";

import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import SubCategoryDialoge from "./SubCategoryDialoge";
import {  warning } from "../../../util/Alert";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../../util/SkeletonColor";
import EditInfo from "../../../assets/images/Edit.png";
import Delete from "../../../assets/images/Delete.svg"

const CategoryWiseSubCategory = (props) => {
  const { categoryWiseSubCategory } = useSelector((state) => state.subCategory);

  console.log("categoryWiseSubCategory", categoryWiseSubCategory);

  const { dialogue, dialogueType } = useSelector((state) => state.dialogue);


  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { state } = useLocation();
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getCategoryWiseSubCategory(state?.id));
  }, [dispatch, state]);

  useEffect(() => {
    setData(categoryWiseSubCategory);
  }, [categoryWiseSubCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  console.log("categoryWiseSubCategory", categoryWiseSubCategory);

  // Delete Category
  const handleDelete = (id) => {
    debugger


    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          dispatch(deleteSubCategory(id));
        }
      })
      .catch((err) => console.log(err));
  };

  // // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span className="text-white">{index + 1}</span>,
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
                src={row?.image}
                style={{ borderRadius: "10px", cursor: "pointer" }}
                height={80}
                width={80}
                alt=""
              />
            </>
          )}
        </>
      ),
    },
    {
      Header: "Sub Category",
      body: "name",
      Cell: ({ row }) => (
        console.log("row", row),
        (
          <div className="">
            <p className="mb-0 fw-normal text-white">{row?.name}</p>
            {row?.category?.name ? (
              <p className="text-white fw-normal text-center">
                {"(" + row?.category?.name + ")"}
              </p>
            ) : (
              <p className="text-white fw-normal text-center">
                {"(" + row?.category + ")"}
              </p>
            )}
          </div>
        )
      ),
    },
    {
      Header: "Product",
      body: "name",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 fw-normal text-white">
            {row?.sameSubcategoryProductCount
              ? row?.sameSubcategoryProductCount
              : 0}
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
            payload: { data: row, type: "subCategory" },
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
            onClick={() => handleDelete(row?.subCategoryId ? row?.subCategoryId : row?._id)}

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
                  newClass={`whiteFont mt-1`}
                  btnColor={`btnBlackPrime`}
                  btnIcon={`fa-solid fa-plus`}
                  btnName={`Add`}
                  onClick={() => {
                    dispatch({
                      type: OPEN_DIALOGUE,
                      payload: { type: "subCategory", extraData: state?.id },
                    });
                  }}
                  style={{ borderRadius: "10px" }}
                />
                {dialogue && dialogueType === "subCategory" && (
                  <SubCategoryDialoge />
                )}
              </div>
              <div className="col-4 ">
                <div
                  className="d-flex justify-content-end"
                  style={{ margin: "10px 32px 10px 0px" }}
                >
                  <Button
                    newClass={`themeFont boxCenter userBtn fs-5`}
                    btnIcon={`fa-solid fa-angles-left text-dark fs-6`}
                    style={{
                      borderRadius: "5px",

                      width: "60px",
                      backgroundColor: "#DEF213",
                      color: "#000",
                    }}
                    onClick={() => navigate("/admin/category")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sellerMain">
            <div className="tableMain mt-2">
              <Table
                data={data}
                mapData={mapData}
                PerPage={rowsPerPage}
                Page={page}
                type={"client"}
              />
              <Pagination
                type={"client"}
                component="div"
                count={categoryWiseSubCategory?.length}
                serverPage={page}
                serverPerPage={rowsPerPage}
                onPageChange={handleChangePage}
                totalData={categoryWiseSubCategory?.length}
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

export default connect(null, { getCategoryWiseSubCategory, deleteSubCategory })(
  CategoryWiseSubCategory
);
