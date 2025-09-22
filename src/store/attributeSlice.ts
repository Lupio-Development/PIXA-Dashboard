import { apiInstanceFetch } from "@/util/ApiInstance";
import { setToast } from "@/util/toastServices";
import { PayloadAction, createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import { debug } from "console";

interface UserState {
  attributes: any[];
  subCategory: any[];
  isLoading: boolean;
  isSkeleton: boolean;
}

const initialState: UserState = {
  attributes: [],
  subCategory: [],
  isLoading: false,
  isSkeleton: false,
};

interface AllUsersPayload {
  start?: number;
  limit?: number;
  search: string;
  startDate?: string;
  endDate?: string;
  type?: string;
  meta?: any;
  id?: any;
  data: any;
  attrId: any;
  payload: any;
  formData: any;
}

export const getAttributes: any = createAsyncThunk(
  "admin/attributes/fetchAttributes",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(`admin/attributes/fetchAttributes`);
  }
);

export const getSubCategory: any = createAsyncThunk(
  "admin/attributes/getActiveSubCategories",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.get(`admin/attributes/getActiveSubCategories`);
  }
);

export const createAttribute = createAsyncThunk(
  "admin/attributes/createCategoryWithAttributes",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.post("admin/attributes/createAttributes", payload);
  }
);

export const deleteAttribute = createAsyncThunk(
  "admin/attributes/deleteAttribute",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.delete(`admin/attributes/deleteAttribute?attributeId=${payload}`);
  }
);

export const updateAttribute: any = createAsyncThunk(
  "admin/attributes/modifyAttributes?attributeId",
  async (payload: AllUsersPayload | undefined) => {
    return apiInstanceFetch.patch(
      `admin/attributes/modifyAttributes?attributeId=${payload?.id}`,
      payload?.data
    );
  }
);

export const activeAttribute = createAsyncThunk(
  "admin/attributes/toggleAttributeStatus",
  async (payload: AllUsersPayload | undefined) => {
    return axios.patch(`admin/attributes/toggleAttributeStatus?attributeId=${payload}`);
  }
);

const attributeSlice = createSlice({
  name: "attribute",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(getAttributes.pending, (state, action: PayloadAction<any>) => {
      state.isSkeleton = true;
      state.isLoading = true
    });
    builder.addCase(
      getAttributes.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        state.attributes = action.payload.attributes;
        state.isLoading = false

      }
    );
    builder.addCase(getSubCategory.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
    });

    builder.addCase(getSubCategory.pending, (state, action: PayloadAction<any>) => {
      state.isSkeleton = true;
      state.isLoading = true
    });
    builder.addCase(
      getSubCategory.fulfilled,
      (state, action: PayloadAction<any>) => {

        state.isLoading = false;
        state.subCategory = action.payload.subCategories;
        state.isLoading = false

      }
    );
    builder.addCase(getAttributes.rejected, (state, action: PayloadAction<any>) => {
      state.isLoading = false;
    });

    builder.addCase(
      createAttribute.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );
    builder.addCase(
      createAttribute.fulfilled,
      (state, action: PayloadAction<any>) => {
        state.isLoading = false;
        if (action.payload.status) {
          state.attributes = action.payload.attributes;
          setToast("success", "Attribute Added Successfully");
        } else {
          setToast("error", action.payload.message);
        }
      }
    );


    builder.addCase(createAttribute.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(
      deleteAttribute.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(deleteAttribute.fulfilled, (state, action: any) => {
      if (action?.payload?.status) {
        state.attributes = state.attributes.filter(
          (attributes) => attributes?._id !== action?.meta?.arg
        );
        setToast("success", "Attribute Delete Successfully");
      }
      state.isLoading = false;
    });

    builder.addCase(deleteAttribute.rejected, (state, action) => {
      state.isLoading = false;
    });

    builder.addCase(updateAttribute.pending, (state) => {
      state.isLoading = true;
    });

    builder.addCase(updateAttribute.fulfilled, (state, action: PayloadAction<any>) => {
      if (action?.payload?.status) {
        const updatedAttributesArray = action.payload.attributes?.attributes;
        if (!Array.isArray(state.attributes) || state.attributes.length === 0) {
          console.warn("state.attributes is empty or not an array!");
          return;
        }

        // Find the parent attribute object
        const parentIndex = state.attributes.findIndex(attr => attr._id === action.payload.attributes._id);

        if (parentIndex !== -1) {
          updatedAttributesArray?.forEach((updatedAttribute) => {
            const attrIndex = state.attributes[parentIndex].attributes.findIndex(
              subAttr => subAttr._id === updatedAttribute?._id
            );
            if (attrIndex !== -1) {
              // ✅ Properly update the attribute
              state.attributes[parentIndex].attributes[attrIndex] = {
                ...state.attributes[parentIndex].attributes[attrIndex],
                ...updatedAttribute
              };

            } else {
              console.warn(`Attribute with _id ${updatedAttribute?._id} not found inside attributes!`);
            }
          });

          // ✅ Store updated attributes in localStorage
          localStorage.setItem("attributes", JSON.stringify(state.attributes));
        } else {
          console.warn(`Parent attribute with _id ${action.payload.attributes._id} not found in state.attributes!`);
        }

        // window.location.reload()
        setToast("success", "Attributes Updated Successfully");
      }

      state.isLoading = false;
    });







    builder.addCase(updateAttribute.rejected, (state) => {
      state.isLoading = false;
    });

    builder.addCase(
      activeAttribute.pending,
      (state, action: PayloadAction<any>) => {
        state.isLoading = true;
      }
    );

    builder.addCase(
      activeAttribute.fulfilled,
      (state, action: PayloadAction<any>) => {
        if (action?.payload?.data?.status) {
          const updatedAttr = action.payload.data.data;
          const attrIndex = state.attributes.findIndex(
            (attribute) => attribute?._id === updatedAttr?._id
          );
          if (attrIndex !== -1) {
            state.attributes[attrIndex].isActive = updatedAttr.isActive;
          }
          setToast("success", "Attribute Status Updated Successfully");
        }
        state.isLoading = false;
      }
    );

    builder.addCase(activeAttribute.rejected, (state, action) => {
      state.isLoading = false;
    });
  },
});

export default attributeSlice.reducer;
