import Button from '@/extra/Button';
import Input, { Textarea } from '@/extra/Input';
import { closeDialog } from '@/store/dialogSlice';
import { createPromocode, getPromocodes, updatePromoCode } from '@/store/promocodeSlice';
import { RootStore, useAppDispatch } from '@/store/store';
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
  promoCode: any;
  discount: any;
  minOrder: any;
  conditions: any;
  discountType: any;
}
const PromocodeDialogue = () => {
  const hasPermission = useSelector(
    (state: RootStore) => state.admin.admin.flag
  );

  const { dialogue, dialogueData, dialogueType } = useSelector(
    (state: RootStore) => state.dialogue
  );

  useEffect(() => {
    dispatch(getPromocodes());
  }, []);

  const dispatch = useAppDispatch();
  const [promoCode, setPromoCode] = useState<any>();
  const [discount, setDiscount] = useState<number>();
  const [discountType, setDiscountType] = useState<any>();
  const [minOrder, setMinOrder] = useState<number>();
  const [conditions, setConditions] = useState<any>();
  const [mongoId, setMongoId] = useState<string>('');
  const [addPromoOpen, setAddPromoOpen] = useState(false);


  const [error, setError] = useState<any>({
    promoCode: '',
    discount: '',
    discountType: '',
    minOrder: '',
    conditions: '',
  });

  useEffect(() => {
    if (dialogue) {
      setAddPromoOpen(dialogue);
    }
  }, [dialogue]);

  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData._id);
      setPromoCode(dialogueData.promoCode);
      setDiscount(dialogueData.discount);
      setDiscountType(dialogueData.discountType);
      setMinOrder(dialogueData.minOrderValue);
      setConditions(dialogueData.conditions?.join(','));
    }
  }, [dialogueData]);

  const handleCloseAddCategory = () => {
    setAddPromoOpen(false);
    dispatch(closeDialog());
    localStorage.setItem('dialogueData', JSON.stringify(dialogueData));
  };

  const types = [
    { value: 1, name: 'Flat' },
    { value: 2, name: 'Percentage' },
  ];

  const handleSubmit = (e: any) => {

    if (!promoCode || !discount || !discountType || !minOrder || !conditions) {
      let error = {} as ErrorState;
      if (!promoCode) error.promoCode = 'Promo Code is required';
      if (!discount) error.discount = 'Discount is required';
      if (!discountType) error.discountType = 'Discount Type is required';
      if (!minOrder) error.minOrder = 'Minimum Order Value is required';
      if (!conditions) error.conditions = 'Conditions are required';
      return setError({ ...error });
    } else {
  
      let payload: any = {
          promoCode: promoCode,
          discount: Number(discount),
          discountType: Number(discountType),
          minOrderValue: Number(minOrder),
          conditions: conditions,
        };
        
        if (dialogueData) {
            let editpayload: any = {
                id:mongoId,
                promoCode: promoCode,
                discount: Number(discount),
                discountType: Number(discountType),
                minOrderValue: Number(minOrder),
                conditions: conditions,
              };
        dispatch(updatePromoCode(editpayload));
      } else {
        dispatch(createPromocode(payload));
      }
      dispatch(closeDialog());
    }
  };

  return (
    <div>
      <Modal
        open={addPromoOpen}
        onClose={handleCloseAddCategory}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style} className="create-channel-model">
          <Typography id="modal-modal-title" variant="h6" component="h2">
            {dialogueData ? 'Edit Promo Code' : 'Add Promo Code'}
          </Typography>
          <form>
            <div className="row sound-add-box" style={{ overflowX: 'hidden' }}>
              <Input
                label={'Promo Code'}
                placeholder={'Enter Promocode'}
                value={promoCode}
                errorMessage={error.promoCode && error.promoCode}
                onChange={(e) => {
                  setPromoCode(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      promoCode: `Promo Code Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      promoCode: '',
                    });
                  }
                }}
              />
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  marginTop: '5px',
                }}
              >
                Discount Type
              </label>
              <select
                name="discountType"
                className="rounded-5"
                style={{
                  margin: '5px 0px',
                  border: '1px solid #c9c9c9',
                  fontSize: '14px',
                  padding : "10px 10px",
                  marginLeft : "13px",
                  width : "95%"
                }}
                id="discountType"
                value={discountType}
                onChange={(e) => {
                  setDiscountType(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      discountType: 'Discount Type is Required !',
                    });
                  } else {
                    setError({
                      ...error,
                      discountType: '',
                    });
                  }
                }}
              >
                <option value="" disabled selected>
                  --Select Type--
                </option>
                {types?.map((data) => {
                  return <option value={data?.value}>{data?.name}</option>;
                })}
              </select>

              <Input
                label={'Discount Amount'}
                placeholder={'Discount'}
                value={discount}
                errorMessage={error.discount && error.discount}
                onChange={(e) => {
                  setDiscount(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      discount: `Discount Is Required`,
                    });
                  }else if (discountType == 2 && e.target.value > 100){
                    return setError({
                      ...error,
                      discount: `Discount amount can not more than 100`,
                    });
                  } 
                  else {
                    return setError({
                      ...error,
                      discount: '',
                    });
                  }
                }}
              />

              <Input
                label={'Minimum Order Value'}
                placeholder={'Enter Min. Order Value'}
                value={minOrder}
                errorMessage={error.minOrder && error.minOrder}
                onChange={(e) => {
                  setMinOrder(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      minOrder: `Minimum Order Value Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      minOrder: '',
                    });
                  }
                }}
              />
              <label
                style={{
                  fontSize: '14px',
                  fontWeight: '500',
                  marginTop: '5px',
                }}
              >
                Conditions
              </label>
              <textarea
                placeholder={'Write Conditions'}
                value={conditions}
                style={{ margin: '5px 10px', fontSize: '14px' , width : "95%" }}
                onChange={(e) => {
                  setConditions(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      conditions: `Conditions Are Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      conditions: '',
                    });
                  }
                }}
              />
              <p className='text-danger'>Note : You can add multiple conditions separate by comma (,)</p>
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

export default PromocodeDialogue;
