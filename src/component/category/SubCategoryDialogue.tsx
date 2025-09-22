import Button from '@/extra/Button';
import Input from '@/extra/Input';
import Selector from '@/extra/Selector';
import {
  getCategories,
} from '@/store/categorySlice';
import { closeDialog } from '@/store/dialogSlice';
import { RootStore, useAppDispatch } from '@/store/store';
import {
  createSubCategory,
  getSubCategories,
  updateSubCategory,
} from '@/store/subcategorySlice';
import { Box, Modal, Typography } from '@mui/material';
import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
const style: React.CSSProperties = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 600,
  backgroundColor: 'background.paper',
  borderRadius: '13px',
  border: '1px solid #C9C9C9',
  boxShadow: '24px',
  padding: '19px',
};

interface ErrorState {
  catName: string;
  subCatName: string;
  categoryId: any;
}
const SubCategoryDialogue = () => {
  const { dialogue, dialogueData, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );
  const { category } = useSelector((state: RootStore) => state.category);


  useEffect(() => {
    const payload: any = {
      start: 1,
      limit: 20,
    };
    dispatch(getSubCategories(payload));
  }, [1, 20]);

  const dispatch = useAppDispatch();
  const [catName, setCatName] = useState<string>();
  const [catData, setCatData] = useState<any[]>([]);
  const [categoryId, setCategoryId] = useState<string>();
  const [subCatName, setSubCatName] = useState<string>();
  const [mongoId, setMongoId] = useState<string>('');
  const [addSubCategoryOpen, setAddSubCategoryOpen] = useState(false);
  
  const [error, setError] = useState({
    catName: '',
    categoryId : '',
    subCatName: '',
  });

  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData._id);
      setCatName(dialogueData?.categoryName);
      setSubCatName(dialogueData.name);
      
      const filteredCategoryId : any = catData
      ?.filter((category) => category.name === dialogueData.categoryName)
      ?.map((category) => category._id); // Assuming you need _id
      setCategoryId(filteredCategoryId);
    }
  }, [dialogueData, catData]);
  

  useEffect(() => {
    if (dialogue) {
      setAddSubCategoryOpen(dialogue);
    }
  }, [dialogue]);

  useEffect(() => {
    setCatData(category);
  }, [category]);

  useEffect(() => {
    const payload:any = {
      start: 1,
      limit: 100,
    };
    dispatch(getCategories(payload))
  },[])



  const handleCloseAddCategory = () => {
    setAddSubCategoryOpen(false);
    dispatch(closeDialog());
    localStorage.setItem('dialogueData', JSON.stringify(dialogueData));
  };

  const handleSubmit = async(e: any) => {
    if (!subCatName) {
      let error = {} as ErrorState;
      if (!catName) error.catName = 'Category is required';
      if (!subCatName) error.subCatName = 'Sub Category is required';
      return setError({ ...error });
    } else {
  

      if (dialogueData) {
        let payload: any = {
          subCategoryId: mongoId,
          categoryId: categoryId[0],
          name: subCatName,
        };

        const editRes = 
       await dispatch(updateSubCategory(payload)).unwrap();
       if(editRes){
        const payload = {
          start : 1,
          limit : 20
        }
        dispatch(getSubCategories(payload))
       }
      } else {
        let addPayload: any = {
          category: categoryId,
          name: subCatName,
        };
        const res = 
       await dispatch(createSubCategory(addPayload)).unwrap()
        if(res){
          const payload = {
            start : 1,
            limit : 20
          }
          dispatch(getSubCategories(payload))
        }
      }

      dispatch(closeDialog());
    }
  };

  return (
    <div>
      <Modal
        open={addSubCategoryOpen}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? 'Edit Sub Category' : 'Add Sub Category'}
          </Typography>
          <form>
            <div
              className="row sound-add-box mb-2"
              style={{ overflowX: 'hidden' }}
            >

              <Selector
                label={'Category'}
                selectValue={categoryId}
                placeholder={'Enter Category...'}
                selectData={catData}
                selectId={true}
                errorMessage={error.categoryId && error.categoryId}
                isdisabled={dialogueData ? true : false}
                onChange={(e) => {
                  setCategoryId(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      categoryId: `Category Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      categoryId: '',
                    });
                  }
                }}
              />
            </div>
            <div className="row sound-add-box" style={{ overflowX: 'hidden' }}>
              <Input
                type={'text'}
                label={'Sub Category Name'}
                value={subCatName}
                errorMessage={error.subCatName && error.subCatName}
                onChange={(e) => setSubCatName(e.target.value)}
              />
              {error.subCatName && (
                <p className="text-danger">{error.subCatName}</p>
              )}
            </div>
            <div className="mt-3 d-flex justify-content-end">
              <Button
                onClick={handleCloseAddCategory}
                btnName={'Close'}
                newClass={'close-model-btn'}
              />
              <Button
                onClick={handleSubmit}
                btnName={dialogueData ? 'Update' : 'Submit'}
                type={'button'}
                newClass={'submit-btn'}
                style={{
                  borderRadius: '0.5rem',
                  width: '80px',
                  marginLeft: '10px',
                }}
              />
            </div>
          </form>
        </Box>
      </Modal>
    </div>
  );
};

export default SubCategoryDialogue;
