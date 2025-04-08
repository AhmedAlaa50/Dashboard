// store/authSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit"
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
} from "firebase/auth"
import { auth } from "@/lib/firebase"

interface AuthState {
  user: any
  loading: boolean
  error: string | null
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
}

export const signUp = createAsyncThunk(
  "auth/signUp",
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await createUserWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }
)

export const logIn = createAsyncThunk(
  "auth/logIn",
  async ({ email, password }: { email: string; password: string }) => {
    const userCredential = await signInWithEmailAndPassword(auth, email, password)
    return userCredential.user
  }
)

export const logOut = createAsyncThunk("auth/logOut", async () => {
  await signOut(auth)
})

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(signUp.pending, (state) => {
        state.loading = true
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Sign up failed"
      })

      .addCase(logIn.pending, (state) => {
        state.loading = true
      })
      .addCase(logIn.fulfilled, (state, action) => {
        state.loading = false
        state.user = action.payload
        state.error = null
      })
      .addCase(logIn.rejected, (state, action) => {
        state.loading = false
        state.error = action.error.message || "Login failed"
      })

      .addCase(logOut.fulfilled, (state) => {
        state.user = null
      })
  },
})

// Selector to get the signed-in user's email
export const selectUserEmail = (state: { auth: AuthState }) => state.auth.user?.email || null

export default authSlice.reducer
