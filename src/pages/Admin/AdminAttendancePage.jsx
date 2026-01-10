import { AttendanceIcon } from "@/icons"
import ComponentCard from "../../components/common/ComponentCard"
import PageBreadcrumb from "../../components/common/PageBreadCrumb"
import PageMeta from "../../components/common/PageMeta"
import AdminAttendanceTable from "@/components/admin/attendance/AdminAttendanceTable"
import Button from "@/components/ui/Button"

const AdminAttendancePage = () => {
    return (
        <>
            <PageMeta title="Admin: Attendance | GCCC Ibadan" />
            <PageBreadcrumb icon={AttendanceIcon} pageTitle="Admin: Attendance" description={'Review, filter and manage attendance records for all members.'} />
            <ComponentCard>
                <Button href={'/dashboard/attendance/report'} >Attendance Report</Button>
                <AdminAttendanceTable />
            </ComponentCard>
        </>
    )
}
export default AdminAttendancePage
