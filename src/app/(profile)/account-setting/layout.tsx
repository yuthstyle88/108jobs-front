import { Metadata } from 'next'
import Header from "@/components/Header";
import AccountSettingWrapper from "@/containers/AccountSettingWrapper";
import SpHeader from "@/containers/SpHeader";
import { LayoutProps } from "@/types/layout";
import { generateBaseMetadata } from '@/lib/metadata'
import { getCurrentLanguage } from '@/actions/getCurrentLanguage';

export async function generateMetadata(): Promise<Metadata> {
    const currentLang = await getCurrentLanguage()
    console.log('currentLang', currentLang);
    
    return generateBaseMetadata({
            locale: currentLang || 'th'
        }
    )
}

export default function ProfileLayout({
  children,
}: LayoutProps) {
  return (
    <>
      <div className="hidden sm:block">
        <Header type="primary" />
      </div>
      <div className="block sm:hidden">
        <SpHeader showSearch={false} />
      </div>

      <section className="min-h-screen pt-[3rem] sm:pt-[4.5rem] bg-[#F6F7F8]">
        <div className="grid-container-desktop-banner w-full pt-6 pb-16 px-4 sm:px-0 sm:py-8">
          <div className="col-start-2 col-end-3">
            <div className="grid-cols-1 sm:grid-cols-[286px_1fr] grid gap-6 items-start">
              <AccountSettingWrapper />
              <div className="">{children}</div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

