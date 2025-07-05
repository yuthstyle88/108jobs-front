
import React from 'react';
import { cn } from "@/lib/utils";
import { CreditCard, Wifi } from "lucide-react";

interface BankCardProps {
  accountName: string;
  accountNumber: string;
  bankName?: string;
  className?: string;
}

const BankCard = ({
  accountName,
  accountNumber,
  bankName = "Bangkok Bank",
  className,
}: BankCardProps) => {
  const formattedAccountNumber = accountNumber
    .replace(/\s/g, '')
    .match(/.{1,4}/g)
    ?.join(' ') || accountNumber;

  return (
    <div 
      className={cn(
        "relative w-full h-56 p-6 rounded-xl overflow-hidden",
        "bg-[#1A1F2C] shadow-lg",
        "before:absolute before:inset-0 before:bg-gradient-to-br before:from-[#1A1F2C] before:to-[#2C3347]/30",
        "after:absolute after:inset-0 after:bg-[length:40px_40px] after:opacity-10 after:bg-[radial-gradient(#ffffff_1px,_transparent_1px)]",
        className
      )}
      style={{
        backgroundImage: `
          linear-gradient(rgba(255,255,255,0.05), rgba(255,255,255,0.05)),
          linear-gradient(45deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.03) 100%)
        `,
      }}
    >
      <div className="absolute top-0 left-0 right-0 h-20 bg-gradient-to-b from-[#ffffff]/5 to-transparent opacity-20"></div>
      
      <div className="relative z-10 flex flex-col h-full">
        <div className="flex justify-between items-start">
          <div className="text-white text-lg font-medium">{bankName}</div>
          <Wifi className="text-white/50 opacity-80" size={24} />
        </div>
        
        <div className="flex-grow flex items-center">
          <div className="w-12 h-12 mr-3 rounded-md bg-gradient-to-br from-[#FFD700] to-[#FFA500] flex items-center justify-center">
            <CreditCard className="text-[#1A1F2C]" size={24} />
          </div>
          <div className="text-2xl tracking-wider text-white/80 bg-gradient-to-r from-transparent via-white/10 to-transparent bg-[length:200%_100%]">
            {formattedAccountNumber}
          </div>
        </div>
        
        <div className="mt-auto">
          <div className="text-xs uppercase text-white/50">Account Holder</div>
          <div className="text-lg text-white font-medium tracking-wide">{accountName}</div>
        </div>
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#ffffff]/5 to-transparent opacity-20"></div>
    </div>
  );
};

export default BankCard;
