import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus, BarChart2, QrCode, Maximize2 } from 'lucide-react';
import PageMeta from '@/components/common/PageMeta';
import PageBreadcrumb from '@/components/common/PageBreadCrumb';
import AdminFirstTimersTable from '@/components/admin/firsttimer/AdminFirstTimersTable';
import { Units } from '@/utils/constant';
import { useHasUnit } from '@/hooks/useUnitPermission';
import Modal from '@/components/ui/modal/Modal';
import ComponentCard from '@/components/common/ComponentCard';

const FirstTimerPage = () => {
    const navigate = useNavigate();
    const hasFollowUp = useHasUnit(Units.FOLLOW_UP);
    const [qrOpen, setQrOpen] = useState(false);

    useEffect(() => {
        if (hasFollowUp === false) navigate('/dashboard', { replace: true });
    }, [hasFollowUp, navigate]);

    if (hasFollowUp !== true) return null;

    return (
        <>
            <PageMeta title="First Timers | GCCC Ibadan" />

            <Modal
                isOpen={qrOpen}
                onClose={() => setQrOpen(false)}
                title="Welcome Form QR Code"
                description="Scan with your phone camera to open the First Timer Welcome Form"
                maxWidth="max-w-lg"
            >
                <div className="flex flex-col items-center gap-4">
                    <div className="rounded-xl overflow-hidden border border-gray-100 dark:border-gray-700 bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
                        <img
                            src="/images/welcome-form.png"
                            alt="First Timer Welcome QR Code"
                            className="w-full h-full object-contain p-2"
                            onError={e => {
                                e.currentTarget.style.display = 'none';
                                e.currentTarget.nextSibling.style.display = 'flex';
                            }}
                        />
                        <div className="hidden w-full h-full flex-col items-center justify-center gap-2 text-gray-300 dark:text-gray-600">
                            <QrCode className="w-14 h-14" />
                            <span className="text-xs">Add QR PNG to /public</span>
                        </div>
                    </div>
                </div>
            </Modal>

            <PageBreadcrumb
                pageTitle="First Timers"
                description="Log, track, and manage all first timer's records, follow-up process and assign care tasks."
            />
            <ComponentCard>
                {/* ── Action Bar ── */}
                <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl px-5 py-4 mb-5 flex flex-wrap items-center justify-between gap-4">
                    <div className="flex items-center gap-3 flex-wrap">
                        <Link
                            to="/first-timer/welcome"
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold text-white transition hover:opacity-90 active:scale-95"
                            style={{ backgroundColor: '#0998d5' }}
                        >
                            <UserPlus className="w-4 h-4" />
                            First Timer Welcome
                        </Link>

                        <Link
                            to="/dashboard/first-timers/report"
                            className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold border border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-300 bg-white dark:bg-gray-800 hover:border-gray-300 dark:hover:border-gray-500 hover:text-gray-800 dark:hover:text-gray-100 transition active:scale-95"
                        >
                            <BarChart2 className="w-4 h-4" />
                            View Report
                        </Link>
                    </div>

                    {/* QR Trigger */}
                    <button
                        onClick={() => setQrOpen(true)}
                        className="inline-flex items-center gap-2.5 rounded-xl px-4 py-2.5 border border-dashed text-sm font-medium transition hover:bg-gray-50 dark:hover:bg-gray-700/50 active:scale-95"
                        style={{ borderColor: '#0998d5', color: '#0998d5' }}
                    >
                        <div
                            className="w-7 h-7 rounded overflow-hidden border flex items-center justify-center bg-white dark:bg-gray-900 flex-shrink-0"
                            style={{ borderColor: '#0998d5' }}
                        >
                            <img
                                src="/qr-first-timer-welcome.png"
                                alt=""
                                className="w-full h-full object-contain"
                                onError={e => {
                                    e.currentTarget.style.display = 'none';
                                    e.currentTarget.nextSibling.style.display = 'flex';
                                }}
                            />
                            <div className="hidden w-full h-full items-center justify-center">
                                <QrCode className="w-4 h-4 text-gray-300 dark:text-gray-600" />
                            </div>
                        </div>
                        Welcome Form QR
                        <Maximize2 className="w-3.5 h-3.5 opacity-60" />
                    </button>
                </div>
                <AdminFirstTimersTable />
            </ComponentCard>
        </>
    );
};

export default FirstTimerPage;