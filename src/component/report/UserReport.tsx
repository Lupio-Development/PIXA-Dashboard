import React, { useEffect, useState } from "react";
import Searching from "../../extra/Searching";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { useSelector } from "react-redux";
import { deleteReport, getReport, solvedReport } from "../../store/reportSlice";
import dayjs from "dayjs";
import Button from "../../extra/Button";
import TrashIcon from "../../assets/icons/trashIcon.svg";
import TrueArrow from "../../assets/icons/TrueArrow.svg";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import {  warning } from "../../util/Alert";
import { RootStore, useAppDispatch } from "@/store/store";
import Image from "next/image";
import useClearSessionStorageOnPopState from "@/extra/ClearStorage";
import UserImage from "../../assets/images/8.jpg";


const UserReport = (props) => {
  const startDate = props?.startDate;
  const endDate = props?.endDate;

  const { userReport, totalUserReport } = useSelector(
    (state: RootStore) => state.report
  );
 
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<number>(1);
  const [size, setSize] = useState<number>(20);
  const [type, setType] = useState<any>("All");
  const [search, setSearch] = useState<string>();
  useClearSessionStorageOnPopState("multiButton");

  useEffect(() => {
    let payload: any = {
      start: page,
      limit: size,
      status: type,
      startDate: startDate,
      endDate: endDate,
      type: 3,
    };
    dispatch(getReport(payload));
  }, [page, size, type, startDate, endDate]);

  useEffect(() => {
    setData(userReport);
  }, [userReport]);

  const postReportTable = [
    {
      Header: "NO",
      body: "no",
      Cell: ({ index }: { index: number }) => (
        <span className="  text-nowrap">{(page - 1) * size + index + 1}</span>
      ),
    },
    {
      Header: "User Image",
      body: "image",
      Cell: ({ row, index }: { row: any; index: number }) => (
        <img
          src={row?.image === '' ? UserImage.src : row?.image}
          width="48px"
          height="48px"
          style={{ objectFit: "cover" }}
        />
      ),
    },
    {
      Header: "User id",
      body: "uniqueId",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.uniqueId}</span>
      ),
    },

    {
      Header: "User name",
      body: "userName",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">{row?.userName}</span>
      ),
    },
    {
      Header: "User report reason",
      body: "reportType",
      Cell: ({ row }: { row: any }) => (
        <>{<span className="text-capitalize">{row?.reportReason}</span>}</>
      ),
    },
    {
      Header: "Status",
      body: "status",
      Cell: ({ row }: { row: any }) => (
        <>
          {row?.status === 1 && (
            <span className="text-capitalize badge badge-primary p-2">
              Pending
            </span>
          )}
          {row?.status === 2 && (
            <span className="text-capitalize badge badge-success p-2">
              Solved
            </span>
          )}
        </>
      ),
    },
    {
      Header: "User reported",
      body: "createdAt",
      Cell: ({ row }: { row: any }) => (
        <span className="text-capitalize">
          {row?.createdAt ? dayjs(row?.createdAt).format("DD MMMM YYYY") : ""}
        </span>
      ),
    },
    {
      Header: "Action",
      body: "action",
      Cell: ({ row }: { row: any }) => (
        <div className="action-button">
          {row.status === 2 ? (
            ""
          ) : (
            <Button
              btnIcon={<Image src={TrueArrow} alt="TrueArrow" />}
              onClick={() => handleSolved(row?._id)}
            />
          )}
          <Button
            btnIcon={
              <Image src={TrashIcon} alt="TrashIcon" height={25} width={25} />
            }
            onClick={() => handleDeleteReport(row)}
          />
        </div>
      ),
    },
  ];

  const selectType = (type: number) => {
    let payload: any = {
      startDate: "All",
      endDate: "All",
      type: type,
    };
    setType(type);
  };

  const handleFilterData = (filteredData: any) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const handlePageChange = (pageNumber: number) => {
    setPage(pageNumber);
  };

  const handleRowsPerPage = (value: number) => {
    setPage(1);
    setSize(value);
  };

  const handleSolved = (id: any) => {

    const payload: any = {
      reportId: id,
      reportType: 3,
    };
    dispatch(solvedReport(payload));
  };

  const handleDeleteReport = (row: any) => {


    const data = warning();
    data
      .then((logouts: any) => {
        if (logouts) {
          const payload: any = {
            reportId: row?._id,
            reportType: 3,
          };
          dispatch(deleteReport(payload));
        }
      })
      .catch((err: any) => console.log(err));
  };

  return (
    <>
      <div className="userPage border-0 pt-0"
      style={{
        paddingLeft : "0px"
      }}
      >
        <div className="payment-setting-box user-table pt-0">
          <div style={{ padding: "12px", position: "relative" }}>
            <div className="row">
              <div className="col-md-6 col-lg-6 col-12">
         
            <Searching
              data={userReport}
              placeholder={"Search for ID, Keyword, Username,Name,Title,Reported "}
              type={"client"}
              setData={setData}
              onFilterData={handleFilterData}
              searchValue={search}
              actionShow={false}
            />
            </div>
            <div className="col-6 d-flex justify-content-end align-items-center">
              <FormControl sx={{ width: "120px" }}>
                <InputLabel
                  id="demo-simple-select-label"
                  style={{
                    fontWeight: "500",
                    fontSize: "17px",
                    marginBottom: "10px",
                  }}
                >
                  Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={type}
                  label="Type"
                  onChange={(e) => selectType(e.target.value as number)}
                >
                  <MenuItem value="All" key="All">
                    All
                  </MenuItem>
                  <MenuItem value={1} key="Pending">
                    Pending
                  </MenuItem>
                  <MenuItem value={2} key="Solved">
                    Solved
                  </MenuItem>
                </Select>
              </FormControl>
            </div>
            </div>
          </div>
          <div className="mt-3"
          style={{
            paddingLeft : "10px",
            paddingRight : "10px"
          }}
          >
            <Table
              data={data}
              mapData={postReportTable}
              serverPerPage={size}
              serverPage={page}
              type={"server"}
            />
            <div className="mt-3">
              <Pagination
                type={"server"}
                activePage={page}
                rowsPerPage={size}
                userTotal={totalUserReport}
                setPage={setPage}
                handleRowsPerPage={handleRowsPerPage}
                handlePageChange={handlePageChange}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default UserReport;
