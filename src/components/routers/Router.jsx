import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Header from "../header/Header"
import { MainDashBoard } from "../dashboard/MainDashBoard"
import {Login} from "../../login/Login"
import { AddStudent } from "../student/AddStudent"

const MainRouter = ({children}) => {
    const routesData =createBrowserRouter([
        {
            path:"/login",
            element:<Login/>
        },
        {
            path:"/",
            element :<Header/>,
            children: [
                {
                    path: "/",
                    element :<MainDashBoard/>,
                    errorElement: <div>404 Not Found</div>
                },
                {
                    path:"/addstudent",
                    element:<AddStudent/>,
                    errorElement: <div>404 Not Found</div>
                }
            ]
        }
    ])

    return(
        <React.Fragment>
            <RouterProvider router={routesData}>{children}</RouterProvider>
        </React.Fragment>
    )
}
export default MainRouter