import Page from "@/app/(main)/comics/page"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/comics/")({
    component: Page,
})

