import AnyversePage from "@/app/(main)/anyverse/page"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/anyverse/")({
    component: AnyversePage,
})
