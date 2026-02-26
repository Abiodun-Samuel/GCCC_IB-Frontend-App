import { memo } from "react"

import { AdminIcon } from "@/icons"
import PageMeta from "@/components/common/PageMeta"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import AdminRedeemableItemsList from "@/components/redeemable-items/AdminRedeemableItemsList"
import ComponentCard from "@/components/common/ComponentCard"

const AdminRedeemableItemsPage = () => {

    return (
        <>
            <PageMeta title="Admin: Redeemable Items | GCCC Ibadan" />

            <PageBreadcrumb
                icon={AdminIcon}
                pageTitle="Admin: Redeemable Items"
                description="Manage reward items and track user redemptions"
            />

            <ComponentCard>
                <AdminRedeemableItemsList />
            </ComponentCard>
        </>
    )
}

export default memo(AdminRedeemableItemsPage)