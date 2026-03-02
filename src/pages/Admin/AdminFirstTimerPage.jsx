import PageMeta from '@/components/common/PageMeta'
import PageBreadcrumb from '@/components/common/PageBreadCrumb'
import ComponentCard from '@/components/common/ComponentCard'
import AdminFirstTimersTable from '@/components/admin/firsttimer/AdminFirstTimersTable'
import { Link } from 'react-router-dom'

const AdminFirstTimerPage = () => {
    return (
        <>
            <PageMeta title="Admin: First Timers | GCCC Ibadan" />
            <PageBreadcrumb pageTitle="Admin: First Timers" description={'Log, track, and manage all first timer`s records, follow-up process and assign care tasks.'} />
            <ComponentCard>
                <div className='flex gap-5'>
                    <Link className='underline text-blue-500' to='/dashboard/first-timers/report'> First Timer Report</Link>
                </div>
                <AdminFirstTimersTable />
            </ComponentCard>
        </>
    )
}

export default AdminFirstTimerPage