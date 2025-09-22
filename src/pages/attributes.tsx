import RootLayout from '@/component/layout/Layout';
import Button from '@/extra/Button';
import Pagination from '@/extra/Pagination';
import TrashIcon from '../assets/icons/trashIcon.svg';
import EditIcon from '../assets/icons/EditBtn.svg';
import Table from '@/extra/Table';
import Title from '@/extra/Title';
import ToggleSwitch from '@/extra/ToggleSwitch';
import { RootStore, useAppDispatch } from '@/store/store';
import { warning } from '@/util/Alert';
import Image from 'next/image';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import AddIcon from '@mui/icons-material/Add';
import { activeAttribute, deleteAttribute, getAttributes } from '@/store/attributeSlice';
import AttributeDialogue from '@/component/attribute/AttributeDialogue';
import { Box, Modal, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import infoImage from "@/assets/images/info.svg"


const style: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 1000,
  backgroundColor: 'background.paper',
  borderRadius: '13px',
  border: '1px solid #C9C9C9',
  boxShadow: '24px',
  padding: '19px',
  maxHeight: "80vh",
  overflow: "auto"
};

interface AttributeData {
  _id: string;
  category: string;
  subCategory: {
    name: string
  }
  isActive: false;
}

const Attributes = () => {
  const { dialogueType } = useSelector((state: RootStore) => state.dialogue);
  const router = useRouter();
  const hasPermission = useSelector(
    (state: RootStore) => state.admin.admin.flag
  );
  const { attributes } = useSelector((state: RootStore) => state.attribute);
  const dispatch = useAppDispatch();

  const [data, setData] = useState<any[]>([]);
  const [rowsPerPage, setRowsPerPage] = useState<number>(20);
  const [page, setPage] = useState<any>(1);
  const [size, setSize] = useState(20);
  const [openInfo, setOpenInfo] = useState(false);
  const [infoData, setInfodata] = useState<any>();

  useEffect(() => {
    dispatch(getAttributes());
  }, [dispatch]);

  useEffect(() => {
    setData(attributes);
  }, [attributes]);

  const handleChangePage = (event: any, newPage: any) => {
    setPage(newPage);
  };

  const handleDeleteAttribute = (row: any) => {

    const data = warning();
    data
      .then((res) => {
        if (res) {
          dispatch(deleteAttribute(row?._id));
        }
      })
      .catch((err) => console.log(err));
  };

  const handleOpenInfo = (row) => {
    router.push('/attributeInfo')
    localStorage.setItem('attributes', JSON.stringify(row));
  };

  const handleEditAttribute = (row: any) => {
    router.push({
      pathname: '/provider/AddAttribute',
      query: { id: row?._id },
    });
    localStorage.setItem('attributes', JSON.stringify(row));
  };

  const attributeTable = [
    {
      Header: 'No',
      Cell: ({ index }: { index: number }) => <span>{index + 1}</span>,
    },
    {
      Header: 'Sub Category',
      Cell: ({ row }: { row: AttributeData }) => (
        <span>{row?.subCategory?.name || '-'}</span>
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
          onClick={() => handleOpenInfo(row)}
        />
      ),
    },
    {
      Header: "Is Active",
      body: "isActive",
      sorting: { type: "client" },
      Cell: ({ row }: { row: AttributeData }) => (
        <ToggleSwitch
          value={row?.isActive}
          onClick={() => {
            const id: any = row?._id;

            dispatch(activeAttribute(id));
          }}
        />
      ),
    },
    {
      Header: 'Action',
      Cell: ({ row }: { row: any }) => (
        <>
          <div className="action-button">
            <Button
              btnIcon={
                <Image src={EditIcon} alt="EditIcon" height={25} width={25} />
              }
              onClick={() => handleEditAttribute(row)}
            />
            <Button
              btnIcon={
                <Image src={TrashIcon} alt="TrashIcon" height={27} width={27} />
              }
              onClick={() => handleDeleteAttribute(row)}
            />
          </div>
        </>
      ),
    },
  ];

  const handleCloseInfo = () => {
    setOpenInfo(false);
  };

  return (
    <>
      {dialogueType === 'attribute' && <AttributeDialogue />}
      {dialogueType === 'editAttribute' && <AttributeDialogue />}

      <div className={`userTable pt-0`} style={{ padding: '20px' }}>

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
                Attributes
              </h5>
          </div>
          <div className=" mt-2 m-sm-0 new-fake-btn px-3">
            <Button
              btnIcon={<AddIcon />}
              btnName={'New'}
              onClick={() => {
                router.push('/provider/AddAttribute');
              }}
            />
          </div>
        </div>
        <div className="mt-3">
          <Table
            data={attributes}
            mapData={attributeTable}
            PerPage={size}
            Page={page}
            type={'client'}
          />
          <div className="mt-3">
            <Pagination
              type={'client'}
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
      {/* For Attributes Info Dialog :- */}
      <Modal
        open={openInfo}
        onClose={handleCloseInfo}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Attribute Info
          </Typography>
          <div className="p-3">
            <div className="row">
              {infoData?.attributes?.length > 0 ? (
                infoData.attributes.map((item, idx) => (
                  <div key={idx} className="col-md-6 mb-3">
                    <div
                      className="card shadow rounded-3 text-center p-3"
                      style={{ backgroundColor: '#FAFAFA' }}
                    >
                      <div className="card-body">
                        <h5 className="fw-bold">{item?.name}</h5>
                        {item?.values?.length > 0 &&
                          item?.values?.map((li, id) => (
                            <ul key={id} className="list-group">
                              <li className="list-group-item my-1">{li}</li>
                            </ul>
                          ))}
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <p className="text-center">No attributes found for this row.</p>
              )}
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <Button
                onClick={handleCloseInfo}
                btnName={'Close'}
                newClass={'btn btn-danger'}
              />
            </div>
          </div>
        </Box>
      </Modal>
    </>
  );
};
Attributes.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};
export default Attributes;
