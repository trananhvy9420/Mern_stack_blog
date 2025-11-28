import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
interface PostUiState {
  filter: {
    userId: number | null;
    search: string;
  };
  viewMode: "grid" | "list";
  isCreateModalOpen: boolean;
}

const initialState: PostUiState = {
  filter: {
    userId: null,
    search: "",
  },
  viewMode: "list",
  isCreateModalOpen: false,
};

const postUISlice = createSlice({
  name: "postUi",
  initialState,
  reducers: {
    // Action để thay đổi bộ lọc
    setSearchFilter: (state, action: PayloadAction<string>) => {
      state.filter.search = action.payload;
    },
    setUserIdFilter: (state, action: PayloadAction<number | null>) => {
      state.filter.userId = action.payload;
    },
    // Action để thay đổi giao diện
    toggleViewMode: (state) => {
      state.viewMode = state.viewMode === "list" ? "grid" : "list";
    },
    // Action mở/đóng modal
    toggleCreateModal: (state, action: PayloadAction<boolean>) => {
      state.isCreateModalOpen = action.payload;
    },
  },
});

export const {
  setSearchFilter,
  setUserIdFilter,
  toggleViewMode,
  toggleCreateModal,
} = postUISlice.actions;
export default postUISlice.reducer;
