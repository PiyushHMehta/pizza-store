import Image from "next/image";
import Right from "../icons/Right";
import Link from "next/link";


export default function Hero() {
    return (
        <section className="hero mt-4">
            <div className="py-8 md:py-12">
                <h1 className="text-4xl font-semibold">
                    Everything <br />
                    is better <br />
                    with a&nbsp;
                    <span className="text-primary">Pizza</span>
                </h1>
                <p className="my-6 text-gray-500 text-sm">Pizza is the missing piece that makes everyday complete, a simple yet deleicious joy in life</p>
                <div className="flex gap-4 text-sm items-center">
                    <button className="bg-primary text-white px-4 py-2 rounded-full flex gap-2 uppercase items-center justify-center">
                        <Link href={'/menu'}>Order Now</Link>
                        <Right />
                    </button>
                    <button className="py-2 border-0 flex gap-2 text-gray-600 font-semibold items-center">
                        <Link href={'/#about-us'}>Learn More</Link>
                        <Right />
                    </button>
                </div>
            </div>

            <div className="relative hidden md:block">
                <Image src={'/pizza.png'} layout={'fill'} objectFit={'contain'} alt="Pizza" />
            </div>
        </section>
    )
}