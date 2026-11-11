import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, PhoneCall, ShieldCheck } from "lucide-react";

const Footer = () => {
  return (
    <footer className="w-full bg-slate-100/90 text-slate-600 border-t border-slate-200/80 py-10 px-6 sm:px-12 transition-colors">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center md:items-start justify-between gap-8">
        {/* Cột 1: Logo và Slogan thương hiệu */}
        <div className="flex flex-col items-center md:items-start gap-2.5 max-w-sm text-center md:text-left shrink-0">
          <Link href="/" className="inline-block">
            <Image
              src="/logofooter.png"
              alt="logofooter"
              width={150}
              height={46}
              className="object-contain"
            />
          </Link>
          <p className="text-xs text-slate-500 leading-relaxed">
            Nền tảng kết nối gia sư và học viên uy tín, chất lượng hàng đầu. Học tập hiệu quả và phát triển tương lai.
          </p>
          <div className="flex items-center gap-1.5 text-xs text-emerald-700 font-medium pt-0.5">
            <ShieldCheck className="size-4 shrink-0 text-emerald-600" />
            <span>Gia sư được kiểm duyệt và xác thực</span>
          </div>
        </div>

        {/* Cột 2: Thông tin liên hệ */}
        <div className="flex flex-col items-center md:items-start gap-2 text-xs">
          <span className="font-bold text-sm text-slate-800 tracking-wide uppercase mb-1">
            Thông tin liên hệ
          </span>
          <div className="flex items-center gap-2 text-slate-700">
            <PhoneCall className="size-3.5 text-emerald-600 shrink-0" />
            <span>
              Hotline hỗ trợ:{" "}
              <strong className="text-slate-900 text-sm font-bold">
                1001 9999
              </strong>
            </span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Phone className="size-3.5 text-slate-400 shrink-0" />
            <span>Điện thoại: 0372 992 038</span>
          </div>
          <div className="flex items-center gap-2 text-slate-600">
            <Mail className="size-3.5 text-slate-400 shrink-0" />
            <span>Email: klkt842@gmail.com</span>
          </div>
        </div>

        {/* Cột 3: Mạng xã hội / Liên kết */}
        <div className="flex flex-col items-center md:items-start gap-2.5 text-xs">
          <span className="font-bold text-sm text-slate-800 tracking-wide uppercase mb-1">
            Kết nối với chúng tôi
          </span>
          <div className="flex items-center gap-2.5">
            <a
              href="https://www.facebook.com/cnsnewscom?locale=vi_VN"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs transition-all text-xs font-medium"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-blue-600 shrink-0"
              >
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
              </svg>
              <span>Facebook</span>
            </a>

            <a
              href="https://www.instagram.com/cns_update/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200/90 shadow-2xs transition-all text-xs font-medium"
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-pink-600 shrink-0"
              >
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z" />
              </svg>
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      {/* Dòng bản quyền dưới cùng */}
      <div className="max-w-7xl mx-auto mt-8 pt-5 border-t border-slate-200/80 text-center text-xs text-slate-400">
        © 2026 CnS Platform. Tất cả quyền được bảo lưu.
      </div>
    </footer>
  );
};

export default Footer;
