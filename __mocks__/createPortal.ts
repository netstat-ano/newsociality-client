import { ReactPortal, ReactNode } from "react";
import ReactDOM from "react-dom";
export default (node: ReactNode): ReactPortal => node as ReactPortal;
