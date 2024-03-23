import Image from "next/image";
const TopBarAuth = () => {
    return (
        <div className="flex items-center justify-between px-8 pb-4 sm:px-16 sm:py-5 lg:px-28">
            <div className="flex items-center gap-x-2 py-10">
                <Image src={"/logo.svg"} width={35} height={45} alt={"logo"} />
                <span className="text-2xl font-semibold sm:text-3xl">Zeus</span>
            </div>
        </div>
    )
}
export default TopBarAuth