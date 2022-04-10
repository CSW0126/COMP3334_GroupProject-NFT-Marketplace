import classNames from "classnames";
import Link from "next/link";
import { useRouter } from "next/router";
import { ReactNode } from "react";
import useSigner from "state/signer";

const NavBar = () => {
  const {address} = useSigner();
  const owner = process.env.NEXT_PUBLIC_CONTRACT_OWNER as string;

  return (
    <nav className="absolute bottom-1/2 right-1/2 flex translate-y-1/2 translate-x-1/2 transform justify-center">
      <NavBarItem href="/">Market</NavBarItem>
      <NavBarItem href="/owned">Owned NFT</NavBarItem>
      <NavBarItem href="/create">Create NFT</NavBarItem>
      {address == owner ? <NavBarItem href="/withdrawFunds">Withdraw Funds</NavBarItem> : ""}
    </nav>
  );
};

type NavbarItemProps = {
  href: string;
  children: ReactNode;
};

const NavBarItem = (props: NavbarItemProps) => {
  const { href, children } = props;
  const router = useRouter();
  const activeRoute = router.route.split("/")[1];
  const isActive = href == `/${activeRoute}`;

  return (
    <Link href={href}>
      <a
        className={classNames("rounded-lg px-4 py-2 font-semibold", {
          "bg-black text-white dark:bg-white dark:text-black": isActive,
        })}
      >
        {children}
      </a>
    </Link>
  );
};

export default NavBar;
