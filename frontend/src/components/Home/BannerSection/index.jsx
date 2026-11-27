import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Pagination, Navigation } from "swiper/modules";
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/navigation";
import { ChevronLeft, ChevronRight } from "lucide-react";

import SearchBar from "../SearchBar";
import Categories from "../Categories";
import banner1 from "../../../assets/banners/banner-1.png";
import banner2 from "../../../assets/banners/banner-2.png";
import banner3 from "../../../assets/banners/banner-3.png";

const BANNERS = [
    {
        id: 1,
        title: "TopCV - MB Ageas Life",
        image: banner3,
        link: "/vieclam",
    },
    {
        id: 2,
        title: "TopCV - Cơ hội việc làm bứt phá",
        image: banner2,
        link: "/vieclam",
    },
    {
        id: 3,
        title: "TopCV - Tuyển dụng & Tạo CV chuyên nghiệp",
        image: banner1,
        link: "/tao-cv",
    },
];

export default function BannerSection({ categories }) {
    return (
        <section className="bg-[linear-gradient(180deg,#002b33,rgba(0,43,51,.25)),linear-gradient(90deg,#008060_21.86%,#2bab60_78.13%)] bg-cover py-5 font-[Inter,sans-serif]">
            <div className="mx-auto w-full max-w-[1200px] px-6">
                <div className="mt-3 text-lg md:text-[26px]">
                    <h1 className="m-0 p-0 text-center font-semibold text-title">
                        Tạo CV, Tìm việc làm, Tuyển dụng hiệu quả
                    </h1>
                </div>

                {/* search */}
                <SearchBar />

                {/* hero */}
                <div className="my-3 flex items-stretch gap-2">
                    <Categories categories={categories} />
                    
                    {/* banner slider */}
                    <div className="relative group/banner flex flex-1 min-w-0 overflow-hidden rounded-2xl">
                        <Swiper
                            modules={[Autoplay, Pagination, Navigation]}
                            spaceBetween={0}
                            slidesPerView={1}
                            loop={true}
                            autoplay={{
                                delay: 3500,
                                disableOnInteraction: false,
                                pauseOnMouseEnter: true,
                            }}
                            pagination={{
                                clickable: true,
                            }}
                            navigation={{
                                prevEl: ".banner-nav-prev",
                                nextEl: ".banner-nav-next",
                            }}
                            className="topcv-banner-swiper h-full w-full rounded-2xl"
                        >
                            {BANNERS.map((banner) => (
                                <SwiperSlide key={banner.id} className="h-full w-full">
                                    <a
                                        href={banner.link}
                                        className="relative block h-full w-full overflow-hidden rounded-2xl"
                                    >
                                        <img
                                            src={banner.image}
                                            onError={(e) => {
                                                e.currentTarget.remove();
                                            }}
                                            alt={banner.title}
                                            className="h-full w-full rounded-2xl object-cover"
                                        />
                                    </a>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                        {/* Navigation Pre / Next buttons */}
                        <button
                            type="button"
                            aria-label="Previous banner"
                            className="banner-nav-prev absolute left-3 top-1/2 -translate-y-1/2 z-10 size-8 sm:size-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/banner:opacity-100 transition-all duration-200 cursor-pointer shadow-md"
                        >
                            <ChevronLeft className="size-5" />
                        </button>
                        <button
                            type="button"
                            aria-label="Next banner"
                            className="banner-nav-next absolute right-3 top-1/2 -translate-y-1/2 z-10 size-8 sm:size-9 rounded-full bg-black/40 hover:bg-black/70 text-white flex items-center justify-center opacity-0 group-hover/banner:opacity-100 transition-all duration-200 cursor-pointer shadow-md"
                        >
                            <ChevronRight className="size-5" />
                        </button>
                    </div>
                </div>
            </div>
        </section>
    );
}
