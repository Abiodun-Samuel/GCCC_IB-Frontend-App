import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import PageMeta from '@/components/common/PageMeta'
import UserInfoCard from '@/components/userProfile/UserInfoCard'
import UserMetaCard from '@/components/userProfile/UserMetaCard'
import UserProfessionalCard from '@/components/userProfile/UserProfessionalCard'
import UserChurchCard from '@/components/userProfile/UserChurchCard'
import { UserIcon } from '@/icons'
import UserAnniversary from '@/components/userProfile/UserAnniversary'
const UserProfilePage = () => {
    return (
        <>
            <PageMeta title="Profile | GCCC Ibadan" />
            <PageBreadcrumb icon={UserIcon} pageTitle="Profile" description={'View and update your personal information and contact details.'} />
            <ComponentCard>
                <UserMetaCard />
                <UserInfoCard />
                <UserProfessionalCard />
                <UserChurchCard />
                <UserAnniversary />
            </ComponentCard>
        </>
    )
}

export default UserProfilePage