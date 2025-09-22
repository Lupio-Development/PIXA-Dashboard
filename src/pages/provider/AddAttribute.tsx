import RootLayout from '@/component/layout/Layout';
import Title from '@/extra/Title';
import { updateAttribute, createAttribute, getSubCategory } from '@/store/attributeSlice';
import { RootStore, useAppDispatch } from '@/store/store';
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Button from '@/extra/Button';
import AddIcon from "@mui/icons-material/Add";
import Input from '@/extra/Input';
import { setToast } from '@/util/toastServices';
import Selector from '@/extra/Selector';
import { useSelector } from 'react-redux';

type AttributeType = {
  _id: string;
  name: string;
  values: string[];
};

type Attribute = {
  name: string;
  values: string[];
  _id?: string | string[];
};



const AddAttribute = () => {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { id } = router.query; // Get ID from URL
  const [categoryName, setCategoryName] = useState<string>('');
  const [attributes, setAttributes] = useState<{ name: string; values: string[] }[]>([]);
  const [error, setError] = useState<any>({ categoryName: '', attributes: [] });
  const [fakeUserId, setFakeUserId] = useState<string>();
  const [fakeUserDataGet, setFakeUserDataGet] = useState<any[]>([]);
  const { subCategory } = useSelector((state: RootStore) => state.attribute);


  useEffect(() => {
    dispatch(getSubCategory())
  }, [])

  const [storedData, setStoredData] = useState(() => typeof window !== "undefined" && localStorage.getItem('attributes'));
  useEffect(() => {
    if (id && storedData) {
      const parsedData = JSON.parse(storedData);
  
      setFakeUserId(parsedData?.subCategory?._id);
      setCategoryName(parsedData?.category);
      setAttributes(parsedData?.attributes);
    }
  }, [id, storedData]); // Now storedData is reactive
  
  // Update storedData whenever localStorage changes
  const updateStorage = () => {
    setStoredData(localStorage.getItem('attributes'));
  };
  

  // Handle Attribute Change
  const handleAttributeChange = (index: number, field: string, value: any) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index] = { ...updatedAttributes[index], [field]: value };
    setAttributes(updatedAttributes);
  };

  // Handle Attribute Values Change
  const handleValuesChange = (index: number, value: string) => {
    const updatedAttributes = [...attributes];
    updatedAttributes[index].values = value.split(',').map((v) => v.trim());
    setAttributes(updatedAttributes);
  };

  // Add New Attribute
  const addAttribute = () => {
    setAttributes([...attributes, { name: '', values: [] , _id  : id} as Attribute]);
  };

  // Remove Attribute
  const removeAttribute = (index: number) => {
    setAttributes(attributes.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!fakeUserId || attributes.some((attr) => !attr.name || !attr.values.length)) {
      setError({
        categoryName: fakeUserId ? '' : 'SubCategory Name is required!',
        attributes: attributes.map((attr) => ({
          name: attr.name ? '' : 'Attribute Name is required!',
          values: attr.values.length ? '' : 'At least one value is required!',
        })),
      });
      return;
    }

    if (attributes.length === 0) {
      setError({
        categoryName: '',
        attributes: [{ name: '', values: [] }],
      });
      setToast("error", "Please add atleast one attribute.")
      return;
    }

    const payload: any = {
      subCategoryId: fakeUserId,
      attributes: attributes.map((attr) => ({
        name: attr.name,
        values: attr.values,
        _id: (attr as any)._id,
      })),
    };

    const editPayload = {
      attributes: attributes.map((attr) => ({
        name: attr.name,
        values: attr.values,
        _id: (attr as any)._id,
      })),
    };
    

    if (id) {
    const response =  await dispatch(updateAttribute({ data: editPayload, id })).unwrap();

    if(response){
      setToast("success", "Attributes Updated Successfully");
    }

    localStorage.setItem("attributes" , JSON.stringify(response.attributes.attributes))

      router.push('/attributes'); // Redirect to attributes list
      updateStorage();
    } else {
      dispatch(createAttribute(payload));
      router.push('/attributes');
    }
  };

  return (
    <div className="p-3">
      <div className="d-flex justify-content-between py-3">
        <h4 className='ms-2'>{!id ? `Add Attributes` : `Update Attributes`}</h4>
        <div className="betBox">
          <div className="new-fake-btn">
            
              <Button
                btnIcon={<AddIcon />}
                btnName={"Attribute"}
                style={{width : "120px"}}
                onClick={addAttribute} />
          
          </div>
        </div>
      </div>
      <div className="card p-3">
        <div className="card-body">
          <div className="row mb-3">

            <div className="col-12 col-lg-12 col-sm-6  mt-2 country-dropdown">
              <Selector
                label={"Sub Category"}
                selectValue={fakeUserId}
                placeholder={"Enter SubCategories..."}
                selectData={subCategory}
                selectId={true}
                errorMessage={error.fakeUserId && error.fakeUserId}
                disabled={id ? true : false}
                onChange={(e) => {
                  setFakeUserId(e.target.value);
                  if (!e.target.value) {
                    return setError({
                      ...error,
                      fakeUserId: `Subcategory Is Required`,
                    });
                  } else {
                    return setError({
                      ...error,
                      fakeUserId: "",
                    });
                  }
                }}
              />
            </div>
            {error.categoryName && <p className="text-danger">{error.categoryName}</p>}
          </div>
          {/* Render attribute cards */}
          {attributes?.map((attr, index) => (
            <>
              <h4 className=''>Attribute {index + 1}</h4>
              <div key={index} className="row mb-3 shadow-md p-3 align-items-center" style={{ backgroundColor: '#fafafa', borderRadius: "24px" }}>
                <div className="col-md-5">
                  <Input
                    label={'Attribute Name'}
                    type="text"
                    value={attr.name}
                    onChange={(e) => handleAttributeChange(index, 'name', e.target.value)}
                    className="form-control"
                  />
                </div>
                <div className="col-md-5">
                  {/* <label>Attribute Values</label> */}
                  <Input
                    label={'Attribute Values'}
                    type="text"
                    value={attr.values.join(',')}
                    onChange={(e) => handleValuesChange(index, e.target.value)}
                    className="form-control"
                  />
                  <span className='text-danger'>

                    Note : Enter details Coma (,) separated string.
                  </span>

                </div>
                <div className="col-md-2 ">
                  <button className="btn btn-danger p-2" style={{ backgroundColor: '#FE0929', color: 'white' }} onClick={() => removeAttribute(index)}>
                    Remove
                  </button>
                </div>
              </div>
            </>
          ))}
          <button className="btn btn-success" onClick={handleSubmit}>
            {!id ? `Add Attributes` : `Update Attributes`}
          </button>
        </div>
      </div>
    </div>
  );
};

AddAttribute.getLayout = function getLayout(page: React.ReactNode) {
  return <RootLayout>{page}</RootLayout>;
};

export default AddAttribute;
