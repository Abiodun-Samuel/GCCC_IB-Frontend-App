const HomepageComponentCard = ({ children }) => {
    return (
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-hidden">
            <div className='max-w-7xl mx-auto relative pt-10 md:pt-14'>
                {children}
            </div>
        </div>
    )
}

export default HomepageComponentCard