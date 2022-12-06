import Link from "next/link";
import React from "react";

const About = () => {
  return (
    <div className="max-w-full">
      <div className="mx-48 mt-5">
        <h1 className="text-center text-5xl underline underline-offset-2">
          About
        </h1>
        <p className="mt-3 text-xl">
          Tokofication app is a fake E-commerce web app. Here you can simulate
          selling and buying products.
        </p>
        <p className="mt-3 text-xl">
          Tokofication app is my second web app project I developed with React.
          This is also my first project I developed with the{" "}
          <Link href={"https://create.t3.gg/"} className="text-blue-500">
            T3 Stack
          </Link>
          . Seriously, this stack is amazing. I also use{" "}
          <Link href={"https://supabase.com/"} className="text-blue-500">
            Supabase
          </Link>{" "}
          for storing images. And finally this project is deployed to{" "}
          <Link href={"https://vercel.com/"} className="text-blue-500">
            Vercel
          </Link>
          .
        </p>
        <p className="mt-3 text-xl">
          Honestly, this project did not take me that long to finish. This
          project took me 36 days to complete, most of which was to finding the
          right tool to use. And on 23 November 2022, I stumbled upon the{" "}
          <Link href={"https://create.t3.gg/"} className="text-blue-500">
            T3 Stack
          </Link>
          . And from then I started to develop this app. And on 6 December 2022
          I decided that this project is &quot;finished&quot; (with maybe some
          bug I havent discovered yet)
        </p>
        <p className="mt-3 text-xl">
          For my next project, I think I will develop something that is not as
          complicated as this but I will focus more on the functionality. Well
          see.
        </p>
        <div className="text-right">
          <p className="mt-3 text-xl">Sincerely</p>
          <p className="mt-3 text-xl">Taufiqurrahman Idrus @taufiqidr</p>
          <p className="mt-3 text-xl">2022</p>
        </div>
      </div>
    </div>
  );
};

export default About;
