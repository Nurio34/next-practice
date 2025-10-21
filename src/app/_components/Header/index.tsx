import Link from "next/link";

function Header() {
  return (
    <header className="flex justify-between py-1 px-2">
      <Link href={"/"} className="text-xl font-bold">
        Logo
      </Link>
      <Link href={"/signup"} className="text-primary">
        Signup
      </Link>
    </header>
  );
}
export default Header;
