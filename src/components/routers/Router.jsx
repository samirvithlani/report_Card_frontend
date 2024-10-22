import React from "react"
import { createBrowserRouter, RouterProvider } from "react-router-dom"
import Header from "../header/Header"
import { MainDashBoard } from "../dashboard/MainDashBoard"

const MainRouter = ({children}) => {
    const routesData =createBrowserRouter([
        {
            path:"/",
            element :<Header/>,
            children: [
                {
                    path: "/",
                    element :<MainDashBoard/>,
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