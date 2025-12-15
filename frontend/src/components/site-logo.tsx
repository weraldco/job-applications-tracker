import Image from "next/image";
import Link from "next/link";

const SiteLogo = ({className}: {className?: string}) => {
	return (
		// Logo for the sites
		<Link href="/" className={`flex items-center space-x-2`}>
			<Image src="/images/logo/jobstashr-logo-horizontal.svg" width="200" height="200" alt="JobStashr Logo" className={` ${className}`} priority></Image>
		</Link>)
};

export default SiteLogo;
 