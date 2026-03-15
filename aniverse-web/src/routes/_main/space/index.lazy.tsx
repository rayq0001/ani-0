import SpacePage from "@/app/(main)/space/page"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/space/")({
    component: SpacePage,
})
