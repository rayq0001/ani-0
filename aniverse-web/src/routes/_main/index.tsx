import { HomeScreen } from "@/app/(main)/_features/home/home-screen"
import { createFileRoute } from "@tanstack/react-router"

export const Route = createFileRoute("/_main/")({
    component: HomeScreen,
    // No pendingComponent to avoid loading screen on static deployment
})
