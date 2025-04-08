import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit"

export type Results = {
    name: string
    id: string
    email: string
    gender: string
    age: number
}

interface UsersState {
    users: Results[]
    currentPage: number
    isLoading: boolean
    error: string | null
    sorting: any[]
    globalFilter: string
    columnFilters: Record<string, string>
}

const initialState: UsersState = {
    users: [],
    currentPage: 1,
    isLoading: false,
    error: null,
    sorting: [],
    globalFilter: "",
    columnFilters: {},
}

export const fetchUsers = createAsyncThunk(
    "users/fetchUsers",
    async (page: number) => {
        const response = await fetch(
            `https://randomuser.me/api/?results=10&page=${page}`
        )
        const data = await response.json()
        return data.results.map((user: any) => ({
            name: `${user.name.title} ${user.name.first} ${user.name.last}`,
            id: user.login.username,
            email: user.email,
            gender: user.gender,
            age: user.dob.age,
        }))
    }
)

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {
        nextPage(state) {
            state.currentPage++
        },
        previousPage(state) {
            state.currentPage = Math.max(1, state.currentPage - 1)
        },
        setSorting(state, action: PayloadAction<any[]>) {
            state.sorting = action.payload
        },
        setGlobalFilter(state, action: PayloadAction<string>) {
            state.globalFilter = action.payload
        },
        setColumnFilter(
            state,
            action: PayloadAction<{ columnId: string; value: string }>
        ) {
            state.columnFilters[action.payload.columnId] = action.payload.value
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUsers.pending, (state) => {
                state.isLoading = true
                state.error = null
            })
            .addCase(fetchUsers.fulfilled, (state, action) => {
                state.users = action.payload
                state.isLoading = false
            })
            .addCase(fetchUsers.rejected, (state, action) => {
                state.error = action.error.message || "Failed to fetch users"
                state.isLoading = false
            })
    },
})

export const {
    nextPage,
    previousPage,
    setSorting,
    setGlobalFilter,
    setColumnFilter,
} = userSlice.actions

export default userSlice.reducer
