

export const PageHeader = ({heading, description}: {heading: string, description?: string}) => {
    return (
        <>
            <h1 className="md:text-2xl font-bold lg:text-4xl">{heading}</h1>
            <h1>{description}</h1>
        </>
    )
}