import { Metadata } from "next";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HomeClient from "@/components/feature/HomeClient";
import productsData from "@/data/products.json";
import blogsData from "@/data/blogs.json";
import type { Product, Blog } from "@/types/product";

export const metadata: Metadata = {
  title: "Góc Da Đẹp — Tra cứu sản phẩm & cẩm nang skincare khoa học",
  description: "Tìm kem chống nắng, serum trị mụn thâm phù hợp với loại da và hoạt chất của bạn. Được kiểm chứng khách quan.",
};

export default function HomePage() {
  return (
    <div className="min-h-screen bg-white text-zinc-900 flex flex-col justify-between selection:bg-zinc-100">
      <Header />
      <main className="flex-grow pt-16">
        <HomeClient 
          initialProducts={productsData as Product[]} 
          initialBlogs={blogsData as Blog[]} 
        />
      </main>
      <Footer />
    </div>
  );
}
