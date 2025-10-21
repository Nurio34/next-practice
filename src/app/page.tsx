import Link from "next/link";

export default function Page() {
  return (
    <div>
      <Link href={"/home"} className="text-primary font-bold">
        Home
      </Link>
    </div>
  );
}
