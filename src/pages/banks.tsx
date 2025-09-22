import RootLayout from "@/component/layout/Layout";
import Button from "@/extra/Button";
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
import { activeBank, deleteBank, getBanks } from '@/store/bankSlice';
import BankDialogue from '@/component/bank/BankDialogue';

interface BankData {
  _id: string;
  isActive : boolean;
  name: string;
}

const Banks = () => {
  const { dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const hasPermission = useSelector(
    (state: RootStore) => state.admin.admin.flag
  );
  const { banks } = useSelector((state: RootStore) => state.bank);

  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [page, setPage] = useState<any>(1);
  const [size, setSize] = useState(20);

  useEffect(() => {
    dispatch(getBanks());
  }, []);

  useEffect(() => {
    setData(banks);
  }, [banks]);

  const handleDeleteBank = (row: any) => {

    const data = warning();
    data
    .then((res) => {
        if (res) {
          dispatch(deleteBank(row?._id));
        }
      })
      .catch((err) => console.log(err));
  };

  const bankTable = [
    {
      Header: 'No',
      Cell: ({ index }: { index: number }) => <span>{index + 1}</span>,
    },
    {
      Header: "Bank Name",
      Cell: ({ row }: { row: BankData}) => (
        <span>{row?.name}</span>
      ),
    },
    {
      Header: "Is Active",
      body: "isActive",
      sorting: { type: "client" },
      Cell: ({ row }: { row: BankData }) => (
        <ToggleSwitch
          value={row?.isActive}
          onClick={() => {
            const id: any = row?._id;
        
            dispatch(activeBank(id));
          }}
        />
      ),
    },

    {
      Header: "Action",
      Cell: ({ row }: { row: BankData }) => (
        <>
          <div className="action-button">
            <Button
              btnIcon={
                <Image src={EditIcon} alt="EditIcon" height={25} width={25} />
              }
              onClick={() => {
                dispatch(openDialog({ type: "editBank", data: row }));
              }}
            />

            <Button
              btnIcon={
                <Image src={TrashIcon} alt="TrashIcon" height={27} width={27} />
              }
              onClick={() => handleDeleteBank(row)}
            />
          </div>
        </>
      ),
    },
  ];

  return (
    <>
      {dialogueType === "bank" && <BankDialogue />}
      {dialogueType === "editBank" && <BankDialogue />}

      <div className={`userTable pt-0`} style={{ padding: "20px" }}>

        <div className="betBox d-flex justify-content-between align-items-center">
        <div>
          <h5
                style={{
                  fontWeight: "500",
                  fontSize: "20px",
                  marginTop: "5px",
                  marginBottom: "4px",
                  paddingLeft : "10px"
                }}
              >
                Banks
              </h5>
          </div>
          <div className="mt-2 m-sm-0 new-fake-btn px-3">
            <Button
              btnIcon={<AddIcon />}
              btnName={"New"}
              onClick={() => {
                dispatch(openDialog({ type: "bank" }));
              }}
            />
          </div>
        </div>
        <div className="mt-3">
          <Table
            data={data}
            mapData={bankTable}
            serverPerPage={size}
            serverPage={page}
            type={"server"}
          />
          {/* <div className="mt-3">
         
            <Pagination
                      type={"server"}
                      activePage={page}
                      rowsPerPage={size}
                      userTotal={total}
                      setPage={setPage}
                      handleRowsPerPage={handleRowsPerPage}
                      handlePageChange={handlePageChange}
                    />
          </div> */}
        </div>
      </div>
    </>
  );
};

Banks.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default Banks;
