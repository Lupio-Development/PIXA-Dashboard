import { Link, Navigate, useNavigate } from "react-router-dom";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import {
  getPromoCode,
  deletePromoCode,
} from "../../store/PromoCode/promoCode.action";
import ToggleSwitch from "../../extra/ToggleSwitch";
import dayjs from "dayjs";
import PromoDialog from "./PromoDialog";
import Pagination from "../../extra/Pagination";
import EditInfo from "../../../assets/images/Edit.png";
import {  warning } from "../../../util/Alert";
import Delete from "../../../assets/images/Delete.svg"

const PromoCode = (props) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { promoCode } = useSelector((state) => state.promoCode);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );


  useEffect(() => {
    dispatch(getPromoCode());
  }, [dispatch]);
  useEffect(() => {
    setData(promoCode);
  }, [promoCode]);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  // Delete PromoCode
  const handleDelete = (id) => {


    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deletePromoCode(id);
        }
      })
      .catch((err) => console.log(err));
  };

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span className="text-white fw-normal">{parseInt(index) + 1}</span>,
    },

    {
      Header: "Promo Code", body: "promoCode",

      Cell: ({ row }) => (
        <>
          <span className="text-white fw-normal">
            {row.promoCode} $
          </span>
        </>
      ),
    },
    {
      Header: "Discount",
      body: "discountAmount",
      Cell: ({ row }) => (
        <>
          {row.discountType === 0 && (
            <>
              <span className="text-white fw-normal">
                {row.discountAmount} $
              </span>
            </>
          )}
          {row.discountType === 1 && (
            <>
              <span className="text-white fw-normal">
                {row.discountAmount} %
              </span>
            </>
          )}
        </>
      ),
    },
    {
      Header: "MinOrderValue",
      body: "minOrderValue",
      Cell: ({ row }) => (
        <>
          <span className="text-white fw-normal">
            {row.minOrderValue} $
          </span>
        </>
      ),
    },
    {
      Header: "Conditions",
      body: "conditions",

      Cell: ({ row }) => {
        return (
          <>
            {row.conditions.map((condition, i) => (
              <>
                <div key={i} className=" text-start d-flex">
                  <div style={{ color: "#FF2929" }}>✔ </div>
                  <span className="ms-2 text-white fw-normal">{condition}</span>
                </div>
              </>
            ))}
          </>
        );
      },
    },

    {
      Header: "CreatedDate",
      body: "createdAt",
      Cell: ({ row }) => (
        <span className="text-white fw-normal">{dayjs(row.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
    {
      Header: "Edit",
      body: "",
      Cell: ({ row }) => (
        <>
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
            onClick={() =>
              dispatch({
                type: OPEN_DIALOGUE,
                payload: { data: row, type: "promoCode" },
              })
            }

          />
          {/* <Button
            newClass={`themeFont boxCenter userBtn fs-5`}
            
            btnIcon={`far fa-edit`}
            style={{
              borderRadius: "5px",
              margin: "auto",
              width: "40px",
              backgroundColor: "#fff",
              color: "#160d98",
            }}
            onClick={() =>
              dispatch({
                type: OPEN_DIALOGUE,
                payload: { data: row, type: "promoCode" },
              })
            }
          /> */}
          {dialogue && dialogueType === "promoCode" && <PromoDialog />}
        </>
      ),
    },
    {
      Header: "Delete",
      body: "",
      Cell: ({ row }) => (
        <>
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
              padding: "0px"

            }}
            isImage={true}
            isDeleted={true}
            onClick={() => handleDelete(row._id)}
          />
        </>
      ),
    },

    // add more columns as needed
  ];
  return (
    <>
      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="sellerHeader primeHeader">
            <div className="row">
              <div className="col-10">
                <Button
                  newClass={`whiteFont`}
                  btnColor={`btnBlackPrime`}
                  btnIcon={`fa-solid fa-plus`}
                  btnName={`Add`}
                  onClick={() => {
                    dispatch({
                      type: OPEN_DIALOGUE,
                      payload: { type: "promoCode" },
                    });
                  }}
                  style={{ borderRadius: "10px" }}
                />
                {dialogue && dialogueType === "promoCode" && <PromoDialog />}
              </div>
              <div className="col-2 text-end">

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
                component="div"
                count={promoCode?.length}
                serverPage={page}
                type={"client"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={promoCode?.length}
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

export default connect(null, { getPromoCode, deletePromoCode })(PromoCode);

