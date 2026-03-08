import { CustomBackgroundImage } from "@/app/(main)/_features/custom-ui/custom-background-image"
import Template from "@/app/template"
import { AppErrorBoundary } from "@/components/shared/app-error-boundary"
import { NotFound } from "@/components/shared/not-found"

import { QueryClient } from "@tanstack/react-query"
import { createRootRouteWithContext, Outlet } from "@tanstack/react-router"

import { createStore } from "jotai"
import React from "react"

export const Route = createRootRouteWithContext<{
    queryClient: QueryClient
    store: ReturnType<typeof createStore>
}>()({
    component: () => (
        <Template>
            <CustomBackgroundImage />
            <Outlet />
            {/*<TanStackRouterDevtools />*/}
        </Template>
    ),
    // No pendingComponent to avoid loading screen on static deployment
    errorComponent: AppErrorBoundary,
    notFoundComponent: NotFound,
})
