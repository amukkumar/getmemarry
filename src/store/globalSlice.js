import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    user: "null",
    token: "null",
    name: "null",
    resource: "null",
    partner: "null"
};

export const globalSlice = createSlice({
    name: "Getmemarry",
    initialState,
    reducers: {
        setUser: (state, user) => {
            state.user = user;
        },

        setToken: (state, token) => {
            state.token = token;
        },

        setName: (state, name) => {
            state.name = name;
        },

        setResource: (state, resource) => {
            state.resource = resource;
        },
        setPartner: (state, partner) => {
            state.partner = partner;
        },
    },
});

export const { setUser } = globalSlice.actions;
export const { setToken } = globalSlice.actions;
export const { setName } = globalSlice.actions;
export const { setResource } = globalSlice.actions;
export const { setPartner } = globalSlice.actions;

export default globalSlice.reducer;