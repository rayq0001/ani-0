import AIServicesPage from "@/app/(main)/ai-services/page"
import { createLazyFileRoute } from "@tanstack/react-router"

export const Route = createLazyFileRoute("/_main/ai-services/")({
    component: AIServicesPage,
})
