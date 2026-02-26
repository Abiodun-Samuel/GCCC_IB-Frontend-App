import { memo } from "react"
import PageMeta from "@/components/common/PageMeta"
import PageBreadcrumb from "@/components/common/PageBreadCrumb"
import ComponentCard from "@/components/common/ComponentCard"
import UserRedeemableItemsPageDetails from "@/components/redeemable-items/UserRedeemableItemsPageDetails"
import { Gift } from "lucide-react"

const UserRedeemPage = () => {

    return (
        <>
            <PageMeta title="Redeem Rewards | GCCC Ibadan" />
            <PageBreadcrumb
                icon={Gift}
                pageTitle="Redeem Rewards"
                description="Use your reward points to redeem available items"
            />
            <ComponentCard>
                <UserRedeemableItemsPageDetails />
            </ComponentCard>
        </>
    )
}

export default memo(UserRedeemPage)