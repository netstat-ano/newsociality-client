import {
    configureStore,
    PreloadedState,
    combineReducers,
} from "@reduxjs/toolkit";
import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import user from "./user";
const store = configureStore({
    reducer: {
        user: user.reducer,
    },
});

export function setupStore(preloadedState?: PreloadedState<RootState>) {
    return store;
}
const rootReducer = combineReducers({
    user: user.reducer,
});
export type RootState = ReturnType<typeof rootReducer>;
export type AppStore = ReturnType<typeof setupStore>;
export type AppDispatch = typeof store.dispatch;
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
export default store;
