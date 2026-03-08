import Page from "@/app/(main)/ai-tools/page"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/ai-tools/")({
    component: Page,
})
