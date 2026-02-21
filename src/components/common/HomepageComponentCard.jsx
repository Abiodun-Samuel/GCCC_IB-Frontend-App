import AnimatedBackground from "@/components/common/AnimatedBackground"

const HomepageComponentCard = ({ children }) => {
    return (
        <>
            <AnimatedBackground />
            <div className='mt-40 relative mb-6 flex flex-col gap-6 justify-center p-3'>
                {children}
            </div>
        </>
    )
}

export default HomepageComponentCard