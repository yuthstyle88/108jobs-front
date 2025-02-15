import Image from "next/image";
import Footer from "../components/Footer";

export default function Home() {
  return (
    <>
      <main className="min-h-screen flex flex-col justify-center items-center">
        <h1 className="text-4xl font-bold">Welcome to Fastwork</h1>
        <p className="mt-4 text-lg">Your go-to platform for freelancers.</p>
      </main>
      <Footer />
    </>
  );
}
