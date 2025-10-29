import { Link } from "react-router-dom";

export default function Home() {
  const links = [
    { label: "AccountSheets", path: "/psliveaccounts" },
    { label: "Orders", path: "/psliveorders" },
    { label: "Addresses", path: "/psliveaddresses" },
    { label: "Products", path: "/psliveproducts" },
    { label: "Technicians", path: "/pslivetechnicians" },
    { label: "Schedule", path: "/psliveschedule" },
  ];

  return (
    <div className="flex flex-col items-center p-6">
      <div className="w-full max-w-md">
        <h3 className="relative text-center leading-[125%] font-bold text-gray-900 dark:text-gray-200">
          Click the upper left menu to access available pages
        </h3>

        <div className="mx-auto mt-10 grid max-w-3xl grid-cols-1 justify-items-center gap-6 sm:grid-cols-2">
          {links.map((link) => (
            <Link
              to={link.path}
              key={link.path}
              className="block flex h-32 w-full max-w-sm items-center justify-center rounded-xl border border-gray-200 bg-white shadow-md transition-shadow duration-200 hover:shadow-lg dark:border-gray-700 dark:bg-gray-800"
            >
              <h2 className="text-2xl font-bold text-gray-900 sm:text-3xl dark:text-gray-200">
                {link.label}
              </h2>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
