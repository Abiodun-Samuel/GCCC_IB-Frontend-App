import FirstTimersAnnualReport from '@/components/admin/firsttimer/FirstTimersAnnualReport'
import ComponentCard from '@/components/common/ComponentCard'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import PageMeta from '@/components/common/PageMeta'
import { FormIcon, Users } from 'lucide-react'

const AdminFirstTimerReportPage = () => {
    return (
        <>
            <PageMeta title="First-Timers Annual Report | GCCC Ibadan" />
            <PageBreadcrumb
                icon={Users}
                pageTitle="First-Timers Annual Report"
                description="Complete overview and analytics of all first-time visitors throughout the year."
            />
            <ComponentCard>
                <FirstTimersAnnualReport />
            </ComponentCard>
        </>
    )
}

export default AdminFirstTimerReportPage