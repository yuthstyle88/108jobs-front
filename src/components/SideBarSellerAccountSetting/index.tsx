"use client";
import { CreditCard, FileText, Mail, User } from 'lucide-react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react'


const SideBarSellerAccountSetting = () => {
      const pathname = usePathname(); 

      const menuItems = [
        { href: "/seller-account-setting/freelance-profile", label: "Thông tin tài khoản freelancer", icon: User },
        { href: "/seller-account-setting/contact-info", label: "Thông tin liên lạc", icon: Mail },
        { href: "/seller-account-setting/personal-info", label: "Thông tin CMND/CCCD", icon: FileText },
        { href: "/seller-account-setting/commitment-letter", label: "Thông tin khai báo thuế", icon: FileText },
        { href: "/seller-account-setting/bank-account", label: "Thông tin ngân hàng", icon: CreditCard },
      ];
  return (
    <div className="md:col-span-1">
              <div className="bg-white rounded-md shadow-sm">
                <div className="p-4 border-b border-gray-200">
                  <h3 className="font-medium text-gray-800">
                    Tài khoản freelancer của bạn
                  </h3>
                </div>
                <nav>
                  <ul>
                    {menuItems.map(({ href, label, icon: Icon }) => {
                      const isActive = pathname === href; 
                      return (
                        <li key={href}>
                          <Link
                            href={href}
                            className={`flex items-center w-full px-4 py-3 text-left ${
                              isActive
                                ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                                : "text-gray-700 hover:bg-gray-100"
                            }`}
                          >
                            <Icon className="w-5 h-5 mr-3 text-gray-500" />
                            {label}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </nav>

                <div className="p-4 border-t border-gray-200">
                  <h3 className="font-medium text-gray-800 mb-2">
                    Thông tin tài liệu của người thuê
                  </h3>
                  <ul>
                    <li>
                      <Link
                        href="/seller-account-setting/document-info"
                        className={`flex items-center w-full px-4 py-3 text-left ${
                          pathname === "/seller-account-setting/document-info"
                            ? "bg-blue-50 border-l-4 border-blue-500 text-blue-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <FileText className="w-5 h-5 mr-3 text-gray-500" />
                        Thông tin tài liệu của người thuê (cá nhân)
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
            </div>
  )
}

export default SideBarSellerAccountSetting